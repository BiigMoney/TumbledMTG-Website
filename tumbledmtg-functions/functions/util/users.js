const {db, admin, testConnection, Return, challongekey, password} = require("./admin")
var moment = require("moment")
const {validateUsername, validatePassword} = require("./validators")
const request = require("request")
const momenttz = require("moment-timezone")

function getTournaments(id, name) {
  admin
    .firestore()
    .collection("users")
    .where("id", "==", id)
    .get()
    .then(snap => {
      if (snap.size === 1) {
        snap.forEach(doc => {
          const url = `https://api.challonge.com/v1/tournaments.json?api_key=${challongekey}`
          request.get({url, json: true}, (error, res, body) => {
            if (error) {
              console.error(error)
              return
            }
            let tournaments = body
            let total = 0
            let current = 0
            tournaments.forEach(({tournament}) => {
              if (tournament.state != "complete") {
                return
              }
              let description = JSON.parse(tournament.description.replace(/<[^>]*>?/gm, ""))
              const participanturl = `https://api.challonge.com/v1/tournaments/${tournament.id}/participants.json?api_key=${challongekey}`
              request.get({url: participanturl, json: true}, (error, res, body) => {
                if (error) {
                  console.error(error)
                  return
                }
                let participants = body
                participants.forEach(({participant}) => {
                  if (name === participant.name) {
                    total++
                    let newtournament = {
                      place: participant.final_rank,
                      entrants: tournament.participants_count,
                      decklistUsed: description.filter(a => a.name === participant.name)[0].decklist,
                      date: momenttz.tz(tournament.start_at, "America/Los_Angeles").format().split("T")[0],
                      url: tournament.full_challonge_url
                    }
                    doc.ref.update({tournaments: admin.firestore.FieldValue.arrayUnion(newtournament)}).then(() => {
                      current++
                      if (total === current) {
                        sortTournaments(id)
                      }
                    })
                  }
                })
              })
            })
          })
        })
      }
    })
}

function sortTournaments(id) {
  admin
    .firestore()
    .collection("users")
    .where("id", "==", id)
    .get()
    .then(snap => {
      if (snap.size === 1) {
        snap.forEach(doc => {
          let {tournaments} = doc.data()
          tournaments.sort((a, b) => (a.date > b.date ? 1 : b.date > a.date ? -1 : 0))
          doc.ref.update({tournaments})
        })
      }
    })
}

exports.createUser = (req, res) => {
  let errors = validateUsername(req.body.username)
  if (errors.length > 0) {
    return res.status(400).json({error: errors[0]})
  }
  errors = validatePassword(req.body.password, req.body.confirmpassword)
  if (errors.length > 0) {
    return res.status(400).json({error: errors[0]})
  }

  let dataOptions = {
    url: "https://discord.com/api/users/@me",
    headers: {
      authorization: req.headers.token
    },
    json: true
  }
  request.get(dataOptions, function (error, response, body) {
    if (error || !response.body.id || !response.body.username || !response.body.discriminator) {
      return res.status(400).json({error: "Something went wrong.", logout: true})
    }
    let newUser = {
      username: req.body.username,
      id: response.body.id,
      discordName: `${response.body.username}#${response.body.discriminator}`,
      createdAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      tournaments: []
    }
    db.collection("users")
      .where("username", "==", req.body.username)
      .get()
      .then(snap => {
        if (snap.size === 0) {
          let password = sha512(req.body.password, false)

          var connection = testConnection()
          if (!connection) {
            return res.status(500).json({error: "Error connecting to database, please try again later."})
          }

          connection.query(`insert into servatrice.cockatrice_users (admin,name,password_sha512,active,realname,gender,email,country,avatar_bmp,registrationDate,clientid,privlevelStartDate,privlevelEndDate) values (0,'${newUser.username}','${password}',1,'NA','N','NA','AA','NA','${newUser.createdAt}','NA','2221-01-01 00:00:01','2221-01-01 00:00:02');`, (error, response, fields) => {
            if (error) {
              console.error(error)
              return res.status(500).json({error: "Error connecting to database, please try again later."})
            }
            db.collection("users")
              .add(newUser)
              .then(doc => {
                getTournaments(newUser.id, newUser.discordName)
                newUser.firebaseId = doc.id
                return res.json({success: "Success", user: newUser})
              })
              .catch(err => {
                console.error(err)
                return res.status(500).json({error: err})
              })
          })
          connection.end()
        } else {
          return res.status(404).json({error: "Username has already been taken."})
        }
      })
      .catch(err => {
        console.error(err)
        return res.status(500).json({error: "Firebase fetch error, please try again."})
      })
  })
}

