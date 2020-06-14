import * as fs from 'fs-extra'
import * as path from 'path'

const directory = 'dist'

const keep = [ 'frontend', '.git-keep' ]



let clean = () => {

	console.log( '💦  cleaning dist server' )

	fs.readdir( directory, ( err, files ) => {
		
		if ( err ) {
			if ( err.code !== 'ENOENT' ) throw err
		}

		for ( let file of files ) {
			
			if ( keep.indexOf( file ) < 0 ) {

				fs.remove( path.join( directory, file ), err => {
					if ( err ) throw err
				} )

			}
		}

	} )

}


fs.ensureDir( directory, ( exists ) => {

	clean()

} )
