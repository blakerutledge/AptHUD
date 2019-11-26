// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  SETUP

#include "/app/glsl/defines"
#include "/app/glsl/helpers"
#include "/app/glsl/helpers_frag"

uniform vec4 u_config_1;
uniform vec4 u_config_2;
uniform vec4 u_config_3;
uniform vec4 u_config_4;

uniform vec4 u_config_alt;

const float ROT_SCALE_STEP = 1.0 / 12.0;
const float POS_OFFSET_STEP = 6.0 / 60.0;
const float SHIMMER_BIRTH = 1000.0;
const float SHIMMER_LIFE_MIN = 0.25;
const float SHIMMER_LIFE_MAX = 3.0;


// shimmer birthrate
layout( binding = 0, offset = 0 ) uniform atomic_uint ac_shimmer;


layout( location = 0 ) out vec4 frag_transform_1;
layout( location = 1 ) out vec4 frag_transform_2;
layout( location = 2 ) out vec4 frag_transform_3;
layout( location = 3 ) out vec4 frag_transform_4;
layout( location = 4 ) out vec4 frag_life;
layout( location = 5 ) out vec4 frag_meta;
layout( location = 6 ) out vec4 frag_misc;
layout( location = 7 ) out vec4 frag_debug;



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - TEXTURE SCHEMA

/*
	
	frag_transform_1.r  	>>  particle world position x
	frag_transform_1.g  	>>  particle world position y
	frag_transform_1.b  	>>  p_group
	frag_transform_1.a  	>>  
	
	frag_transform_2.r  	>>  normalized rotation
	frag_transform_2.g  	>>  normalized scale
	frag_transform_2.b  	>>  prev rotation, snapped to quadrant
	frag_transform_2.a  	>>  rotation tween

	frag_transform_3.r  	>>  color, red
	frag_transform_3.g  	>>  color, green
	frag_transform_3.b  	>>  color, blue
	frag_transform_3.a  	>>  color, alpha

	frag_transform_4.r 		>> offset x
	frag_transform_4.g 		>> offset y
	frag_transform_4.b 		>> pulse offset
	frag_transform_4.a		>> pulse ratio (scale?)

	frag_life.r 			>> life progress
	frag_life.g 			>> life attenuation factor
	frag_life.b 			>> x target position
	frag_life.a 			>> y target position

	frag_meta.r 			>>  render particle					: 0 or 1
	frag_meta.g 			>>  particle type					: 0, 1, 2, 3, 4
	frag_meta.b 			>>  particle grid unit scale		: 1 - 10
	frag_meta.a 			>>  ...





	p_type key: 
		0 -> CIRC
		1 -> RECT
		2 -> DIAG
		3 -> SHIMMER
		4 -> RECT_LARGE
		5 -> DIAG_LARGE

	p_is_norm
		particle is CIRC, RECT, or DIAG
	
	p_is_alt
		particle is CIRC_LARGE or DIAG_LARGE



*/







// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  MAIN

