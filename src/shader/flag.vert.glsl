
attribute vec3  a_position;
attribute vec2  a_texcoord;
attribute vec3  a_normal;

uniform mat4    u_projection;       // depth perspective projection matrix
uniform mat4    u_facing_view;      // camera facing view matrix

uniform float   u_wave_strength;    // wave roughness, calmest = .99, roughest = 0.01
uniform float   u_wave_period;      // wave progression to drive the wave rendering per frame.  (0, int), times 2PI.

uniform int     u_model_type;       // item's type; see def.js
uniform vec3    u_model_pos;        // item's model position
uniform float   u_model_scale;      // item's model scale
uniform mat4    u_model_rot;        // item's model rotation

varying vec3    v_pos;
varying vec2    v_texcoord;
varying vec3    v_normal;
varying float   v_slope;

float PI_2 = 2.0 * 3.141592653589;  // 2PI

// scale controls the wave amplitude and intensity. calmest = .99, roughest = 0.01
float fixed_portion = 0.85;         // maximum waving amplitude
float param_portion = 0.15;         // this amount allocated to u_wave_strength
float strength = fixed_portion + (1.0 - u_wave_strength) * param_portion;


void main() {
    float x         = a_position.x;
    float y         = a_position.y;
    float x2        = x - 0.001;
    float y2;

    // compute wave transformation.
    if (u_model_type == 8) {       // T_CASH = 8
        float amplitude = 1.0 - strength; 
        float waveLen   = 2.0 * strength;
        y += amplitude * ( (x + strength) / waveLen ) * sin(PI_2 * (x - u_wave_period));
        y2 = a_position.y + amplitude * ( (x2 + strength) / waveLen) * sin(PI_2 * (x2 - u_wave_period));
    } else {
        // non-flag models don't have wave
        y2 = y;
    }

    // new position after wave transformation; the new position is still in the model unit space.
    vec4 position   = vec4(a_position.x, y, a_position.z, 1);

    // transform the model's position, scale, and rotation from the model unit space to the clip space.
    mat4 model      = mat4(u_model_scale);                      // set scale value at the diagonal.
    model[3].xyzw   = vec4(u_model_pos, 1.0);                   // set translation value at the 4th column's xyz, with w=1.0
    model           = model * u_model_rot;

    // combine the project, facing view, and model matrices to together.
    mat4 matrix     = u_projection * u_facing_view * model;

    // Apply the projection, facing view, and model matrices to the position.
    // It's important to take in all values of the vec4 on gl_Position including the w-axis.
    // The matrices apply on the w-axis as well.  Projection won't look right without w-axis.
    gl_Position     = matrix * position;

    // pass the variants along to the fragment shader.
    v_pos           = position.xyz;                             // pass the model unit position (before applying projection/view/model matrics).
    v_normal        = mat3(matrix) * a_normal;                  // apply the same combined matrix to the normal vec3.
    v_texcoord      = a_texcoord;
    v_slope         = y - y2;

}

