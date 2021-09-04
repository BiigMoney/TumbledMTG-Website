import React from "react"
import queryString from "query-string"
import {Link} from "react-router-dom"
import SearchBar from "./SearchBar"
import axios from "axios"

class CardList extends React.Component {
  cardsPerPage = 40

  state = {
    isLoading: true,
    fbCards: null,
    allCards: [],
    cards: [],
    pgNum: null,
    searchTerm: "",
    currentSearch: ""
  }

  pgUp = () => {
    let path = queryString.parse(window.location.pathname)
    let {searchTerm, pgNum, fbCards} = this.state
    this.setState({
      cards: [],
      isLoading: true,
      pgNum: parseInt(pgNum) + 1
    })
    if ((path["/search"] === "null" && searchTerm.length === 0) || (path["/search"].length === 0 && searchTerm.length === 0)) {
      this.getFromAll(fbCards, parseInt(pgNum) + 1)
    } else if (path["/search"] !== undefined) {
      this.handleSearch(path["/search"], parseInt(pgNum) + 1, fbCards)
    }
  }

  pgDown = () => {
    let path = queryString.parse(window.location.pathname)
    let {searchTerm, pgNum, fbCards} = this.state
    this.setState({
      cards: [],
      isLoading: true,
      pgNum: parseInt(pgNum) - 1
    })
    if ((path["/search"] === "null" && searchTerm.length === 0) || (path["/search"].length === 0 && searchTerm.length === 0)) {
      this.getFromAll(fbCards, parseInt(pgNum) - 1)
    } else if (path["/search"] !== undefined) {
      this.handleSearch(path["/search"], parseInt(pgNum) - 1, fbCards)
    }
  }

  onChange = event => {
    this.setState({searchTerm: event.target.value.replace("+", "%2B")})
  }

  disableSubmit = () => {
    let path = queryString.parse(window.location.pathname)
    let {searchTerm} = this.state
    this.setState({
      pgNum: 1,
      currentSearch: path["/search"]
    })
    if ((path["/search"] === "null" && searchTerm.length === 0) || (path["/search"].length === 0 && searchTerm.length === 0)) {
      this.getFromAll(this.state.fbCards, 1)
    }
  }

  getColorNum = a => {
    let rank = 0
    if (a.includes("W")) {
      rank += 10000
    }
    if (a.includes("U")) {
      rank += 1000
    }
    if (a.includes("B")) {
      rank += 100
    }
    if (a.includes("R")) {
      rank += 10
    }
    if (a.includes("G")) {
      rank += 1
    }
    return rank
  }

  getFromAll(cards, pgNum) {
    let cardArr = []

    const startidx = (pgNum - 1) * this.cardsPerPage
    const endidx = this.cardsPerPage + (pgNum - 1) * this.cardsPerPage
    if (endidx < cards.length) {
      for (var i = startidx; i < endidx; i++) {
        const card = cards[i]
        card["url"] = `https://firebasestorage.googleapis.com/v0/b/tumbledmtg-website.appspot.com/o/${encodeURI(card.name)}.jpg?alt=media`
        cardArr.push(card)
      }
    } else {
      for (var j = startidx; j < cards.length; j++) {
        const card = cards[j]
        card["url"] = `https://firebasestorage.googleapis.com/v0/b/tumbledmtg-website.appspot.com/o/${encodeURI(card.name)}.jpg?alt=media`
        cardArr.push(card)
      }
    }

    this.setState({cards: cardArr, isLoading: false})
  }

