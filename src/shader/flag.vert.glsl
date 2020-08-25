
attribute vec2 a_position;
attribute vec2 a_texcoord;

uniform mat4 u_projection;
uniform mat4 u_facingView;
uniform mat4 u_world;
uniform float u_model_scale;
uniform float u_wave_speed;

varying vec2 v_texcoord;
varying float v_slope;

float PI_2 = 2.0 * 3.141592653589;  // 2PI 
float scale = 0.90;                 // controls the wave intensity and speed. slowest = .99, fastest = 0.01

void main() {

    // gl_Position = u_projection * u_facingView * u_world * position;
    // vec4 position = u_projection * u_world * vec4(a_position, 0, 1);
    vec4 position = u_world * vec4(a_position, 0, 1);
//   vec4 position = vec4(a_position, 0, 1);

    float amplitude     = 1.0 - scale; 
    float waveLength    = 2.0 * scale;
    float               x = position.x;
    float               y = position.y;
    float               x2 = x - 0.001;
    float               y2 = position.y + amplitude * ( (x2 + scale) / waveLength) * sin(PI_2 * (x2 - u_wave_speed));

    y += amplitude * ( (x + scale) / waveLength ) * sin(PI_2 * (x - u_wave_speed));

    v_slope     = y - y2;
    v_texcoord  = a_texcoord;
    gl_Position = vec4(x, y, 0.0, 1.0);
}

