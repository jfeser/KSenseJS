/** 
 * @license Copyright (c) 2012, Jack Feser and Dominic Antonacci. All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *   * Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *   * Neither the name of the University of Illinois nor the
 *     names of its contributors may be used to endorse or promote products
 *     derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var ksensejs = {};

/** @typedef {{x: number, y: number, z: number}} */
ksensejs.Vector;

/** @typedef {{x: number, y: number, z: number, mag: number}} */
ksensejs.MagVector;

/** @typedef {{ankle_left: ksensejs.Vector,
 hip_left: ksensejs.Vector,
 foot_right: ksensejs.Vector,
 shoulder_left: ksensejs.Vector,
 ankle_right: ksensejs.Vector,
 hip_right: ksensejs.Vector,
 hand_left: ksensejs.Vector,
 shoulder_right: ksensejs.Vector,
 elbow_left: ksensejs.Vector,
 knee_left: ksensejs.Vector,
 hand_right: ksensejs.Vector,
 spine: ksensejs.Vector,
 elbow_right: ksensejs.Vector,
 knee_right: ksensejs.Vector,
 head: ksensejs.Vector,
 wrist_left: ksensejs.Vector,
 foot_left: ksensejs.Vector,
 shoulder_center: ksensejs.Vector,
 hip_center: ksensejs.Vector,
 wrist_right: ksensejs.Vector}} */
ksensejs.SkeletonData;

/** @typedef {{ankle_left: ksensejs.MagVector,
 hip_left: ksensejs.MagVector,
 foot_right: ksensejs.MagVector,
 shoulder_left: ksensejs.MagVector,
 ankle_right: ksensejs.MagVector,
 hip_right: ksensejs.MagVector,
 hand_left: ksensejs.MagVector,
 shoulder_right: ksensejs.MagVector,
 elbow_left: ksensejs.MagVector,
 knee_left: ksensejs.MagVector,
 hand_right: ksensejs.MagVector,
 spine: ksensejs.MagVector,
 elbow_right: ksensejs.MagVector,
 knee_right: ksensejs.MagVector,
 head: ksensejs.MagVector,
 wrist_left: ksensejs.MagVector,
 foot_left: ksensejs.MagVector,
 shoulder_center: ksensejs.MagVector,
 hip_center: ksensejs.MagVector,
 wrist_right: ksensejs.MagVector}} */
ksensejs.VelocityData;

/** @typedef Object.<number, ksensejs.SkeletonData> */
ksensejs.SkeletonDataFrame;

/** @typedef Object.<number, ksensejs.VelocityData> */
ksensejs.VelocityDataFrame;

