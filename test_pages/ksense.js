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

        return false;
    }
    if( Object.keys(skeleton_data).length > 0 ) {
        return true;
    }
    return false;
}




/** Get the location of the input joint for the input ID.



/** Register a new data callback.

    x += 2.2;








            }

    var countx = 0;
        }
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
ksensejs['get_joint_velocity'] = get_joint_velocity;
ksensejs['get_joint_velocity_vector'] = get_joint_velocity_vector;
ksensejs['get_tracking_ids'] = get_tracking_ids;
ksensejs['get_skeleton_data'] = get_skeleton_data;
ksensejs['get_velocity_data'] = get_velocity_data;

var gesture = {};
gesture['swipe'] = swipe;
gesture['click'] = click;
gesture['get_past_data'] = get_past_data;

window['ksensejs'] = ksensejs;
window.ksensejs['gesture'] = gesture;

