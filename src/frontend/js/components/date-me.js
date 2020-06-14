export default () => {

	let d = new Date()
	let y = d.getFullYear()

	let year_spots = Array.prototype.slice.call(document.querySelectorAll('.date-me-footer'))
	year_spots.forEach( x => {
		x.innerHTML = y
	})

}