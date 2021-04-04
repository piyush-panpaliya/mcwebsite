
(function() {
  // Set our main variables
  let scene,  
    renderer,
    camera,
    model,                              // Our character
    neck,                               // Reference to the neck bone in the skeleton
    waist,                               // Reference to the waist bone in the skeleton                      // Animations found in our file
    mixer,                              // THREE.js animations mixer
    clock = new THREE.Clock()         // Used for anims, which run to a clock instead of frame rate 
    //raycaster = new THREE.Raycaster(),  // Used to detect the click on our character
    //loaderAnim = document.getElementById('js-loader');
  
  init(); 

  function init() {
    //https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/
    const MODEL_PATH = 'assets/steve.glb';
    const canvas = document.querySelector('#c');
    const backgroundColor = 0x242424;
    
    // Init the scene
    scene = new THREE.Scene();
    //scene.background = new THREE.Color(backgroundColor);
    scene.background = null;
    
    // Init the renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true});
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0x242424, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    
    // Add a camera
    camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30 
    camera.position.x = 0;
    camera.position.y = -3;
    
    let stacy_txt

    if (window.location.href == 'http://127.0.0.1:4000/mcwebsite/about') {
     stacy_txt = new THREE.TextureLoader().load('assets/texturef.png');}
    else  {
     stacy_txt = new THREE.TextureLoader().load('assets/Steve.png');
    }
    //else{}  (window.location.href == 'http://127.0.0.1:4000/mcwebsite/about1')
    stacy_txt.flipY = false;

    const stacy_mtl = new THREE.MeshPhongMaterial({
      map: stacy_txt,
      color: 0xffffff,
      skinning: true

    });

    
    var loader = new THREE.GLTFLoader();

    loader.load(
      MODEL_PATH,
      function(gltf) {
        model = gltf.scene;
        let fileAnimations = gltf.animations;

          model.traverse(o => {

          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
            o.material = stacy_mtl;
            o.material.alphaTest = 0.5;
          }
          // Reference the neck and waist bones
          
        });
        
        model.scale.set(22, 22, 22);
        model.position.y = -11;
                
        scene.add(model);
        model.rotation.y = -90
        
        loaderAnim.remove();
        
        //mixer = new THREE.AnimationMixer(model);
        
        
      },
      undefined, // We don't need this function
      function(error) {
        console.error(error);
      }
    );
    
    // Add lights
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemiLight.position.set(0, 50, 0);
    // Add hemisphere light to scene
    scene.add(hemiLight);

    let d = 8.25;
    let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
    dirLight.position.set(-8, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 1500;
    dirLight.shadow.camera.left = d * -1;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = d * -1;
    // Add directional Light to scene
    scene.add(dirLight);
 }

 
  function update() {
    
    
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    
     renderer.render(scene, camera);
    requestAnimationFrame(update);
  }

  update();
  
   function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    let width , height
    if (window.innerWidth <= window.innerHeight) {
        console.log(1)
         width = window.innerWidth/3;
         height = window.innerHeight/10;
    }
    else { width = window.innerWidth/3;
          height = window.innerHeight/10;}

    
    let canvasPixelWidth = canvas.width / window.devicePixelRatio;
    let canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize =
      canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
  
  document.addEventListener('mousemove', function(e) {
    var mousecoords = getMousePos(e);
        moveJoint(mousecoords, 30,model);
      
  });

  function getMousePos(e) {
    return { x: e.clientX, y: e.clientY };
  }
  
    function moveJoint(mouse,degreeLimit,model) {
      let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
      model.rotation.y = 90
      //joint.rotation.y = THREE.Math.degToRad(degrees.x);
      //joint.rotation.x = THREE.Math.degToRad(degrees.y);
      if (degrees.y<30 && degrees.x < 30){
      model.rotation.x = 0.01 *degrees.y  
      model.rotation.y = (0.01 *degrees.x) -90 }}
    function getMouseDegrees(x, y, degreeLimit) {
    let dx = 0,
        dy = 0,
        xdiff,
        xPercentage,
        ydiff,
        yPercentage;

    let w = { x: window.innerWidth, y: window.innerHeight };

    // Left (Rotates neck left between 0 and -degreeLimit)
     // 1. If cursor is in the left half of screen
    if (x <= w.x / 2) {
     // 2. Get the difference between middle of screen and cursor position
      xdiff = w.x / 2 - x; 
      // 3. Find the percentage of that difference (percentage toward edge of screen)
      xPercentage = (xdiff / (w.x / 2)) * 100; 
      // 4. Convert that to a percentage of the maximum rotation we allow for the neck
      dx = ((degreeLimit * xPercentage) / 100) * -1; 
    }
    
    // Right (Rotates neck right between 0 and degreeLimit)
    if (x >= w.x / 2) {
      xdiff = x - w.x / 2;
      xPercentage = (xdiff / (w.x / 2)) * 100;
      dx = (degreeLimit * xPercentage) / 100;
    }
    // Up (Rotates neck up between 0 and -degreeLimit)
    if (y <= w.y / 2) {
      ydiff = w.y / 2 - y;
      yPercentage = (ydiff / (w.y / 2)) * 100;
      // Note that I cut degreeLimit in half when she looks up
      dy = (((degreeLimit * 0.5) * yPercentage) / 100) * -1;
    }
    // Down (Rotates neck down between 0 and degreeLimit)
    if (y >= w.y / 2) {
      ydiff = y - w.y / 2;
      yPercentage = (ydiff / (w.y / 2)) * 100;
      dy = (degreeLimit * yPercentage) / 100;
    }
    return { x: dx, y: dy };
  }
  
  })();
