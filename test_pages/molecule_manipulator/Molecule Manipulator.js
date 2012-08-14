/** 
 * @preserve Copyright (c) 2012, Dominic Antonacci and Jack Feser. All rights reserved.
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

var kOptions = {allowedMovement: {pos: true, rot: true, zoom: true},
                divID: 'maincanvasContainer',
                //width: "60%",
                //height: "90%",
                //buttonPos: "up",
                //buttonHTML: '<div id="buttons"><span id="rot"class="selectable chosen">Rotate</span><span id="pos"class="selectable">Translate</span><span id="zoom"class="selectable">Zoom</span><div id="cursor"></div></div><canvas id="chemCanvas"></canvas>',
                sensitivity: {rotation: 0.01, 
                              position: 0.01, 
                              zoom: 1},
                shoulderDeadZone: 0.2,
                handDeadZone: 0.15};

var kinect_canvas, sub_canvas;

/* Set the window resize and document ready functions. */
$(window).resize(resize);
$(document).ready(function () {
                      /*Kinect initialization with the plugin*/
                      ksensejs.initialize();
                      ksensejs.register(handle_new_data);

                      /* Add the skeleton demo code to check the kinect status. */
                      var canvas = document.getElementById('skeletonCanvas');
                      var ctx = canvas.getContext('2d');
                      ksensejs.register(function () {
                                            var tracking_ids = ksensejs.get_tracking_ids();
                                            var scale_coordinate = function(x, y, canvas_x, canvas_y) {
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
                                            };

                                            if(tracking_ids.length <= 0) {
                                                return;
                                            }

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
                                                    if(skel.hasOwnProperty(joint)) {
                                                        var x = skel[joint].x;
                                                        var y = skel[joint].y;
                                                        var scaled_coord = scale_coordinate(x,y,width,height);
                                                        x = scaled_coord[0];
                                                        y = scaled_coord[1];

                                                        /* Reset fill style. */
                                                        ctx.fillStyle = '#000';
                                                        
                                                        /* Check condition for first control gesture. */
                                                        var rHand = ksensejs.get_relative_joint_location(id, 
                                                                                                         "shoulder_right", 
                                                                                                         "hand_right");
                                                        var lHand = ksensejs.get_relative_joint_location(id, 
                                                                                                         "shoulder_left", 
                                                                                                         "hand_left");
                                                        if(joint === 'hand_left' && 
                                                           lHand.z > kOptions.shoulderDeadZone && 
                                                           rHand.z < kOptions.shoulderDeadZone) {
                                                            ctx.fillStyle = '#f00';
                                                        }

                                                        /* Check condition for second control gesture. */
                                                        var absRHand = ksensejs.get_joint_location(id, "hand_right");
                                                        var absLHand = ksensejs.get_joint_location(id, "hand_left");
                                                        
                                                        /* creates a vector from the midpoint between the right
                                                         * and left hands and the right hand*/
                                                        var rHandVec = {x: (absRHand.x - absLHand.x) / 2,
                                                                        y: (absRHand.y - absLHand.y) / 2,
                                                                        z: (absRHand.z - absLHand.z) / 2};
                                                        var rHandVecArray = [rHandVec.x, rHandVec.y, rHandVec.z];
                                                        if ((joint === 'hand_left' || joint === 'hand_right') &&
                                                            Math.abs(rHand.z) > kOptions.shoulderDeadZone && 
                                                            Math.abs(lHand.z) > kOptions.shoulderDeadZone && 
                                                            vec3.length(rHandVecArray) > kOptions.handDeadZone) {
                                                            ctx.fillStyle = '#FFF700';
                                                        }
   
                                                        ctx.fillRect(x,height-y,5,5);
                                                    }   
                                                }
                                            }
                                        });

                      /* Remove the buttons for any kind of movement that is not permitted. */
                      if (!kOptions.allowedMovement.rot) {
                          $('#rot').remove();
                      }
                      if (!kOptions.allowedMovement.pos) {
                          $('#pos').remove();
                      }
                      if (!kOptions.allowedMovement.zoom) {
                          $('#zoom').remove();
                      }

                      /* If the molecule canvas has not been already loaded, load up a molecule 
                       * and set the 3d representation. */
                      if (!kinect_canvas) {
                          kinect_canvas = new ChemDoodle.TransformCanvas3D('chemCanvas', 100, 100);
                          kinect_canvas.specs.set3DRepresentation("Stick");
                      }
                      if(!sub_canvas) {
                          sub_canvas = new ChemDoodle.ViewerCanvas("subMol");
                          sub_canvas.specs.bonds_width_2D = 0.6;
                          sub_canvas.specs.bonds_saturationWidth_2D = .18;
                          sub_canvas.specs.bonds_hashSpacing_2D = 2.5;
                          sub_canvas.specs.atoms_font_size_2D = 10;
                          sub_canvas.specs.atoms_font_families_2D = ['Helvetica', 'Arial', 'sans-serif'];
                          sub_canvas.specs.atoms_displayTerminalCarbonLabels_2D = true;
                      }

                      var mol = ChemDoodle.readMOL(exampleMolFile);
                      //mol.scaleToAverageBondLength(14.4);
                      loadMol(mol);
                      
                      /* Resize the UI to fit the window. */
                      resize();
                  });

