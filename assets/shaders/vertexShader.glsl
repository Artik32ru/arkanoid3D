attribute vec3 a_pos;
varying vec3 v_pos;
void main() 
{
	v_pos = vec3(a_pos.xyz);
	gl_Position = vec4(a_pos, 1);
}
