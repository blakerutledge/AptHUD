// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  SETUP

#include "/app/glsl/defines"
#include "/app/glsl/helpers"
#include "/app/glsl/helpers_frag"

uniform vec4 u_config_1;
uniform vec4 u_config_2;
uniform vec4 u_config_3;
uniform vec4 u_config_4;

uniform vec4 u_config_alt;

in vec4 transport_geo_out_p_transform_1;
in vec4 transport_geo_out_p_transform_2;
in vec4 transport_geo_out_p_transform_3;
in vec4 transport_geo_out_p_transform_4;
in vec4 transport_geo_out_p_life;
in vec4 transport_geo_out_p_meta;
in vec4 transport_geo_out_p_misc;
in vec2 transport_geo_out_p_uv;

out vec4 frag_color;



// - - - - - - - - - - - - - - - - - - - - - - - - - - - SHAPE HELPER FUNCTIONS

float draw_circle( vec2 uv, float alpha )
{

	vec2 buv = uv * 2.0 - 1.0;
	float d = distance( buv, vec2( 0.0 ) );
	float x = 1.0 - aastep( 1.0, d );

	return x * alpha;

}



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - MAIN

void main()
{

	TDCheckDiscard();

	// - - - UNPACK UNIFORMS

	vec2  u_sim_res = 			u_config_alt.xy;
	vec2  u_grid_count = 		u_config_1.xy;
	vec2  u_grid_scale = 		u_config_1.zw;
	vec2  u_canvas_res = 		u_config_2.zw;
	float u_max_particles = 	u_config_2.x;
	float u_frametime = 		u_config_2.y;
	float u_time = 				u_config_3.x;
	float u_zoom = 				u_config_3.y;
	float u_zoom_a = 			u_config_4.x;
	float u_zoom_b = 			u_config_4.y;
	float u_zoom_c = 			u_config_4.z;
	float u_zooming = 			u_config_4.w;
	float u_is_conclusion = 	u_config_alt.z;

	float u_ratio = 			u_grid_count.y / u_grid_count.x;
	float u_px_w_tx = 			6.0 / u_canvas_res.x;
	float u_group_count =		u_grid_count.x * u_grid_count.y;
	float u_group_count_alt =	u_grid_count.x * u_grid_count.y * 0.5;
	float u_num_groups = 		3.0;
	float u_num_groups_alt = 	2.0;
	float u_group_total = 		u_num_groups * u_group_count;
	float u_group_total_alt = 	u_num_groups_alt * u_group_count_alt;
	float u_module_w =			( u_grid_scale.x / u_grid_count.x ) * mix( 1.0, MAX_ZOOM, u_zoom ) + 2.0 * u_px_w_tx;


	// - - - UNPACK transform & meta data from texture

	vec4 p_transform_1 = 		transport_geo_out_p_transform_1;
	vec4 p_transform_2 = 		transport_geo_out_p_transform_2;
	vec4 p_transform_3 = 		transport_geo_out_p_transform_3;
	vec4 p_transform_4 = 		transport_geo_out_p_transform_4;
	vec4 p_life = 				transport_geo_out_p_life;
	vec4 p_meta = 				transport_geo_out_p_meta;
	vec4 p_misc = 				transport_geo_out_p_misc;


	// - - - UNPACK transform & meta values

	int   p_type_i = 					int( p_meta.g );
	float p_renderable = 				p_meta.r;

	vec2  p_origin = 					p_transform_1.xy;
	float p_scale = 					p_transform_2.y;
	float p_rotation = 					p_transform_2.x;

	vec4 p_color = 						p_transform_3.rgba;

	int gi = 							int( p_transform_1.z );


	// - - - UV SPACES

	vec2 puv =					transport_geo_out_p_uv;
	vec2 bpuv = 				puv * 2.0 - 1.0;

	// screen uv
	vec2 suv = 					vec2( gl_FragCoord.xy / u_canvas_res );
	
	// canvus uv
	vec2 cuv = vec2(
		3.0 * ( suv.x * 2.0 - 1.0 ),
		3.0 * ( suv.y * 2.0 - 1.0 ) * u_ratio
	);



	// - - - PULSE

	float p_pulse_offset = 				p_transform_4.z;
	float p_pulse_ratio = 				0.75;
	float p_pulse_scale = 				2.0;

	vec2 pulse_uv = vec2( puv.x, fract( puv.y / p_pulse_scale - p_pulse_offset ) );

	float on_pulse = aastep( pulse_uv.y, p_pulse_ratio );

	// on_pulse = mix( 1.0, on_pulse, step( P_NORM, p_type_i );



	float on_shape = 

		eq( p_type_i, 0 ) * p_transform_2.g * ( 1.0 - aastep( 1.0, distance( bpuv, vec2( 0.0 ) ) ) ) +

		eq( p_type_i, 1 ) * ( on_pulse ) +

		eq( p_type_i, 2 ) * ( on_pulse ) +

		eq( p_type_i, 3 ) * ( on_pulse ) +

		eq( p_type_i, 4 ) * ( on_pulse ) +

		eq( p_type_i, 5 ) * ( on_pulse ) +

		0.0;




	float alpha = mix(
			p_color.a, 
			step( P_NORM, p_color.a ) * step( P_NORM * 10.0, p_scale ),
			eq( p_type_i, 0 ) * u_is_conclusion
		);


	float fade_w = 0.01;

	float group_border_fade = 
		( 1.0 - smoothstep( GROUP_EDGES[ 0 ].x - fade_w, GROUP_EDGES[ 0 ].x, cuv.x ) ) * eq( gi, 0 ) +
		min( 
			smoothstep( GROUP_EDGES[ 0 ].x, GROUP_EDGES[ 0 ].x + fade_w, cuv.x ),
			1.0 - smoothstep( GROUP_EDGES[ 1 ].x - fade_w, GROUP_EDGES[ 1 ].x, cuv.x )
		) * eq( gi, 1 ) + 
		( smoothstep( GROUP_EDGES[ 1 ].x, GROUP_EDGES[ 1 ].x + fade_w, cuv.x ) ) * eq( gi, 2 ) +
		0.0;

	alpha = mix( alpha, alpha * group_border_fade, u_zooming );


	// - - - INIT color output variables

	vec4 color = vec4( p_color.rgb, on_shape * alpha );
	// color.r = 1.0;
	// color.a = 1.0;

	// color.r = p_transform_3.r;

	// color.r = 0.0;
	// color.g = 0.0;
	// color.g = 0.0;
	// color.a = 0.5;

	// color.rgb = p_life.rgb;

	// - - - OUTPUT

	color.rgb *= color.a;
	
	TDAlphaTest(color.a);

	frag_color = TDOutputSwizzle( color );

}