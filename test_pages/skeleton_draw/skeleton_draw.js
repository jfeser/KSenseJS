// Copyright (c) 2012, John Feser
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

function handle_new_data() {
    if ( ksensejs.is_tracking() ) {
        var tracking_ids = ksensejs.get_tracking_ids();

        ctx.clearRect(0,0,canvas.width,canvas.height);

        for ( var i = 0, l = tracking_ids.length; i < l; i++ ) {
            var id = tracking_ids[i];

            try {
                var skel = ksensejs.get_skeleton_data(id);
            } catch (err) {
                continue;
            }
            try {
                var vel = ksensejs.get_velocity_data(id);
            } catch (err) {
                continue;
            }

            var width = canvas.width;
            var height = canvas.height;
            for( var joint in skel ) {
                var x = skel[joint].x;
                var y = skel[joint].y;
                var scaled_coord = scale_coordinate(x,y,width,height);
                x = scaled_coord[0];
                y = scaled_coord[1];
                ctx.fillRect(x,height-y,5,5);

                ctx.beginPath();
                ctx.moveTo(x, height-y);
                ctx.lineTo(x+vel[joint].x*100, height-y+vel[joint].y*100);
                ctx.closePath();
                ctx.stroke();
            }
        }
    }
}

function scale_coordinate(x, y, canvas_x, canvas_y) {
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