/** Resize the UI to fit the window. */
function resize() {
    var outer = $("#outer"),
        subcanvas = $("#subcanvasContainer"),
        buttons = $("#buttons"),
        ui = $("#ui");

    /** The amount of padding to put between elements.
     * @const
     */
    var padding = 20;

    // Resize the main molecule canvas.
    kinect_canvas.resize(outer.width() - (subcanvas.outerWidth() + padding), 
                         window.innerHeight - (ui.height() + buttons.height() + padding + 30));

    // Set the button height to 1/5 of the total height
    buttons.css('height', outer.height() / 8 + 'px'); 

    var scaleSource = buttons.height();
    var scaleFactor = 3;
    var maxSize = 475;
    var minSize = 30;
    var fontSize = scaleSource * scaleFactor;

    fontSize = Math.min(fontSize, maxSize);
    fontSize = Math.max(fontSize, minSize);

    buttons.css('font-size', fontSize + '%');

    // /*define jQuery constants*/
    // var $con = $("#" + kOptions.divID), $sel = $('.selectable'), $button = $('#buttons'), $chem = $('#chemCanvas');

    // /* Reset CSS values so that the scaling program works correctly. */
    // $sel.height('');
    // $sel.width('');
    // $sel.css('line-height', "");
    // $sel.css('display', 'inline');

    // /* Figure out the proper width and height for the div.  Changes depending on button placement.  
    //  * Default is up/down. */
    // var targetWidth = $con.width() / $sel.length - 2 * ($sel.outerWidth(true) - $sel.outerWidth());
    // var targetHeight = $con.height() / 8;
    // var str = kOptions.buttonPos;
    // if (str === 'left' || str === 'right') {
    //     targetWidth = $con.width() / 5;
    //     targetHeight = $con.height() / $sel.length - 2 * ($sel.outerHeight(true) - $sel.outerHeight());
    // }
    // var scaleObj = $('.selectable:first');
    // $sel.each(function () {
    //               if ($(this).width() > scaleObj.width()) {
    //                   scaleObj = $(this);
    //               }
    //           });
    // while (scaleObj.outerHeight() < targetHeight && scaleObj.outerWidth(true) < targetWidth) {
    //     scaleObj.css('font-size', '+=10');
    // }
    // while ((scaleObj.outerHeight(true) > targetHeight || scaleObj.outerWidth(true) > targetWidth) && scaleObj.css('font-size') !== '1px') {
    //     scaleObj.css('font-size', '-=1');
    // }
    // $sel.css('display', 'block');
    // $sel.height(targetHeight);
    // $sel.width(targetWidth);
    // $sel.css('line-height', targetHeight + 'px');
    // $sel.css("font-size", scaleObj.css("font-size"));
    // if (str === 'left' || str === 'right') {
    //     // $chem.width($con.width() - $button.outerWidth(true));
    //     // $chem.height($con.height());
    //     kinect_canvas.resize($con.width() - $button.outerWidth(true), $con.height());
    // } else {
    //     // $chem.width($con.width());
    //     // $chem.height($con.height() - $button.outerHeight(true));
    //     kinect_canvas.resize($con.width(), $con.height() - $button.outerHeight(true));
    // }
}

