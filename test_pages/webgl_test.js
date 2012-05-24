var sphere;
var scene;
var camera;
var renderer;

function create_scene() {
    // set the scene size
    var WIDTH = 400,
    HEIGHT = 300;

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
    var radius = 50,
    segments = 16,
    rings = 16;

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

    // create the sphere's material
    var sphereMaterial =
        new THREE.MeshLambertMaterial(
            {
                color: 0xCC0000
            });

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

function start() {
    create_scene();
    document.getElementById('plugin0').addEventListener("newskeletondata", handle_new_data, false);
}

function plugin()
{
    return document.getElementById('plugin0');
}

function get_valid_id() {
    var tracking_ids = plugin().trackedSkeletonIDs;
    return tracking_ids.shift();
}

function get_skeleton_data(tracking_id) {
    return plugin().getSkeletonData(tracking_id);
}

function get_joint_velocity(tracking_id) {
    return plugin().getVelocityData(tracking_id);
}

function is_tracking() {
    var tracking_ids = plugin().trackedSkeletonIDs;
    if( tracking_ids.length > 0 ) {
        return true;
    }
    return false;
}

function handle_new_data() {
    if ( is_tracking() ) {
        var id = get_valid_id();
        var vel = get_joint_velocity(id);
        var pos = get_skeleton_data(id);
        var right_hand_v = vel[11];
        var left_hand_p = pos[7];
        var shoulder_center_p = pos[2];
        if( left_hand_p[1] > shoulder_center_p[1] ) {
            sphere.rotation.x += (-7)*right_hand_v[3];
            sphere.rotation.y += (-7)*right_hand_v[1];
            renderer.render(scene, camera);
        }
    }
}
