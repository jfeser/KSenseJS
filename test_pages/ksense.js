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

    gesture : {
        skeleton_position_history : [],
        skeleton_velocity_history : [],
        timeframes : 30,

        swipe : function(PlayerID, joint, gestureLength, gestureSpeed)
        //checks to see if player is swiping (sustained velocity in x or y axis for 3 frames)
        //two optional functions, length and speed (default length is 2, default speed is .075)
        {
	    if(!gestureLength)
	        var gestureLength = 2
	    if(!gestureSpeed)
	        var gestureSpeed = .075;
	    var countx=0;
	    var county=0;

	    var data = get_past_data(PlayerID, joint, gestureLength, ksensejs.gesture.skeleton_velocity_history);
	    if(data.length !== gestureLength)
	        return "none";

	    for(i = 0; i < gestureLength; i++)
	    {
	        if(data[i].x > gestureSpeed)
		    countx++;
	        if(data[i].x < -gestureSpeed)
		    countx--;
	        if(data[i].y > gestureSpeed)
		    county++;
	        if(data[i].y < -gestureSpeed)
		    county--;
	    }

	    if(countx === gestureLength && county === 0)
	        return "right";
	    if(countx === -gestureLength && county === 0)
	        return "left";
	    if(county === gestureLength && countx === 0)
	        return "up";
	    if(county === -gestureLength && countx === 0)
	        return "down";
	    return "none";
        },

        click : function(playerID, jointName, gestureLength, movementDistance, positionTolerance)
        //checks for a click gesture from the player
        //the gesture is pushing your hand forward, then back
        {
	    if(!gestureLength)
	        var gestureLength = 2; //length will be multiplied by 2 to get full gesture, this would jsut be for the outer push
	    if(!movementDistance)
	        var movementDistance = .04;
	    if(!positionTolerance)
	        var positionTolerance = .1;
	    var data = get_past_data(playerID, jointName, gestureLength*2, ksensejs.gesture.skeleton_position_history);
	    if(data.length !== gestureLength*2)
	        return false;
	    var xdist = Math.abs(data[gestureLength*2-1].x-data[0].x);
	    var ydist = Math.abs(data[gestureLength*2-1].y-data[0].y);
	    var zdist = Math.abs(data[gestureLength*2-1].z-data[0].z);
	    var check_click = data[gestureLength].z-data[2*gestureLength-1].z;
	    if (check_click < -movementDistance && xdist < positionTolerance && ydist < positionTolerance && zdist < positionTolerance)
	    {
	        return true;
	    }
	    return false;
        },

        function get_past_data(id, joint, timeframes, array)
        //returns an array of all joint data (either position or velocity) from an id
        //returns a number of timeframes, starting at the present and going back
        {
            var frame_count = Math.min(timeframes,array.length);
            var past_data = [];
            for(i = 0; i < frame_count; i++) {
	        if(typeof(array[i][id]) === "object") {
	            past_data.push(array[i][id][joint]);
                }
            }
            return past_data;
        }
    }
};
