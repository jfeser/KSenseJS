/** 
 * @preserve Copyright (c) 2012, Jack Feser and Dominic Antonacci. All rights reserved.
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

"use strict";

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

var local = function () {
    /** @type{?Object.<number, ksensejs.SkeletonData>} 
     * @private
     */
    var skeleton_data = null;

    /** @type{?Object.<number, ksensejs.VelocityData>} 
     * @private
     */
    var velocity_data = null;

    /** @type{Array.<function()>}
     * @private
     */
    var callbacks = [];

    /** @type{boolean}
     * @private
     */
    var initialized = false;

    /** Initialize the plugin object and start detection. */
    var initialize = function() {
        // Create a plugin object and append to the <body> element
        var plugin_object = document.createElement('object');
        plugin_object.setAttribute('id', 'plugin0');
        plugin_object.setAttribute('type', 'application/x-ksensejs');
        document.body.appendChild(plugin_object);

        document.getElementById('plugin0').addEventListener("newskeletondata", handle_new_data, false);
        initialized = true;
    };

    /** Get a reference to the plugin object.
     * @private
     */
    var plugin = function() {
        return document.getElementById('plugin0');
    };

    /** Handle new data from the plugin.  Also run the user supplied callbacks.
     * @private
     */
    var handle_new_data = function() {
        var pluginObject = plugin();
        skeleton_data = pluginObject.getSkeletonData();
        velocity_data = pluginObject.getVelocityData();

        for(var i = 0; i < callbacks.length; ++i) {
            callbacks[i]();
        }
    };

    /** Check whether the plugin is tracking anything. 
     * @return {boolean}
     */
    var is_tracking = function() {
        if(skeleton_data == null) {
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
        if( typeof skeleton_data[id] === "undefined" ) {
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
        if( typeof velocity_data[id] === "undefined" ) {
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
        if( typeof skeleton_data[id] === "undefined" ) {
            throw "Invalid tracking ID.";
        } else {
            return skeleton_data[id][name];
        }
    };

    /** Get the velocity magnitude of the input joint for the input ID.
     * @param {number} id
     * @param {string} name
     * @return {number}
     */
    var get_joint_velocity = function(id, name) {
        if( typeof velocity_data[id] === "undefined" ) {
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
        if( typeof velocity_data[id] === "undefined" ) {
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
        return plugin().getDeltaTime();
    };


    // var skeleton_position_history = [];
    // var skeleton_velocity_history = [];
    // var timeframes = 30;

    // function normalize_player(id, joint, dataSource, frame) {
    //     if (!dataSource) {
    //         dataSource = skeleton_position_history;
    //     }

    //     if (!frame) {
    //         frame = 0;
    //     }

    //     var playerFrame = dataSource[frame][id];

    //     if (joint === 'all') {
    //         joint = [];
    //         var i;
    //         for (i in playerFrame) {
    //             if (playerFrame.hasOwnProperty(i)) {
    //                 joint.push(i);
    //             }
    //         }
    //     }

    //     if (typeof(joint) !== 'object') {
    //         joint = [joint];
    //     }

    //     //shoulders can rotate around +-57deg, hips only around +-45deg.
    //     var leftPt = get_joint_location(id, 'shoulder_left');
    //     var rightPt = get_joint_location(id, 'shoulder_right');

    //     if(dataSource === skeleton_velocity_history) {
    //         var centerPt = {x:0, y:0, z:0};
    //     } else {
    //         var centerPt = playerFrame.hip_center;
    //     }

    //     //returns an angle with 0rad being facing the Kinect
    //     var angle = Math.atan((rightPt.z - leftPt.z) / (rightPt.x - leftPt.x));
    //     var sin = Math.sin(-angle), cos = Math.cos(-angle), retObj = {}, a = 0;

    //     //if a velocity used, we must modify how we pull the data (individual axes are 1-4, not 0-3).
    //     if (playerFrame[joint[0]].length === 4) {
    //         a = 1;
    //     }

    //     var jointLoc, x, z;
    //     for (var i = 0; i < joint.length; i++) {
    //         jointLoc = playerFrame[joint[i]];
    //         x = jointLoc[a] - centerPt.x;
    //         z = jointLoc[a + 2] - centerPt.z;

    //         if(a === 1) {
    //             retObj[joint[i]] = [jointLoc[0],
    //                                 x * cos - z * sin + centerPt.x,
    //                                 jointLoc[2],
    //                                 x * sin + z * cos + centerPt.z];
    //         } else {
    //             retObj[joint[i]] = [x * cos - z * sin + centerPt.x,
    //                                 jointLoc[1],
    //                                 x * sin + z * cos + centerPt.z];
    //         }
    //     }
    //     return retObj;
    // }

    // function swipe(PlayerID, joint, gestureLength, gestureSpeed)
    // //checks to see if player is swiping (sustained velocity in x or y axis for 3 frames)
    // //two optional functions, length and speed (default length is 2, default speed is .075)
    // {
    //     if(!gestureLength) {
    // 	gestureLength = 2;
    //     }

    //     if(!gestureSpeed) {
    // 	gestureSpeed = .075;
    //     }

    //     var countx = 0;
    //     var county = 0;
    //     var data = get_past_data(PlayerID,
    //                              joint,
    //                              gestureLength,
    //                              skeleton_velocity_history,
    //                              true);

    //     if(data.length !== gestureLength) {
    // 	return "none";
    //     }

    //     for(var i = 0; i < gestureLength; i++) {
    // 	if(data[i].x > gestureSpeed) {
    // 	    countx++;
    //         }
    //         if(data[i].x < -gestureSpeed) {
    // 	    countx--;
    //         }
    // 	if(data[i].y > gestureSpeed) {
    // 	    county++;
    //         }
    // 	if(data[i].y < -gestureSpeed) {
    // 	    county--;
    //         }
    //     }

    //     if(countx === gestureLength && county === 0) {
    // 	return "right";
    //     }
    //     if(countx === -gestureLength && county === 0) {
    // 	return "left";
    //     }
    //     if(county === gestureLength && countx === 0) {
    // 	return "up";
    //     }
    //     if(county === -gestureLength && countx === 0) {
    // 	return "down";
    //     }

    //     return "none";
    // }

    // function click(playerID, jointName, normalize, gestureLength, movementDistance, positionTolerance)
    // //checks for a click gesture from the player
    // //the gesture is pushing your hand forward, then back
    // {
    //     if(!gestureLength)
    //         //length will be multiplied by 2 to get full gesture,
    //         //this would jsut be for the outer push
    // 	gestureLength = 2;

    //     if(!movementDistance)
    // 	movementDistance = .04;

    //     if(!positionTolerance)
    // 	positionTolerance = .1;

    //     var data = get_past_data(playerID,
    //                              jointName,
    //                              gestureLength*2,
    //                              skeleton_position_history,
    //                              normalize);

    //     if(data.length !== gestureLength*2)
    // 	return false;

    //     var xdist = Math.abs(data[gestureLength * 2 - 1].x - data[0].x);
    //     var ydist = Math.abs(data[gestureLength * 2 - 1].y - data[0].y);
    //     var zdist = Math.abs(data[gestureLength * 2 - 1].z - data[0].z);
    //     var check_click = data[gestureLength].z - data[2 * gestureLength - 1].z;

    //     if (check_click < -movementDistance &&
    //         xdist < positionTolerance &&
    //         ydist < positionTolerance &&
    //         zdist < positionTolerance)
    // 	return true;

    //     return false;
    // }

    // function get_past_data(id, joint, timeframes, array, normalize)
    // //returns an array of all joint data (either position or velocity) from an id
    // //returns a number of timeframes, starting at the present and going back
    // {
    //     // if( typeof(normalize) === 'undefined' )
    //     //     normalize = true;

    //     var repeat = Math.min(timeframes, array.length);
    //     var ret_arr = [];

    //     for (var i = 0; i < repeat; i++) {
    //         if (typeof(array[i][id]) === "object") {
    //             if(normalize) {
    //                 ret_arr.push(normalize_player(id, joint, array, i)[joint]);
    //             } else {
    //                 ret_arr.push(array[i][id][joint]);
    //             }
    //         }
    //     }

    //     return ret_arr;
    // }

    /* Export functions. */
    ksensejs['initialize'] = initialize;
    ksensejs['is_tracking'] = is_tracking;
    ksensejs['get_delta_time'] = get_delta_time;
    ksensejs['scale_position'] = scale_position;
    ksensejs['register'] = register;
    ksensejs['unregister'] = unregister;
    ksensejs['get_joint_location'] = get_joint_location;
    ksensejs['get_joint_velocity'] = get_joint_velocity;
    ksensejs['get_joint_velocity_vector'] = get_joint_velocity_vector;
    ksensejs['get_tracking_ids'] = get_tracking_ids;
    ksensejs['get_skeleton_data'] = get_skeleton_data;
    ksensejs['get_velocity_data'] = get_velocity_data;

    // var gesture = {};
    // gesture['swipe'] = swipe;
    // gesture['click'] = click;
    // gesture['get_past_data'] = get_past_data;

    window['ksensejs'] = ksensejs;
    //window.ksensejs['gesture'] = gesture;

    // set_new_data_callback(function () {
    //                           skeleton_position_history.unshift(skeleton_data);
    //                           skeleton_velocity_history.unshift(velocity_data);
    //                           if(skeleton_position_history.length > timeframes) {
    //                               skeleton_position_history.pop();
    //                               skeleton_velocity_history.pop();
    //                           }
    //                       });
}();