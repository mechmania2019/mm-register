const { send, json } = require('micro')
const mongoose = require('mongoose')
const { Team } = require('mm-schemas')(mongoose)

mongoose.connect(process.env.MONGO_URI)
mongoose.Promise = global.Promise

module.exports = async (req, res) => {
  try {
    const data = await json(req)
    // check if team exists or not
    const team = await Team.find({ name: data.name })
    console.log(team)
    if (team.length !== 0) {
      return send(res, 401, 'Team already exists')
    }

    const newTeam = new Team({
      name: data.name,
      email: data.email
    })
    newTeam.save()

    return newTeam
  } catch (err) {
    return send(res, 400, err.message)
  }
}
