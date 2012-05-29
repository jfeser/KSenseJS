var sphere;
var scene;
var camera;
var renderer;

function create_scene() {
    // set the scene size
    var WIDTH = 500,
    HEIGHT = 500;

    // set some camera attributes
    var VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

    // get the DOM element to attach to
    // - assume we've got jQuery to hand
    var $container = $('#container');

    // create a WebGL renderer, camera
    // and a scene
    renderer = new THREE.WebGLRenderer();
    camera =
        new THREE.PerspectiveCamera(
            VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR);

    scene = new THREE.Scene();

    // add the camera to the scene
    scene.add(camera);

    // the camera starts at 0,0,0
    // so pull it back
    camera.position.z = 300;

    // start the renderer
    renderer.setSize(WIDTH, HEIGHT);

    // attach the render-supplied DOM element
    $container.append(renderer.domElement);

    // set up the sphere vars
    var radius = 100,
    segments = 16,
    rings = 16;

    var texture = THREE.ImageUtils.loadTexture("earth.jpg");

    // create the sphere's material
    var sphereMaterial = new THREE.MeshBasicMaterial({map : texture});

    // create a new mesh with
    // sphere geometry - we will cover
    // the sphereMaterial next!
    sphere = new THREE.Mesh(

        new THREE.SphereGeometry(
            radius,
            segments,
            rings),

        sphereMaterial);

    // add the sphere to the scene
    scene.add(sphere);

    // create a point light
    var pointLight =
        new THREE.PointLight(0xFFFFFF);

    // set its position
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;

    // add to the scene
    scene.add(pointLight);
}

window.onload = function() {
    create_scene();
    ksensejs.initialize();
    ksensejs.set_new_data_callback(handle_new_data);
}

function handle_new_data() {
    if ( ksensejs.is_tracking() ) {
        var id = ksensejs.get_tracking_ids()[0];
        var right_hand_v = ksensejs.get_joint_velocity_vector(id, 'hand_right');
        if( ksensejs.get_joint_location(id, 'hand_left')[1] > ksensejs.get_joint_location(id, 'shoulder_center')[1] ) {
            sphere.rotation.x += (-7)*right_hand_v[2];
            sphere.rotation.y += (-7)*right_hand_v[0];
            renderer.render(scene, camera);
        }
    }
}
