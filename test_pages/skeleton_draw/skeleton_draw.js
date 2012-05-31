function handle_new_data() {
    if ( ksensejs.is_tracking() ) {
        var tracking_ids = ksensejs.get_tracking_ids();

        ctx.clearRect(0,0,canvas.width,canvas.height);

        for ( var i = 0, l = tracking_ids.length; i < l; i++ ) {
            var id = tracking_ids[i];

            try {
                var data = ksensejs.get_skeleton_data(id);
            } catch (err) {
                continue;
            }
            try {
                var velocity = ksensejs.get_velocity_data(id);
            } catch (err) {
                continue;
            }

            var width = canvas.width;
            var height = canvas.height;
            for( var joint in data ) {
                var x = data[joint].x;
                var y = data[joint].y;
                var scaled_coord = scale_data(x,y,width,height);
                x = scaled_coord[0];
                y = scaled_coord[1];
                ctx.fillRect(x,height-y,5+100*velocity[joint].mag,5+100*velocity[joint].mag);
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
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");
    ksensejs.initialize();
    ksensejs.set_new_data_callback(handle_new_data);
}