var updateOld = true, oldrHand = {x:0, y:0, z:0}, oldlHand = {x:0, y:0, z:0}, oldrHandVec = {x:0, y:0, z:0}, id = -1;

/** Handle new data coming in from the plugin. */
function handle_new_data() {
    /** List of tracking IDs.
     * @type {Array.<number>}
     */
    var ids = ksensejs.get_tracking_ids();

    /* If the Kinect doesn't have anything tracked, return. */
    if(ids.length <= 0) {
        return;
    }

    var x = 0, y = 0, z = 0, height, width;

    var foundId = false;
    // If the current tracking id is not in the ids list, we need to find a new one.
    if(id == -1 || !ids.hasOwnProperty(id)) {
        // Find the first tracking id whose left hand is higher than the head
        for(var i = 0; i < ids.length; i++) {
            if(ksensejs.get_relative_joint_location(ids[i], 'hand_left', 'head').y > 0) {
                //updateOld = true;
                id = ids[i];
                foundId = true;
            }
        }
    } else {
        foundId = true;
    }
    
    /* If no players with their hands up are found, return. */
    if(!foundId) {
        return;
    }

    var rHand = ksensejs.get_relative_joint_location(id, "shoulder_right", "hand_right");
    //var lHand = ksensejs.get_relative_joint_location(id, "shoulder_left", "hand_left");
    var lHand = ksensejs.get_relative_joint_location(id, "hand_left", "shoulder_left");

    var oldrHand = ksensejs.get_past_joint_data(id, "shoulder_right", 1, "position", "hand_right");
    var oldlHand = ksensejs.get_past_joint_data(id, "hand_left", 1, "position", "hand_left");

    var absRHand = ksensejs.get_joint_location(id, "hand_right");
    var absLHand = ksensejs.get_joint_location(id, "hand_left");

    var oldAbsRHand = ksensejs.get_past_joint_data(id, "hand_right", 1, "position");
    var oldAbsLHand = ksensejs.get_past_joint_data(id, "hand_left", 1, "position");

    // This means that the player has only been tracked for one frame, so we can't detect gestures.
    if(oldrHand === null || oldlHand === null || oldAbsRHand === null || oldAbsLHand === null) {
        return;
    }

    /* creates a vector from the midpoint between the right
     * and left hands and the right hand*/
    var rHandVec = [(absRHand.x - absLHand.x) / 2,
                    (absRHand.y - absLHand.y) / 2,
                    (absRHand.z - absLHand.z) / 2];
    var oldrHandVec = [(oldAbsRHand.x - oldAbsLHand.x) / 2,
                       (oldAbsRHand.y - oldAbsLHand.y) / 2,
                       (oldAbsRHand.z - oldAbsLHand.z) / 2];

    // /* If we have a new player ID, update the old data. */
    // if (updateOld) {
    //     oldrHand = rHand;
    //     oldlHand = lHand;
    //     oldrHandVec = rHandVec;
    //     updateOld = false;
    // }

    /* If the right and left hands are far enough away from the shoulder (in the z direction), 
     * and the magnitude of the right hand vector? is greater than a constant? */
    if (Math.abs(rHand.z) > kOptions.shoulderDeadZone && 
        Math.abs(lHand.z) > kOptions.shoulderDeadZone && 
        vec3.length(rHandVec) > kOptions.handDeadZone) {
        /* If we are shifting the molecule's position, let x and y be the difference between 
         * the past and current right and left hand position, divided by two and multiplied by 
         * a sensitivity constant. */
        if ($("#pos").hasClass("chosen")) {
            x = (absRHand.x + absLHand.x - oldrHand.x - oldlHand.x) / 2 * kOptions.sensitivity.position;
            y = (absRHand.y + absLHand.y - oldrHand.y - oldlHand.y) / 2 * kOptions.sensitivity.position;
        }
        /* If we are changing the molecule's zoom, let z be the difference between the past and 
         * current distance between the left and right hands multiplied by a sensitivity constant. */
        if ($("#zoom").hasClass("chosen")) {
            z = (get_distance(absRHand, absLHand) - get_distance(oldrHand, oldlHand)) * kOptions.sensitivity.zoom;
        }
        /* If we are changing the molecule's rotation, create a rotation matrix by rotating an 
         * identity matrix by the angle between the past and current right hand vectors, rotating 
         * around the cross product of the two vectors. Then, rotate the molecule by that rotation 
         * matrix. */
        if ($("#rot").hasClass("chosen")) {
            var a = angle(rHandVec, oldrHandVec) * kOptions.sensitivity.rotation;
            var c = vec3.cross(oldrHandVec, rHandVec);
            var r = mat4.rotate(mat4.identity(), a, c);

            if(!a || !c || !r) {
                debugger;
            }

            mat4.multiply(r,
                          kinect_canvas.rotationMatrix, 
                          kinect_canvas.rotationMatrix);
        }
    }

    // If the left hand is above the shoulder, move the cursor.
    if(lHand.y > 0) {
        height = $('#buttons').outerHeight(true);
        width = $('#buttons').outerWidth(true);
        /* Update the cursor position from the position of the hands. */
        $('#cursor').css('left', width / 2 + lHand.x * width * 1.5 + "px");

        /* Iterate through each element that is selectable. If the cursor is in the element bounds, set the
         * hover property. */
        $.each($('.selectable'), 
               function (index, value) {
                   var div = $(value);
                   var divBound = {left:div.offset().left, 
                                   right:div.offset().left + div.outerWidth(false), 
                                   top:div.offset().top, 
                                   bottom:div.offset().top + div.outerHeight(false)};

                   var cur = {x:$('#cursor').offset().left, 
                              y:$('#cursor').offset().top};

                   if (cur.x > divBound.left && cur.x < divBound.right && 
                       cur.y > divBound.top && cur.y < divBound.bottom) {
                       div.addClass("hover");
                   } else {
                       div.removeClass("hover");
                   }
               });

        /* If a click is detected, toggle the button that is being hovered over. */
        if (ksensejs.gesture.click(id, "hand_left")) {
            $('.hover').toggleClass("chosen");
        }
    } else {
        $('.selectable').removeClass('hover');
    }

    kinect_canvas.translationMatrix = mat4.translate(kinect_canvas.translationMatrix, 
                                                     [x * 250, y * 250, z * 500]);
    // oldrHand = absRHand;
    // oldlHand = absLHand;
    // oldrHandVec = rHandVec;

    kinect_canvas.repaint();
}

