import * as whatwg_fetch from 'whatwg-fetch'
import * as content from './content'

export let get = ( url, callback ) => {

	fetch(url)
		.then( (response) => {
			return response.json()
		})
		.then( (body) => {
			if ( callback ) callback(body)
			else return body
		})

}