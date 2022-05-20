const util = {
    validSession: function (req, res, next) {
        if (!req.session.username)
            return res.status(403).json({ error: "user not logged in" }).send();
        return next();
    },
    containsParams : function (pars, req) {
        pars.forEach(par => {
            if (!(par in req.body)){
                return false;
            }
        });
        return true
    }
}

export default util