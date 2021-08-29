import {Component} from "react"
import axios from "axios"
import {Link} from "react-router-dom"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import SearchBar from "./SearchBar"
import queryString from "query-string"
import star4 from "../resources/4_stars.png"
import star3 from "../resources/3_stars.png"
import star2 from "../resources/2_stars.png"
import star1 from "../resources/1_stars.png"
import DecklistsSkeleton from "./DecklistsSkeleton"

class Decklists extends Component {
  decklistsPerPage = 30

  state = {
    decklists: [],
    allDecklists: [],
    isLoading: true,
    pgNum: 0,
    searchTerm: ""
  }

  onChange = event => {
    this.setState({searchTerm: event.target.value})
  }

  disableSubmit = () => {
    let path = queryString.parse(window.location.pathname)
    let {searchTerm} = this.state
    if ((path["/decklists"] === "null" && searchTerm.length === 0) || (path["/decklists"].length === 0 && searchTerm.length === 0)) {
      return
    }
    this.setState({
      decklists: [],
      isLoading: true,
      pgNum: 1
    })
    if (path["/decklists"] !== undefined) {
      this.handleSearch(path["/decklists"])
    }
  }

  pgUp = () => {
    let path = queryString.parse(window.location.pathname)
    this.setState({
      decklists: [],
      isLoading: true,
      pgNum: parseInt(this.state.pgNum) + 1
    })
    if (path["/decklists"] !== undefined) {
      this.handleSearch(path["/decklists"])
    }
  }

  pgDown = () => {
    let path = queryString.parse(window.location.pathname)
    this.setState({
      decklists: [],
      isLoading: true,
      pgNum: parseInt(this.state.pgNum) - 1
    })
    if (path["/decklists"] !== undefined) {
      this.handleSearch(path["/decklists"])
    }
  }

