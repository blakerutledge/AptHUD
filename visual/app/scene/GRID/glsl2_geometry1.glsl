// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  SETUP

#include "/app/glsl/defines"
#include "/app/glsl/helpers"

layout(	points ) in;
layout ( triangle_strip, max_vertices = 4 ) out;

uniform vec4 u_config_1;
uniform vec4 u_config_2;
uniform vec4 u_config_3;
uniform vec4 u_config_4;

uniform sampler2D u_flow;

uniform vec4 u_config_shapes;
uniform vec4 u_config_alt;

in vec4[1] transport_geo_in_p_transform_1;
in vec4[1] transport_geo_in_p_transform_2;
in vec4[1] transport_geo_in_p_transform_3;
in vec4[1] transport_geo_in_p_transform_4;
in vec4[1] transport_geo_in_p_life;
in vec4[1] transport_geo_in_p_meta;
in vec4[1] transport_geo_in_p_misc;

out vec4 transport_geo_out_p_transform_1;
out vec4 transport_geo_out_p_transform_2;
out vec4 transport_geo_out_p_transform_3;
out vec4 transport_geo_out_p_transform_4;
out vec4 transport_geo_out_p_life;
out vec4 transport_geo_out_p_meta;
out vec4 transport_geo_out_p_misc;
out vec2 transport_geo_out_p_uv;

const float CIRCLE_RADIUS_MIN = 0.0;
const float CIRCLE_RADIUS_MAX = 0.25;
const float RECT_PADDING_MIN = 0.0;
const float RECT_PADDING_MAX = 0.5;
const float RECT_WIDTH_MIN = 0.0;
const float RECT_WIDTH_MAX = 0.25;


void draw_circ( float module_w, float renderable, vec2 origin, float scale, float theta, vec4 flow_in ) {

	float CIRCLE_RADIUS = mix( CIRCLE_RADIUS_MIN, CIRCLE_RADIUS_MAX, u_config_shapes.x );

	float r = 		module_w * CIRCLE_RADIUS;
	float t = 		-theta * 2.0 * PI;
	float z = 		mix( 1000.0, 0.0, renderable );
	vec2 o = 		origin;
	float s = 		scale;

	z += flow_in.r * 0.2;

	r *= 			s;

	// bottom right
	vec2 p = vec2( r, -r );
	p *= rotate2d( t );
	transport_geo_out_p_uv = vec2( 1.0, 0.0 );
	gl_Position = TDWorldToProj( vec4( o + p, z, 1.0 ), 0 );
	EmitVertex();

	// bottom left
	p = vec2( -r, -r );
	p *= rotate2d( t );
	transport_geo_out_p_uv = vec2( 0.0, 0.0 );
	gl_Position = TDWorldToProj( vec4( o + p, z, 1.0 ), 0 );
	EmitVertex();

	// top right
	p = vec2( r, r );
	p *= rotate2d( t );
	transport_geo_out_p_uv = vec2( 1.0, 1.0 );
	gl_Position = TDWorldToProj( vec4( o + p, z, 1.0 ), 0 );
	EmitVertex();

	// top left
	p = vec2( -r, r );
	p *= rotate2d( t );
	transport_geo_out_p_uv = vec2( 0.0, 1.0 );
	gl_Position = TDWorldToProj( vec4( o + p, z, 1.0 ), 0 );
	EmitVertex();

	EndPrimitive();

}



