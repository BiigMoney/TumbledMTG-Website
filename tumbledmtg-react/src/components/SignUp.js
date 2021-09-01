import {Component} from "react"
import axios from "axios"

class SignUp extends Component {
  state = {
    isAuthed: false,
    id: null,
    name: null,
    avatar: null,
    token: null,
    rtoken: null,
    errors: null,
    expires: null
  }

  onSubmit = e => {
    e.preventDefault()
    let req = {
      username: document.getElementById("username").value,
      password: document.getElementById("password").value,
      confirmpassword: document.getElementById("confirmpassword").value
    }

    const {id, token, rtoken, avatar} = this.state
    axios
      .post("/createUser", req, {headers: {token}})
      .then(res => {
        localStorage.setItem("firebaseId", res.data.user.firebaseId)
        localStorage.setItem("id", id)
        localStorage.setItem("token", token)
        localStorage.setItem("avatar", avatar)
        localStorage.setItem("rtoken", rtoken)
        this.props.history.push(`/profile=${id}`)
      })
      .catch(err => {
        console.log(err.response)
        if (err?.response?.data) {
          this.setState({
            errors: err.response.data
          })
        } else {
          this.setState({
            errors: {error: "Unknown error, please try again later."}
          })
        }
      })
  }

  componentDidMount() {
    const {state} = this.props.location
    if (state && state.isAuthed && localStorage.getItem("expires")) {
      this.setState({
        isAuthed: true,
        id: state.id,
        name: state.name,
        avatar: state.avatar,
        token: state.token,
        rtoken: state.rtoken,
        expires: localStorage.getItem("expires")
      })
      this.props.history.replace({
        state: {}
      })
      return
    }

    this.props.history.push("/")
  }

  render() {
    return (
      <div className="container">
        <h2>Welcome to TumbledMTG.com</h2>
        <br />
        <h3>Enter the following information to make an account for the TumbledMTG cockatrice server:</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label for="username">Username</label>
              <input className="form-control" id="username" placeholder="Username" autoComplete="off" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label for="password">Password</label>
              <input type="password" className="form-control" id="password" placeholder="Password" autoComplete="off" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label for="confirmpassword">Confirm Password</label>
              <input type="password" className="form-control" id="confirmpassword" placeholder="Confirm Password" autoComplete="off" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Create Account
          </button>
        </form>
        {this.state.errors ? <h5 style={{color: "red", marginTop: "10px"}}>{this.state.errors.error}</h5> : null}
      </div>
    )
  }
}

export default SignUp
