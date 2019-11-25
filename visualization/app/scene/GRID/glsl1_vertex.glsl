// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  SETUP

#include "/app/glsl/defines"
#include "/app/glsl/helpers"

uniform sampler2D u_transform_1;
uniform sampler2D u_transform_2;
uniform sampler2D u_transform_3;
uniform sampler2D u_transform_4;
uniform sampler2D u_life;
uniform sampler2D u_meta;
uniform sampler2D u_misc;

uniform vec4 u_config_1;
uniform vec4 u_config_2;
uniform vec4 u_config_3;
uniform vec4 u_config_4;

uniform vec4 u_config_alt;

in int p_index_global;

out vec4 transport_geo_in_p_transform_1;
out vec4 transport_geo_in_p_transform_2;
out vec4 transport_geo_in_p_transform_3;
out vec4 transport_geo_in_p_transform_4;
out vec4 transport_geo_in_p_life;
out vec4 transport_geo_in_p_meta;
out vec4 transport_geo_in_p_misc;



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  MAIN

void main() 
{


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

	float u_ratio = 			u_grid_count.y / u_grid_count.x;
	float u_px_w_tx = 			6.0 / u_canvas_res.x;
	float u_group_count =		u_grid_count.x * u_grid_count.y;
	float u_group_count_alt =	u_grid_count.x * u_grid_count.y * 0.5;
	float u_num_groups = 		3.0;
	float u_num_groups_alt = 	2.0;
	float u_group_total = 		u_num_groups * u_group_count;
	float u_group_total_alt = 	u_num_groups_alt * u_group_count_alt;
	float u_module_w =			( u_grid_scale.x / u_grid_count.x ) * mix( 1.0, MAX_ZOOM, u_zoom ) + 2.0 * u_px_w_tx;


	// - - - CALC simulation uv coordinate
	
	vec2 sim_uv = vec2(
		( 0.5 + mod( p_index_global, u_sim_res.x ) ) / ( u_sim_res.x ),
		( 0.5 + floor( p_index_global / ( u_sim_res.y ) ) ) / ( u_sim_res.y )
	);


	// - - - READ & PASS transform & meta data from texture
	
	vec4 transform_1_px = 				texture( u_transform_1, sim_uv );
	vec4 transform_2_px = 				texture( u_transform_2, sim_uv );
	vec4 transform_3_px = 				texture( u_transform_3, sim_uv );
	vec4 transform_4_px = 				texture( u_transform_4, sim_uv );
	vec4 life_px = 						texture( u_life, sim_uv );
	vec4 meta_px = 						texture( u_meta, sim_uv );
	vec4 misc_px = 						texture( u_misc, sim_uv );

	transport_geo_in_p_transform_1 = 	transform_1_px;
	transport_geo_in_p_transform_2 = 	transform_2_px;
	transport_geo_in_p_transform_3 = 	transform_3_px;
	transport_geo_in_p_transform_4 = 	transform_4_px;
	transport_geo_in_p_life = 			life_px;
	transport_geo_in_p_meta = 			meta_px;
	transport_geo_in_p_misc = 			misc_px;

	vec4 p_transform_1 =				transport_geo_in_p_transform_1;
	vec4 p_transform_2 =				transport_geo_in_p_transform_2;
	vec4 p_transform_3 =				transport_geo_in_p_transform_3;
	vec4 p_transform_4 =				transport_geo_in_p_transform_4;
	vec4 p_life =						transport_geo_in_p_life;
	vec4 p_meta =						transport_geo_in_p_meta;
	vec4 p_misc =						transport_geo_in_p_misc;

	float p_renderable = 				p_meta.x;


	// - - - HIDE all particles as default, let geo shader position each

	gl_Position = TDWorldToProj( vec4( 0.0, 0.0, 1000.0, 1.0 ) );


}