  handleSearch = search => {
    this.setState({isLoading: true})

    if (search.length === 0 || search === undefined) {
      this.setState({
        isLoading: false,
        decklists: this.state.allDecklists.slice((this.state.pgNum - 1) * this.decklistsPerPage, this.state.pgNum * this.decklistsPerPage)
      })
      return
    }
    var tempDecklists = []
    var words = search.split(" ")
    var keywords = []
    var values = []
    var searchwords = []
    var validKeyWords = ["stars", "a", "c", "title", "author", "s", "t", "colors", "colours"]
    words.forEach(word => {
      if (!word.includes(":")) {
        searchwords.push(word)
      } else {
        var halfs = word.split(":")
        keywords.push(halfs[0])
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
      return
    }

    this.state.allDecklists.forEach(decklist => {
      var valid = true
      const title = decklist.title.toLowerCase()
      const body = decklist.body.toLowerCase()
      const author = decklist.author.toLowerCase()
      const colors = decklist.colors
      const stars = decklist.stars
      const description = decklist.description
      const coloreq = 0.8
      const colorcol = 0.2
      searchwords.forEach(word => {
        if (!body.includes(word.toLowerCase()) && !description.includes(word.toLowerCase())) {
          valid = false
        }
      })
      if (!valid) {
        return
      }
      for (var i = 0; i < keywords.length; i++) {
        try {
          switch (keywords[i]) {
            case "a":
              if (!author.includes(values[i].toLowerCase())) {
                valid = false
              }
              break
            case "author":
              if (!author.includes(values[i].toLowerCase())) {
                valid = false
              }
              break
            case "t":
              if (!title.includes(values[i].toLowerCase())) {
                valid = false
              }
              break
            case "title":
              if (!title.includes(values[i].toLowerCase())) {
                valid = false
              }
              break
            case "stars":
              switch (values[i].charAt(0)) {
                case ">":
                  if (!(stars > values[i].substring(1))) {
                    valid = false
                  }
                  break
                case "<":
                  if (!(stars < values[i].substring(1))) {
                    valid = false
                  }
                  break
                case "=":
                  if (!(stars === values[i].substring(1))) {
                    valid = false
                  }
                  break
                default:
                  if (!isNaN(values[i])) {
                    if (!(stars === values[i])) {
                      valid = false
                    }
                    break
                  } else {
                    valid = false
                  }
              }
              break
            case "c":
              if (values[i].charAt(0) === "=") {
                if (values[i].length !== 2) {
                  valid = false
                  break
                }
                switch (values[i].charAt(1).toLowerCase()) {
                  case "w":
                    if (!(colors[0] > coloreq)) {
                      valid = false
                    }
                    break
                  case "u":
                    if (!(colors[1] > coloreq)) {
                      valid = false
                    }
                    break
                  case "b":
                    if (!(colors[2] > coloreq)) {
                      valid = false
                    }
                    break
                  case "r":
                    if (!(colors[3] > coloreq)) {
                      valid = false
                    }
                    break
                  case "g":
                    if (!(colors[4] > coloreq)) {
                      valid = false
                    }
                    break
                  default:
                    valid = false
                    break
                }
                break
              }
              for (var k = 0; k < values[i].length; k++) {
                switch (values[i].charAt(k).toLowerCase()) {
                  case "w":
                    if (!(colors[0] > colorcol)) {
                      valid = false
                    }
                    break
                  case "u":
                    if (!(colors[1] > colorcol)) {
                      valid = false
                    }
                    break
                  case "b":
                    if (!(colors[2] > colorcol)) {
                      valid = false
                    }
                    break
                  case "r":
                    if (!(colors[3] > colorcol)) {
                      valid = false
                    }
                    break
                  case "g":
                    if (!(colors[4] > colorcol)) {
                      valid = false
                    }
                    break
                  default:
                    valid = false
                    break
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
      tempDecklists.push(decklist)
    })
    this.setState({
      decklists: tempDecklists.slice((this.state.pgNum - 1) * this.decklistsPerPage, this.state.pgNum * this.decklistsPerPage),
      isLoading: false
    })
  }

  componentDidMount() {
    let path = queryString.parse(window.location.pathname)
    this.setState({
      isLoading: true
    })
    if (path["user"] && path["id"]) {
      axios
        .get(`/decklistsByUser/${path["id"]}`)
        .then(res => {
          this.setState({
            allDecklists: res.data,
            isLoading: false,
            pgNum: parseInt(path["pg"])
          })
          this.handleSearch(path["/decklists"])
        })
        .catch(err => {
          console.error(err)
          this.setState({
            isLoading: false,
            error: "Error getting decklists, please try again later."
          })
        })
    } else {
      axios
        .get("/decklists")
        .then(res => {
          this.setState({
            allDecklists: res.data,
            isLoading: false,
            pgNum: parseInt(path["pg"])
          })
          this.handleSearch(path["/decklists"])
        })
        .catch(err => {
          console.error(err)
          this.setState({
            isLoading: false,
            error: "Error getting decklists, please try again later."
          })
        })
    }
  }

  render() {
    dayjs.extend(relativeTime)
    let decklistsMarkup =
      this.state.decklists.length > 0 && !this.state.isLoading ? (
        <div>
          <table className="table table-striped table-dark">
            <thead>
              <tr>
                <th scope="col" style={{textAlign: "center"}}>
                  Stars
                </th>
                <th scope="col">Colors</th>
                <th scope="col">Title</th>
                <th scope="col">Author</th>
                <th scope="col">Format</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {this.state.decklists.map(decklist => {
                return (
                  <tr key={decklist.decklistId}>
                    <th scope="col" style={{textAlign: "center"}}>
                      {parseInt(decklist.stars) === 4 ? (
                        <div>
                          <img src={star4} style={{width: 103, height: 25}} alt="4star" />
                        </div>
                      ) : parseInt(decklist.stars) === 3 ? (
                        <div>
                          <img src={star3} alt="3star" style={{width: 103, height: 25}} />
                        </div>
                      ) : parseInt(decklist.stars) === 2 ? (
                        <div>
                          <img src={star2} style={{width: 103, height: 25}} alt="2star" />
                        </div>
                      ) : parseInt(decklist.stars) === 1 ? (
                        <div>
                          <img src={star1} style={{width: 103, height: 25}} alt="1star" />
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </th>
                    <th scope="col">
                      <div style={{background: "white", height: 15, display: "inline-block", float: "left", width: decklist.colors[0] * 50}}></div>
                      <div style={{background: "blue", height: 15, display: "inline-block", float: "left", width: decklist.colors[1] * 50}}></div>
                      <div style={{background: "black", height: 15, display: "inline-block", float: "left", width: decklist.colors[2] * 50}}></div>
                      <div style={{background: "red", height: 15, display: "inline-block", float: "left", width: decklist.colors[3] * 50}}></div>
                      <div style={{background: "green", height: 15, display: "inline-block", float: "left", width: decklist.colors[4] * 50}}></div>
                    </th>

                    <th scope="col">
                      <Link
                        to={{
                          pathname: `/decklist=${decklist.decklistId}`
                        }}
                      >
                        {decklist.title}
                      </Link>
                    </th>
                    <th scope="col">
                      <a href={`https://tumbledmtg.com/profile=${decklist.uploadId}`}>{decklist.author}</a>
                    </th>
                    <th scope="col">{decklist.duplex ? "Duplex" : "TBLD"}</th>
                    <th scope="col">{dayjs(decklist.createdAt).fromNow()}</th>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : this.state.error ? (
        <div>
          <h2 style={{textAlign: "center"}}>{this.state.error}</h2>
        </div>
      ) : this.state.decklists.length === 0 && !this.state.isLoading ? (
        <div className="bigcard">
          <header>Could not find any decklists.</header>
        </div>
      ) : (
        <DecklistsSkeleton />
      )
    return (
      <div className="container">
        <SearchBar onChange={this.onChange} searchTerm={this.state.searchTerm} onSubmit={this.disableSubmit} placeholder="search for decklists..." thing="decklists" />
        <div className="needhelp" style={{textAlign: "center"}}>
          <a href="/advdecklistsearch">
            <button type="button" className="btn btn-dark">
              need help?
            </button>
          </a>
        </div>
        <div className="pagebuttons">
          {!this.state.isLoading && this.state.allDecklists.length > (parseInt(this.state.pgNum) - 1) * this.decklistsPerPage && this.state.pgNum > 1 ? (
            <Link
              to={{
                pathname: `/decklists=${queryString.parse(this.props.location.pathname)["/decklists"]}&pg=${parseInt(this.state.pgNum) - 1}`
              }}
            >
              <button onClick={this.pgDown}>Previous Page</button>
            </Link>
          ) : (
            <button disabled>Previous Page</button>
          )}
          {!this.state.isLoading && this.state.allDecklists.length > this.decklistsPerPage && Math.ceil(this.state.allDecklists.length / this.decklistsPerPage) > this.state.pgNum ? (
            <Link
              to={{
                pathname: `/decklists=${queryString.parse(this.props.location.pathname)["/decklists"]}&pg=${parseInt(this.state.pgNum) + 1}`
              }}
            >
              <button onClick={this.pgUp}>Next Page</button>
            </Link>
          ) : (
            <button disabled>Next Page</button>
          )}
        </div>
        <br />
        {decklistsMarkup}
        <br />
        {!this.state.isLoading && this.state.decklists.length > 15 ? (
          <div className="pagebuttons">
            {!this.state.isLoading && this.state.allDecklists.length > (parseInt(this.state.pgNum) - 1) * this.decklistsPerPage && this.state.pgNum > 1 ? (
              <Link
                to={{
                  pathname: `/decklists=${queryString.parse(this.props.location.pathname)["/decklists"]}&pg=${parseInt(this.state.pgNum) - 1}`
                }}
              >
                <button onClick={this.pgDown}>Previous Page</button>
              </Link>
            ) : (
              <button disabled>Previous Page</button>
            )}
            {!this.state.isLoading && this.state.allDecklists.length > this.decklistsPerPage && 1 + Math.floor(this.state.allDecklists.length / this.decklistsPerPage) > this.state.pgNum ? (
              <Link
                to={{
                  pathname: `/decklists=${queryString.parse(this.props.location.pathname)["/decklists"]}&pg=${parseInt(this.state.pgNum) + 1}`
                }}
              >
                <button onClick={this.pgUp}>Next Page</button>
              </Link>
            ) : (
              <button disabled>Next Page</button>
            )}
          </div>
        ) : null}
      </div>
    )
  }
}

export default Decklists
