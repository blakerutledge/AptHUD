import controller from './controller'


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - CURRENT STATE DATA

// ONLY import this module when require-ing state

export let data = {

	meta: {
		hello: 'world'
	},


	
}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  TASKS

// ONLY import this module into the controller

export let tasks = {

	set_meta_hello: ( val ) => {
		exports.data.meta.hello = val
	},



}