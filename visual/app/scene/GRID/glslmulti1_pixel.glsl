#include "/app/glsl/defines"
#include "/app/glsl/helpers"
#include "/app/glsl/helpers_frag"

const int NUM_TOUCHES = 30;

uniform vec3 u_touches[ NUM_TOUCHES ];
uniform vec4 u_config;
uniform vec4 u_config_2;

layout( location=0 ) out vec4 frag_0;
// layout( location=1 ) out vec4 frag_1;


void main() {


	// - - - UNPACK uniforms

	vec2 u_res = 					uTDOutputInfo.res.zw;
	float u_ratio = 				u_res.y / u_res.x;
	vec2 u_px = 					vec2( 1.0 / u_res.x, 1.0 / u_res.y );
	float u_time = 					u_config.x;
	float u_touch_radius = 			clamp( u_config.y, u_px.x, 1.0 );
	float u_touch_rolloff = 		u_config.z;
	float u_distort = 				clamp( u_config.w, 0.0, 1.0 );


	// - - - UV SPACES

	vec2 uv = 						vUV.st;
	vec2 buv = 						uv * 2.0 - 1.0;
	vec2 acuv = 					vec2( uv.x, uv.y * u_res.y / u_res.x );
	vec2 bacuv = 					vec2( buv.x, buv.y * u_res.y / u_res.x );
	vec2 wuv =						vec2( bacuv.x * 3.0, bacuv.y * 3.0 );


	// - - - INIT pixel variables

	vec4 pixel_0 = vec4( vec3( 0.0 ), 1.0 );
	vec4 pixel_1 = vec4( vec3( 0.0 ), 1.0 );


	// - - - SAMPLERS

	vec4 touch_in = texture( sTD2DInputs[ 0 ], uv );
	vec4 noise_in = texture( sTD2DInputs[ 1 ], uv );

	vec4 touches = vec4( 0.0 );


	// - - - WAVE





	// - - - ITERATE over all touch points

	float d_max = length( vec2( u_res.y / u_res.x, 1.0 ) );
	float d_min = length( vec2( u_res.y / u_res.x, 1.0 ) );

	for ( int i=0; i<NUM_TOUCHES; i++ ) {	
		
		vec3 t_pos = u_touches[ i ].xyz;

		vec2 t = mix(
			vec2( wuv.x, wuv.y ),
			u_touches[ i ].xy,
			u_touches[ i ].z
		);


		// if ( eq( i, 1 ) > 0 ) {
			// ADD fake touches to spoof multiples on desktop
			// touch = vec3( 0.2, 0.4, 1.0 );
		// }

		vec2 diff = normalize( wuv - t );

		float d = mix(
			d_max,
			distance( wuv, t_pos.xy ) + mix( -0.25 * u_touch_radius, 0.25 * u_touch_radius, noise_in.r ) * u_distort,
			t_pos.z
		);
		d_min = min( d_min, d );
		

		float touch = remap( d_max - d, 0.0, d_max, 0.0, 1.0 );
		touch = remap( touch, 1.0 - u_touch_radius, 1.0, 0.0, 1.0 );
		touch = clamp( touch, 0.0, 1.0 );

		touches.rg = max( touches.rg, diff * u_touches[ i ].z );
		touches.b = max( touches.b, touch );

	}



	// float on_wave = step( 0.9, get_random( wuv.xy * u_time ) ) * step( 0.95, ssin( 1.0 * PI * ( 0.5 * u_time + distance( wuv.xy, vec2( 0.0 ) ) ), 0.0, 1.0 ) );

	// touches.b = max( touches.b,  on_wave );

	// touches.rg *= step( 0.15, touches.b );



	// - - - ROLLOFF

	// touches.rg = smoothstep( 0.0, )
	touches.b = smoothstep( 0.0, max( u_touch_rolloff, u_px.x ), touches.b );
	touches.b = cubicIn( touches.b );

	touches.rg *= touches.b;


	// - - - COMPOSITE

	pixel_0.rgb = touches.rgb;


	// - - - OUTPUT

	frag_0 = TDOutputSwizzle( pixel_0 );
	// frag_1 = TDOutputSwizzle( pixel_1 );

}