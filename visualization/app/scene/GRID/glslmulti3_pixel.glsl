// precision highp float;


#include "/app/glsl/defines"
#include "/app/glsl/helpers"
#include "/app/glsl/helpers_frag"

#include "/app/scene/GRID/draw_attract"
#include "/app/scene/GRID/draw_landscape"
#include "/app/scene/GRID/draw_issues"
#include "/app/scene/GRID/draw_solutions"
#include "/app/scene/GRID/draw_platform"
#include "/app/scene/GRID/draw_case"
#include "/app/scene/GRID/draw_conclusion"



const int NUM_SCENES = 7;
const int NUM_SUBSCENES = 35;

uniform float u_scene_tweens[ NUM_SCENES ];
uniform float u_subscene_tweens[ NUM_SUBSCENES ];

uniform vec4 u_config;
uniform vec4 u_config_2;
uniform vec4 u_config_3;
uniform vec4 u_patches;
uniform vec4 u_case_splash;
uniform vec4 u_conclusion_sub;


layout( location=0 ) out vec4 frag_0;
layout( location=1 ) out vec4 frag_1;
layout( location=2 ) out vec4 frag_2;
layout( location=3 ) out vec4 frag_3;
layout( location=4 ) out vec4 frag_4;
layout( location=5 ) out vec4 frag_5;
layout( location=6 ) out vec4 frag_6;
layout( location=7 ) out vec4 frag_7;


/*

	CIRC
	RECT
	DIAG
		r: rotation
		g: scale
		b: offset x
		a: offset y

	RECTDIAG_L
		r: rect rotation
		g: rect scale
		b: rect rotation
		a: rect scale

	MISC 
		r: pulse offset
		g: 
		b: 
		a: 

	COLOR_BASE
	COLOR_LARGE
		r: red
		g: green
		b: blue
		a: alpha lol


*/