void draw_rect( float module_w, float renderable, vec2 origin, float span, float scale, float theta, vec4 flow_in ) {

	float CIRCLE_RADIUS = 	mix( CIRCLE_RADIUS_MIN, CIRCLE_RADIUS_MAX, u_config_shapes.x );
	float RECT_WIDTH =  	mix( RECT_WIDTH_MIN, RECT_WIDTH_MAX, u_config_shapes.y );

	float RECT_PADDING = 	mix( RECT_PADDING_MIN, min( 0.5 - CIRCLE_RADIUS, RECT_PADDING_MAX ), u_config_shapes.z );

	float l = 		span * module_w - module_w * ( 2.0 * CIRCLE_RADIUS + 2.0 * RECT_PADDING );
	float g = 		module_w * ( CIRCLE_RADIUS + RECT_PADDING );
	float w = 		module_w * RECT_WIDTH * 0.5;

	float t =		-floor( theta * 4.0 ) / 4.0 * 2.0 * PI;
	float z = 		mix( 1000.0, 0.0, renderable );
	vec2 o = 		origin;
	float s = 		scale;

	z += flow_in.r * 0.2;

	// bottom right
	vec2 p = vec2( w, g );
	p *= rotate2d( t );
	transport_geo_out_p_uv = vec2( 1.0, 0.0 );
	gl_Position = TDWorldToProj( vec4( o + p, z, 1.0 ), 0 );
	EmitVertex();

	// bottom left
	p = vec2( -w, g );
	p *= rotate2d( t );
	transport_geo_out_p_uv = vec2( 0.0, 0.0 );
	gl_Position = TDWorldToProj( vec4( o + p, z, 1.0 ), 0 );
	EmitVertex();

	// top right
	p = vec2( w, g + l * s );
	p *= rotate2d( t );
	transport_geo_out_p_uv = vec2( 1.0, 1.0 );
	gl_Position = TDWorldToProj( vec4( o + p, z, 1.0 ), 0 );
	EmitVertex();

	// top left
	p = vec2( -w, g + l * s );
	p *= rotate2d( t );
	transport_geo_out_p_uv = vec2( 0.0, 1.0 );
	gl_Position = TDWorldToProj( vec4( o + p, z, 1.0 ), 0 );
	EmitVertex();

	EndPrimitive();

}



void draw_diag( float module_w, float renderable, vec2 origin, float span, float scale, float theta, vec4 flow_in ) {

	float CIRCLE_RADIUS = 	mix( CIRCLE_RADIUS_MIN, CIRCLE_RADIUS_MAX, u_config_shapes.x );
	float RECT_WIDTH =  	mix( RECT_WIDTH_MIN, RECT_WIDTH_MAX, u_config_shapes.y );
	float RECT_PADDING = 	mix( RECT_PADDING_MIN, RECT_PADDING_MAX, u_config_shapes.z );

	float l = 		ROOT_2 * span * module_w - module_w * ( 2.0 * CIRCLE_RADIUS + 2.0 * RECT_PADDING );
	float g = 		module_w * ( CIRCLE_RADIUS + RECT_PADDING );
	float w = 		module_w * RECT_WIDTH * 0.5;

	float t =		( -floor( theta * 4.0 ) / 4.0 - 0.125 ) * 2.0 * PI;
	float z = 		mix( 1000.0, 0.0, renderable );
	vec2 o = 		origin;
	float s = 		scale;

	z += flow_in.r * 0.2;

	// bottom right
	vec2 p = vec2( w, g );
	p *= rotate2d( t );
	transport_geo_out_p_uv = vec2( 1.0, 0.0 );
	gl_Position = TDWorldToProj( vec4( o + p, z, 1.0 ), 0 );
	EmitVertex();

	// bottom left
	p = vec2( -w, g );
	p *= rotate2d( t );
	transport_geo_out_p_uv = vec2( 0.0, 0.0 );
	gl_Position = TDWorldToProj( vec4( o + p, z, 1.0 ), 0 );
	EmitVertex();

	// top right
	p = vec2( w, g + l * s );
	p *= rotate2d( t );
	transport_geo_out_p_uv = vec2( 1.0, 1.0 );
	gl_Position = TDWorldToProj( vec4( o + p, z, 1.0 ), 0 );
	EmitVertex();

	// top left
	p = vec2( -w, g + l * s );
	p *= rotate2d( t );
	transport_geo_out_p_uv = vec2( 0.0, 1.0 );
	gl_Position = TDWorldToProj( vec4( o + p, z, 1.0 ), 0 );
	EmitVertex();

	EndPrimitive();

}




