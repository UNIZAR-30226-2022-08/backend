function validSession(req, res, next) {
	if (!req.session.username)
		return res.status(403).json({ error: "user not logged in" }).send();
	return next();
}

/**
 *
 * @param {Array} props Array of properties
 * @param {Object} includedIn Object to check
 * @returns {boolean} True if object 'includedIn' contains all properties specified
 * 	in the 'props' array.
 */
function containsParams(props, includedIn) {
	return props.reduce(
		(prev, elem) => (prev ? elem in includedIn.body : false),
		true
	);
}

export { validSession, containsParams };
