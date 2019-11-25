// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  CONSTANTS 

const float ROOT_2 = sqrt( 2.0 );
const float P_NORM_EPSILON = 0.000001;
const float P_NORM = P_NORM_EPSILON;
const float PI = 3.14159265359;
const float QUARTER_PI = ( PI * .25 );


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  GENERIC HELPERS

// RANDOM helpers
float get_random ( float x ) { return fract(sin(x)*1e4); }
float get_random ( vec2 st )
{ 
	return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

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

float get_normalized_angle_from_center( vec2 uv )
{
	float is_left = step( 0.0, uv.x );
	float a = 0.5*acos(dot(normalize(uv),normalize(vec2(0.0,1.0))))/PI;
	a = (is_left*a+(1.0-is_left)*(1.0-a));
	return a;
}

// ROTATION helper
mat2 rotate2d(float _angle)
{
    return mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle));
}

// Rotate Vec2 Directly Helper
vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	v -= .5;
	v = m * v;
	v += .5;
	return v;
}

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

// Scale Vec2 Directly Helper
vec2 scale( vec2 _st, vec2 _scale ){
	_st -= .5;
    _st = mat2(_scale.x,0.0,
                0.0,_scale.y) * _st;
    _st += .5;
    return _st;
}

// Integer Equality Helper
float eq( int i, int j )
{
	return
		step( float( j ) - P_NORM_EPSILON, float( i ) ) *
		step( float( i ), float( j ) + P_NORM_EPSILON );
}

// SCALED sin
float ssin( float val, float min, float max )
{
	return ( max - min ) * ( sin( val ) * 0.5 + 0.5 ) + min;
}

// SCALED cos
float scos( float val, float min, float max )
{
	return ( max - min ) * ( cos( val ) * 0.5 + 0.5 ) + min;
}


vec3 hsv_to_rgb( float h, float s, float v )
{

	vec3 rgb = vec3( 0.0 );
	
	float i = int( h * 6.0 );
	float f = ( h * 6.0 ) - i;
	float p = float( ( v * ( 1.0 - s ) ) );
	float q = float( ( v * ( 1.0 - s * f ) ) );
	float t = float( ( v * ( 1.0 - s * ( 1.0 - f ) ) ) );

	i = mod( i, 6.0 );

	rgb = 
		eq( int( s ), 0 ) * vec3( v ) +
		eq( int( i ), 0 ) * vec3( v, t, p ) +
		eq( int( i ), 1 ) * vec3( q, v, p ) +
		eq( int( i ), 2 ) * vec3( p, v, t ) +
		eq( int( i ), 3 ) * vec3( p, q, v ) +
		eq( int( i ), 4 ) * vec3( t, p, v ) +
		eq( int( i ), 5 ) * vec3( v, p, q );

	return rgb;

}

vec3 hsv_to_rgb( vec3 hsv )
{

	float h = hsv.x;
	float s = hsv.y;
	float v = hsv.z;

	vec3 rgb = hsv_to_rgb( h, s, v );
	
	return rgb;

}

// ANTI-ALIAS STEP helper
float aastep_thick(float threshold, float value, float afwidth) {
    return smoothstep(threshold-afwidth, threshold+afwidth, value);
}

vec2 aastep_thick(vec2 threshold, vec2 value, float afwidth) {
    return smoothstep(threshold-afwidth, threshold+afwidth, value);
}


// - - - EASES

float cubicInOut(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}

float cubicIn(float t) {
  return t * t * t;
}

float cubicOut(float t) {
  float f = t - 1.0;
  return f * f * f + 1.0;
}

float exponentialInOut(float t) {
  return t == 0.0 || t == 1.0
    ? t
    : t < 0.5
      ? +0.5 * pow(2.0, (20.0 * t) - 10.0)
      : -0.5 * pow(2.0, 10.0 - (t * 20.0)) + 1.0;
}

float exponentialIn(float t) {
  return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}

float exponentialOut(float t) {
  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
}

float quadraticInOut(float t) {
  float p = 2.0 * t * t;
  return t < 0.5 ? p : -p + (4.0 * t) - 1.0;
}

float quadraticIn(float t) {
  return t * t;
}

float quadraticOut(float t) {
  return -t * (t - 2.0);
}

float circularInOut(float t) {
  return t < 0.5
    ? 0.5 * (1.0 - sqrt(1.0 - 4.0 * t * t))
    : 0.5 * (sqrt((3.0 - 2.0 * t) * (2.0 * t - 1.0)) + 1.0);
}

float circularIn(float t) {
  return 1.0 - sqrt(1.0 - t * t);
}

float circularOut(float t) {
  return sqrt((2.0 - t) * t);
}


// - - - CUSTOMIZEABLE EASES

float quadraticBezier (float x, float a, float b){
	// adapted from BEZMATH.PS (1993)
	// by Don Lancaster, SYNERGETICS Inc. 
	// http://www.tinaja.com/text/bezmath.html

	float epsilon = 0.00001;
	a = max(0, min(1, a)); 
	b = max(0, min(1, b)); 
	if (a == 0.5){
	a += epsilon;
	}

	// solve t from x (an inverse operation)
	float om2a = 1 - 2*a;
	float t = (sqrt(a*a + om2a*x) - a)/om2a;
	float y = (1-2*b)*(t*t) + (2*b)*t;
	return y;
}


