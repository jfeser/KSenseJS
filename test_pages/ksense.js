var ksensejs = {
    initialize : function() {
        // Create a plugin object and append to the <body> element
        var plugin_object = document.createElement('object');
        plugin_object.setAttribute('id', 'plugin0');
        plugin_object.setAttribute('type', 'application/x-ksensejs');
        document.body.appendChild(plugin_object);

        document.getElementById('plugin0').addEventListener("newskeletondata", ksensejs.handle_new_data, false);
    },

    skeleton_data : null,
    velocity_data : null,
    callback : null,

    plugin : function() {
        return document.getElementById('plugin0');
    },

    handle_new_data : function() {
        ksensejs.skeleton_data = ksensejs.plugin().getSkeletonData();
        ksensejs.velocity_data = ksensejs.plugin().getVelocityData();
        ksensejs.callback();
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
            return ksensejs.velocity_data[id][name][0];
        }
    },

    get_joint_velocity_vector : function(id, name) {
        if( typeof ksensejs.velocity_data[id] === "undefined" ) {
            throw "Invalid tracking ID.";
        } else {
            return ksensejs.velocity_data[id][name].slice(1,4);
        }
    },

    set_new_data_callback : function(callback) {
        if( typeof callback === "function" ) {
            ksensejs.callback = callback;
        }
    }
};
