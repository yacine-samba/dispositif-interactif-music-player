import * as THREE from 'three';
import AudioController from '../../utils/AudioController';

export default class Line {
	constructor() {
		this.colors = [
			0xb97100, 0x993399, 0x008c00, 0x000080, 0x807000, 0xb32d00, 0xb34789,
			0x008080, 0xb88600, 0x548c00,
		];

		this.group = new THREE.Group();

		this.geometry = new THREE.BoxGeometry(1, 1, 1);
		// this.material = new THREE.MeshNormalMaterial();

		this.materials = [];

		// this.mesh = new THREE.Mesh(this.geometry, this.material);

		this.colors.forEach(color => {
			const material = new THREE.MeshBasicMaterial({
				color: color,
				opacity: 1,
				transparent: true,
			});
			this.materials.push(material);
		});

		this.spacing = 1.5;

		let n = -1;

		const Modulo = Math.ceil(256 / this.colors.length);

		for (let i = 0; i < 256; i++) {
			if (i % Modulo === 0) {
				// console.log(i);
				n++;
				// console.log(n);
			}

			const materialIndex = n % this.colors.length;
			this.mesh = new THREE.Mesh(this.geometry, this.materials[materialIndex]);
			// this.mesh = new THREE.Mesh(this.geometry, this.materials[n]);
			this.mesh.position.x = i * this.spacing - (256 * this.spacing) / 2;
			// this.mesh.scale.y = 0.5;
			this.group.add(this.mesh);
		}
	}

	tick() {
		const minOpacity = 0.6;
		const opacityRange = 1.0 - minOpacity;
		const time = Date.now() * 0.001;

		for (let i = 0; i < this.group.children.length; i++) {
			const child = this.group.children[i];
			child.scale.y = AudioController.fdata[i] + 0.5;

			const opacity = minOpacity + Math.sin(time + i * 0.5) * opacityRange;

			child.material.opacity = opacity;
			child.material.transparent = true;
		}
	}
}
