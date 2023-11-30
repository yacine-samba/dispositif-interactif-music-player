import * as THREE from 'three';
import { gsap } from 'gsap';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import Stats from 'three/examples/jsm/libs/stats.module.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import pane from '../utils/Pane';

import Waves from './objects/Waves';
import WavesTest from './objects/WavesTest';
import Cube from './objects/Cube';
import Line from './objects/Line';
import Particles from './objects/Particles';

class SCENE {
	setup(canvas) {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.canvas = canvas;

		this.setupScene();
		this.setupCamera();
		this.setupControls();
		this.setupStats();
		this.setupRenderer();
		this.setupPostprocessing();
		this.setupGLTFLoader();
		this.setTextureLoader();

		this.addObjects();
		this.addEvents();
	}

	setupScene() {
		this.scene = new THREE.Scene();
	}
	setTextureLoader() {
		this.textureLoader = new THREE.TextureLoader();
	}

	setupGLTFLoader() {
		this.gltfLoader = new GLTFLoader();
	}

	setupStats() {
		this.stats = new Stats();
		document.body.appendChild(this.stats.dom);
	}

	setupCamera() {
		this.camera = new THREE.PerspectiveCamera(
			28,
			this.width / this.height,
			0.1,
			10000
		);

		this.camera.position.z = 5;
	}

	setupControls() {
		this.controls = new OrbitControls(this.camera, this.canvas);
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.05;
		this.controls.enablePan = false;
		this.controls.enableZoom = true;
	}

	setupRenderer() {
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: false,
			powerPreference: 'high-performance',
			stencil: false,
			depth: false,
			// alpha: true
		});

		this.renderer.toneMapping = THREE.NoToneMapping;
		this.renderer.outputColorSpace = THREE.SRGBColorSpace;

		// color sky =
		this.renderer.setClearColor(0x010101);
		this.renderer.setSize(this.width, this.height);
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	}

	setupPostprocessing() {
		this.BLOOM_PARAMS = {
			strength: 1,
			radius: 0,
			threshold: 0,
		};

		this.composer = new EffectComposer(this.renderer);
		this.scenePass = new RenderPass(this.scene, this.camera);
		this.bloomPass = new UnrealBloomPass(
			new THREE.Vector2(this.width, this.height),
			this.BLOOM_PARAMS.strength,
			this.BLOOM_PARAMS.radius,
			this.BLOOM_PARAMS.threshold
		);

		this.composer.addPass(this.scenePass);
		this.composer.addPass(this.bloomPass);

		this.postProcessFolder = pane.addFolder({
			title: 'Blom',
		});

		this.postProcessFolder
			.addBinding(this.BLOOM_PARAMS, 'strength', {
				min: 0,
				max: 2,
				step: 0.1,
				label: 'Strength',
			})
			.on('change', () => {
				this.bloomPass.strength = this.BLOOM_PARAMS.strength;
			});

		this.postProcessFolder
			.addBinding(this.BLOOM_PARAMS, 'radius', {
				min: 0,
				max: 2,
				step: 0.1,
				label: 'Radius',
			})
			.on('change', () => {
				this.bloomPass.radius = this.BLOOM_PARAMS.radius;
			});

		this.postProcessFolder
			.addBinding(this.BLOOM_PARAMS, 'threshold', {
				min: 0,
				max: 2,
				step: 0.01,
				label: 'Threshold',
			})
			.on('change', () => {
				this.bloomPass.threshold = this.BLOOM_PARAMS.threshold;
			});
	}

	addEvents() {
		gsap.ticker.add(this.tick);

		window.addEventListener('resize', () => this.resize());
	}

	resize() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(this.width, this.height);
	}

	addObjects() {
		this.cube = new Cube();
		this.line = new Line();
		this.waves = new Waves();
		// this.particles = new Particles();

		this.selectedObject = this.cube;
		this.bloomPass.strength = 0.25;
		this.scene.add(this.selectedObject.group);
	}

	changeVisualizer(index) {
		// console.log(index);
		this.scene.remove(this.selectedObject.group);
		switch (index) {
			case 0:
				this.selectedObject = this.cube;
				this.camera.position.set(0, 0, 5);
				this.bloomPass.strength = 0.25;
				break;
			case 1:
				this.selectedObject = this.line;
				this.camera.position.set(0, 0, 800);
				// this.bloomPass.strength = 0.5;
				break;
			case 2:
				this.selectedObject = this.waves;
				this.camera.position.set(0, 10, 50);
				this.bloomPass.strength = 0.5;
				break;
			case 3:
				this.selectedObject = this.particles;
				this.camera.position.set(0, 0, 0.5);
				// this.bloomPass.strength = 0.5;
				break;

			default:
				break;
		}
		this.scene.add(this.selectedObject.group);
	}

	tick = (time, deltaTime, frame) => {
		this.stats.begin();

		// this.waves.tick(deltaTime);
		this.selectedObject.tick(deltaTime);

		this.renderer.render(this.scene, this.camera);
		this.composer.render();
		this.controls.update();

		this.stats.end();
	};
}

const Scene = new SCENE();
export default Scene;
