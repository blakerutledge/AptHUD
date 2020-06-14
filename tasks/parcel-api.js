import Bundler from 'parcel-bundler'
import path from 'path'
import { run as postprocess } from './windows-parcel-css-relpath-hack.js'

let build = () => {


	// DEFAULT configuration
	let entry = 'src/index.html'
	let options = {
	  outDir: './dist',
	  watch: false,
	  target: 'server'
	}

	// PARSE arguments for basic configuration
	process.argv.forEach( x => {

		if ( x.startsWith( 'watch=' ) ) {
			options.watch = JSON.parse( x.replace( 'watch=', '' ) )
		}
		else if ( x.startsWith( 'target=' ) ) {
			options.target = x.replace( 'target=', '' )
		}
		else if ( x.startsWith( 'dist=' ) ) {
			options.outDir = path.join( __dirname, '..', x.replace( 'dist=', '' ) )
		}
		else if ( x.startsWith( 'entry=' ) ) {
			entry = path.join( __dirname, '..', x.replace( 'entry=', '' ) )
		}

	} )

	// BUILD
	const bundler 	= new Bundler( entry, options)
	const bundle 	= bundler.bundle()
	

	bundler.on('buildEnd', () => {

		postprocess()
	
	})

}


build()