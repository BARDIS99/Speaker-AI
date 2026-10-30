import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Procedural luminous soft dot particle texture (Zero 404 dependencies)
function createParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(140, 210, 255, 0.9)');
  gradient.addColorStop(0.5, 'rgba(120, 80, 240, 0.4)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function Background3D({ isStreaming = false }) {
  const mountRef = useRef(null);
  const isStreamingRef = useRef(isStreaming);
  isStreamingRef.current = isStreaming;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Detect software rendering guard
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      50,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 4.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // Build the 3D Morphing Particle Wave Sphere inspired by SS.jpeg
    // Dense spherical grid of glowing dots
    const rings = isSoftwareGl ? 50 : 90;
    const pointsPerRing = isSoftwareGl ? 70 : 120;
    const totalCount = rings * pointsPerRing;

    const basePositions = new Float32Array(totalCount * 3);
    const currentPositions = new Float32Array(totalCount * 3);
    const colors = new Float32Array(totalCount * 3);
    const angles = new Float32Array(totalCount * 2); // theta, phi

    // Color Palette matching SS.jpeg:
    // Top: Electric Cyan / Sky Blue (#38bdf8 -> #00d2ff)
    // Mid: Royal Blue / Indigo (#3b82f6 -> #6366f1)
    // Bottom: Neon Violet / Magenta (#a855f7 -> #e879f9)
    const colorTop = new THREE.Color(0x38bdf8);
    const colorMid = new THREE.Color(0x6366f1);
    const colorBottom = new THREE.Color(0xd946ef);
    const tempColor = new THREE.Color();

    let idx = 0;
    for (let i = 0; i < rings; i++) {
      const v = (i / (rings - 1)); // 0 to 1 (top to bottom)
      const phi = v * Math.PI; // 0 to PI

      for (let j = 0; j < pointsPerRing; j++) {
        const u = j / pointsPerRing; // 0 to 1
        const theta = u * Math.PI * 2; // 0 to 2*PI

        // Base unit sphere
        const baseRadius = 1.65;
        const x = Math.sin(phi) * Math.cos(theta) * baseRadius;
        const y = Math.cos(phi) * baseRadius;
        const z = Math.sin(phi) * Math.sin(theta) * baseRadius;

        basePositions[idx * 3] = x;
        basePositions[idx * 3 + 1] = y;
        basePositions[idx * 3 + 2] = z;

        currentPositions[idx * 3] = x;
        currentPositions[idx * 3 + 1] = y;
        currentPositions[idx * 3 + 2] = z;

        angles[idx * 2] = theta;
        angles[idx * 2 + 1] = phi;

        // Smooth vertical gradient: Top (cyan) -> Mid (indigo) -> Bottom (magenta)
        if (v < 0.45) {
          tempColor.lerpColors(colorTop, colorMid, v / 0.45);
        } else {
          tempColor.lerpColors(colorMid, colorBottom, (v - 0.45) / 0.55);
        }

        // Add subtle luminance variation for realistic cybernetic wave look
        const jitter = 0.9 + Math.random() * 0.2;
        colors[idx * 3] = Math.min(1, tempColor.r * jitter);
        colors[idx * 3 + 1] = Math.min(1, tempColor.g * jitter);
        colors[idx * 3 + 2] = Math.min(1, tempColor.b * jitter);

        idx++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleTexture = createParticleTexture();

    const material = new THREE.PointsMaterial({
      size: isSoftwareGl ? 0.055 : 0.045,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleMesh = new THREE.Points(geometry, material);
    scene.add(particleMesh);

    // Subtle outer ambient dust particle shell
    const dustCount = isSoftwareGl ? 40 : 120;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    for (let d = 0; d < dustCount; d++) {
      const radius = 2.4 + Math.random() * 1.5;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      dustPos[d * 3] = radius * Math.sin(p) * Math.cos(t);
      dustPos[d * 3 + 1] = radius * Math.cos(p);
      dustPos[d * 3 + 2] = radius * Math.sin(p) * Math.sin(t);
      dustColors[d * 3] = 0.3 + Math.random() * 0.3;
      dustColors[d * 3 + 1] = 0.6 + Math.random() * 0.4;
      dustColors[d * 3 + 2] = 0.9;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustMesh = new THREE.Points(dustGeo, dustMat);
    scene.add(dustMesh);

    // Mouse tracking for subtle organic tilt
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMouseMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // Animation loop with harmonic sinusoidal deformation
    let frameId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const isStreamingActive = isStreamingRef.current;

      // Accelerated wave dynamics when Zentra is thinking / streaming
      const timeSpeed = isStreamingActive ? 1.8 : 0.85;
      const waveTime = elapsedTime * timeSpeed;
      const amplitudeMultiplier = isStreamingActive ? 1.35 : 1.0;

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      particleMesh.rotation.y = elapsedTime * 0.12 + mouse.x * 0.3;
      particleMesh.rotation.x = Math.sin(elapsedTime * 0.08) * 0.15 + mouse.y * 0.2;
      particleMesh.rotation.z = Math.cos(elapsedTime * 0.06) * 0.08;

      dustMesh.rotation.y = elapsedTime * -0.05;

      const posAttr = geometry.attributes.position;
      const arr = posAttr.array;

      for (let k = 0; k < totalCount; k++) {
        const theta = angles[k * 2];
        const phi = angles[k * 2 + 1];

        const bx = basePositions[k * 3];
        const by = basePositions[k * 3 + 1];
        const bz = basePositions[k * 3 + 2];

        // Complex organic harmonic wave formula reproducing the rippling lobes in SS.jpeg
        const wave1 = Math.sin(theta * 3 + phi * 2 + waveTime * 1.6) * 0.24;
        const wave2 = Math.cos(phi * 4.5 - waveTime * 1.2 + theta) * 0.18;
        const wave3 = Math.sin(theta * 5.0 - phi * 3.0 + waveTime * 0.9) * 0.12;
        const wave4 = Math.cos(theta * 2.0 + waveTime * 2.1) * 0.08;

        const displacement = 1.0 + (wave1 + wave2 + wave3 + wave4) * amplitudeMultiplier;

        arr[k * 3] = bx * displacement;
        arr[k * 3 + 1] = by * displacement;
        arr[k * 3 + 2] = bz * displacement;
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      mount.removeChild(renderer.domElement);

      renderer.dispose();
      geometry.dispose();
      material.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      particleTexture?.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-90 transition-opacity duration-700"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 45%, rgba(19, 20, 25, 0.4) 0%, rgba(19, 19, 20, 0.85) 70%, #131314 100%)`,
      }}
    />
  );
}
