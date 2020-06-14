import * as fs from 'fs-extra'
import * as path from 'path'
import replace from 'replace-in-file'

const directory = path.join( 'dist', 'frontend' )


let find_css_bundle = () => {

	fs.readdir( directory, ( err, files ) => {
		
		if ( err ) {
			if ( err.code !== 'ENOENT' ) throw err
		}

		for ( let file of files ) {
			
			if ( file.startsWith( 'style.' ) && file.endsWith( '.css' ) ) {

				let options = {
					files: path.join( directory, file ),
					from: /\\/g,
					to: '/'
				}

				replace( options )
					.then( results => {
						console.log( 'Fixed relative paths in css bundle' )
					})
					.catch( error => {
						console.error( 'Error occurred:', error )
					})
	
			}

		}

	} )

}


export let run = () => {

	fs.ensureDir( directory, ( exists ) => {

		if ( process.platform == 'win32' ) {

			find_css_bundle()

		}

	} )

}