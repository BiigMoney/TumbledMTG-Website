const {db, admin, testConnection, Return, discordsecret, challongekey, password, sendMessage} = require("./admin")
const {validateDecklist} = require("./validators")
const request = require("request")
const {v4: uuid} = require("uuid")

exports.callback = (req, res) => {
  let code = req.query.code
  if (code) {
    let options = {
      url: "https://discord.com/api/v8/oauth2/token",
      form: {
        code: code,
        redirect_uri: `https://us-central1-tumbledmtg-website.cloudfunctions.net/api/callback`,
        grant_type: "authorization_code",
        client_id: "791329045932802049",
        client_secret: discordsecret,
        scope: "identify"
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      json: true
    }
    request.post(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        let fullToken = `${response.body.token_type} ${response.body.access_token}`
        let rtoken = response.body.refresh_token
        let dataOptions = {
          url: "https://discord.com/api/users/@me",
          headers: {
            authorization: fullToken
          },
          json: true
        }
        request.get(dataOptions, function (error, response, body) {
          let fullName = response.body.username + "%23" + response.body.discriminator
          if (!error && response.statusCode === 200) {
            db.collection("users")
              .where("id", "==", response.body.id)
              .get()
              .then(snap => {
                if (snap.size === 0) {
                  res.redirect(`http://tumbledmtg.com/hqpERZ7PVMms6atWuC09?account=false&token=${fullToken}&id=${response.body.id}&name=${fullName}&pic=${response.body.avatar}&rtoken=${rtoken}`)
                } else {
                  let firebaseToken = ""
                  snap.forEach(snapShot => (firebaseToken = snapShot.id))
                  res.redirect(`http://tumbledmtg.com/hqpERZ7PVMms6atWuC09?account=true&token=${fullToken}&pic=${response.body.avatar}&rtoken=${rtoken}&id=${response.body.id}&fid=${firebaseToken}`)
                }
              })
              .catch(err => {
                console.error(err)
                let error = "Server error"
                return res.redirect(`http://tumbledmtg.com/hqpERZ7PVMms6atWuC09?error=${error}`)
              })
          } else {
            let error = "Invalid data fetch"
            res.redirect(`http://tumbledmtg.com/hqpERZ7PVMms6atWuC09?error=${error}`)
          }
        })
      } else {
        let error = "Invalid token fetch"
        res.redirect(`http://tumbledmtg.com/hqpERZ7PVMms6atWuC09?error=${error}`)
      }
    })
  }
}

exports.uploadDecklist = async (req, res) => {
  let newDecklist = {
    author: req.body.author,
    body: req.body.body,
    createdAt: new Date().toISOString(),
    description: req.body.description,
    stars: 0,
    title: req.body.title,
    colors: [0, 0, 0, 0, 0]
  }
  if (req.body.duplex) {
    newDecklist.duplex = true
  }
  let errors = await validateDecklist(newDecklist)
  if (errors.length > 0) {
    return res.status(400).json({errors, error: "Invalid decklist"})
  }

  newDecklist.uploadId = req.user.id
  const batch = db.batch()
  var newDecklistRef = db.collection("decklists").doc()
  batch.set(newDecklistRef, newDecklist)
  newDecklist.id = newDecklistRef.id
  batch
    .commit()
    .then(() => {
      sendMessage(`**${newDecklist.title}**\nby: ${newDecklist.author}\n<https://tumbledmtg.com/decklist=${newDecklist.id}>`)
      Return(req, res, {decklist: newDecklist})
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: "Error adding decklist"})
    })
}

exports.uploadDecklistAdmin = async (req, res) => {
  if (password !== req.body.password) {
    return res.status(401).json({error: "Incorrect password"})
  }
  let newDecklist = {
    author: req.body.author,
    body: req.body.body,
    createdAt: new Date().toISOString(),
    description: req.body.description,
    stars: 0,
    title: req.body.title,
    colors: [0, 0, 0, 0, 0],
    uploadId: req.body.id
  }
  await validateDecklist(newDecklist)
  const batch = db.batch()
  var newDecklistRef = db.collection("decklists").doc()
  batch.set(newDecklistRef, newDecklist)
  newDecklist.id = newDecklistRef.id
  batch
    .commit()
    .then(() => {
      sendMessage(`**${newDecklist.title}**\nby: ${newDecklist.author}\n<https://tumbledmtg.com/decklist=${newDecklist.id}>`)
      return res.json({success: "Success", decklist: newDecklist})
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: "Error adding decklist"})
    })
}