  handleSearch = (search, pgNum, fbCards) => {
    if (search.length === 0 || search === null) {
      return
    }
    var tempCards = []
    var words = search.split(" ")
    var keywords = []
    var values = []
    var searchwords = []
    var validKeyWords = ["cmc", "o", "t", "c", "-o", "power", "toughness", "type", "p", "-c", "-t", "-type", "is", "mv"]
    words.forEach(word => {
      if (!word.includes(":")) {
        searchwords.push(word)
      } else {
        var halfs = word.split(":")
        halfs[0] === "mv" ? keywords.push("cmc") : keywords.push(halfs[0])
        values.push(halfs[1])
      }
    })
    keywords.forEach(keyword => {
      if (!validKeyWords.includes(keyword)) {
        values.splice(keywords.indexOf(keyword), 1)
        keywords.splice(keywords.indexOf(keyword), 1)
      }
    })
    if (keywords.length === 0 && searchwords.length === 0) {
      this.getFromAll([], pgNum)
      return
    }
    fbCards.forEach(card => {
      var valid = true
      const title = card.name
      const colors = card.color.toLowerCase()
      const type = card.type.toLowerCase()

      searchwords.forEach(word => {
        if (!title.toLowerCase().includes(word.toLowerCase())) {
          valid = false
        }
      })
      if (!valid) {
        return
      }
      for (var i = 0; i < keywords.length; i++) {
        try {
          switch (keywords[i]) {
            case "cmc":
              const cmc = card.cmc
              switch (values[i].charAt(0)) {
                case ">":
                  if (!(cmc > values[i].substring(1))) {
                    valid = false
                  }
                  break
                case "<":
                  if (!(cmc < values[i].substring(1))) {
                    valid = false
                  }
                  break
                case "=":
                  if (!(cmc.toString() === values[i].substring(1))) {
                    valid = false
                  }
                  break
                default:
                  if (!isNaN(values[i])) {
                    if (!(cmc.toString() === values[i])) {
                      valid = false
                    }
                    break
                  } else {
                    valid = false
                  }
              }
              break
            case "-c":
              for (var j = 0; j < values[i].length; j++) {
                if (colors.includes(values[i].charAt(j).toLowerCase())) {
                  valid = false
                  break
                }
              }
              break
            case "c":
              if (values[i].charAt(0) === "=") {
                for (var l = 1; l < values[i].length; l++) {
                  if (!colors.includes(values[i].charAt(l).toLowerCase())) {
                    valid = false
                    break
                  }
                }
                if (colors.includes("h")) {
                  break
                }
                if (colors.length !== values[i].length && colors.length !== 1) {
                  valid = false
                  break
                }
                break
              } else if (values[i].charAt(0) === "+") {
                let test = false
                let validcolours = values[i].substring(1).toLowerCase()
                for (var x = 0; x < validcolours.length; x++) {
                  if (colors.includes(validcolours[x]) && colors.includes("h")) {
                    test = true
                  }
                }
                if (test) {
                  break
                }
                validcolours += "hmc"
                for (var y = 0; y < colors.length; y++) {
                  if (!validcolours.includes(colors[y])) {
                    valid = false
                    break
                  }
                }
                break
              }
              for (var k = 0; k < values[i].length; k++) {
                if (!colors.includes(values[i].charAt(k).toLowerCase())) {
                  valid = false
                  break
                }
              }
              break
            case "-o":
              const text = card.text.toLowerCase()
              if (text.includes(values[i].toLowerCase())) {
                valid = false
              }
              break
            case "o":
              const text2 = card.text.toLowerCase()
              if (values[i].includes(",")) {
                var search = values[i].toLowerCase().replace(/,/g, " ")
                if ((search.charAt(0) === '"' && search.charAt(search.length - 1) === '"') || (search.charAt(0) === "'" && search.charAt(search.length - 1) === "'")) {
                  if (!text2.includes(search.substring(1, search.length - 1))) {
                    valid = false
                  }
                  break
                } else {
                  var owords = search.split(" ")
                  for (var owordscount = 0; owordscount < owords.length; owordscount++) {
                    if (!text2.includes(owords[owordscount])) {
                      valid = false
                      break
                    }
                  }
                  break
                }
              } else if (!text2.includes(values[i].toLowerCase())) {
                valid = false
              }
              break
            case "t":
              if (!type.includes(values[i].toLowerCase())) {
                valid = false
              }
              break
            case "type":
              if (!type.includes(values[i].toLowerCase())) {
                valid = false
              }
              break
            case "-t":
              if (type.includes(values[i].toLowerCase())) {
                valid = false
              }
              break
            case "-type":
              if (type.includes(values[i].toLowerCase())) {
                valid = false
              }
              break
            case "is":
              if (!card?.tags.toLowerCase().includes(values[i].toLowerCase())) {
                valid = false
              }
              break
            case "power":
              if (!card.pt) {
                valid = false
                break
              }
              const power = parseInt(card.pt.split("/")[0])
              switch (values[i].charAt(0)) {
                case ">":
                  if (!(power > values[i].substring(1))) {
                    valid = false
                  }
                  break
                case "<":
                  if (!(power < values[i].substring(1))) {
                    valid = false
                  }
                  break
                case "=":
                  if (!(power === values[i].substring(1))) {
                    valid = false
                  }
                  break
                default:
                  if (!isNaN(values[i])) {
                    if (!(power === values[i])) {
                      valid = false
                    }
                    break
                  } else {
                    valid = false
                  }
              }
              break
            case "toughness":
              if (!card.pt) {
                valid = false
                break
              }
              const toughness = parseInt(card.pt.split("/")[1])
              switch (values[i].charAt(0)) {
                case ">":
                  if (!(toughness > values[i].substring(1))) {
                    valid = false
                  }
                  break
                case "<":
                  if (!(toughness < values[i].substring(1))) {
                    valid = false
                  }
                  break
                case "=":
                  if (!(toughness === values[i].substring(1))) {
                    valid = false
                  }
                  break
                default:
                  if (!isNaN(values[i])) {
                    if (!(toughness === values[i])) {
                      valid = false
                    }
                    break
                  } else {
                    valid = false
                  }
              }
              break
            default:
              valid = false
          }
        } catch (err) {
          valid = false
        }
        if (!valid) {
          break
        }
      }
      if (!valid) {
        return
      }
      tempCards.push(card)
    })
    tempCards.sort((a, b) => {
      if (a.cmc === b.cmc) {
        if (this.getColorNum(a.color) === this.getColorNum(b.color)) {
          if (a?.type.includes("Land") === b?.type.includes("Land")) {
            return 0
          } else if (a?.type.includes("Land") && !b?.type.includes("Land")) {
            return 1
          } else {
            return -1
          }
        } else {
          return this.getColorNum(b.color) - this.getColorNum(a.color)
        }
      } else {
        return a.cmc - b.cmc
      }
    })

    let cards = []

    const startidx = (pgNum - 1) * this.cardsPerPage
    const endidx = this.cardsPerPage + (pgNum - 1) * this.cardsPerPage
    if (endidx < tempCards.length) {
      for (var i = startidx; i < endidx; i++) {
        const card = tempCards[i]
        card["url"] = `https://firebasestorage.googleapis.com/v0/b/tumbledmtg-website.appspot.com/o/${encodeURI(card.name)}.jpg?alt=media`
        cards.push(card)
      }
    } else {
      for (var j = startidx; j < tempCards.length; j++) {
        const card = tempCards[j]
        card["url"] = `https://firebasestorage.googleapis.com/v0/b/tumbledmtg-website.appspot.com/o/${encodeURI(card.name)}.jpg?alt=media`
        cards.push(card)
      }
    }

    this.setState({allCards: tempCards, currentSearch: search, cards, isLoading: false})
  }

