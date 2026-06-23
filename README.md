# TechFest 2026 | Hyper-Space Nexus

An interactive, futuristic 3D website built using **Three.js** and **GSAP (GreenSock)**. The concept revolves around a "Hyper-Space Nexus"—a digital corridor filled with floating crystalline polyhedrons, neon energy paths, and interactive digital dust.

## 🚀 Live Demo & Repository
- **GitHub Repository**: [https://github.com/OpticRish/TechFest3D.git](https://github.com/OpticRish/TechFest3D.git)

---

## ✨ Features

- **High-End 3D Interactive Graphics**:
  - Fullscreen WebGL canvas background rendering a dynamic particle system ("digital dust") color-coordinated with cyan, purple, and pink tones.
  - Three primary wireframe 3D meshes (Torus Knot, Icosahedron, and Octahedron) designed as interactive focus nodes.
  - Interactive Raycaster: Hovering over the 3D shapes upscales them and triggers an emissive glow effect.
  - Cursor-linked lighting: A dynamic point spotlight that follows the user's cursor across the 3D canvas.

- **Scroll-Driven Camera Pathing**:
  - The camera's coordinate position, rotation, and mesh velocities are linked to scroll progress via a GSAP `ScrollTrigger` timeline. As users scroll down the page, they traverse a 3D path through the shapes.
  - Lagging mouse parallax adds organic depth, shifting the camera perspective based on pointer displacement.

- **Premium CSS Glassmorphism**:
  - Modern dark space layout (`#030014`) using custom fonts (`Orbitron` for tech headers and `Inter` for clean body typography).
  - Hover illumination effect: Glass cards track mouse coordinate positions to update local CSS variables, creating a moving radial spotlight reflection overlay.
  - Responsive layout optimized for desktop, tablet, and mobile views.

- **Asset Theme**:
  - Custom custom-designed 3D favicon matching the theme's core crystalline octahedron logo.

---

## 🛠️ Technology Stack

*   **Markup**: HTML5 (Semantic Structure)
*   **Styling**: CSS3 (Vanilla CSS, Custom Properties, Glassmorphism, CSS Animations)
*   **3D Rendering**: [Three.js](https://threejs.org/) (WebGL)
*   **Animations**: [GSAP (GreenSock)](https://greensock.com/gsap/) & [ScrollTrigger](https://greensock.com/scrolltrigger/)

---

## 💻 How to Run Locally

Since this is a client-side static site, no complicated setup is required:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/OpticRish/TechFest3D.git
    cd TechFest3D
    ```
2.  **Open the Files**:
    - Simply open the [index.html](file:///c:/Users/RAJ/Documents/CODING/3DTechFest/index.html) file directly in any modern web browser.
    - Alternatively, use a development server like VS Code's **Live Server** extension or Python's HTTP server for optimal local performance:
      ```bash
      python -m http.server 8000
      ```
      Then visit `http://localhost:8000` in your browser.

---

## 🎨 Credits
- **Designed by**: RISHABH