void draw_triangle( float module_w, float renderable, vec2 origin, float span, float scale, float theta, vec4 flow_in ) {

	float CIRCLE_RADIUS = 	mix( CIRCLE_RADIUS_MIN, CIRCLE_RADIUS_MAX, u_config_shapes.x );
	float RECT_WIDTH =  	mix( RECT_WIDTH_MIN, RECT_WIDTH_MAX, u_config_shapes.y );
	float RECT_PADDING = 	mix( RECT_PADDING_MIN, min( 0.5 - CIRCLE_RADIUS, RECT_PADDING_MAX ), u_config_shapes.z );

	float w = 		module_w * span * 0.5;

	float t =		-floor( theta * 8.0 ) / 8.0 * 2.0 * PI;
	float z = 		mix( 1000.0, 0.1, renderable );
	vec2 o = 		origin;
	float s = 		scale;


	z += flow_in.r * 0.8;

	// snap scale
	// s = clamp( s, 1.0, 1.0 );
	s = clamp( s * 1.5, 0.0, 1.0 );
	s = floor( max( s, 0.0 ) * 4.0 ) / 4.0;
	
	float b = 		module_w * span * ( CIRCLE_RADIUS * 0.5 + RECT_PADDING );
	w = ( w - b * 0.5 ) * s;


	// bottom
	vec2 p = vec2( 0.0, b );
	p *= rotate2d( t );
	transport_geo_out_p_uv = vec2( 0.5, 0.0 );
	gl_Position = TDWorldToProj( vec4( o + p, z, 1.0 ), 0 );
	EmitVertex();

	// left
	p = vec2( -w, w + b );
	p *= rotate2d( t );
	transport_geo_out_p_uv = vec2( 0.0, 1.0 );
	gl_Position = TDWorldToProj( vec4( o + p, z, 1.0 ), 0 );
	EmitVertex();

	// right
	p = vec2( w, w + b );
	p *= rotate2d( t );
	transport_geo_out_p_uv = vec2( 1.0, 1.0 );
	gl_Position = TDWorldToProj( vec4( o + p, z, 1.0 ), 0 );
	EmitVertex();

	EndPrimitive();


}






// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  MAIN

