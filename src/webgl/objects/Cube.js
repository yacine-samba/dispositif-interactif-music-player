import * as THREE from 'three';
import AudioController from '../../utils/AudioController';

export default class Cube {
	constructor() {
		this.geometry = new THREE.BoxGeometry(1, 1, 1);
		this.material = new THREE.MeshNormalMaterial({});
		this.mesh = new THREE.Mesh(this.geometry, this.material);

		this.group = new THREE.Group();
		this.group.add(this.mesh);
	}

	tick() {
		this.mesh.rotation.x += 0.01;
		this.mesh.rotation.z += 0.01;

		const remap = AudioController.fdata[0] / 255;

		this.mesh.scale.set(1 + remap, 1 + remap, 1 + remap);
	}
}
