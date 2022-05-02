function validSession(req, res, next) {
	if (!req.session.username)
		return res.status(403).json({ error: "user not logged in" }).send();
	return next();
}

export default validSession;
