attribute vec2 a_position;

uniform float u_distance;

varying vec2 v_uvTexCoord;
varying float v_slope;

float PI = 3.14159;
float scale = 0.95;

// shrink (x, y) by (0.625, 0.625) and translate by (0.5, 0.5).
mat3 s_t_mat=mat3(  0.625,  0,      0,
                    0,      0.625,  0,
                    0.5,    0.5,    1);

void main() {

    float x = a_position.x;
    float y = a_position.y;

    float amplitude = 1.0 - scale; 
    float period = 1.0;
    float waveLength = 2.0 * scale;

    // The mesh has the same dimension as the image.
    // Use the vertex's (x, y) for texture coordinate.
    // Shrink the vertex (x, y) a bit before copying over to texcoord.
    v_uvTexCoord = (s_t_mat * vec3(x, y, 1.0)).xy;

    y += amplitude * ( (x + scale) / waveLength ) * sin(2.0 * PI * (x - u_distance));

    float x2 = x - 0.001;
    float y2 = a_position.y + amplitude * ( (x2 + scale) / waveLength) * sin(2.0 * PI * (x2 - u_distance));
    v_slope = y - y2;

    gl_Position = vec4(vec2(x, y), 0.0, 1.0);
}