/** Get the angle between the two input vectors.
 * @param {Array.<number>} v1
 * @param {Array.<number>} v2
 * @return {number}
 */
function angle(v1, v2) {
    return Math.acos(vec3.dot(v1, v2) / Math.pow(vec3.length(v1), 2) * Math.pow(vec3.length(v2), 2));
}

/** Get the distance between the two input joints.
 * @param {Vector} joint1
 * @param {Vector} joint2
 * @return {number}
 */
function get_distance(joint1, joint2) {
    return Math.sqrt(Math.pow(joint1.x - joint2.x, 2) + Math.pow(joint1.y - joint2.y, 2) + Math.pow(joint1.z - joint2.z, 2));
}

/** Load a molecule file provided by the user.
 * @param {?} fileList
 */
function handleFile(fileList) {
    // Use the first file in the list as the input
    var file = fileList[0];
    var reader = new FileReader();
    
    reader.onload = function(e) {
        loadMol(ChemDoodle.readMOL(e.target.result, 1));
    };
    reader.readAsText(file);
}

function setMoleculeRepresentation(rep) {
    kinect_canvas.specs.set3DRepresentation(rep);
    kinect_canvas.repaint();
}

function loadMol(mol) {
    //mol.scaleToAverageBondLength(14.4);
    kinect_canvas.loadMolecule(mol);
    sub_canvas.loadMolecule(mol);
}

