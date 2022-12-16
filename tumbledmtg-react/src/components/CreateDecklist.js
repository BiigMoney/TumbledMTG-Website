import axios from "axios"
import React, {Component} from "react"

class CreateDecklist extends Component {
  state = {
    errors: null,
    isLoading: false,
    loggedIn: false
  }

  preventDefault = e => {
    e.preventDefault()
  }

  componentDidMount() {
    if (!(localStorage.getItem("id") && localStorage.getItem("expires") && localStorage.getItem("rtoken") && localStorage.getItem("token") && localStorage.getItem("avatar") && localStorage.getItem("firebaseId"))) {
      return
    } else {
      this.setState({
        loggedIn: true
      })
    }
  }

  onCreateDecklist = e => {
    e.preventDefault()
    if (this.state.isLoading === true) {
      return
    }
    this.setState({
      isLoading: true,
      errors: null
    })
    let decklist = {
      author: document.getElementById("decklistAuthor").value,
      body: document.getElementById("decklistBody").value,
      description: document.getElementById("decklistDescription").value,
      title: document.getElementById("decklistTitle").value,
      token: localStorage.getItem("token"),
      rtoken: localStorage.getItem("rtoken"),
      expires: localStorage.getItem("expires")
    }
    if (document.getElementById("exampleCheck1").checked) {
      decklist.duplex = true
    }
    axios
      .post("/decklist", decklist, {headers: {token: localStorage.getItem("token"), expires: localStorage.getItem("expires"), rtoken: localStorage.getItem("rtoken")}})
      .then(res => {
        if (res.data.refreshed) {
          localStorage.setItem("token", res.data.token)
          localStorage.setItem("rtoken", res.data.rtoken)
          let expires = new Date(new Date().getTime() + 604700 * 1000).getTime()
          localStorage.setItem("expires", expires)
        }
        this.props.history.push(`/decklist=${res.data.decklist.id}`)
      })
      .catch(err => {
        if (err?.response?.data) {
          if (err.response.data.logout) {
            this.props.history.push("/logout")
            return
          }
          this.setState({
            isLoading: false,
            errors: err.response.data.errors
          })
        } else {
          this.setState({
            isLoading: false,
            errors: ["Unknown error, please try again later."]
          })
        }
      })
  }

  render() {
    return (
      <div className="container" style={{marginTop: 15}}>
        {this.state.loggedIn ? (
          <div>
            <h1>Create a Decklist</h1>
            <br />
            <form onSubmit={this.preventDefault}>
              <div className="form-group">
                <label>Title</label>
                <input autoComplete="off" type="text" className="form-control" id="decklistTitle" aria-describedby="emailHelp" placeholder="Title" />
                <small className="form-text text-muted">*required</small>
              </div>
              <div className="form-group">
                <label>Author</label>
                <input autoComplete="off" type="text" className="form-control" id="decklistAuthor" placeholder="Author" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea autoComplete="off" className="form-control" style={{height: 100}} id="decklistDescription" placeholder="Description" />
              </div>
              <div className="form-group">
                <label>Decklist</label>
                <textarea autoComplete="off" className="form-control" style={{height: 400}} id="decklistBody" />
              </div>
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                <label className="form-check-label" htmlFor="exampleCheck1">
                  Duplex
                </label>
              </div>
              <br />
              <button type="submit" className="btn btn-primary" onClick={this.onCreateDecklist}>
                Submit
              </button>
            </form>
            <br />
            {this.state.errors ? (
              <div>
                {this.state.errors.map((error, i) => {
                  return <h5 key={i}>{error}</h5>
                })}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="container">
            <h3>You must be logged in to create a decklist.</h3>
          </div>
        )}
      </div>
    )
  }
}

export default CreateDecklist
