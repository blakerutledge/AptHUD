let controller = require('./controller')


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - CURRENT STATE DATA

// ONLY import this module when require-ing state

exports.data = {

	meta: {
		password: null
	}
	
}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  TASKS

// ONLY import this module into the controller

exports.tasks = {

	set_password: ( password_hash ) => {
		exports.data.meta.password = password_hash
	}



	

}