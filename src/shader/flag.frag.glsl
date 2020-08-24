precision mediump float;

uniform sampler2D u_sampler;

varying vec2 v_uvTexCoord;
varying float v_slope;

void main() {
    vec4 color = texture2D( u_sampler, v_uvTexCoord );
    if( v_slope > 0.0 ) {
        color = mix( color, vec4(0.0, 0.0, 0.0, 1.0), v_slope * 300.0 );
    }
    if( v_slope < 0.0 ) {
        color = mix( color, vec4(1.0), abs(v_slope) * 300.0 );
    }
    if(v_uvTexCoord.x < 0.0 || v_uvTexCoord.x > 1.0 || v_uvTexCoord.y < 0.0 || v_uvTexCoord.y > 1.0) {
        color.a = 0.0;
    }
    gl_FragColor = color;
    //gl_FragColor = vec4(255, 20, 0, 1);

}

