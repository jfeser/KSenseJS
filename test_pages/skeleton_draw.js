function plugin()
{
    return document.getElementById('plugin0');
}

function get_tracking_ids() {
    return plugin().trackedSkeletonIDs;
}

function get_skeleton_data(tracking_id) {
    return plugin().getSkeletonData(tracking_id);
}

function get_joint_velocity(tracking_id) {
    return plugin().getVelocityData(tracking_id);
}

function is_tracking() {
    var tracking_ids = get_tracking_ids();
    if( tracking_ids.length > 0 ) {
        return true;
    }
    return false;
}

function handle_new_data() {
    if ( is_tracking() ) {
        var tracking_ids = get_tracking_ids();

        ctx.clearRect(0,0,canvas.width,canvas.height);

        for ( var i = 0, l = tracking_ids.length; i < l; i++ ) {
            var id = tracking_ids[i];

            try {
                var data = get_skeleton_data(id);
            } catch (err) {
                continue;
            }
            var velocity = get_joint_velocity(id);

            var width = canvas.width;
            var height = canvas.height;
            for( var joint = 0, l_d = data.length; joint < l_d; joint++ ) {
                var x = data[joint][0];
                var y = data[joint][1];
                var scaled_coord = scale_data(x,y,width,height);
                x = scaled_coord[0];
                y = scaled_coord[1];
                ctx.fillRect(x,height-y,5+100*velocity[joint][0],5+100*velocity[joint][0]);
            }
        }
    }
}

function scale_data(x, y, canvas_x, canvas_y) {
    x += 2.2;
    if ( x < 0 ) {
        x = 0;
    }
    x = (x/4.4) * canvas_x;

    y += 1.6;
    if ( y < 0 ) {
        y = 0;
    }
    y = (y/3.2) * canvas_y;

    return [x,y];
}

var canvas;
var ctx;

window.onload = function() {
    document.getElementById('plugin0').addEventListener("newskeletondata", handle_new_data, false);
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
}
