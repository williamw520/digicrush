precision mediump float;

uniform sampler2D   u_sampler;
uniform float       u_item_index;
uniform float       u_item_count;
uniform vec4        u_background;

varying vec2        v_texcoord;
varying float       v_slope;


void main() {
    float   item_height     = 1.0 / u_item_count;                                   // overall texture height is 1.0.
    float   item_y_offset   = (u_item_count - u_item_index - 1.0) * item_height;
    float   item_y          = item_y_offset + v_texcoord.y * item_height;
    vec2    item_texcoord   = vec2(v_texcoord.x, item_y);
    vec4    color           = texture2D(u_sampler, item_texcoord);

    if (color.a == 0.0) {
        color = u_background;       // texture's color is transparent; use the background color instead
    } else {
        if (v_slope > 0.0) {
            color = mix( color, vec4(0.0, 0.0, 0.0, 1.0), v_slope * 300.0 );
        }
        if (v_slope < 0.0) {
            color = mix( color, vec4(1.0), abs(v_slope) * 300.0 );
        }
        if (item_texcoord.x < 0.0 || item_texcoord.x > 1.0 || item_texcoord.y < 0.0 || item_texcoord.y > 1.0) {
            color.a = 0.0;
        }
    }

    gl_FragColor = color;
}

