uniform sampler2D uMap;
uniform vec3 uWaveColor; // Nouvel uniforme pour la couleur des vagues

varying vec2 vUv;

void main() {
    vec4 texture = texture2D(uMap, vUv);

    vec3 finalColor = texture.rgb * uWaveColor; // Exemple de mélange simple

    gl_FragColor = vec4(finalColor, texture.a); // Utilisation de la nouvelle couleur combinée avec la texture
}
