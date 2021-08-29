const functions = require("firebase-functions")
var cors = require("cors")
const {validateUser} = require("./util/admin")
const express = require("express")
const {deleteUser, updateUsername, resetPassword, getUser, checkLogin, createUser} = require("./util/users")
const {uploadDecklist, uploadDecklistAdmin, getReplays, getTournaments, getTournament, getDecklists, getCards, callback, getDecklist, tourneyResults, decklistsByUser, deleteDecklist, addStars, uploadReplay, testDecklist, checkDecklist} = require("./util/data")
const app = express()

app.use(cors())

app.get("/callback", callback)

app.post("/createUser", createUser)

app.get("/tournaments", getTournaments)

app.get("/tournament/:tourneyId", getTournament)

app.get("/replays", getReplays)

app.post("/resetPassword", resetPassword)

app.post("/updateUsername", validateUser, updateUsername)

app.post("/deleteUser", validateUser, deleteUser)

app.get("/user/:userId", getUser)

app.get("/decklists", getDecklists)

app.get("/cards", getCards)

app.get("/decklists/:decklistId", getDecklist)

app.post("/tourneyResults", tourneyResults)

app.get("/decklistsByUser/:userId", decklistsByUser)

app.delete("/deldecklist/:decklistId", deleteDecklist)

app.put("/stars/:decklistId", addStars)

app.post("/uploadReplay", uploadReplay)

app.post("/decklist", validateUser, uploadDecklist)

app.post("/decklistAdmin", uploadDecklistAdmin)

app.post("/testdecklist", testDecklist)

app.get("/validateDecklist/:decklistId", checkDecklist)

app.get("/checkLogin", validateUser, checkLogin)

exports.api = functions.https.onRequest(app)
