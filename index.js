const { send } = require('micro')

const register = mongoose => {
  const { Team } = require('mm-schemas')(mongoose)
  return fn => async(req, res) => {
    const header = req.headers.authorization
    if(!header) {
      return send(res, 401, 'Unauthorized')
    }
    // Assumed Format: https://user:password@domain.com
    const [email, psswd] = header.split(':') 
    const team = await Team.find({email: email })
    if (!team){
      return send(res, 401, 'Team already exists')
    }
    const data = await json(req)
    const newTeam = new Team({
      name: data.name,
      admin: data.admin || false,
      email: email,
      password: passwd,
    })
    res.user = newTeam
    return await fn(req,res)  
  }
}

module.exports = register;