precision mediump float;

uniform sampler2D   u_sampler;
uniform float       u_item_index;
uniform float       u_item_count;
uniform vec4        u_background;
uniform vec3        u_light_direction;

varying vec2        v_texcoord;
varying vec3        v_normal;
varying float       v_slope;


void main() {
    // compute a clipped texcoord from one of the image items on the image texture.
    float item_height   = 1.0 / u_item_count;                                   // overall texture height is 1.0.
    float item_y_offset = (u_item_count - u_item_index - 1.0) * item_height;    // get the y-offset of the item on the texture.
    float texcoord_y    = item_y_offset + v_texcoord.y * item_height;           // compute texcoord's y based on item offset and height.
    vec2 item_texcoord  = vec2(v_texcoord.x, texcoord_y);                       // construct a clipped textcoord.
    
    vec4 color          = texture2D(u_sampler, item_texcoord);                  // get the sampled color from the texture.
    vec3 normal         = normalize(v_normal);                                  // make varying vector into a unit vector.
    float light         = dot(normal, u_light_direction);

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
    gl_FragColor.rgb *= light;      // adding directional lighting.
}

