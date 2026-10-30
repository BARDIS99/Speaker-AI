import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const THEMES = {
  blue: { primary: 0x6366f1, secondary: 0xa855f7, accent: 0x3b82f6 },
  green: { primary: 0x10b981, secondary: 0x06b6d4, accent: 0x34d399 },
  sunset: { primary: 0xf97316, secondary: 0xec4899, accent: 0xfbbf24 },
};

export default function Background3D({ theme = 'blue' }) {
  const mountRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const colors = THEMES[theme] || THEMES.blue;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Particles
    const particleCount = reduced ? 80 : 200;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({ color: colors.primary, size: 0.03, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Floating spheres
    const spheres = [];
    for (let i = 0; i < (reduced ? 3 : 6); i++) {
      const geo = new THREE.SphereGeometry(0.15 + Math.random() * 0.2, 16, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? colors.primary : colors.secondary,
        transparent: true,
        opacity: 0.15,
        wireframe: true,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4);
      mesh.userData = { speed: 0.2 + Math.random() * 0.3, offset: Math.random() * Math.PI * 2 };
      scene.add(mesh);
      spheres.push(mesh);
    }

    // Rings
    for (let i = 0; i < 2; i++) {
      const geo = new THREE.TorusGeometry(1.5 + i * 0.8, 0.02, 8, 64);
      const mat = new THREE.MeshBasicMaterial({ color: colors.accent, transparent: true, opacity: 0.1 });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = Math.PI / 3;
      scene.add(ring);
      spheres.push(ring);
    }

    const onMouse = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouse);

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    let frame;
    const clock = new THREE.Clock();
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      particles.rotation.y = t * 0.02;
      particles.rotation.x = t * 0.01;
      spheres.forEach((s, i) => {
        if (s.userData.speed) {
          s.position.y += Math.sin(t * s.userData.speed + s.userData.offset) * 0.002;
          s.rotation.y = t * 0.1;
        } else {
          s.rotation.z = t * 0.05 * (i % 2 === 0 ? 1 : -1);
        }
      });
      if (!reduced) {
        camera.position.x += (mouse.current.x * 0.3 - camera.position.x) * 0.02;
        camera.position.y += (mouse.current.y * 0.2 - camera.position.y) * 0.02;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      pGeo.dispose();
      pMat.dispose();
    };
  }, [theme]);

  return <div ref={mountRef} className="fixed inset-0 -z-10 pointer-events-none" />;
}