void main() {


	// - - - UNPACK uniforms

	vec2 u_res = 							uTDOutputInfo.res.zw;
	float u_ratio = 						u_res.y / u_res.x;
	vec2 u_px = 							vec2( 1.0 / u_res.x, 1.0 / u_res.y );
	float u_time = 							u_config.x;
	float u_scene_index = 					u_config.y;
	float u_scene_index_tween = 			u_config.z;
	float u_grid_scale = 					u_config.w;
	float u_grid_snap = 					u_config_2.z;

	float u_sst_case_intro_special = 		u_config_3.y;

	float u_sst_issues_index_tween = 		u_config_2.x;
	float u_sst_landscape_index_tween = 	u_config_2.y;



	// - - - UNPACK SCENE TWEENS

	float u_st_attract = 					u_scene_tweens[ 0 ];
	float u_st_landscape = 					u_scene_tweens[ 1 ];
	float u_st_issues = 					u_scene_tweens[ 2 ];
	float u_st_solutions = 					u_scene_tweens[ 3 ];
	float u_st_platform = 					u_scene_tweens[ 4 ];
	float u_st_case = 						u_scene_tweens[ 5 ];
	float u_st_conclusion =					u_scene_tweens[ 6 ];


	// - - - UNPACK SUBSCENE TWEENS

	float u_sst_attract_default = 			u_subscene_tweens[  0 ];
	float u_sst_attract_select = 			u_subscene_tweens[  1 ];
 
	float u_sst_landscape_headline = 		u_subscene_tweens[  2 ];
	float u_sst_landscape_reveal_1 = 		u_subscene_tweens[  3 ];
	float u_sst_landscape_reveal_2 = 		u_subscene_tweens[  4 ];
	float u_sst_landscape_reveal_3 = 		u_subscene_tweens[  5 ];
 
	float u_sst_issues_headline = 			u_subscene_tweens[  6 ];
	float u_sst_issues_pre_reveal = 		u_subscene_tweens[  7 ];
	float u_sst_issues_reveal_1 = 			u_subscene_tweens[  8 ];
	float u_sst_issues_reveal_2 = 			u_subscene_tweens[  9 ];
	float u_sst_issues_reveal_3 = 			u_subscene_tweens[ 10 ];
	float u_sst_issues_reveal_4 = 			u_subscene_tweens[ 11 ];
	float u_sst_issues_reveal_5 = 			u_subscene_tweens[ 12 ];
	float u_sst_issues_reveal_6 = 			u_subscene_tweens[ 13 ];
	float u_sst_issues_reveal_1_alt =		u_subscene_tweens[ 29 ];
	float u_sst_issues_reveal_2_alt =		u_subscene_tweens[ 30 ];
	float u_sst_issues_reveal_3_alt =		u_subscene_tweens[ 31 ];
	float u_sst_issues_reveal_4_alt =		u_subscene_tweens[ 32 ];
	float u_sst_issues_reveal_5_alt =		u_subscene_tweens[ 33 ];
	float u_sst_issues_reveal_6_alt =		u_subscene_tweens[ 34 ];

	float u_sst_solutions_headline = 		u_subscene_tweens[ 14 ];
	float u_sst_solutions_empty = 			u_subscene_tweens[ 15 ];
	float u_sst_solutions_reveal_1 = 		u_subscene_tweens[ 16 ];

	float u_sst_platform_headline = 		u_subscene_tweens[ 17 ];
	float u_sst_platform_3up = 				u_subscene_tweens[ 18 ];
	float u_sst_platform_pillar_1 = 		u_subscene_tweens[ 19 ];
	float u_sst_platform_pillar_2 = 		u_subscene_tweens[ 20 ];
	float u_sst_platform_pillar_3 = 		u_subscene_tweens[ 21 ];

	float u_sst_case_intro = 				u_subscene_tweens[ 22 ];
	float u_sst_case_headline = 			u_subscene_tweens[ 23 ];
	float u_sst_case_challenges = 			u_subscene_tweens[ 24 ];
	float u_sst_case_solutions = 			u_subscene_tweens[ 25 ];
	float u_sst_case_outcomes = 			u_subscene_tweens[ 26 ];

	float u_sst_conclusion_initial = 		u_subscene_tweens[ 27 ];
	float u_sst_conclusion_resolve = 		u_subscene_tweens[ 28 ];


	// - - - SUBSCENE MISC
	float u_platform_ss_index = 			u_config_2.w;
	float u_platform_ss_color_blend = 		u_config_3.x;
	vec3 u_case_outcome_splashes = 			u_case_splash.xyz;
	vec4 u_conc_custom = 					u_conclusion_sub;


	// - - - UNPACK SCENE TRANSITION PATCHES

	float u_sp_solutions_platform = 		u_patches.x;
	float u_sp_landscape_issues = 			u_patches.y;
	float u_sp_case_conclusion = 			u_patches.z;



	// - - - UV SPACES

	vec2 uv = 			vUV.st;
	vec2 px = 			vec2( floor( uv.x * u_res.x ), floor( uv.y * u_res.y ) );
	vec2 buv = 			uv * 2.0 - 1.0;
	vec2 acuv = 		vec2( uv.x, uv.y * u_res.y / u_res.x );
	vec2 bacuv = 		vec2( buv.x, buv.y * u_res.y / u_res.x );
	vec2 wuv =			vec2( bacuv.x * u_grid_scale * 0.5, bacuv.y * u_grid_scale * 0.5 );



	// - - - SECTION & SUBSECTION QUADRANT things

	float num_screens = 6.0;
	float num_sections = 3.0;
	float screen = clamp( floor( wuv.x ) + 0.5 * num_screens, 0.0, num_screens - 1.0 );
	float group = clamp( floor( clamp( 0.5 * wuv.x + 0.5 * num_sections, 0.0, num_sections ) ), 0.0, num_sections - 1.0 );
	int gi = int( group );
	int si = int( screen );
	vec2 guv = vec2( 0.5 * wuv.x + 0.5 * num_sections - group, uv.y );
	vec2 suv = vec2( wuv.x + 0.5 * num_screens - screen, uv.y );



	// - - - INIT pixel variables

	vec4 px_base_dot = 			vec4( 0.0 );
	vec4 px_base_rect = 		vec4( 0.0 );
	vec4 px_base_diag = 		vec4( 0.0 );
	vec4 px_large_rectdiag = 	vec4( 0.0 );
	vec4 px_misc = 				vec4( 0.0 );
	vec4 px_base_color = 		vec4( 0.0 );
	vec4 px_large_color = 		vec4( 0.0 );
	vec4 px_debug = 			vec4( 0.0 );



	// - - - SAMPLERS

	vec4 noise_in = 			clamp( texture( sTD2DInputs[ 0 ], uv ), -1.0, 1.0 );
	vec4 flow_in = 				clamp( texture( sTD2DInputs[ 1 ], uv ), -1.0, 1.0 );
	vec4 touches_in = 			clamp( texture( sTD2DInputs[ 2 ], uv ), -1.0, 1.0 );
	vec4 touches_flow_in = 		clamp( texture( sTD2DInputs[ 3 ], uv ), -1.0, 1.0 );
	vec4 touches_color_in = 	clamp( texture( sTD2DInputs[ 4 ], uv ), -1.0, 1.0 );
	vec4 case_color_in = 		clamp( texture( sTD2DInputs[ 5 ], guv ), -1.0, 1.0 );


	// - - - COMMON SHAPE BUILDING FLAGS

	// General

	float module_tx = u_grid_scale / u_res.x;
	vec2 g_origin = GROUP_CENTERS[ gi ];
	vec2 gwuv = vec2( wuv.x - g_origin.x, wuv.y - g_origin.y );


	// Rectalinear bounds and borders

	float is_left = step( wuv.x + 0.5 * module_tx, g_origin.x );
	float is_right = 1.0 - is_left;
	float is_bottom = step( wuv.y + 0.5 * module_tx, g_origin.y );
	float is_top = 1.0 - is_bottom;

	float is_border_l = 
		is_left * 			
		step( abs( g_origin.x - ( wuv.x + 0.5 * module_tx ) ), module_tx + P_NORM );

	float is_border_r = 
		is_right * 
		step( abs( g_origin.x - ( wuv.x + 0.5 * module_tx ) ), module_tx - P_NORM );

	float is_border_b = 
		step( guv.y + P_NORM, 0.5 ) * 			
		step( abs( g_origin.y - ( wuv.y + 0.5 * module_tx ) ), module_tx + P_NORM );

	float is_border_t = 
		( 1.0 - step( guv.y + P_NORM, 0.5 ) ) * 
		step( abs( g_origin.y - ( wuv.y + 0.5 * module_tx ) ), module_tx - P_NORM );

	float is_border_tb = max( is_border_t, is_border_b );
	float is_border_lr = max( is_border_r, is_border_l );

	float is_border = max( is_border_tb, is_border_lr );

	float is_group_border_a_l = 
		eq( gi, 0 ) * step( 1.0 - module_tx + P_NORM, gwuv.x );

	float is_group_border_a_r = 
		eq( gi, 1 ) * step( gwuv.x, -1.0 + module_tx + P_NORM );

	float is_group_border_b_l = 
		eq( gi, 1 ) * step( 1.0 - module_tx + P_NORM, gwuv.x );

	float is_group_border_b_r = 
		eq( gi, 2 ) * step( gwuv.x, -1.0 + module_tx + P_NORM );



	// Diamond bounds & borders

	float is_tri_top = 
		is_right * step( abs( gwuv.x ), gwuv.y - 0.5 * module_tx ) + 
		is_left * step( abs( gwuv.x ), gwuv.y - 0.5 * module_tx );

	float is_tri_bot = 
		is_right * step( abs( gwuv.x ), -gwuv.y - 0.5 * module_tx ) + 
		is_left * step( abs( gwuv.x ), -gwuv.y - 0.5 * module_tx );

	float is_tri_left = 
		is_left * ( 1.0 - max( is_tri_top, is_tri_bot ) );

	float is_tri_right = 
		is_right * ( 1.0 - max( is_tri_top, is_tri_bot ) );

	float is_tri_border_tl = 
		( 1.0 - is_tri_top ) * 
		is_left * step( abs( gwuv.x ), gwuv.y + 0.5 * module_tx );

	float is_tri_border_tr = 
		( 1.0 - is_tri_top ) * 
		is_right * step( abs( gwuv.x ), gwuv.y + 0.5 * module_tx );

	float is_tri_border_bl = 
		( 1.0 - is_tri_bot ) * 
		is_left * step( abs( gwuv.x ), -gwuv.y + 0.5 * module_tx );

	float is_tri_border_br = 
		( 1.0 - is_tri_bot ) * 
		is_right * step( abs( gwuv.x ), -gwuv.y + 0.5 * module_tx );



	// - - - CROSS-SCENE PATCHES

	float is_pre_platform = max( 
		max( u_st_attract, u_st_landscape ),
		max( u_st_issues, u_st_solutions )
	);

	float is_dots_patch = max( 
		max( u_st_attract, u_st_issues ),
		max( u_st_solutions, u_st_platform )
	);
	is_dots_patch = max( is_dots_patch, u_st_conclusion );
	is_dots_patch = max( is_dots_patch, u_st_landscape );


	float is_noise = max( step( P_NORM, u_sp_landscape_issues ), max( u_st_landscape, u_st_issues ) );
	// is_noise = step( P_NORM, is_noise );

	// // float is_sol_plat = max( u_st_solutions, u_st_platform );



	vec4 hue = get_hue_wuv( wuv, 0.0 );
	vec4 white = vec4( vec3( 1.0 ), 0.5 );

	// // DOTS
	float offset_amount = 1.0;
	vec2 p_offset = vec2( 
		offset_amount * remap( abs( noise_in.r ), 0.0, 1.0, -1.0, 1.0 ) * 1.0, 
		offset_amount * u_ratio * noise_in.g * 0.0
	);


	px_base_dot.g = step( P_NORM, is_dots_patch );

	px_base_dot.b = p_offset.x * is_noise;
	px_base_dot.a = p_offset.y * is_noise;
	px_base_rect.b = p_offset.x * is_noise;
	px_base_rect.a = p_offset.y * is_noise;
	px_base_diag.b = p_offset.x * is_noise;
	px_base_diag.a = p_offset.y * is_noise;



	// float is_issues_solutions_patch = 
	// 	step( P_NORM, max( u_st_issues, u_st_solutions ) );
	// px_base_diag.rg = mix( px_base_diag.rg, vec2( ( 1.0 - abs( noise_in.r ) ), noise_in.b ), is_issues_solutions_patch );




	px_base_color = mix( hue, white, step( P_NORM, is_pre_platform ) );

	// px_debug.b = is_noise;


	// - - - COMPOSITE

	draw_attract( 
		px_base_dot, px_base_rect, px_base_diag, px_large_rectdiag, px_misc, px_base_color, px_large_color, px_debug,
		noise_in, flow_in, touches_in, touches_flow_in, touches_color_in,
		u_res, u_time, uv, px, wuv, screen, group, si, gi, guv, u_grid_scale, u_ratio, module_tx, g_origin, gwuv,
		is_left, is_right, is_bottom, is_top, is_border_l, is_border_r, is_border_b, is_border_t, is_border_tb, is_border_lr, is_border, is_group_border_a_l, is_group_border_a_r, is_group_border_b_l, is_group_border_b_r, is_tri_top, is_tri_bot, is_tri_left, is_tri_right, is_tri_border_tl, is_tri_border_tr, is_tri_border_bl, is_tri_border_br, 
		u_st_attract, u_sst_attract_default, u_sst_attract_select,
		u_st_conclusion
	);


	draw_landscape(
		px_base_dot, px_base_rect, px_base_diag, px_large_rectdiag, px_misc, px_base_color, px_large_color, px_debug,
		noise_in, flow_in, touches_in, touches_flow_in, touches_color_in,
		u_res, u_time, uv, px, wuv, screen, group, si, gi, guv, u_grid_scale, u_ratio, module_tx, g_origin, gwuv,
		is_left, is_right, is_bottom, is_top, is_border_l, is_border_r, is_border_b, is_border_t, is_border_tb, is_border_lr, is_border, is_group_border_a_l, is_group_border_a_r, is_group_border_b_l, is_group_border_b_r, is_tri_top, is_tri_bot, is_tri_left, is_tri_right, is_tri_border_tl, is_tri_border_tr, is_tri_border_bl, is_tri_border_br, 
		u_st_landscape, u_sst_landscape_headline, u_sst_landscape_reveal_1, u_sst_landscape_reveal_2, u_sst_landscape_reveal_3,
		u_sst_landscape_index_tween
	);


	draw_issues(
		px_base_dot, px_base_rect, px_base_diag, px_large_rectdiag, px_misc, px_base_color, px_large_color, px_debug,
		noise_in, flow_in, touches_in, touches_flow_in, touches_color_in,
		u_res, u_time, uv, px, wuv, screen, group, si, gi, guv, u_grid_scale, u_ratio, module_tx, g_origin, gwuv,
		is_left, is_right, is_bottom, is_top, is_border_l, is_border_r, is_border_b, is_border_t, is_border_tb, is_border_lr, is_border, is_group_border_a_l, is_group_border_a_r, is_group_border_b_l, is_group_border_b_r, is_tri_top, is_tri_bot, is_tri_left, is_tri_right, is_tri_border_tl, is_tri_border_tr, is_tri_border_bl, is_tri_border_br, 
		u_st_issues, u_sst_issues_headline, u_sst_issues_pre_reveal, u_sst_issues_reveal_1, u_sst_issues_reveal_2, u_sst_issues_reveal_3, u_sst_issues_reveal_4, u_sst_issues_reveal_5, u_sst_issues_reveal_6, u_sst_issues_reveal_1_alt, u_sst_issues_reveal_2_alt, u_sst_issues_reveal_3_alt, u_sst_issues_reveal_4_alt, u_sst_issues_reveal_5_alt, u_sst_issues_reveal_6_alt, u_sst_issues_index_tween,
		u_sp_landscape_issues
	);


	draw_solutions(
		px_base_dot, px_base_rect, px_base_diag, px_large_rectdiag, px_misc, px_base_color, px_large_color, px_debug,
		noise_in, flow_in, touches_in, touches_flow_in, touches_color_in,
		u_res, u_time, uv, px, wuv, screen, group, si, gi, guv, u_grid_scale, u_ratio, module_tx, g_origin, gwuv,
		is_left, is_right, is_bottom, is_top, is_border_l, is_border_r, is_border_b, is_border_t, is_border_tb, is_border_lr, is_border, is_group_border_a_l, is_group_border_a_r, is_group_border_b_l, is_group_border_b_r, is_tri_top, is_tri_bot, is_tri_left, is_tri_right, is_tri_border_tl, is_tri_border_tr, is_tri_border_bl, is_tri_border_br, 
		u_st_solutions, u_sst_solutions_headline, u_sst_solutions_empty, u_sst_solutions_reveal_1,
		u_sp_solutions_platform
	);
	
	draw_platform(
		px_base_dot, px_base_rect, px_base_diag, px_large_rectdiag, px_misc, px_base_color, px_large_color, px_debug,
		noise_in, flow_in, touches_in, touches_flow_in, touches_color_in,
		u_res, u_time, uv, px, wuv, screen, group, si, gi, guv, u_grid_scale, u_ratio, module_tx, g_origin, gwuv,
		is_left, is_right, is_bottom, is_top, is_border_l, is_border_r, is_border_b, is_border_t, is_border_tb, is_border_lr, is_border, is_group_border_a_l, is_group_border_a_r, is_group_border_b_l, is_group_border_b_r, is_tri_top, is_tri_bot, is_tri_left, is_tri_right, is_tri_border_tl, is_tri_border_tr, is_tri_border_bl, is_tri_border_br, 
		u_st_platform, u_sst_platform_headline, u_sst_platform_3up, u_sst_platform_pillar_1, u_sst_platform_pillar_2, u_sst_platform_pillar_3,
		u_sp_solutions_platform, u_platform_ss_index, u_platform_ss_color_blend
	);
	
	draw_case(
		px_base_dot, px_base_rect, px_base_diag, px_large_rectdiag, px_misc, px_base_color, px_large_color, px_debug,
		noise_in, flow_in, touches_in, touches_flow_in, touches_color_in,
		u_res, u_time, uv, px, wuv, screen, group, si, gi, guv, u_grid_scale, u_ratio, module_tx, g_origin, gwuv,
		is_left, is_right, is_bottom, is_top, is_border_l, is_border_r, is_border_b, is_border_t, is_border_tb, is_border_lr, is_border, is_group_border_a_l, is_group_border_a_r, is_group_border_b_l, is_group_border_b_r, is_tri_top, is_tri_bot, is_tri_left, is_tri_right, is_tri_border_tl, is_tri_border_tr, is_tri_border_bl, is_tri_border_br, 
		u_st_case, u_sst_case_intro, u_sst_case_headline, u_sst_case_challenges, u_sst_case_solutions, u_sst_case_outcomes ,
		u_sst_case_intro_special, case_color_in, u_case_outcome_splashes,
		u_sp_case_conclusion
	);


	draw_conclusion(
		px_base_dot, px_base_rect, px_base_diag, px_large_rectdiag, px_misc, px_base_color, px_large_color, px_debug,
		noise_in, flow_in, touches_in, touches_flow_in, touches_color_in,
		u_res, u_time, uv, px, wuv, screen, group, si, gi, guv, u_grid_scale, u_ratio, module_tx, g_origin, gwuv,
		is_left, is_right, is_bottom, is_top, is_border_l, is_border_r, is_border_b, is_border_t, is_border_tb, is_border_lr, is_border, is_group_border_a_l, is_group_border_a_r, is_group_border_b_l, is_group_border_b_r, is_tri_top, is_tri_bot, is_tri_left, is_tri_right, is_tri_border_tl, is_tri_border_tr, is_tri_border_bl, is_tri_border_br, 
		u_st_conclusion, u_sst_conclusion_initial, u_sst_conclusion_resolve,
		u_grid_snap, u_conc_custom
	);



	// px_misc = vec4( 0.0 );
	// px_debug = vec4( 0.0 );


	// - - - OUTPUT

	frag_0 = TDOutputSwizzle( px_base_dot );
	frag_1 = TDOutputSwizzle( px_base_rect );
	frag_2 = TDOutputSwizzle( px_base_diag );
	frag_3 = TDOutputSwizzle( px_large_rectdiag );
	frag_4 = TDOutputSwizzle( px_misc );
	frag_5 = TDOutputSwizzle( px_base_color );
	frag_6 = TDOutputSwizzle( px_large_color );
	frag_7 = TDOutputSwizzle( px_debug );

}