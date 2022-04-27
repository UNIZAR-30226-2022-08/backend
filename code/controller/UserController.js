import { Router } from 'express';
import User from '../models/User';

const UserController = {
    async register(req, res) {
        const {username, email, password } = req.body
        await User.create({
            username,
            email,
            password
        }). then(function(){
            res.status(201).send();
        })
        .catch(function(err) {
            res.status(400).json({ error: err.errors}).send()
        });
    },
    async login(req, res) {
        if (req.session.username) {
            res.status(403).json({ message: 'User already logged in' })
            return
        }
        const {email, password} = req.body;
        await User.findOne({
            where: {
                email: password,
                password: password
            }
        }).then(function(user) {
            if(user.length !== 0){
                const {session} = req;
                session.username=user.dataValues.username
                session.email=user.dataValues.email
                res.status(200).send();
            } else {
                res.status(400).json({ error: "Invalid email or password"}).send();
                
            }
        })
    },
    async changePassword(req, res) {
        const {email, newPassword} = req.body
        await User.update({
            password: newPassword,
            where: {
                email
            }
        })
        .then(function() {
            res.status(201).send();
        })
        .catch(function(err) {
            res.status(400).json({ error: err.errors}.send())
            
        });
    },
    async logout(req,res) {
        req.session.destroy();
        res.status(201).json({ status: 'success', message: 'Logged out' })
    },
    async getPublicProfile(req,res) {
        const {username} = req.body
        let user = User.findOne({
            attributes: { include: ["username", "elo", "money"] },
            where: {
                username: username
            }
        })
		if (user === null) {
			res.status(400).json({ error:"Couldn't find the game"})
			res.send()
			return
		}
        else {
            var { count, rows } = await Project.findAndCountAll({
                where: {
                    inProgress: false,
                    [Op.or]: [{ whitePlayer: username }, { blackPlayer: username }]
                },
            });
            var playedCount = count

            const { count, rows } = await Project.findAndCountAll({
                where: {
                    inProgress: false,
                    [Op.or]: [
                        { [Op.and]: [{whitePlayer: username}, {whiteWon : true}] }, 
                        { [Op.and]: [{blackPlayer: username}, {whiteWon : false}] }
                    ]
                },
            });
            var wonCount = count


            var stats = {
                playedGames: playedCount,
                wonGames: wonCount,
                playedTournaments : 0,
                wonTournaments : 0
            }

            var response = {
                user : user,
                stats : stats
            }
            res.status(200).json({ response: user })
			res.send()
        }
    }
}


export default UserController