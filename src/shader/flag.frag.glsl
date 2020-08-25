precision mediump float;

uniform sampler2D   u_sampler;
uniform float       u_item_index;
uniform float       u_item_count;
uniform vec4        u_background;

varying vec2        v_uv_texcoord;
varying float       v_slope;


void main() {
    float   item_fraction = 1.0 / u_item_count;
    float   y_offset = (u_item_count - u_item_index - 1.0) * item_fraction;
    vec2    uv_texcoord = vec2(v_uv_texcoord.x, y_offset + v_uv_texcoord.y * item_fraction);
    vec4    sample = texture2D(u_sampler, uv_texcoord);
    vec4    color = sample;

    if (v_slope > 0.0) {
        color = mix( color, vec4(0.0, 0.0, 0.0, 1.0), v_slope * 300.0 );
    }
    if (v_slope < 0.0) {
        color = mix( color, vec4(1.0), abs(v_slope) * 300.0 );
    }
    if (uv_texcoord.x < 0.0 || uv_texcoord.x > 1.0 || uv_texcoord.y < 0.0 || uv_texcoord.y > 1.0) {
        color.a = 0.0;
    }
    if (sample.a == 0.0) {
        color = u_background;
    }

    gl_FragColor = color;

}

