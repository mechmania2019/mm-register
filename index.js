const mongoose = require('mongoose')
const { Team } = require('mm-schemas')(mongoose)

mongoose.connect(process.env.MONGO_URL)
mongoose.Promise = global.Promise
mongoose.connection
  .once('open', () => console.log('Connected to MongoLab instance.'))
  .on('error', error => console.log('Error connecting to MongoLab:', error))

const json = async req => new Promise(resolve => {
  let data = []
  req.on('data', chunk => {
    data.push(chunk)
  });
  req.on('end', () => {
    resolve(JSON.parse(data));
  })
});

const handler = async (req, res) => {
  try {
    const data = await json(req)
    console.log('Recieved Request: ', data)
    const newTeam = new Team({
      name: data.name,
      email: data.email
    })
    res.end(JSON.stringify(await newTeam.save()));
  } catch (err) {
    res.statusCode = 401;
    res.end("Team already exists");
  }
}
module.exports = handler