void main()
{

	// - - - UNPACK UNIFORMS

	vec2  u_sim_res = 			u_config_alt.xy;
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
	float u_zooming = 			u_config_4.w;
	
	float u_ratio = 			u_grid_count.y / u_grid_count.x;
	float u_px_w_tx = 			6.0 / u_canvas_res.x;
	float u_group_count =		u_grid_count.x * u_grid_count.y;
	float u_group_count_alt =	u_grid_count.x * u_grid_count.y * 0.5;
	float u_num_groups = 		3.0;
	float u_num_groups_alt = 	2.0;
	float u_group_total = 		u_num_groups * u_group_count;
	float u_group_total_alt = 	u_num_groups_alt * u_group_count_alt;
	float u_module_w =			( u_grid_scale.x / u_grid_count.x ) * mix( 1.0, MAX_ZOOM, u_zoom ) + 0.0 * u_px_w_tx;




	// - - - UNPACK & PASS transform & meta data from texture

	transport_geo_out_p_transform_1 = 	transport_geo_in_p_transform_1[0];
	transport_geo_out_p_transform_2 = 	transport_geo_in_p_transform_2[0];
	transport_geo_out_p_transform_3 = 	transport_geo_in_p_transform_3[0];
	transport_geo_out_p_transform_4 = 	transport_geo_in_p_transform_4[0];
	transport_geo_out_p_life = 			transport_geo_in_p_life[0];
	transport_geo_out_p_meta = 			transport_geo_in_p_meta[0];
	transport_geo_out_p_misc = 			transport_geo_in_p_misc[0];

	vec4 p_transform_1 = 				transport_geo_out_p_transform_1;
	vec4 p_transform_2 = 				transport_geo_out_p_transform_2;
	vec4 p_transform_3 = 				transport_geo_out_p_transform_3;
	vec4 p_transform_4 = 				transport_geo_out_p_transform_4;
	vec4 p_life = 						transport_geo_out_p_life;
	vec4 p_meta = 						transport_geo_out_p_meta;
	vec4 p_misc = 						transport_geo_out_p_misc;


	// - - - UNPACK transform & meta values

	int   p_type_i = 					int( p_meta.g );
	float p_renderable = 				p_meta.r;

	vec2 p_pos = 						p_transform_1.xy;
	vec2 p_grid_rowcol = 				p_transform_1.zw;
	float p_scale = 					p_transform_2.y; // cubicOut( p_transform_2.y );
	float p_rotation = 					p_transform_2.z;
	vec4 p_color = 						p_transform_3;
	float p_span = 						p_meta.b;
	vec2 p_offset = 					p_transform_4.xy;



	// SNAP shimmer layer
	vec2 p_offset_snap = vec2( 
		u_grid_scale.x * round( ( p_offset.x / u_grid_scale.x ) * u_grid_crop.x ) / ( u_grid_crop.x ),
		u_grid_scale.y * round( ( p_offset.y / u_grid_scale.y ) * u_grid_crop.y ) / ( u_grid_crop.y )
	);
	float p_scale_shimmer = p_transform_3.a;
	p_offset = mix( p_offset, p_offset_snap, eq( p_type_i, 3 ) );
	p_rotation = mix( p_rotation, floor( 4.0 * p_transform_2.x ) / 4.0 + 0.125, eq( p_type_i, 3 ) );
	// p_scale = mix( p_scale, p_scale_shimmer, eq( p_type_i, 3 ) );



	vec2 cuv = vec2(
		0.5 * ( p_pos.x + p_offset.x ) / 3.0 - 0.5,
		0.5 * ( p_pos.y + p_offset.y ) / ( 3.0 * u_ratio ) - 0.5
	);
	vec4 flow_in = texture( u_flow, cuv );


	// - - - GROUP ZOOMS

	// vec2 pre_zoom_p_pos = vec2(
	// 	( 0.5 * u_grid_scale.x ) * ( p_grid_rowcol.x / ( u_grid_count.x - 1.0 ) * 2.0 - 1.0 ),
	// 	( 0.5 * u_grid_scale.y ) * ( p_grid_rowcol.y / ( u_grid_count.y - 1.0 ) * 2.0 - 1.0 )
	// );

	float p_group = p_transform_1.z;
	// 	0.0 * step( pre_zoom_p_pos.x, -1.0 + P_NORM ) +
	// 	1.0 * step( -1.0 + P_NORM, pre_zoom_p_pos.x ) * step( pre_zoom_p_pos.x,  1.0 - P_NORM ) +
	// 	2.0 * step(  1.0 - P_NORM, pre_zoom_p_pos.x );
	// p_group = clamp( p_group, 0.0, 2.0 );

	// p_group = 0.0;

	int p_group_i = int( p_group );

	vec2 group_center = vec2( -2.0 + p_group * 2.0, 0.0 );

	float group_zoom = 
		eq( p_group_i, 0 ) * u_zoom_a +
		eq( p_group_i, 1 ) * u_zoom_b +
		eq( p_group_i, 2 ) * u_zoom_c;

	group_zoom = mix( 1.0, MAX_GROUP_ZOOM, group_zoom );

	u_module_w *= group_zoom;

	p_offset *= group_zoom;











	// - - - DRAW vertices 

	vec4[ 2 ] quad = vec4[ 2 ]( vec4( 1.0 ), vec4( 1.0 ) );

	if ( eq( p_type_i, 0 ) > 0.0 ) {

		draw_circ( u_module_w, p_renderable, p_pos + p_offset, max( p_scale, p_color.a ), p_rotation, flow_in );

	}
	else if ( eq( p_type_i, 1 ) > 0.0 ) {

		draw_rect( u_module_w, p_renderable, p_pos + p_offset, p_span, p_scale, p_rotation, flow_in );

	}
	else if ( eq( p_type_i, 2 ) > 0.0 ) {

		draw_diag( u_module_w, p_renderable, p_pos + p_offset, p_span, p_scale, p_rotation, flow_in );

	}
	else if ( eq( p_type_i, 3 ) > 0.0 ) {

		draw_triangle( u_module_w, p_renderable, p_pos + p_offset, p_span, p_scale, p_rotation, flow_in );

	}
	else if ( eq( p_type_i, 4 ) > 0.0 ) {

		draw_rect( u_module_w, p_renderable, p_pos + p_offset, p_span, p_scale, p_rotation, flow_in );

	}
	else if ( eq( p_type_i, 5 ) > 0.0 ) {

		draw_diag( u_module_w, p_renderable, p_pos + p_offset, p_span, p_scale, p_rotation, flow_in );

	}

}