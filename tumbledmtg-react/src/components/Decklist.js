import {Component} from "react"
import axios from "axios"
import queryString from "query-string"
import $ from "jquery"

class Decklist extends Component {
  state = {
    decklist: null,
    fbCards: null,
    lines: [],
    errors: null,
    markup: null
  }

  isEmpty(string) {
    return !string || 0 === string.length
  }

  setMarkup() {
    this.setState({
      markup:
        this.state.errors === null ? (
          this.state.lines.length > 0 ? (
            <div>
              <h1>{this.state.decklist.title}</h1>
              <br />
              <h3>
                Author: <a href={`https://tumbledmtg.com/profile=${this.state.decklist.uploadId}`}>{this.state.decklist.author}</a>
              </h3>
              <br />
              {this.state.decklist.description.length > 0 ? (
                <div>
                  <h5>{this.state.decklist.description}</h5>
                  <br />
                </div>
              ) : (
                <div></div>
              )}
              <div className={this.state.lines.length > 20 ? "twoColumns" : "alttwoColumns"}>
                {this.state.lines.map((line, idx) => {
                  let image = `<img src=${line.url} alt="cantfind" height='350'/>`
                  return (
                    <div key={idx}>
                      {line.url ? (
                        <a href={line.link} data-toggle="tooltip" data-placement="right" title={image}>
                          <span style={{marginRight: 10, fontSize: 17}}>{line.text}</span>
                        </a>
                      ) : (
                        <h4>{line.text}</h4>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )
        ) : (
          <h2 style={{textAlign: "center"}}>{this.state.errors}</h2>
        )
    })
  }

  getLinks() {
    const lines = this.state.decklist.body.split("\n")
    for (var i = 0; i < lines.length; i++) {
      let line = {
        text: lines[i],
        name: null,
        url: null,
        link: null,
        id: i
      }
      this.state.lines.push(line)
      if (lines[i].charAt(0) === "/" && lines[i].charAt(1) === "/") {
        continue
      }
      if (this.isEmpty(lines[i])) {
        continue
      }
      const words = lines[i].split(" ")
      let string = ""
      let j = 1
      if (words[0] === "SB:") {
        j = 2
      }
      for (j; j < words.length; j++) {
        string += words[j] + " "
      }
      line.link = "card=" + string
      string = string.substring(0, string.length - 1)
      line.name = string
      line.url = `https://firebasestorage.googleapis.com/v0/b/tumbledmtg-website.appspot.com/o/${encodeURI(string)}.jpg?alt=media`
    }
    this.setMarkup()
  }

  componentDidUpdate(prevProps, prevState) {
    $('[data-toggle="tooltip"]').tooltip({
      html: true
    })
    if (prevState.errors !== this.state.errors) {
      this.setMarkup()
    }
  }

  componentDidMount() {
    this.setMarkup()
    $('[data-toggle="tooltip"]').tooltip({html: true})

    const decklistId = queryString.parse(this.props.location.pathname)["/decklist"]
    axios
      .get(`/decklists/${decklistId}`)
      .then(res => {
        this.setState({
          decklist: res.data
        })
        if (this.state.fbCards) {
          this.getLinks()
        }
      })
      .catch(err => {
        if (err?.response?.data?.error) {
          this.setState({
            errors: err.response.data.error
          })
        } else {
          this.setState({
            errors: "Could not connect to server, please try again later."
          })
        }
      })
    axios
      .get("/cards")
      .then(res => {
        this.setState({
          fbCards: res.data
        })
        if (this.state.decklist) {
          this.getLinks()
        }
      })
      .catch(() => {
        this.setState({
          errors: "Error getting cards."
        })
      })
  }

  render() {
    return <div className="container">{this.state.markup}</div>
  }
}

export default Decklist
