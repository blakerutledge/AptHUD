import * as controller from './controller'


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - CURRENT STATE DATA

// ONLY import this module when require-ing state

export let data = {

	meta: {
		password: null
	}
	
}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  TASKS

// ONLY import this module into the controller

export const tasks = {

	set_password: ( password_hash ) => {
		exports.data.meta.password = password_hash
	}



	

}