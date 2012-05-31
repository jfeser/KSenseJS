var ksensejs = {
    skeleton_data : null,
    velocity_data : null,
    callback : null,
    initialized: false,

    initialize : function() {
        if(!ksensejs.initialized) {
            // Create a plugin object and append to the <body> element
            var plugin_object = document.createElement('object');
            plugin_object.setAttribute('id', 'plugin0');
            plugin_object.setAttribute('type', 'application/x-ksensejs');
            document.body.appendChild(plugin_object);

            document.getElementById('plugin0').addEventListener("newskeletondata", ksensejs.handle_new_data, false);
            ksensejs.initialized = true;
        }
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
            return [ksensejs.velocity_data[id][name]["x"],
                    ksensejs.velocity_data[id][name]["y"],
                    ksensejs.velocity_data[id][name]["z"]];
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

    scale_data : function(init_coord, scale_coord) {
        var x = init_coord[0];
        var y = init_coord[1];
        var z = init_coord[2];

        x += 2.2;
        if ( x < 0 ) {
            x = 0;
        }
        x = (x/4.4) * scale_coord[0];

        y += 1.6;
        if ( y < 0 ) {
            y = 0;
        }
        y = (y/3.2) * scale_coord[1];

        if ( z < 0 ) {
            z = 0;
        }
        z = (z/4.0) * scale_coord[2];
        return [x,y,z];
    }
};
