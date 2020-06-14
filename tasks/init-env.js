import * as fs from 'fs-extra'
import * as path from 'path'

let my_env_path = '.env'
let ex_env_path = path.join( 'etc', '.env-example' )

let my_env = {}
let ex_env = {}



fs.readFile( my_env_path, 'utf8', ( err, data ) => {

	if ( err && err.code === 'ENOENT') {
		
		fs.copy( ex_env_path, my_env_path, ( err ) => {
			if ( err ) {
				throw err
			}
			else {
				console.log( 'Created new .env file from example file. Please manually verify any missing secret values like API keys.' )
			}
		} )

	}
	else {

		my_env = parse_env( data )

		fs.readFile( ex_env_path, 'utf8', ( _err, _data ) => {

			if ( _err ) throw _err

			ex_env = parse_env( _data )

			my_env = sync_envs( my_env, ex_env )

			write_env( my_env )

		} )

	}

} )





// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - HELPERS


let parse_env = ( data ) => {

	let lines = data.split('\n').filter( l => { return l !== '' } )

	let obj = {}

	lines.forEach( ( l, i ) => {
		let els = l.split( '=' )
		if ( els.length == 2 ) {
			obj[ els[ 0 ] ] = els[ 1 ]
		}
	} )

	return obj

}

let write_env = ( env_obj ) => {

	let str = ''

	for ( let key in env_obj ) {

		let line = `${ key }=${ env_obj[ key ] }\n`
		str += line

	}
  
	fs.writeFile( my_env_path, str, 'utf-8', ( err ) => {

		if ( err ) throw err

		console.log( '💫  Synced .env file' )

	} )

}

let sync_envs = ( local, example ) => {

	let new_local = {}

	// COPY existing
	for ( let key in local ) {
		new_local[ key ] = String( local[ key ] )
	}

	// TEST missing, populate with default
	for ( let key in example ) {
		if ( local[ key ] == undefined ) {
			console.log( `Missing key in .env file, ${ key }. Using default value. Please manually verify any missing secret values like API keys.` )
			new_local[ key ] = String( example[ key ] )
		}
	}

	return new_local

}