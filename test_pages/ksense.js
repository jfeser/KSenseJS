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
    tracking_ids : null,

    plugin : function() {
        return document.getElementById('plugin0');
    },

    handle_new_data : function() {
        ksensejs.tracking_ids = ksensejs.plugin().trackedSkeletonIDs;
        if ( ksensejs.tracking_ids.length > 0 ) {
            ksensejs.skeleton_data = {};
            ksensejs.velocity_data = {};
            for ( i = 0, l = ksensejs.tracking_ids.length; i < l; i++ ) {
                ksensejs.skeleton_data[ksensejs.tracking_ids[i]] = ksensejs.plugin().getSkeletonData(ksensejs.tracking_ids[i]);
                ksensejs.velocity_data[ksensejs.tracking_ids[i]] = ksensejs.plugin().getVelocityData(ksensejs.tracking_ids[i]);
            }
        }
    },

    is_tracking : function() {
        if( ksensejs.tracking_ids.length > 0 ) {
            return true;
        }
        return false;
    },

    get_skeleton_data : function(id) {
        if( ksensejs.is_tracking() && $.inArray(id, ksensejs.tracking_ids) ) {
            return ksensejs.skeleton_data[id];
        }
    },

    get_velocity_data : function(id) {
        if( ksensejs.is_tracking() && $.inArray(id, ksensejs.tracking_ids) ) {
            return ksensejs.velocity_data[id];
        }
    },
};

$(document).ready(ksensejs.initialize);
