export default (x) => {

    let hash = ""
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

    for( let i=0; i < x; i++ ) {
      hash += possible.charAt(Math.floor(Math.random() * possible.length))
    }

	return hash
}