exports.getReplays = (req, res) => {
  db.collection("replays")
    .orderBy("id", "desc")
    .limit(100)
    .get()
    .then(data => {
      let replayList = []
      data.forEach(doc => {
        replayList.push(doc.data())
      })
      return res.json(replayList)
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: "Error fetching data."})
    })
}

exports.getTournaments = (req, res) => {
  let options = {
    url: `https://api.challonge.com/v1/tournaments.json?api_key=${challongekey}`,
    headers: {
      "Content-Type": "application/json"
    },
    json: true
  }
  request.get(options, function (error, response, body) {
    return res.json(response)
  })
}

exports.getTournament = (req, res) => {
  const tournamentId = req.params.tourneyId

  const tourneyurl = `https://api.challonge.com/v1/tournaments/${tournamentId}.json?api_key=${challongekey}`
  const participanturl = `https://api.challonge.com/v1/tournaments/${tournamentId}/participants.json?api_key=${challongekey}`

  let data = {}
  let options1 = {
    url: tourneyurl,
    headers: {
      "Content-Type": "application/json"
    },
    json: true
  }
  let options2 = {
    url: participanturl,
    headers: {
      "Content-Type": "application/json"
    },
    json: true
  }
  request.get(options1, function (error, response, body) {
    if (error) {
      return res.status(500).json({error: "Error getting data"})
    }
    if (body.tournament.description.length !== 0) {
      data.description = JSON.parse(body.tournament.description.replace(/<[^>]*>?/gm, ""))
    }
    data.tournament = body.tournament
    if (data.participants) {
      return res.json(data)
    }
  })
  request.get(options2, function (error, response, body) {
    if (error) {
      return res.status(500).json({error: "Error getting data"})
    }
    data.participants = body
    if (data.tournament) {
      return res.json(data)
    }
  })
}

exports.getDecklists = (req, res) => {
  db.collection("decklists")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let decklists = []
      data.forEach(doc => {
        let lol = {
          decklistId: doc.id,
          author: doc.data().author,
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          description: doc.data().description,
          stars: doc.data().stars,
          title: doc.data().title,
          colors: doc.data().colors,
          uploadId: doc.data().uploadId
        }
        if (doc.data().duplex) {
          lol.duplex = true
        }
        decklists.push(lol)
      })
      return res.json(decklists)
    })
    .catch(err => {
      console.error(err)
    })
}

exports.getCards = (req, res) => {
  admin
    .database()
    .ref()
    .child("cards")
    .get()
    .then(snap => {
      return res.json(snap.val().card)
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: "Could not get cards"})
    })
}

exports.getCard = (req, res) => {
  let search = req.params.cardName
  admin
    .database()
    .ref()
    .child("cards")
    .get()
    .then(snap => {
      return res.json(snap.val().card.find(card => card.name === search))
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: "Could not get card"})
    })
}