(function () {
     "use strict";

     /** Store skeleton data from the Kinect.
      * @type {?ksensejs.SkeletonDataFrame}
      * @private
      */
     var skeleton_data = null;

     /** Store velocity data from the Kinect.
      * @type {?ksensejs.VelocityDataFrame}
      * @private
      */
     var velocity_data = null;

     /** Store all user supplied new data callbacks.
      * @type {Array.<function()>}
      * @private
      */
     var callbacks = [];

     /** Skeleton position history.
      * @type {Array.<ksensejs.SkeletonDataFrame>}
      */
     var skeleton_position_history = [];

     /** Skeleton velocity history.
      * @type {Array.<ksensejs.VelocityDataFrame>}
      */
     var skeleton_velocity_history = [];

     /** The length of history data to keep.
      * @const
      * @type {number}
      */
     var max_timeframes = 30;

     /** The plugin object.
      * @type {Object} 
      */
     //var plugin = null;

     /** The plugin id.
      * @type {string} 
      * @const
      */
     var plugin_id = "plugin0";

     /** Handle new data from the plugin.  Also run the user supplied callbacks.
      * @private
      */
     var handle_new_data = function() {
         var plugin = document.getElementById(plugin_id);
         skeleton_data = null;
         velocity_data = null;

         skeleton_data = plugin.getSkeletonData();
         velocity_data = plugin.getVelocityData();

         // Store skeleton and velocity data history.
         // skeleton_position_history.unshift(skeleton_data);
         // skeleton_velocity_history.unshift(velocity_data);
         // if(skeleton_position_history.length > max_timeframes) {
         //     skeleton_position_history[skeleton_position_history.length] = null;
         //     skeleton_velocity_history[skeleton_velocity_history.length] = null;
         //     skeleton_position_history.pop();
         //     skeleton_velocity_history.pop();
         // }

         for(var i = 0; i < callbacks.length; ++i) {
             callbacks[i]();
         }

         plugin = null;
     };

     /** Initialize the plugin object and start detection. 
      * @param {string=} input_plugin_id The plugin id.  Defaults to "plugin0"
      */
     var initialize = function(input_plugin_id) {
         if(input_plugin_id) {
             plugin_id = input_plugin_id;
         }

         // Create a plugin object and append to the <body> element
         var plugin_object = document.createElement('object');
         plugin_object.setAttribute('id', plugin_id);
         plugin_object.setAttribute('type', 'application/x-ksensejs');
         document.body.appendChild(plugin_object);

         var plugin = document.getElementById(plugin_id);
         plugin.addEventListener("newskeletondata", handle_new_data, false);
     };

     /** Check whether the plugin is tracking anything. 
      * @return {boolean}
      */
     var is_tracking = function() {
         if(skeleton_data === null) {
             return false;
         }
         if( Object.keys(skeleton_data).length > 0 ) {
             return true;
         }
         return false;
     };

     /** Get a list of all valid tracking IDs.
      * @return {Array.<number>}
      */
     var get_tracking_ids = function() {
         if( skeleton_data === null ) {
             return [];
         } else {
             return Object.keys(skeleton_data);
         }
     };

     /** Get all the skeleton data for the given ID.
      * @param {number} id
      * @return {ksensejs.SkeletonData}
      */
     var get_skeleton_data = function(id) {
         if( skeleton_data[id] === "undefined" ) {
             throw "Invalid tracking ID.";
         } else {
             return skeleton_data[id];
         }
     };

     /** Get all the velocity data for the given ID.
      * @param {number} id
      * @return {ksensejs.VelocityData}
      */
     var get_velocity_data = function(id) {
         if( velocity_data[id] === "undefined" ) {
             throw "Invalid tracking ID.";
         } else {
             return velocity_data[id];
         }
     };

     /** Get the location of the input joint for the input ID.
      * @param {number} id
      * @param {string} name
      * @return {ksensejs.Vector}
      */
     var get_joint_location = function(id, name) {
         if( skeleton_data[id] === "undefined" ) {
             throw "Invalid tracking ID.";
         } else {
             return skeleton_data[id][name];
         }
     };

     /** Get the difference between two vectors
      * @param {ksensejs.Vector|ksensejs.MagVector} v1
      * @param {ksensejs.Vector|ksensejs.MagVector} v2
      * @return {ksensejs.Vector|ksensejs.MagVector}
      */
     var get_vector_difference = function(v1, v2) {
         if(v1.hasOwnProperty("mag") && v2.hasOwnProperty("mag")) {
             return {x:v1.x - v2.x,
                     y:v1.y - v2.y,
                     z:v1.z - v2.z,
                     mag:Math.sqrt(Math.pow(v1.x - v2.x, 2), 
                                   Math.pow(v1.y - v2.y, 2), 
                                   Math.pow(v1.z - v2.z, 2))};
         }
             
         return {x:v1.x - v2.x,
                 y:v1.y - v2.y,
                 z:v1.z - v2.z};
     };

     /** Get the difference between the locations of two joints.
      * @param {number} id
      * @param {string} name1
      * @param {string} name2
      * @return {ksensejs.Vector}
      */
     var get_relative_joint_location = function(id, name1, name2) {
         var origin = ksensejs.get_joint_location(id, name2);
         var point = ksensejs.get_joint_location(id, name1);

         return get_vector_difference(point, origin);
     };

     /** Get the velocity magnitude of the input joint for the input ID.
      * @param {number} id
      * @param {string} name
      * @return {number}
      */
     var get_joint_velocity = function(id, name) {
         if( velocity_data[id] === "undefined" ) {
             throw "Invalid tracking ID.";
         } else {
             return velocity_data[id][name].mag;
         }
     };

     /** Get the velocity vector of the input joint for the input ID.
      * @param {number} id
      * @param {string} name
      * @return {ksensejs.Vector}
      */
     var get_joint_velocity_vector = function(id, name) {
         if( velocity_data[id] === "undefined" ) {
             throw "Invalid tracking ID.";
         } else {
             return {x:velocity_data[id][name].x,
                     y:velocity_data[id][name].y,
                     z:velocity_data[id][name].z};
         }
     };

     /** Register a new data callback.
      * @param {function()} new_callback
      */
     var register = function(new_callback) {
         callbacks.push(new_callback);
     };

     /** Unregister a data callback.
      * @param {function()} callback
      */
     var unregister = function(callback) {
         callbacks = callbacks.filter(function(f) {
                                          if(f !== callback) {
                                              return f;
                                          }
                                      });
     };

     /** Scale a vector from the Kinect to a scaled frame.
      * @param {ksensejs.Vector} init_coord
      * @param {ksensejs.Vector} scale_coord
      * @return {ksensejs.Vector}
      */
     var scale_position = function(init_coord, scale_coord) {
         var x = init_coord.x, y = init_coord.y, z = init_coord.z;

         x += 2.2;
         if ( x < 0 ) {
             x = 0;
         }
         x = (x/4.4) * scale_coord.x;

         y += 1.6;
         if ( y < 0 ) {
             y = 0;
         }
         y = (y/3.2) * scale_coord.y;

         if ( z < 0 ) {
             z = 0;
         }
         z = (z/4.0) * scale_coord.z;
         return {x:x, y:y, z:z};
     };

     /** Get the time between the last two frames of data.
      * @return {number}
      */
     var get_delta_time = function() {
         var plugin = document.getElementById(plugin_id);
         return plugin.getDeltaTime();
     };

     /** Normalizes a frame of player data.  This makes sure that joints are not out of allowed bounds.
      * @param {number} id
      * @param {ksensejs.SkeletonData|ksensejs.VelocityData} frame The data to be normalized.
      * @return {ksensejs.SkeletonData|ksensejs.VelocityData} The normalized version of frame.
      */
     var normalize_playerframe = function(id, frame) {
         // Shoulders can rotate around +-57deg, hips only around +-45deg.
         var leftPt = get_joint_location(id, 'shoulder_left');
         var rightPt = get_joint_location(id, 'shoulder_right');

         var useVelocity, centerPt;
         // If the frame contains velocity data,
         if(frame.hip_center.hasOwnProperty('mag')) {
             centerPt = {x:0, y:0, z:0};
             useVelocity = true;
         } else {
             centerPt = frame.hip_center;
             useVelocity = false;
         }

         // Returns an angle with 0rad being facing the Kinect.
         var angle = Math.atan((rightPt.z - leftPt.z) / (rightPt.x - leftPt.x));
         var sin = Math.sin(-angle), cos = Math.cos(-angle);

         var jointLoc, x, z, normalizedFrame = {};
         for(var joint in frame) {
             if(frame.hasOwnProperty(joint)) {
                 jointLoc = frame[joint];
                 x = jointLoc.x - centerPt.x;
                 z = jointLoc.z - centerPt.z;

                 if(useVelocity) {
                     normalizedFrame[joint] = {mag: jointLoc.mag,
                                               x: x * cos - z * sin + centerPt.x,
                                               y: jointLoc.y,
                                               z: x * sin + z * cos + centerPt.z};
                 } else {
                     normalizedFrame[joint] = {x: x * cos - z * sin + centerPt.x,
                                               y: jointLoc.y,
                                               z: x * sin + z * cos + centerPt.z};
                 }
             }
         }

         return normalizedFrame;
     };

     /** Checks to see if player is swiping.  Swiping is defined as sustained velocity in x or y axis for 3 frames.  
      * @param {number} id
      * @param {string} joint
      * @param {number=} gestureLength Default is 2
      * @param {number=} gestureSpeed Default is 0.075
      * @return {string} The direction of the swipe.
      */
     var swipe = function(id, joint, gestureLength, gestureSpeed)
     
     {
         // If no gestureLength is passed, use 2 as the default.
         if(!gestureLength) {
             gestureLength = 2;
         }

         // If no gestureSpeed is passed, use 0.075 as the default.
         if(!gestureSpeed) {
             gestureSpeed = 0.075;
         }

         var countx = 0;
         var county = 0;
         var velocityHistory = get_past_data(id,
                                             joint,
                                             gestureLength,
                                             skeleton_velocity_history,
                                             true);

         // If we don't have enough data to check for a gesture,
         if(velocityHistory.length !== gestureLength) {
             return "none";
         }

         // Count the number of frames that the joint exceeds the gesture speed in each direction.
         for(var i = 0; i < gestureLength; i++) {
    	     if(velocityHistory[i].x > gestureSpeed) {
    	         countx++;
             }
             if(velocityHistory[i].x < -gestureSpeed) {
    	         countx--;
             }
    	     if(velocityHistory[i].y > gestureSpeed) {
    	         county++;
             }
    	     if(velocityHistory[i].y < -gestureSpeed) {
    	         county--;
             }
         }

         // If the swipe is in one direction exclusively, return that direction.
         if(countx === gestureLength && county === 0) {
    	     return "right";
         }
         if(countx === -gestureLength && county === 0) {
    	     return "left";
         }
         if(county === gestureLength && countx === 0) {
    	     return "up";
         }
         if(county === -gestureLength && countx === 0) {
    	     return "down";
         }

         return "none";
     };

     /** Checks for a click gesture from the player.  The gesture is pushing your hand forward, then back.
      * @param {number} id The player tracking ID.
      * @param {string} joint The joint name.
      * @param {boolean} normalize Whether to normalize the player position data.
      * @param {number=} gestureLength The number of frames for each half of the gesture.  Defaults to 2.
      * @param {number=} movementDistance The distance that the joint must move to detect a click.  Defaults to 0.04.
      * @param {number=} positionTolerance The maximum difference between the initial and final joint positions.  Defaults to 0.1.
      * @return {boolean} Whether a click was detected.
      */
     var click = function(id, joint, normalize, gestureLength, movementDistance, positionTolerance) {
         //length will be multiplied by 2 to get full gesture,
         //this would just be for the outer push
         if(!gestureLength) {
    	     gestureLength = 2;
         }
         
         if(!movementDistance) {
             movementDistance = 0.04;   
         }

         if(!positionTolerance) {
             positionTolerance = 0.1;
         }

         var data = get_past_data(id,
                                  joint,
                                  gestureLength * 2,
                                  skeleton_position_history,
                                  normalize);

         // If we don't have enough data to check for a gesture,
         if(data.length !== gestureLength*2) {
             return false;
         }

         // Calculate the difference between the initial and final positions of the joint.
         var xdist = Math.abs(data[gestureLength * 2 - 1].x - data[0].x);
         var ydist = Math.abs(data[gestureLength * 2 - 1].y - data[0].y);
         var zdist = Math.abs(data[gestureLength * 2 - 1].z - data[0].z);

         // Check that the click is in towards the Kinect.
         var check_click = (data[gestureLength].z - data[2 * gestureLength - 1].z) < -movementDistance;

         if (check_click &&
             xdist < positionTolerance &&
             ydist < positionTolerance &&
             zdist < positionTolerance)
    	     return true;

         return false;
     };

     /** Returns an array of all joint data (either position or velocity) from an id.  
      * Returns a number of timeframes, starting at the present and going back.
      * @param {number} id The player tracking ID.
      * @param {string} joint The name of the joint.
      * @param {number} timeframes The number of frames to go back in time.
      * @param {Array.<ksensejs.SkeletonDataFrame>|Array.<ksensejs.VelocityDataFrame>} dataSource An array containing past data.
      * @param {boolean=} normalize Whether to normalize the data.  Defaults to true.
      * @return {Array.<ksensejs.Vector>|Array.<ksensejs.MagVector>} The history data.
      */
     var get_past_data = function(id, joint, timeframes, dataSource, normalize)
     {
         if(!normalize) {
             normalize = true;            
         }

         var output = [];

         for (var i = 0; i < Math.min(timeframes, dataSource.length); i++) {
             // If the player ID does not exist this far back, return.
             if(!dataSource[i].hasOwnProperty(id)) {
                 return output;
             }

             if(normalize) {
                 output.push(normalize_playerframe(id, dataSource[i][id])[joint]);
             } else {
                 output.push(dataSource[i][id][joint]);
             }
         }

         return output;
     };

     /** Returns one joint data object from a point in the past.
      * @param {number} id The player tracking ID.
      * @param {string} joint The joint name.
      * @param {number} timeframes The number of frames to go back in time.
      * @param {string} data_type The type of joint data to use.  (Either "position" or "velocity").
      * @param {string=} relative_joint If relative data is requested, provide a joint that it is relative to.
      * @return {ksensejs.Vector|ksensejs.MagVector}
      */
     var get_past_joint_data = function(id, joint, timeframes, data_type, relative_joint) {
         var data_source;
         if(data_type == "position") {
             data_source = skeleton_position_history;
         } else if(data_type == "velocity") {
             data_source = skeleton_velocity_history;
         } else {
             return null;
         }

         // If the data source data going far enough back, and that frame of data has the requested tracking id.
         if(timeframes < data_source.length - 1 && data_source[timeframes].hasOwnProperty(id)) {
             if(relative_joint !== undefined) {
                 return get_vector_difference(data_source[timeframes][id][joint], 
                                              data_source[timeframes][id][relative_joint]);
             } else {
                 return data_source[timeframes][id][joint];
             }
         } else {
             return null;
         }
     };
     
     /* Export functions. */
     ksensejs['initialize'] = initialize;
     ksensejs['is_tracking'] = is_tracking;
     ksensejs['get_delta_time'] = get_delta_time;
     ksensejs['scale_position'] = scale_position;
     ksensejs['register'] = register;
     ksensejs['unregister'] = unregister;
     ksensejs['get_joint_location'] = get_joint_location;
     ksensejs['get_relative_joint_location'] = get_relative_joint_location;
     ksensejs['get_joint_velocity'] = get_joint_velocity;
     ksensejs['get_joint_velocity_vector'] = get_joint_velocity_vector;
     ksensejs['get_tracking_ids'] = get_tracking_ids;
     ksensejs['get_skeleton_data'] = get_skeleton_data;
     ksensejs['get_velocity_data'] = get_velocity_data;
     ksensejs['get_past_joint_data'] = get_past_joint_data;

     var gesture = {};
     gesture['swipe'] = swipe;
     gesture['click'] = click;
     //gesture['get_past_data'] = get_past_data;

     window['ksensejs'] = ksensejs;
     window.ksensejs['gesture'] = gesture;
 })();