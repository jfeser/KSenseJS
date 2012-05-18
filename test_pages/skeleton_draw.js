function plugin()
{
    return document.getElementById('plugin0');
}

function get_valid_id() {
    tracking_ids = plugin().trackedSkeletonIDs;
    return tracking_ids.shift();
}

function get_skeleton_data(tracking_id) {
    return plugin().getSkeletonData(tracking_id);
}

function is_tracking() {
    tracking_ids = plugin().trackedSkeletonIDs;
    if( tracking_ids.length > 0 ) {
        return true;
    }
    return false;
}

function handle_new_data() {
    if ( is_tracking() ) {
        var id = get_valid_id();
        var data = get_skeleton_data(id);
        draw_data(data);
    }
}

function draw_data(skeleton_data) {
    var width = canvas.width;
    var height = canvas.height;
    ctx.clearRect(0,0,width,height);
    for( var joint = 0, l = skeleton_data.length; joint < l; joint++ ) {
        var x = skeleton_data[joint][0];
        var y = skeleton_data[joint][1];
        var scaled_coord = scale_data(x,y,width,height);
        x = scaled_coord[0];
        y = scaled_coord[1];
        ctx.fillRect(x,height-y,5,5);
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


window.onload = function() {
    document.getElementById('plugin0').addEventListener("newskeletondata", handle_new_data, false);
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
}
