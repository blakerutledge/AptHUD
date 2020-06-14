import * as fs from 'fs-extra'
import * as path from 'path'

const directory = path.join( __dirname, '..', 'dist', 'frontend' )


let clean = ( resolve ) => {

	console.log( '💦  cleaning dist/frontend' )

	fs.readdir( directory, ( err, files ) => {
		
		if ( err ) {
			if ( err.code !== 'ENOENT' ) throw err
		}

		fs.remove( path.join( directory ), err => {
			if ( err ) throw err
		} )

	} )

}


fs.ensureDir( directory, ( exists ) => {

	clean()

} )