const { send, json } = require('micro')
const mongoose = require('mongoose')
const { Team } = require('mm-schemas')(mongoose)
const cors = require('micro-cors')()

mongoose.connect(process.env.MONGO_URL)
mongoose.Promise = global.Promise
mongoose.connection
  .once('open', () => console.log('Connected to MongoLab instance.'))
  .on('error', error => console.log('Error connecting to MongoLab:', error))

const handler = async (req, res) => {
  try {
    const data = await json(req)
    console.log('Recieved Request: ', data)
    // check if team exists or not
    const team = await Team.find({ name: data.name })
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
module.exports = cors(handler)
