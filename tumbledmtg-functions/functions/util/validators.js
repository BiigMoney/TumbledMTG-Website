const allowedPunctuation = "._-"
const allowedCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVQXYZ1234567890-._"
const {admin} = require("./admin")

exports.validateUsername = (username) => {
	let errors = []
	if(!username){
		return ["Invalid username"]
	}

	if(username.length < 3){
		errors.push("Username cannot be shorter than 3 characters")
	}

	if(username.length > 25){
		errors.push("Username cannot be greater than 25 characters")
	}

	if(allowedPunctuation.includes(username.charAt(0))){
		errors.push("Username cannot start with punctuation")
	}

	let i = username.length 
	while(i--){
		if(!allowedCharacters.includes(username.charAt(i))){
			errors.push("Username has invalid characters")
		}
	}
	return errors
}

exports.validateDecklist = (newDecklist) => {
    let errors = []

    if(isEmpty(newDecklist.author)){
        newDecklist.author = "Anonymous"
    }
    if(newDecklist.author.length >= 20){
        errors.push("Author must be less than 20 characters")
    }
    if(isEmpty(newDecklist.title)){
        errors.push("Title cannot be empty.")
    }
    if(newDecklist.title.length >= 30){
        errors.push("Title must be less than 30 characters")
    }
    if(newDecklist.description.length >= 500){
        errors.push("Description must be less than 500 characters")
    }
    if(newDecklist.body.length >= 3000){
        errors.push("Decklist must be less than 3000 characters")
    }

    const body = newDecklist.body 
    const lines = body.split("\n");
    if(lines.length === 0){
        errors.push("Decklist body cannot be empty.")
        return false
    }

    const projectDatabase = admin.database()
    return projectDatabase.ref().child('cards').get().then(snap => {
	const fbCards = snap.val().card
	var count = 0
	var SBcount = 0
	for(var i = 0; i < lines.length; i++){
	if(lines[i].charAt(0) == "/" && lines[i].charAt(1) == "/"){
		continue
	}
	if(isEmpty(lines[i])){
		continue
	}
	const words = lines[i].split(" ")
	var string = ""
	var j = 1
	if(words[0] == "SB:"){
		j = 2
		SBcount += parseInt(words[j-1])
	} else {
		count += parseInt(words[j-1])
	}
	for(var l = j; l < words.length; l++){
		string += words[l] + " "
	}
	string = string.substring(0, string.length - 1);
	var lol = false
	for(var card = 0; card < fbCards.length; card++){
		lol = false
		if(fbCards[card].name == string){
		lol = true
		const manacost = fbCards[card].manacost
		if(isEmpty(manacost)){
			break
		}
		let colors = ""
		for(var m = 0; m < manacost.length; m++){
			let mana = manacost.charAt(m).toLowerCase()
			switch(mana){
			case "w":
				if(!colors.includes("w")){
				colors+="w"
				}
				break
			case "u":
				if(!colors.includes("u")){
				colors+="u"
				}
				break
			case "b":
				if(!colors.includes("b")){
				colors+="b"
				}
				break
			case "r":
				if(!colors.includes("r")){
				colors+="r"
				}
				break
			case "g":
				if(!colors.includes("g")){
				colors+="g"
				}
				break
			}
		}
		for(let c = 0; c < colors.length; c++){
			let color = colors.charAt(c).toLowerCase()
			switch(color){
			case "w":
				newDecklist.colors[0] = newDecklist.colors[0]+parseInt(words[j-1]);
				break
			case "u":
				newDecklist.colors[1] = newDecklist.colors[1]+parseInt(words[j-1]);
				break
			case "b":
				newDecklist.colors[2] = newDecklist.colors[2]+parseInt(words[j-1]);
				break
			case "r":
				newDecklist.colors[3] = newDecklist.colors[3]+parseInt(words[j-1]);
				break
			case "g":
				newDecklist.colors[4] = newDecklist.colors[4]+parseInt(words[j-1]);
				break
			}
		}
		break
		}
	}
	if(!lol){
		errors.push("Invalid card on line " + (i+1))
	}
	}
	if(count < 60){
		errors.push("Decklist must have at least 60 cards")
	}
	if(SBcount > 15){
		errors.push("Sideboard cannot have more than 15 cards")
	}
	let total = 0;
	newDecklist.colors.forEach(color =>{
		total += color
	})
	newDecklist.colors[0] = newDecklist.colors[0] / total
	newDecklist.colors[1] = newDecklist.colors[1] / total
	newDecklist.colors[2] = newDecklist.colors[2] / total
	newDecklist.colors[3] = newDecklist.colors[3] / total
	newDecklist.colors[4] = newDecklist.colors[4] / total
	return errors
    });
}

function isEmpty(string){
    return (!string || 0 === string.length);
}