var KinectCanvas, molFile;
(function () {
     KinectCanvas = function (id, width, height) {
         if (id) {
             this.create(id, width, height);
         }
         this.lastPoint = null;
         return true;
     };

     KinectCanvas.prototype = new ChemDoodle._Canvas3D();
 })();


var exampleMolFile = '3036\n  CHEMDOOD12280913053D\n\n 28 29  0     0  0  0  0  0  0999 V2000\n    0.0456    1.0544   -1.9374 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n   -0.7952   -1.7026   -1.7706 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n    0.6447   -0.8006   -4.1065 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n    1.8316   -0.9435    4.4004 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n    6.9949    1.1239   -3.9007 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n    1.9032   -1.0692   -1.6001 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.8846   -1.0376   -0.1090 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.2176   -0.5035   -2.1949 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.5585   -0.6223   -2.3126 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.2670    0.1198    0.5688 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.3480   -1.2638   -2.0859 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.4856   -2.1660    0.6075 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.1719    0.7242   -2.7939 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.2506    0.1490    1.9633 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.5313   -0.7541   -2.6203 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.4691   -2.1369    2.0020 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.3552    1.2340   -3.3284 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.8515   -0.9793    2.6800 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.5350    0.4948   -3.2417 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.9777   -2.1366   -1.8749 H   0  0  0  0  0  0  0  0  0  0  0  0\n    2.5727    1.0177    0.0401 H   0  0  0  0  0  0  0  0  0  0  0  0\n    4.3513   -2.2356   -1.6034 H   0  0  0  0  0  0  0  0  0  0  0  0\n    1.1951   -3.0814    0.0991 H   0  0  0  0  0  0  0  0  0  0  0  0\n    2.3077    1.3562   -2.8879 H   0  0  0  0  0  0  0  0  0  0  0  0\n    2.5491    1.0585    2.4783 H   0  0  0  0  0  0  0  0  0  0  0  0\n    6.4431   -1.3411   -2.5451 H   0  0  0  0  0  0  0  0  0  0  0  0\n    1.1584   -3.0244    2.5473 H   0  0  0  0  0  0  0  0  0  0  0  0\n    4.3449    2.2098   -3.8075 H   0  0  0  0  0  0  0  0  0  0  0  0\n  1  9  1  0  0  0  0\n  2  9  1  0  0  0  0\n  3  9  1  0  0  0  0\n  4 18  1  0  0  0  0\n  5 19  1  0  0  0  0\n  6  7  1  0  0  0  0\n  6  8  1  0  0  0  0\n  6  9  1  0  0  0  0\n  6 20  1  0  0  0  0\n  7 10  2  0  0  0  0\n  7 12  1  0  0  0  0\n  8 11  2  0  0  0  0\n  8 13  1  0  0  0  0\n 10 14  1  0  0  0  0\n 10 21  1  0  0  0  0\n 11 15  1  0  0  0  0\n 11 22  1  0  0  0  0\n 12 16  2  0  0  0  0\n 12 23  1  0  0  0  0\n 13 17  2  0  0  0  0\n 13 24  1  0  0  0  0\n 14 18  2  0  0  0  0\n 14 25  1  0  0  0  0\n 15 19  2  0  0  0  0\n 15 26  1  0  0  0  0\n 16 18  1  0  0  0  0\n 16 27  1  0  0  0  0\n 17 19  1  0  0  0  0\n 17 28  1  0  0  0  0\nM  END\n';

