import * as THREE from "three";
import AudioController from "../../utils/AudioController";
import Scene from "../Scene";
import pane from "../../utils/Pane";

// eslint-disable-next-line import/no-webpack-loader-syntax
import fragmentShader from "!!raw-loader!!glslify-loader!../shaders/waves/fragment.glsl";
// eslint-disable-next-line import/no-webpack-loader-syntax
import vertexShader from "!!raw-loader!!glslify-loader!../shaders/waves/vertex.glsl";

export default class Waves {
    constructor() {
        this.geometry = new THREE.PlaneGeometry(20, 20, 256, 256);
        this.material = new THREE.ShaderMaterial({
            // size: 0.02,
            // wireframe: true,
            uniforms: {
                uMap: {
                    value: null,
                },
                uBassFrequency: {
                    value: 0,
                },
                uTime: {
                    value: 0,
                },
                uNoiseFrequency: {
                    value: 0.25,
                }
            },
            side: THREE.DoubleSide,
            fragmentShader,
            vertexShader,
        });

        this.mesh = new THREE.Points(this.geometry, this.material);
        this.group = new THREE.Group();
        this.group.add(this.mesh);

        this.folder = pane.addFolder({
            title: "Noise",
        });


        this.folder.addBinding(this.material.uniforms.uNoiseFrequency, "value", {
            label: "Frequency",
            min: 0,
            max: 2,
        });

    }

    updateWaves(src) {
        Scene.textureLoader.load(src, (texture) => {
            console.log(texture);
            this.material.map = texture;
            this.material.uniforms.uMap.value = texture;
            this.material.needsUpdate = true;
        });
    }

    tick(deltaTime) {
        this.material.uniforms.uTime.value += deltaTime * 0.001;
        this.material.uniforms.uBassFrequency.value = AudioController.fdata[0];
        // console.log(this.uniforms);
    }
}