void main()
{


	// - - - UNPACK UNIFORMS

	vec2  u_sim_res = 			uTDOutputInfo.res.zw;
	vec2  u_grid_count = 		u_config_1.xy;
	vec2  u_grid_crop =			u_config_3.zw;
	vec2  u_grid_scale = 		u_config_1.zw;
	vec2  u_canvas_res = 		u_config_2.zw;
	float u_max_particles = 	u_config_2.x;
	float u_frametime = 		u_config_2.y;
	float u_time = 				u_config_3.x;
	float u_zoom = 				u_config_3.y;
	float u_zoom_a = 			u_config_4.x;
	float u_zoom_b = 			u_config_4.y;
	float u_zoom_c = 			u_config_4.z;

	float u_ratio = 			u_grid_count.y / u_grid_count.x;
	float u_px_w_tx = 			6.0 / u_canvas_res.x;
	float u_group_count =		u_grid_count.x * u_grid_count.y;
	float u_group_count_alt =	ceil( u_grid_count.x * u_grid_count.y * 0.5 );
	float u_num_groups = 		4.0;
	float u_num_groups_alt = 	2.0;
	float u_group_total = 		u_num_groups * u_group_count;
	float u_group_total_alt = 	u_num_groups_alt * u_group_count_alt;
	float u_module_w =			( u_grid_scale.x / u_grid_count.x ) * mix( 1.0, MAX_ZOOM, u_zoom ) + 2.0 * u_px_w_tx;

	float u_debug_value = 		u_config_alt.x;



	// - - - UV SPACES & PARTICLE INSTANCE

	vec2  uv = 					vUV.st;

	vec2 spx = vec2(
		( floor( uv.x * u_sim_res.x ) ),
		( floor( uv.y * u_sim_res.y ) )
	);

	float p_index_global = 		spx.y * u_sim_res.x + spx.x;

	float p_is_norm = step( p_index_global, u_group_total - P_NORM );
	float p_is_alt = 1.0 - p_is_norm;

	float p_type =
		floor( p_index_global / u_group_count ) * p_is_norm + 
		( u_num_groups + floor( ( p_index_global - u_group_total ) / u_group_count_alt ) ) * p_is_alt;

	int p_type_i = int( p_type );

	float p_index = 
		( p_index_global - u_group_count * p_type ) * p_is_norm + 
		( p_index_global - u_group_total - ( ( p_type - u_num_groups ) * u_group_count_alt ) ) * p_is_alt;

	float p_valid = step( p_index_global, u_group_total + u_group_total_alt - 1.0 );

	vec2 p_grid_rowcol = 
		p_is_norm * vec2( mod( p_index, u_grid_count.x ), floor( p_index / u_grid_count.x ) ) +
		p_is_alt  * vec2( 2.0 * mod( p_index, u_grid_count.x ), 2.0 * floor( p_index / u_grid_count.x ) );

	vec2 p_pos = vec2(
		( 0.5 * u_grid_scale.x ) * ( p_grid_rowcol.x / ( u_grid_count.x - 1.0 ) * 2.0 - 1.0 ),
		( 0.5 * u_grid_scale.y ) * ( p_grid_rowcol.y / ( u_grid_count.y - 1.0 ) * 2.0 - 1.0 )
	);

	vec2 guv = vec2(
		remap( 
			p_grid_rowcol.x, 
			floor( u_grid_count.x * 0.5 ) - floor( u_grid_crop.x * 0.5 ),
			floor( u_grid_count.x * 0.5 ) + floor( u_grid_crop.x * 0.5 ),
			0.0 + 0.5 / u_grid_crop.x,
			1.0 - 0.5 / u_grid_crop.x
		),
		remap( 
			p_grid_rowcol.y, 
			floor( u_grid_count.y * 0.5 ) - floor( u_grid_crop.y * 0.5 ),
			floor( u_grid_count.y * 0.5 ) + floor( u_grid_crop.y * 0.5 ),
			0.0 + 0.5 / u_grid_crop.y,
			1.0 - 0.5 / u_grid_crop.y
		)
	);



	// - - - GLOBAL ZOOM
	
	p_pos *= mix( 1.0, MAX_ZOOM, u_zoom );
	
	vec2 cuv = vec2(
		clamp( remap( p_pos.x, -3.0, 3.0, 0.0, 1.0 ), 0.0, 1.0 ),
		clamp( remap( p_pos.y, -3.0*u_canvas_res.y/u_canvas_res.x, 3.0*u_canvas_res.y/u_canvas_res.x, 0.0, 1.0 ), 0.0, 1.0 )
	);




	// - - - GROUP ZOOMS

	float p_group = 
		0.0 * step( p_pos.x, -1.0 + P_NORM ) +
		1.0 * step( -1.0 + P_NORM, p_pos.x ) * step( p_pos.x,  1.0 - P_NORM ) +
		2.0 * step(  1.0 - P_NORM, p_pos.x );
	p_group = clamp( p_group, 0.0, 2.0 );

	int p_group_i = int( p_group );


	vec2 group_center = vec2( -2.0 + p_group * 2.0, 0.0 );

	float group_zoom = 
		eq( p_group_i, 0 ) * u_zoom_a +
		eq( p_group_i, 1 ) * u_zoom_b +
		eq( p_group_i, 2 ) * u_zoom_c;
	group_zoom = mix( 1.0, MAX_GROUP_ZOOM, group_zoom );
	p_pos = mix(
		( p_pos - group_center ) * group_zoom + group_center,
		p_pos,
		eq( p_type_i, 3 )
	);

	vec2 cuv_group = vec2(
		clamp( remap( p_pos.x, -3.0, 3.0, 0.0, 1.0 ), 0.0, 1.0 ),
		clamp( remap( p_pos.y, -3.0*u_canvas_res.y/u_canvas_res.x, 3.0*u_canvas_res.y/u_canvas_res.x, 0.0, 1.0 ), 0.0, 1.0 )
	);

	vec2 p_group_horz_bounds = vec2(
		eq( p_group_i, 0 ) * vec2( -999999.0, GROUP_EDGES[ 0 ].x + 1.5 * group_zoom * u_module_w ) + 
		eq( p_group_i, 1 ) * vec2( GROUP_EDGES[ 0 ].x - 1.5 * group_zoom * u_module_w,  GROUP_EDGES[ 1 ].x + 1.5 * group_zoom * u_module_w ) + 
		eq( p_group_i, 2 ) * vec2( GROUP_EDGES[ 1 ].x - 1.5 * group_zoom * u_module_w, 999999.0 )
	);
	


	// - - - BOUNDS

	float p_in_group_bounds = 
		step( p_group_horz_bounds.r, p_pos.x ) * 
		step( p_pos.x, p_group_horz_bounds.g );

	float p_in_global_bounds = 
		step( floor( u_grid_count.x * 0.5 ) - floor( u_grid_crop.x * 0.5 ), p_grid_rowcol.x  ) *
		step( p_grid_rowcol.x, floor( u_grid_count.x * 0.5 ) + floor( u_grid_crop.x * 0.5 )  ) *
		step( floor( u_grid_count.y * 0.5 ) - floor( u_grid_crop.y * 0.5 ), p_grid_rowcol.y  ) *
		step( p_grid_rowcol.y, floor( u_grid_count.y * 0.5 ) + floor( u_grid_crop.y * 0.5 )  );

	float p_renderable = p_valid * p_in_global_bounds * p_in_group_bounds;



	// - - - SAMPLE FEEDBACK TEXTURES

	vec4 transform_1_prev = 	texture( sTD2DInputs[ 0 ], uv );
	vec4 transform_2_prev =		texture( sTD2DInputs[ 1 ], uv );
	vec4 transform_3_prev =		texture( sTD2DInputs[ 2 ], uv );
	vec4 transform_4_prev =		texture( sTD2DInputs[ 3 ], uv );
	vec4 life_prev = 			texture( sTD2DInputs[ 4 ], uv );
	vec4 meta_prev = 			texture( sTD2DInputs[ 5 ], uv );
	vec4 misc_prev = 			texture( sTD2DInputs[ 6 ], uv );
	vec4 debug_prev = 			texture( sTD2DInputs[ 7 ], uv );



	// - - - SAMPLE control layers

	vec4 touches_in = 			texture( sTD2DInputs[ 8  ], guv );
	vec4 chaos_in =				texture( sTD2DInputs[ 9  ], guv );
	vec4 noise_in =				texture( sTD2DInputs[ 10  ], guv );

	vec4 t_base_dot_in = 		texture( sTD2DInputs[ 11  ], guv );
	vec4 t_base_rect_in = 		texture( sTD2DInputs[ 12  ], guv );
	vec4 t_base_diag_in = 		texture( sTD2DInputs[ 13 ], guv );
	vec4 t_large_rectdiag_in =	texture( sTD2DInputs[ 14 ], guv );
	vec4 t_misc_in = 			texture( sTD2DInputs[ 15 ], guv );
	vec4 t_base_color_in = 		texture( sTD2DInputs[ 16 ], guv );
	vec4 t_large_color_in =		texture( sTD2DInputs[ 17 ], guv );
	vec4 t_misc_2_in =			texture( sTD2DInputs[ 18 ], guv );



	// - - - INIT output variables

	vec4 transform_1_new = 		vec4( 0.0 );
	vec4 transform_2_new = 		vec4( 0.0 );
	vec4 transform_3_new = 		vec4( 0.0 );
	vec4 transform_4_new = 		vec4( 0.0 );
	vec4 life_new = 			vec4( 0.0 );
	vec4 meta_new = 			vec4( 0.0 );
	vec4 misc_new = 			vec4( 0.0 );
	vec4 debug_new = 			vec4( 0.0 );



	// - - - SNAPPING ROTATION, TWEEN SCALE ON ROTATION QUADRANT CHANGE

	float p_rot = 				clamp( transform_2_prev.r, 0.0, 1.0 - P_NORM );
	float p_rot_snap = 			floor( 4.0 * p_rot ) / 4.0;
	float p_rot_snap_prev = 	transform_2_prev.b;
	float p_scale_tween = 		transform_2_prev.a;

	// TEST if rotation has changed quadrants
	float p_rot_diff = 1.0 - eq( int( p_rot_snap * 4.0 ), int( p_rot_snap_prev * 4.0 ) );

	// IF DIFF, increment scale tween towards 0
	p_scale_tween = 
		( p_scale_tween ) * ( 1.0 - p_rot_diff ) +
		( p_scale_tween - ROT_SCALE_STEP ) * ( p_rot_diff );

	// IF scale tween hits 0 (or particle out of bounds) ...
	float p_rot_changeover = max(
		step( p_scale_tween, P_NORM ),
		1.0 - meta_prev.r
	);

	// ... THEN change over the cached rotation value
	p_rot_snap_prev = 
		( p_rot_changeover ) 		* p_rot_snap + 
		( 1.0 - p_rot_changeover ) 	* p_rot_snap_prev;

	// IF scale tween is < 1, and rotations match, increment scale tween towards 1
	p_scale_tween +=
		step( p_scale_tween, 1.0 - P_NORM ) * 
		( 1.0 - p_rot_diff ) * 
		ROT_SCALE_STEP;

	// RESET scale tween if particle is out of bounds
	p_scale_tween = max( p_scale_tween, 1.0 - meta_prev.r );
	p_scale_tween = clamp( p_scale_tween, 0.0, 1.0 );




	// - - - APPLY ANIMATIONS FROM CONTROL TEXTURES

	// SCALE
	float scale_f = 
		eq( p_type_i, 0 ) * t_base_dot_in.g +
		eq( p_type_i, 1 ) * t_base_rect_in.g +
		eq( p_type_i, 2 ) * t_base_diag_in.g +
		eq( p_type_i, 3 ) * 1.0 +
		eq( p_type_i, 4 ) * t_large_rectdiag_in.g +
		eq( p_type_i, 5 ) * t_large_rectdiag_in.a;
	scale_f *= p_scale_tween;



	// ROTATION
	float rot_f = 
		eq( p_type_i, 0 ) * t_base_dot_in.r +
		eq( p_type_i, 1 ) * t_base_rect_in.r +
		eq( p_type_i, 2 ) * t_base_diag_in.r +
		eq( p_type_i, 3 ) * 0.0 +
		eq( p_type_i, 4 ) * t_large_rectdiag_in.r +
		eq( p_type_i, 5 ) * t_large_rectdiag_in.b;


	// OFFSET POSITION with temporal smoothing
	float offset_amount = 0.2;
	vec2 p_offset = 
		eq( p_type_i, 0 ) * u_module_w * t_base_dot_in.ba +
		eq( p_type_i, 1 ) * u_module_w * t_base_rect_in.ba +
		eq( p_type_i, 2 ) * u_module_w * t_base_diag_in.ba + 
		eq( p_type_i, 3 ) * 0.0;

	vec2 p_offset_prev = transform_4_prev.rg;
	p_offset = mix( p_offset_prev, p_offset, POS_OFFSET_STEP );


	// COLOR
	vec4 p_color = 
		p_is_norm * t_base_color_in +
		p_is_alt * t_large_color_in;



	// - - -  PULSE 

	float p_pulse_offset = t_misc_in.r * ( 1.0 - eq( p_type_i, 3 ) );




	// - - - LARGE gridscale

	float p_grid_scale = 
		1.0 * p_is_norm + 
		2.0 * p_is_alt;



	// - - - SHIMMER

	float p_life 			= 0.0;
	float p_life_length 	= 0.0;
	vec2  p_target 			= vec2( 0.0 );

	uint shimmer_born_count = 0;
	
	float p_shimmer_spawn = t_misc_in.g;
	vec2 p_shimmer_target = t_misc_in.ba;
	float p_shimmer_grid_scale = t_misc_2_in.r;

	float max_color = max( max( p_color.r, p_color.g ), p_color.b );
	p_shimmer_spawn *= max_color;




	if ( eq( p_type_i, 3 ) > 0.0 ) {



		// DIE
		if ( life_prev.r >= 1.0 ) {

			p_valid = 0.0;
			p_renderable = 0.0;

		}

		// STEP
		else if ( life_prev.r > 0.0 && meta_prev.r > 0.0 ) {

			// LIFE step
			p_life = life_prev.r;
			p_life_length = life_prev.g;
			p_target = life_prev.ba;
			p_life = p_life + ( u_frametime * 0.001 ) / p_life_length;
			float p_life_ease = cubicOut( p_life );

			// PERSIST transforms & colors
			p_pos = ( p_pos - group_center ) * group_zoom + group_center;

			rot_f = transform_2_prev.r;
			p_rot_snap_prev = transform_2_prev.b;
			p_scale_tween = transform_2_prev.a;
			p_color.r = transform_3_prev.r;
			p_color.g = transform_3_prev.g;
			p_color.b = transform_3_prev.b;
			p_grid_scale = meta_prev.b;
			p_color.a = 1.0;
			// ALPHA step
			// p_color.a = 
			// 	smoothstep( 0.0, 0.1, p_life_ease ) *
			// 	( 1.0 - smoothstep( 0.5, 1.0, p_life_ease ) );

			// POSITION step
			p_offset = mix( vec2( 0.0 ), p_target, p_life_ease );

			// SCALE step
			scale_f = p_grid_scale - p_grid_scale * p_life_ease * p_life_ease;

			p_renderable = 1.0;
			p_valid = 1.0;

		}

		// SPAWN
		else if ( life_prev.r == 0.0 && p_shimmer_spawn > 0.0 ) {
			
			shimmer_born_count = atomicCounter( ac_shimmer );

			if ( shimmer_born_count < SHIMMER_BIRTH ) {

				atomicCounterIncrement( ac_shimmer );

				// Position
				p_target = u_module_w * 10.0 * p_shimmer_target;

				// Rotation
				rot_f = get_normalized_angle_from_center( vec2( -p_shimmer_target.x, -p_shimmer_target.y ) );

				// Scale
				scale_f = 0.0;
				p_grid_scale = p_shimmer_grid_scale;

				// Offset (Translation of particle)
				p_offset = vec2( 0.0 );

				// Life attenuation factor
				p_life_length = clamp( remap( get_random( u_time * uv.x * uv.y ), 0.0, 1.0, SHIMMER_LIFE_MIN, SHIMMER_LIFE_MAX ), SHIMMER_LIFE_MIN, SHIMMER_LIFE_MAX );

				// Life
				p_life = P_NORM + ( u_frametime * 0.001 ) / p_life_length;

				p_color.a = 0.0;

				p_renderable = 1.0;
				p_valid = 1.0;

			}
			else {

				// EHH ACTUALLY STAY DORMANT
				p_valid = 0.0;
				p_renderable = 0.0;

			}

		}

		else {

			// DORMANT
			p_renderable = 0.0;
			p_valid = 0.0;

		}

	}







	// - - - DEV ONLY: Mask per particle type

	// p_renderable *= 
		// eq( p_group_i, 0 );
		// eq( p_type_i, 3 );
		// max( eq( p_type_i, 0 ), eq( p_type_i, 2 ) );
		// step( p_type - P_NORM, 4.0 );



	// - - - PACK data into textures

	transform_1_new.rg = p_pos;
	transform_1_new.ba = vec2( p_group, 0.0 );

	transform_2_new.r = rot_f;
	transform_2_new.g = scale_f;
	transform_2_new.b = p_rot_snap_prev;
	transform_2_new.a = p_scale_tween;

	transform_3_new.r = p_color.r;
	transform_3_new.g = p_color.g;
	transform_3_new.b = p_color.b;
	transform_3_new.a = p_color.a;

	transform_4_new.r = p_offset.r;
	transform_4_new.g = p_offset.g;
	transform_4_new.b = p_pulse_offset;
	transform_4_new.a = 0.0;

	life_new.r = p_life;
	life_new.g = p_life_length;
	life_new.b = p_target.x;
	life_new.a = p_target.y;

	misc_new.r = 0.0;
	misc_new.g = 0.0;
	misc_new.b = 0.0;
	misc_new.a = 0.0;

	meta_new.r = p_renderable;
	meta_new.g = p_type;
	meta_new.b = p_grid_scale;

	debug_new.r = eq( p_type_i, 3 );
	debug_new.g = p_life;
	// debug_new.g = p_index_global;
	// debug_new.b = u_group_total_alt;
	// debug_new.a = u_group_total_alt;




	// - - - CLAMP to valid particles in simulation



	transform_1_new *= 			p_valid;
	transform_2_new *= 			p_valid;
	transform_3_new *=			p_valid;
	transform_4_new *=			p_valid;
	life_new *= 				p_valid;
	misc_new *= 				p_valid;
	meta_new *= 				p_valid;
	debug_new *= 				p_valid;



	// - - - OUTPUT

	frag_transform_1 =			TDOutputSwizzle( transform_1_new );
	frag_transform_2 =			TDOutputSwizzle( transform_2_new );
	frag_transform_3 =			TDOutputSwizzle( transform_3_new );
	frag_transform_4 =			TDOutputSwizzle( transform_4_new );
	frag_life = 				TDOutputSwizzle( life_new );
	frag_meta = 				TDOutputSwizzle( meta_new );
	frag_misc = 				TDOutputSwizzle( misc_new );
	frag_debug = 				TDOutputSwizzle( debug_new );


}