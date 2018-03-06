const { send } = require('micro')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL)
mongoose.Promise = global.Promise

module.exports = async (req, res) => {
  const { Team } = require('mm-schemas')(mongoose)
  const data = await json(req)

  // check if team exists or not
  const team = await Team.find({name: data.name })
  if (team){
    return send(res, 401, 'Team already exists')
  }
  
  const newTeam = new Team({
    name: data.name,
    email: data.email
  })
  newTeam.save()

  return newTeam;
}