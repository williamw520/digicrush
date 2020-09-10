precision mediump float;

uniform sampler2D   u_sampler;
uniform int         u_model_type_f;
uniform float       u_item_index;
uniform float       u_item_count;
uniform vec4        u_background;
uniform vec3        u_light_direction;

varying vec3        v_pos;
varying vec2        v_texcoord;
varying vec3        v_normal;
varying float       v_slope;

float BLOCK_R = 1.1;    // slightly bigger than the max radius to create a round octagon shape.
float FORT_O_R = 1.35;
float FORT_I_R = 1.08;
float BOMB_R1 = 1.0; 
float BOMB_R2 = 0.85;
float BOMB_R3 = 0.85;


vec4 colorByShape() {
    vec4 color = u_background;                          // use the background color by default
    float distance = sqrt(dot(v_pos, v_pos));

    if (u_model_type_f == 1) {                          // T_ROCK = 1
        if (distance > BLOCK_R) {
            color = vec4(0.0, 0.0, 0.0, 0.0);
        }
    } else if (u_model_type_f == 3) {                   // T_BOMB3 = 3
        if (distance > BOMB_R1 || distance < BOMB_R2) {
            color = vec4(0.0, 0.0, 0.0, 0.0);
        }
    } else if (u_model_type_f == 4) {                   // T_BOMB4 = 4
        if (distance > BOMB_R1 || distance < BOMB_R3) {
            color = vec4(0.0, 0.0, 0.0, 0.0);
        }
    } else if (u_model_type_f == 5) {                   // T_FORT_O = 5
        if (distance > FORT_O_R) {
            color = vec4(0.0, 0.0, 0.0, 0.0);
        }
    } else if (u_model_type_f == 6) {                   // T_FORT_I = 6
        if (distance > FORT_I_R) {
            color = vec4(0.0, 0.0, 0.0, 0.0);
        }
    }
    return color;
}

void main() {
    // compute a clipped texcoord from one of the image items on the image texture.
    float item_height   = 1.0 / u_item_count;                                   // overall texture height is 1.0.
    float item_y_offset = (u_item_count - u_item_index - 1.0) * item_height;    // get the y-offset of the item on the texture.
    float texcoord_y    = item_y_offset + v_texcoord.y * item_height;           // compute texcoord's y based on item offset and height.
    vec2 item_texcoord  = vec2(v_texcoord.x, texcoord_y);                       // construct a clipped textcoord.

    vec4 tcolor         = texture2D(u_sampler, item_texcoord);                  // get the sampled color from the texture.
    vec4 color;
    vec3 normal         = normalize(v_normal);                                  // make varying vector into a unit vector.
    float light         = dot(normal, u_light_direction);

    if (tcolor.a == 0.0) {
        // Texture's color is transparent; not on the digit drawing.
        color = colorByShape();
    } else {
        // has texture color; on the digit drawing.
        if (u_model_type_f == 1) {                          // T_ROCK = 1
            color = vec4(1.0, 1.0, 0.50, 1.0);
        } else if (u_model_type_f == 3) {                   // T_BOMB3 = 3
            color = vec4(1.0, 1.0, 1.0, 1.0);
        } else if (u_model_type_f == 4) {                   // T_BOMB4 = 4
            color = vec4(1.0, 1.0, 0.50, 1.0);
        } else {
            if (v_slope > 0.0) {
                color = mix( tcolor, vec4(0.0, 0.0, 0.0, 1.0), v_slope * 300.0 );
            }
            if (v_slope < 0.0) {
                color = mix( tcolor, vec4(1.0), abs(v_slope) * 300.0 );
            }
        }
    }

    gl_FragColor = color;
    gl_FragColor.rgb *= light;      // adding directional lighting.
}

