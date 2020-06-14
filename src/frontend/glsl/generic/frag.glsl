uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;


// REMAP helper
float remap(
	in float value, in float low1, in float high1, in float low2, in float high2
) {
	return float(low2 + (value - low1) * (high2 - low2) / (high1 - low1));
}

vec2 remap(
	in vec2 value, in vec2 low1, in vec2 high1, in vec2 low2, in vec2 high2
) {
	return vec2(low2 + (value - low1) * (high2 - low2) / (high1 - low1));
}

vec3 remap(
	in vec3 value, in float low1, in float high1, in float low2, in float high2
) {
	return low2 + (value - low1) * (high2 - low2) / (high1 - low1);
}
vec4 remap(
	in vec4 value, in float low1, in float high1, in float low2, in float high2
) {
	return low2 + (value - low1) * (high2 - low2) / (high1 - low1);
}



void main() {

	// init output
	vec4 pixel = vec4( 0.0, 0.0, 0.0, 1.0 );

	// UV calcs, cover quad and maintain 16:9 aspect ratio
	vec2 uv = gl_FragCoord.xy / u_resolution;
	vec2 buv = uv * 2.0 - 1.0;

	pixel.rg = uv;

	gl_FragColor = pixel;

}