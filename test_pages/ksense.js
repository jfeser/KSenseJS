// Copyright (c) 2012, John Feser and Dominic Antonacci
// All rights reserved.

// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:

// Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.

// Redistributions in binary form must reproduce the above copyright
// notice, this list of conditions and the following disclaimer in the
// documentation and/or other materials provided with the
// distribution.

// Neither the name of the University of Illinois nor the names of its
// contributors may be used to endorse or promote products derived
// from this software without specific prior written permission.

// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
// FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
// COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
// HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
// STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
// OF THE POSSIBILITY OF SUCH DAMAGE.

var ksensejs = {
    skeleton_data : null,
    velocity_data : null,
    callback : null,

    initialize : function() {
        // Create a plugin object and append to the <body> element
        var plugin_object = document.createElement('object');
        plugin_object.setAttribute('id', 'plugin0');
        plugin_object.setAttribute('type', 'application/x-ksensejs');
        document.body.appendChild(plugin_object);

        document.getElementById('plugin0').addEventListener("newskeletondata", ksensejs.handle_new_data, false);
        ksensejs.initialized = true;
    },

    plugin : function() {
        return document.getElementById('plugin0');
    },

    handle_new_data : function() {
        ksensejs.skeleton_data = ksensejs.plugin().getSkeletonData();
        ksensejs.velocity_data = ksensejs.plugin().getVelocityData();

        if( !(ksensejs.callback === null) ) {
            ksensejs.callback();
        }
    },

    is_tracking : function() {
        if( Object.keys(ksensejs.skeleton_data).length > 0 ) {
            return true;
        }
        return false;
    },

    get_tracking_ids : function() {
        if( ksensejs.skeleton_data === null ) {
            return [];
        } else {
            return Object.keys(ksensejs.skeleton_data);
        }
    },

    get_skeleton_data : function(id) {
        if( typeof ksensejs.skeleton_data[id] === "undefined" ) {
            throw "Invalid tracking ID.";
        } else {
            return ksensejs.skeleton_data[id];
        }
    },

    get_velocity_data : function(id) {
        if( typeof ksensejs.velocity_data[id] === "undefined" ) {
            throw "Invalid tracking ID.";
        } else {
            return ksensejs.velocity_data[id];
        }
    },

    get_joint_location : function(id, name) {
        if( typeof ksensejs.skeleton_data[id] === "undefined" ) {
            throw "Invalid tracking ID.";
        } else {
            return ksensejs.skeleton_data[id][name];
        }
    },

    get_joint_velocity : function(id, name) {
        if( typeof ksensejs.velocity_data[id] === "undefined" ) {
            throw "Invalid tracking ID.";
        } else {
            return ksensejs.velocity_data[id][name]["mag"];
        }
    },

    get_joint_velocity_vector : function(id, name) {
        if( typeof ksensejs.velocity_data[id] === "undefined" ) {
            throw "Invalid tracking ID.";
        } else {
            return {x:ksensejs.velocity_data[id][name]["x"],
                    y:ksensejs.velocity_data[id][name]["y"],
                    z:ksensejs.velocity_data[id][name]["z"]};
        }
    },

    set_new_data_callback : function(callback) {
        if( typeof callback === "function" ) {
            ksensejs.callback = callback;
        }
    },

    unset_new_data_callback : function() {
        ksensejs.callback = null;
    },

    scale_position : function(init_coord, scale_coord) {
        var x = init_coord.x;
        var y = init_coord.y;
        var z = init_coord.z;

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
    },

    get_delta_time : function() {
        return ksensejs.plugin().getDeltaTime();
    }
};
