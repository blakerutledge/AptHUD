export default class FBO {

	constructor( data ) {

		/*
			Class to abstract a simple WebGL shader-based FBO, for use in 
			multi-step render pipelines

			data = {
				renderer: (your single webgl renderer),
				dimensions: new THREE.Vector2( x, y ),
				objects: [ new THREE.Mesh(...), ... ],
				output: null
			}
		*/


		// - - - Minimal world setup

		// Renderer
		this.renderer = data.renderer

		// Scale
		this.dimensions = {
			x: data.dimensions.x || 256,
			y: data.dimensions.y || 256
		}

		// Scene
		this.scene = new THREE.Scene()

		// Camera
		this.cam = ( data.cam !== undefined )
			? data.cam
			: new THREE.OrthographicCamera( -1, 1, 1, -1, 1/Math.pow( 2, 53 ), 1 )

		// Shader material
		this.shader_material = data.shader_material
		
		// Add all meshes/groups/objects to scene
		data.objects.forEach( obj => {
			this.scene.add( obj )
		} )

		// Buffer Target
		this.buffer = new THREE.WebGLRenderTarget( this.dimensions.x, this.dimensions.y, {
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			type: THREE.FloatType
		} )

	}

	render() {
	
		this.renderer.render( this.scene, this.cam, this.buffer, false )

	}

}