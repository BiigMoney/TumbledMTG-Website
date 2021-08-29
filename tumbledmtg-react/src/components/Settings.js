import axios from "axios"
import {Component} from "react"
import $ from "jquery"

class Settings extends Component {
  state = {
    usernameErrors: false,
    usernameSuccess: false,
    deleteErrors: false,
    isLoading: false
  }

  disableButtons = () => {
    document.getElementById("updateusername").disabled = true
    document.getElementById("deleteaccount").disabled = true
    document.getElementById("finalbutton").disabled = true
    this.setState({isLoading: true})
  }

  enableButtons = () => {
    document.getElementById("updateusername").disabled = false
    document.getElementById("deleteaccount").disabled = false
    document.getElementById("finalbutton").disabled = false
    this.setState({isLoading: false})
  }

  componentDidMount() {
    if (!(localStorage.getItem("token") && localStorage.getItem("firebaseId") && localStorage.getItem("expires") && localStorage.getItem("id") && localStorage.getItem("avatar") && localStorage.getItem("rtoken"))) {
      this.props.history.push("/")
    }
  }

  deleteAccount = () => {
    if (this.state.isLoading || document.getElementById("confirm").value !== "confirm") {
      return
    }
    this.disableButtons()
    this.setState({
      imageErrors: false,
      usernameErrors: false,
      imageSuccess: false,
      usernameSuccess: false
    })
    let data = {
      token: localStorage.getItem("token"),
      rtoken: localStorage.getItem("rtoken"),
      expires: localStorage.getItem("expires")
    }
    axios
      .post("/deleteUser", {}, {headers: data})
      .then(() => {
        localStorage.removeItem("token")
        localStorage.removeItem("rtoken")
        localStorage.removeItem("id")
        localStorage.removeItem("firebaseId")
        localStorage.removeItem("avatar")
        localStorage.removeItem("expires")
        $("#exampleModalCenter").modal("hide")
        this.props.history.push("/")
      })
      .catch(err => {
        console.error(err)
        if (err?.response?.data?.error) {
          if (err.response.data.logout) {
            this.props.history.push("/logout")
            return
          }
          this.setState({
            deleteErrors: err.response.data.error
          })
        } else {
          this.setState({
            deleteErrors: "Unknown error, please try again later."
          })
        }
        this.enableButtons()
      })
  }

  updateUsername = e => {
    e.preventDefault()
    if (this.state.isLoading) {
      return
    }
    this.disableButtons()
    this.setState({
      imageErrors: false,
      usernameErrors: false,
      imageSuccess: false,
      usernameSuccess: false
    })
    let data = {
      token: localStorage.getItem("token"),
      rtoken: localStorage.getItem("rtoken"),
      expires: localStorage.getItem("expires")
    }
    axios
      .post("/updateUsername", {newUsername: document.getElementById("username").value}, {headers: data})
      .then(res => {
        if (res.data.refreshed) {
          localStorage.setItem("token", res.data.token)
          localStorage.setItem("rtoken", res.data.rtoken)
          localStorage.setItem("expires", res.data.expires)
        }
        this.setState({
          usernameSuccess: true
        })
        this.enableButtons()
      })
      .catch(err => {
        console.error(err)
        if (err?.response?.data?.error) {
          if (err.response.data.logout) {
            this.props.history.push("/logout")
            return
          }
          this.setState({
            usernameErrors: err.response.data.error
          })
        } else {
          this.setState({
            usernameErrors: "Unknown error, please try again later."
          })
        }
        this.enableButtons()
      })
  }
  render() {
    return (
      <div className="container">
        <h3>Username</h3>
        <h5>You can change your Cockatrice username here.</h5>
        <form onSubmit={this.updateUsername}>
          <div className="form-row">
            <div className="form-group col-md-6">
              <input className="form-control" id="username" placeholder="New Username" autoComplete="off" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" id="updateusername">
            Change Username
          </button>
        </form>
        {this.state.usernameSuccess ? <p style={{color: "green"}}>Username has successfully updated.</p> : null}
        {this.state.usernameErrors ? <p style={{color: "red"}}>{this.state.usernameErrors}</p> : null}
        <br />
        <h3>Password</h3>
        <h5>To change your cockatrice password, you must direct message TumbledMTG-Bot#3906 on discord with:</h5>
        <h5> "-resetpassword (cockatrice username) (new password)"</h5>
        <h5> without the parenthesis.</h5>
        <br />
        <h3>Delete Account</h3>
        <h5>This will delete your cockatrice account, and people will no longer be able to go to your profile page to see your decklists and tournament results.</h5>
        <h5>You can make a new TumbledMTG account with the same discord account at any time.</h5>
        <button type="button" id="deleteaccount" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
          Delete Account
        </button>
        <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Are you sure?
                </h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <label htmlFor="confirm">Please type "confirm" in the box below. This action cannot be undone.</label>
                <input className="form-control" id="confirm" placeholder="confirm" autoComplete="off" />
                {this.state.deleteErrors ? <p style={{color: "red"}}>{this.state.deleteErrors}</p> : null}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" id="finalbutton" onClick={this.deleteAccount}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Settings
