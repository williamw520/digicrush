
attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix;

varying vec4 v_color;

void main() {
    // Multiply the position by the matrix.
    vec4 position = u_matrix * a_position;
    gl_Position = position;
    v_color = a_color;
}

