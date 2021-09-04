const functions = require("firebase-functions")
const admin = require("firebase-admin")
const {Client, Intents} = require("discord.js")
admin.initializeApp({databaseURL: "https://tumbledmtg-website-default-rtdb.firebaseio.com/"})
const challongekey = functions.config().tumbledmtg.challongekey
const discordSecret = functions.config().tumbledmtg.discordsecret
const password = functions.config().tumbledmtg.password
const db = admin.firestore()
const request = require("request")

var mysql = require("mysql")

function sendMessage(message) {
  const client = new Client({intents: [Intents.FLAGS.GUILDS]})
  client.on("ready", client => {
    client.channels.fetch("655214733267304451").then(channel => {
      channel.send(message)
      client.logo
    })
  })
  client.login(functions.config().tumbledmtg.discordtoken)
}

const validateUser = (req, res, next) => {
  const getUser = () => {
    let dataOptions = {
      url: "https://discord.com/api/users/@me",
      headers: {
        authorization: req.auth.token
      },
      json: true
    }
    request.get(dataOptions, function (error, response, body) {
      if (error || !response.body.id || !response.body.avatar) {
        return res.status(400).json({error: "Something went wrong.", logout: true})
      }
      const id = response.body.id
      const avatar = response.body.avatar
      db.collection("users")
        .where("id", "==", id)
        .get()
        .then(snapshot => {
          if (snapshot.size === 1) {
            req.user = {...snapshot.docs[0].data()}
            req.user.avatar = avatar
            req.userRef = snapshot.docs[0].ref
            return next()
          } else {
            return res.status(400).json({error: "Could not get user.", logout: true})
          }
        })
        .catch(err => {
          console.error(err)
          return res.status(500).json({error: "Error getting user data."})
        })
    })
  }

  let {token, expires, rtoken} = req.headers
  req.auth = {}
  let now = new Date().getTime()
  if (now < expires) {
    req.auth.token = token
    req.auth.refreshed = false
    getUser()
  } else {
    let options = {
      url: "https://discord.com/api/v8/oauth2/token",
      form: {
        grant_type: "refresh_token",
        client_id: "791329045932802049",
        client_secret: discordSecret,
        refresh_token: rtoken
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      json: true
    }
    request.post(options, function (error, response, body) {
      if (error || !response.body.access_token || !response.body.refresh_token) {
        console.error(error)
        return res.status(400).json({error: "Invalid token", logout: true})
      }
      req.auth.token = `${response.body.token_type} ${response.body.access_token}`
      req.auth.rtoken = response.body.refresh_token
      req.auth.expires = new Date(new Date().getTime() + 604600 * 1000).getTime()
      req.auth.refreshed = true
      getUser()
    })
  }
}

const testConnection = () => {
  try {
    var connection = mysql.createConnection({
      host: functions.config().tumbledmtg.mysqlhost,
      user: functions.config().tumbledmtg.mysqluser,
      password: functions.config().tumbledmtg.mysqlpassword,
      database: "servatrice"
    })

    connection.connect()
    return connection
  } catch (err) {
    console.error(err)
    return null
  }
}

const Return = (req, res, data) => {
  if (req.auth.refreshed) {
    return res.json({success: "Success", refreshed: true, token: req.auth.token, expires: req.auth.expires, rtoken: req.auth.rtoken, ...data})
  } else {
    return res.json({success: "Success", ...data})
  }
}

module.exports = {challongekey, db, validateUser, admin, testConnection, Return, discordSecret, password, sendMessage}
