
precision mediump float;

varying vec3 v_normal;
varying vec4 v_color;

uniform vec4 u_diffuse;
uniform vec3 u_lightDirection;

void main () {
    vec3 normal = normalize(v_normal);
    float fakeLight = dot(u_lightDirection, normal) * .5 + .5;
    vec4 diffuse = u_diffuse * v_color;
//  gl_FragColor = vec4(diffuse.rgb * fakeLight, diffuse.a);
    gl_FragColor = vec4(255, 20, 0, 1);
}