  componentDidMount() {
    let path = queryString.parse(window.location.pathname)
    axios.get("/cards").then(res => {
      this.setState({fbCards: res.data, currentSearch: path["/search"], pgNum: path["pg"]})
      this.handleSearch(path["/search"], path["pg"], res.data)
    })
  }
  componentDidUpdate() {
    let path = queryString.parse(window.location.pathname)
    let {currentSearch, pgNum} = this.state
    if (!this.state.fbCards) {
      return
    }
    if (path["/search"] !== undefined && (path["/search"] !== currentSearch || pgNum !== path["pg"])) {
      this.setState({currentSearch: queryString.parse(window.location.pathname)["/search"], pgNum: queryString.parse(window.location.pathname)["pg"], cards: [], isLoading: true})
      this.handleSearch(queryString.parse(window.location.pathname)["/search"], queryString.parse(window.location.pathname)["pg"], this.state.fbCards)
    }
  }

  render() {
    return (
      <React.Fragment>
        <SearchBar onChange={this.onChange} searchTerm={this.state.searchTerm} onSubmit={this.disableSubmit} placeholder="search for cards..." thing="search" />
        <div className="needhelp" style={{textAlign: "center"}}>
          <a href="/advancedsearch">
            <button type="button" className="btn btn-dark">
              need help?
            </button>
          </a>
        </div>
        <div className="pagebuttons">
          {!this.state.isLoading && this.state.allCards.length > (parseInt(this.state.pgNum) - 1) * this.cardsPerPage && this.state.pgNum > 1 ? (
            <Link
              to={{
                pathname: `/search=${queryString.parse(this.props.location.pathname)["/search"].replace("+", "%2B")}&pg=${parseInt(this.state.pgNum) - 1}`
              }}
            >
              <button onClick={this.pgDown}>Previous Page</button>
            </Link>
          ) : (
            <button disabled>Previous Page</button>
          )}
          {!this.state.isLoading && this.state.allCards.length > this.cardsPerPage && Math.ceil(this.state.allCards.length / this.cardsPerPage) > this.state.pgNum ? (
            <Link
              to={{
                pathname: `/search=${queryString.parse(this.props.location.pathname)["/search"].replace("+", "%2B")}&pg=${parseInt(this.state.pgNum) + 1}`
              }}
            >
              <button onClick={this.pgUp}>Next Page</button>
            </Link>
          ) : (
            <button disabled>Next Page</button>
          )}
        </div>
        <div className="bigcard">{!this.state.isLoading && this.state.cards.length === 0 ? <header>Could not find any cards</header> : <div></div>}</div>
        <div className="container">
          <div className="row">
            {!this.state.isLoading &&
              this.state.cards.map(card => {
                return (
                  <div key={card.name} className="col-md-3" style={{marginBottom: "2rem"}}>
                    <div className="imageList__container">
                      <p>
                        <Link
                          to={{
                            pathname: `/card=${card.name}`
                          }}
                        >
                          <img className="imageList__image" src={card.url} alt="cantfind" />
                        </Link>
                      </p>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
        {this.state.cards.length > 8 ? (
          <div className="pagebuttons">
            {!this.state.isLoading && this.state.allCards.length > (parseInt(this.state.pgNum) - 1) * this.cardsPerPage && this.state.pgNum > 1 ? (
              <Link
                to={{
                  pathname: `/search=${queryString.parse(this.props.location.pathname)["/search"].replace("+", "%2B")}&pg=${parseInt(this.state.pgNum) - 1}`
                }}
              >
                <button onClick={this.pgDown}>Previous Page</button>
              </Link>
            ) : (
              <button disabled>Previous Page</button>
            )}
            {!this.state.isLoading && this.state.allCards.length > this.cardsPerPage && Math.ceil(this.state.allCards.length / this.cardsPerPage) > this.state.pgNum ? (
              <Link
                to={{
                  pathname: `/search=${queryString.parse(this.props.location.pathname)["/search"].replace("+", "%2B")}&pg=${parseInt(this.state.pgNum) + 1}`
                }}
              >
                <button onClick={this.pgUp}>Next Page</button>
              </Link>
            ) : (
              <button disabled>Next Page</button>
            )}
          </div>
        ) : null}
      </React.Fragment>
    )
  }
}

export default CardList