exports.deleteUser = (req, res) => {
  var connection = testConnection()
  if (!connection) {
    return res.status(500).json({error: "Error connecting to database, please try again later."})
  }
  connection.query(`delete from cockatrice_users where name="${req.user.username}";`, (error, response, fields) => {
    if (error) {
      console.error(error)
      return res.status(404).json({error: "Error connecting to database, please try again later."})
    }
    db.doc(`/users/${req.userRef.id}`)
      .delete()
      .then(() => {
        Return(req, res, {})
      })
      .catch(err => {
        console.error(err)
        return res.status(500).json({error: err})
      })
  })
  connection.end()
}

exports.updateUsername = (req, res) => {
  let errors = validateUsername(req.body.newUsername)
  if (errors.length > 0) {
    return res.status(400).json({error: "Invalid username", errors})
  }

  var connection = testConnection()
  if (!connection) {
    return res.status(500).json({error: "Error connecting to database, please try again later."})
  }
  connection.query(`UPDATE cockatrice_users SET name="${req.body.newUsername}" where name="${req.user.username}";`, (error, response, fields) => {
    if (error) {
      console.error(error)
      return res.status(404).json({error: "Error connecting to database, please try again later."})
    }
    db.doc(`/users/${req.userRef.id}`)
      .update({username: req.body.newUsername})
      .then(() => {
        Return(req, res, {})
      })
      .catch(err => {
        console.error(err)
        return res.status(500).json({error: err})
      })
  })
  connection.end()
}

exports.resetPassword = (req, res) => {
  if (password !== req.body.password) {
    return res.status(401).json({error: "Incorrect password."})
  }
  db.collection("users")
    .where("id", "==", req.body.id)
    .get()
    .then(snap => {
      if (snap.size === 1) {
        let username = ""
        snap.forEach(snapshot => (username = snapshot.data().username))
        if (username === req.body.username) {
          let newpassword = sha512(req.body.newPassword, false)
          var connection = testConnection()
          if (!connection) {
            return res.status(500).json({error: "Error connecting to database, please try again later."})
          }

          connection.query(`update cockatrice_users set password_sha512="${newpassword}" where name="${username}"`, function (error, response, body) {
            if (error) {
              console.error(error)
              return res.status(500).json({error: "MYSQL update error"})
            }
            return res.json({success: "Password has successfully been updated."})
          })
          connection.end()
        } else {
          return res.status(400).json({error: "Incorrect username"})
        }
      } else {
        return res.status(400).json({error: "You do not have an account."})
      }
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: "Firebase fetch error."})
    })
}

exports.getUser = (req, res) => {
  let userData = {}
  db.collection("users")
    .where("id", "==", req.params.userId)
    .get()
    .then(snap => {
      if (snap.size === 1) {
        let data = snap.docs[0].data()
        userData.createdAt = data.createdAt
        userData.discordName = data.discordName
        userData.username = data.username
        userData.decklists = []
        userData.tournaments = data.tournaments.slice(-5)
        return db.collection("decklists").where("uploadId", "==", req.params.userId).orderBy("createdAt", "desc").limit(5).get()
      } else {
        return res.status(400).json({error: "User does not exist"})
      }
    })
    .then(snapshot => {
      snapshot.forEach(decklist => {
        userData.decklists.push({...decklist.data(), decklistId: decklist.id})
      })
      return res.json(userData)
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: "Firebase fetch error, please try again."})
    })
}

exports.checkLogin = (req, res) => {
  Return(req, res, {avatar: req.user.avatar})
}

function sha512(password, salted) {
  var crypto = require("crypto")
  let salt = ""
  if (!salted) {
    let saltChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    for (let i = 0; i < 16; i++) {
      salt += saltChars.charAt(Math.random() * saltChars.length - 1)
    }
  } else {
    salt = salted
  }
  let key = salt + password
  for (let i = 0; i < 1000; ++i) {
    key = crypto.createHash("sha512").update(key).digest()
  }
  return salt + key.toString("base64")
}
