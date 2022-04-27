import { Router } from 'express';
import User from '../models/User';

const CommunityController = {
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


export default CommunityController