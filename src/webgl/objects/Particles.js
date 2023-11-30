import * as THREE from 'three';
import AudioController from '../../utils/AudioController';

export default class ParticleEffect {
	constructor() {
		this.particleCount = 1000; // Nombre de particules
		this.particlePositions = new Float32Array(this.particleCount * 3); // Pour stocker les positions des particules (x, y, z)
		this.particleMaterial = new THREE.PointsMaterial({
			color: 0xffffff, // Couleur des particules
			size: 0.1, // Taille des particules
		});

		// Remplir les positions des particules avec des valeurs aléatoires
		for (let i = 0; i < this.particleCount * 3; i += 3) {
			this.particlePositions[i] = Math.random() * 200 - 100; // x
			this.particlePositions[i + 1] = Math.random() * 200 - 100; // y
			this.particlePositions[i + 2] = Math.random() * 200 - 100; // z
		}

		// Création du buffer d'attributs pour les positions des particules
		this.particles = new THREE.BufferGeometry();
		this.particles.setAttribute(
			'position',
			new THREE.BufferAttribute(this.particlePositions, 3)
		);

		// Création du système de particules
		this.particleSystem = new THREE.Points(this.particles, this.particleMaterial);
		this.maxSize = 2.0; // Taille maximale des particules lorsque la musique est forte
		this.minSize = 0.1; // Taille minimale des particules lorsque la musique est faible
	}

	// Fonction pour mettre à jour le mouvement des particules
	updateParticles(deltaTime) {
		const time = Date.now() * 0.001;
		const bassFrequency = AudioController.fdata[0]; // Obtenir la fréquence des basses

		// Récupérer les attributs des positions des particules
		const positions = this.particles.getAttribute('position');

		for (let i = 0; i < this.particleCount; i++) {
			const i3 = i * 3; // Index pour accéder aux valeurs x, y, z d'une particule

			// Modifier la taille des particules en fonction de la fréquence des basses
			const particleSize =
				this.minSize + (this.maxSize - this.minSize) * bassFrequency;

			// Appliquer un mouvement ondulatoire aux particules
			positions.array[i3] += Math.sin(time + i * 0.5) * 0.1; // x
			positions.array[i3 + 1] += Math.sin(time + i * 0.5) * 0.1; // y
			positions.array[i3 + 2] += Math.cos(time + i * 0.5) * 0.1; // z

			// Limiter la portée des particules pour éviter qu'elles ne sortent de l'écran
			if (
				positions.array[i3] < -100 ||
				positions.array[i3] > 100 ||
				positions.array[i3 + 1] < -100 ||
				positions.array[i3 + 1] > 100 ||
				positions.array[i3 + 2] < -100 ||
				positions.array[i3 + 2] > 100
			) {
				positions.array[i3] = Math.random() * 200 - 100; // x
				positions.array[i3 + 1] = Math.random() * 200 - 100; // y
				positions.array[i3 + 2] = Math.random() * 200 - 100; // z
			}

			// Mettre à jour la taille des particules
			this.particleMaterial.size = particleSize;
		}

		positions.needsUpdate = true; // Mettre à jour les positions des particules
	}
}
