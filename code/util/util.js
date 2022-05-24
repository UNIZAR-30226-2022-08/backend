function validSession(req, res, next) {
	if (!req.session.username)
		return res.status(403).json({ error: "user not logged in" }).send();
	return next();
}

/**
 *
 * @param {Array} pars Array of strings with names of properties
 * @param {Object} req Request object
 * @returns {boolean} True if object 'req.body' contains all properties specified
 * 	in the 'pars' array.
 */
function containsParams (pars, req) {
	let foundAll = true;
	pars.forEach(par => {
		if (!(par in req.body)){
			foundAll = false;
		}
	});
	return foundAll
}

export { validSession, containsParams };
