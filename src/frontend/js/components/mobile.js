export default () => {

	let usr = navigator.userAgent
	return usr.match(/Android/i) || usr.match(/BlackBerry/i) || usr.match(/iPhone/i) || usr.match(/iPad/i) || usr.match(/iPod/i) || usr.match(/iPhone|iPad|iPod/i) || usr.match(/IEMobile/i)

}