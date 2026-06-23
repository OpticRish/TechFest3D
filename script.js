// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/* --- THREE.JS SCENE SETUP --- */
const canvas = document.querySelector('#webgl-canvas');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 8);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/* --- CREATING 3D OBJECTS --- */

// 1. Particle Field (Digital Dust)
const particlesCount = 1500;
const positions = new Float32Array(particlesCount * 3);
const colors = new Float32Array(particlesCount * 3);

// Palette for particles (cyan, purple, pink)
const colorPalette = [
    new THREE.Color('#06b6d4'),
    new THREE.Color('#7c3aed'),
    new THREE.Color('#ec4899')
];

for (let i = 0; i < particlesCount * 3; i += 3) {
    // Random position in a wide space
    positions[i] = (Math.random() - 0.5) * 30;
    positions[i + 1] = (Math.random() - 0.5) * 30;
    positions[i + 2] = (Math.random() - 0.5) * 30;

    // Random color from palette
    const randColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i] = randColor.r;
    colors[i + 1] = randColor.g;
    colors[i + 2] = randColor.b;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// Custom circular particle texture using canvas
const createParticleTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    return new THREE.CanvasTexture(canvas);
};

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    map: createParticleTexture(),
    depthWrite: false,
    blending: THREE.AdditiveBlending
});

const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleSystem);

// 2. Interactive Geometries (Node Objects)
// Mesh 1: Torus Knot (Hero Node)
const torusKnotGeo = new THREE.TorusKnotGeometry(1.2, 0.4, 150, 20);
const torusKnotMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    wireframe: true,
    metalness: 0.9,
    roughness: 0.1,
    emissive: 0x01303a
});
const meshHero = new THREE.Mesh(torusKnotGeo, torusKnotMat);
meshHero.position.set(2.5, 0, 0);
scene.add(meshHero);

// Mesh 2: Icosahedron (Stats & Events Node)
const icosahedronGeo = new THREE.IcosahedronGeometry(1.5, 1);
const icosahedronMat = new THREE.MeshStandardMaterial({
    color: 0x7c3aed,
    wireframe: true,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x1b0038
});
const meshStats = new THREE.Mesh(icosahedronGeo, icosahedronMat);
meshStats.position.set(-2.5, -6, -2);
scene.add(meshStats);

// Mesh 3: Octahedron (About Portal Node)
const octahedronGeo = new THREE.OctahedronGeometry(1.6, 0);
const octahedronMat = new THREE.MeshStandardMaterial({
    color: 0xec4899,
    wireframe: true,
    metalness: 0.9,
    roughness: 0.05,
    emissive: 0x3d0020
});
const meshAbout = new THREE.Mesh(octahedronGeo, octahedronMat);
meshAbout.position.set(0, -12, 0);
scene.add(meshAbout);

// Group all interactive meshes for raycasting reference
const interactiveMeshes = [meshHero, meshStats, meshAbout];

/* --- LIGHTING --- */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x06b6d4, 2, 30);
pointLight1.position.set(5, 5, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xec4899, 2, 30);
pointLight2.position.set(-5, -5, 5);
scene.add(pointLight2);

// Cursor light that follows mouse
const cursorLight = new THREE.PointLight(0x7c3aed, 3, 10);
scene.add(cursorLight);

/* --- MOUSE INTERACTION & RAYCASTING --- */
const mouse = new THREE.Vector2();
const targetMouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

window.addEventListener('mousemove', (event) => {
    // Normalised mouse coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Set cursor light target position on z=2 plane
    cursorLight.position.x = mouse.x * 6;
    cursorLight.position.y = mouse.y * 6;
    cursorLight.position.z = 3;

    // Update CSS variables on glass cards for dynamic reflection/illumination
    const cards = document.querySelectorAll('.glass-card, .glass-about-card, .nav-pill');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

/* --- GSAP SCROLL ANIMATIONS --- */
// Animate camera position and rotation based on scroll progress
const scrollTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".content-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        ease: "power2.inOut"
    }
});

// Animate camera and meshes as we scroll down
scrollTl
    // Scroll from Hero to Stats
    .to(camera.position, { x: -2.5, y: -6, z: 6, duration: 2 })
    .to(camera.rotation, { y: 0.4, x: 0.2, duration: 2 }, "<")
    .to(meshHero.rotation, { y: Math.PI * 2, duration: 2 }, "<")
    
    // Scroll from Stats to Events
    .to(camera.position, { x: 0, y: -9, z: 8, duration: 2 })
    .to(camera.rotation, { y: 0, x: 0, duration: 2 }, "<")
    .to(meshStats.rotation, { x: Math.PI * 2, y: Math.PI, duration: 2 }, "<")
    
    // Scroll from Events to About
    .to(camera.position, { x: 0, y: -12, z: 5, duration: 2 })
    .to(camera.rotation, { x: -0.2, duration: 2 }, "<")
    .to(meshAbout.rotation, { y: Math.PI * 4, duration: 2 }, "<");

/* --- WINDOW RESIZE --- */
window.addEventListener('resize', () => {
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/* --- ANIMATION LOOP --- */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Constant rotations of geometries
    meshHero.rotation.y = elapsedTime * 0.15;
    meshHero.rotation.z = elapsedTime * 0.1;

    meshStats.rotation.x = elapsedTime * 0.2;
    meshStats.rotation.y = elapsedTime * 0.1;

    meshAbout.rotation.y = elapsedTime * 0.25;
    meshAbout.rotation.z = elapsedTime * 0.15;

    // Gently drift particles
    particleSystem.rotation.y = elapsedTime * 0.02;
    particleSystem.rotation.x = elapsedTime * 0.01;

    // Mouse Parallax effect (Lagging interpolation)
    targetMouse.x += (mouse.x - targetMouse.x) * 0.05;
    targetMouse.y += (mouse.y - targetMouse.y) * 0.05;

    camera.position.x += (targetMouse.x * 0.8 - camera.position.x) * 0.05;
    camera.position.y += (targetMouse.y * 0.8 - camera.position.y) * 0.05;

    // Raycaster to check intersections with main meshes
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveMeshes);

    // Reset scales
    interactiveMeshes.forEach(mesh => {
        mesh.scale.set(1, 1, 1);
        mesh.material.emissiveIntensity = 1;
    });

    // If hovering, upscale and intensify emissive glow
    if (intersects.length > 0) {
        const hoveredMesh = intersects[0].object;
        hoveredMesh.scale.set(1.2, 1.2, 1.2);
        hoveredMesh.material.emissiveIntensity = 2.5;
    }

    // Render scene
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

// Start tick loop
tick();