exports.getDecklist = (req, res) => {
  let decklistData = {}
  db.doc(`/decklists/${req.params.decklistId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({error: "Decklist does not exist"})
      }
      decklistData = doc.data()
      decklistData.decklistId = doc.id
      return res.json(decklistData)
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: "Could not get decklist"})
    })
}

exports.tourneyResults = (req, res) => {
  if (password !== req.body.password) {
    return res.status(401).json({error: "Incorrect password"})
  }
  let newtournament = {
    place: req.body.placement,
    entrants: req.body.participants,
    decklistUsed: req.body.decklist,
    date: req.body.date,
    url: req.body.url
  }
  db.collection("users")
    .where("id", "==", req.body.id)
    .get()
    .then(snap => {
      if (snap.size === 1) {
        snap.forEach(doc => {
          doc.ref
            .update({tournaments: admin.firestore.FieldValue.arrayUnion(newtournament)})
            .then(() => {
              return res.json({success: "Updated successfully"})
            })
            .catch(err => {
              console.error(err)
              return res.status(500).json({error: "Error updating data"})
            })
        })
      } else {
        return res.status(400).json({error: "User does not exist."})
      }
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: "Error getting firebase data."})
    })
}

exports.decklistsByUser = (req, res) => {
  db.collection("decklists")
    .where("uploadId", "==", req.params.userId)
    .orderBy("createdAt", "desc")
    .get()
    .then(snap => {
      let decklists = []
      snap.forEach(doc => {
        let lol = {
          decklistId: doc.id,
          author: doc.data().author,
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          description: doc.data().description,
          stars: doc.data().stars,
          title: doc.data().title,
          colors: doc.data().colors,
          uploadId: doc.data().uploadId
        }
        if (doc.data().duplex) {
          lol.duplex = true
        }
        decklists.push(lol)
      })
      return res.json(decklists)
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: "Error getting data"})
    })
}

exports.deleteDecklist = (req, res) => {
  if (password !== req.headers.password) {
    return res.status(401).json({error: "Incorrect password"})
  }
  db.doc(`/decklists/${req.params.decklistid}`)
    .delete()
    .then(() => {
      return res.json({success: "Successfully deleted decklist."})
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: "Error deleting decklist"})
    })
}

exports.addStars = (req, res) => {
  if (password !== req.body.password) {
    return res.status(401).json({error: "Incorrect password"})
  }
  let decklistStars = 0
  db.doc(`/decklists/${req.params.decklistId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({error: "Decklist does not exist"})
      }
      decklistStars = parseInt(doc.data().stars)
      decklistStars += parseInt(req.body.inc)
      db.doc(`/decklists/${req.params.decklistId}`)
        .update({
          stars: decklistStars
        })
        .then(() => {
          return res.json({success: "Successfully updated star count"})
        })
        .catch(() => {
          return res.status(500).json({error: "Error updating stars"})
        })
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: "Error getting decklist"})
    })
}

exports.uploadReplay = (req, res) => {
  if (password !== req.body.password) {
    return res.status(401).json({error: "Incorrect password"})
  }
  let replay = req.body.replay.data ? Buffer.from(req.body.replay.data) : req.body.replay
  let generatedToken = uuid()
  admin
    .storage()
    .bucket("tumbledmtg-website")
    .file(`replay_${req.body.id}.cor`)
    .save(replay, {
      resumable: false,
      metadata: {
        metadata: {
          firebaseStorageDownloadTokens: generatedToken
        }
      }
    })
    .then(() => {
      const url = `https://firebasestorage.googleapis.com/v0/b/tumbledmtg-website/o/replay_${req.body.id}.cor?alt=media&token=${generatedToken}`
      let replayData = {
        id: req.body.id,
        url: url,
        duration: req.body.duration,
        host: req.body.host,
        lobbyName: req.body.lobbyName,
        createdAt: new Date().toISOString()
      }
      db.collection("replays")
        .add(replayData)
        .then(() => {
          return res.json({success: "success"})
        })
    })
}

exports.testDecklist = async (req, res) => {
  var newDecklist = {
    author: req.body.author,
    body: req.body.body,
    createdAt: new Date().toISOString(),
    description: req.body.description,
    stars: 0,
    title: req.body.title,
    colors: [0, 0, 0, 0, 0]
  }
  let errors = await validateDecklist(newDecklist)
  if (errors.length > 0) {
    return res.status(400).json({errors, error: "Invalid decklist"})
  } else {
    return res.json({success: "Decklist is valid!"})
  }
}

exports.checkDecklist = (req, res) => {
  db.doc(`/decklists/${req.params.decklistId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({error: "Decklist does not exist"})
      } else {
        let body = doc.data().body
        let lines = body.split("\n")
        const projectDatabase = admin.database()
        const tempcards = projectDatabase.ref().child("cards")
        tempcards.on("value", snap => {
          const fbCards = snap.val().card
          let names = fbCards.map(e => e.name)
          for (var i = 0; i < lines.length; i++) {
            if (lines[i].charAt(0) == "/" && lines[i].charAt(1) == "/") {
              continue
            }
            if (!lines[i] || 0 === lines[i].length) {
              continue
            }
            const words = lines[i].split(" ")
            var string = ""
            var j = 1
            if (words[0] == "SB:") {
              j = 2
            }
            for (var l = j; l < words.length; l++) {
              string += words[l] + " "
            }
            string = string.substring(0, string.length - 1)
            let index = names.indexOf(string)
            if (index === -1) {
              return res.status(400).json({error: "Decklist contains invalid cards.", card: string})
            }
          }
          return res.json({success: "success"})
        })
      }
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({error: "Error getting data."})
    })
}