// - - - CUBIC Bezier

float slopeFromT (float t, float A, float B, float C){
  float dtdx = 1.0/(3.0*A*t*t + 2.0*B*t + C); 
  return dtdx;
}

float xFromT (float t, float A, float B, float C, float D){
  float x = A*(t*t*t) + B*(t*t) + C*t + D;
  return x;
}

float yFromT (float t, float E, float F, float G, float H){
  float y = E*(t*t*t) + F*(t*t) + G*t + H;
  return y;
}

float cubicBezier (float x, float a, float b, float c, float d){

  float y0a = 0.00; // initial y
  float x0a = 0.00; // initial x 
  float y1a = b;    // 1st influence y   
  float x1a = a;    // 1st influence x 
  float y2a = d;    // 2nd influence y
  float x2a = c;    // 2nd influence x
  float y3a = 1.00; // final y 
  float x3a = 1.00; // final x 

  float A =   x3a - 3.0*x2a + 3.0*x1a - x0a;
  float B = 3.0*x2a - 6.0*x1a + 3.0*x0a;
  float C = 3.0*x1a - 3.0*x0a;   
  float D =   x0a;

  float E =   y3a - 3.0*y2a + 3.0*y1a - y0a;    
  float F = 3.0*y2a - 6.0*y1a + 3.0*y0a;             
  float G = 3.0*y1a - 3.0*y0a;             
  float H =   y0a;

  // Solve for t given x (using Newton-Raphelson), then solve for y given t.
  // Assume for the first guess that t = x.
  float currentt = x;
  int nRefinementIterations = 5;
  for (int i=0; i < nRefinementIterations; i++){
    float currentx = xFromT (currentt, A,B,C,D); 
    float currentslope = slopeFromT (currentt, A,B,C);
    currentt -= (currentx - x)*(currentslope);
    currentt = clamp(currentt, 0.0,1.0);
  } 

  float y = yFromT (currentt,  E,F,G,H);
  return y;
}





// - - - - - - - - - - - - - - - - - - - - - - - - - - - - APPLICATION SPECIFIC

const vec3 BLUE = vec3( 0.3647059, 0.8431373, 0.9960784 );
const vec3 RED = vec3( 0.9647059, 0.2745098, 0.2745098 );
const vec3 YELLOW = vec3( 0.9960784, 0.6901961, 0.2588235 );

const float MAX_ZOOM = 20.0;
const float MAX_GROUP_ZOOM = 4.02;



const vec2 SCREEN_CENTERS[ 6 ] = vec2[ 6 ](
	vec2( -2.5,	0.0 ),
	vec2( -1.5,	0.0 ),
	vec2( -0.5,	0.0 ),
	vec2( 0.5,	0.0 ),
	vec2( 1.5,	0.0 ),
	vec2( 2.5,	0.0 )
);

const vec2 GROUP_CENTERS[ 3 ] = vec2[ 3 ](
	vec2( -2.0,	0.0 ),
	vec2( 0.0,	0.0 ),
	vec2( 2.0,	0.0 )
);

const vec2 GROUP_EDGES[ 2 ] = vec2[ 2 ](
	vec2( -1.0,	0.0 ),
	vec2( 1.0,	0.0 )
);


vec4 get_hue_wuv( vec2 wuv, float blend ) {
	
	blend = clamp( blend, P_NORM, GROUP_EDGES[ 1 ].x - GROUP_EDGES[ 0 ].x );
	wuv.x = clamp( wuv.x, -3.0, 3.0 );

	float on_blend = max(
		step( abs( wuv.x - GROUP_EDGES[ 0 ].x ), blend * 0.5 ),
		step( abs( wuv.x - GROUP_EDGES[ 1 ].x ), blend * 0.5 )
	);

	float which_group = 
		step( GROUP_EDGES[ 0 ].x, wuv.x ) +
		step( GROUP_EDGES[ 1 ].x, wuv.x );

	float which_blend = step( 0.0, wuv.x );

	int wg_i = int( which_group );
	int wb_i = int( which_blend );

	float blend_factor = remap( 
		wuv.x, 
		GROUP_EDGES[ wb_i ].x - blend * 0.5, 
		GROUP_EDGES[ wb_i ].x + blend * 0.5, 
		0.0, 
		1.0
	);

	vec4 hue = vec4( 
		( 1.0 - on_blend ) * ( 
			eq( wg_i, 0 ) * BLUE + eq( wg_i, 1 ) * RED + eq( wg_i, 2 ) * YELLOW
		) +
		( on_blend ) * (
			mix( BLUE, RED, blend_factor ) * ( 1.0 - which_blend ) + 
			mix( RED, YELLOW, blend_factor ) * ( which_blend )
		)
	, 1.0 );

	return hue;

}
