import {Component, Fragment} from "react"
import logo from "./resources/tumbled-mtg (1).png"
import axios from "axios"

class App extends Component {
  componentDidMount() {
    if (this.props.location.pathname.includes("signup") || this.props.location.pathname.includes("hqpERZ7PVMms6atWuC09")) {
      return
    }
    if (localStorage.getItem("id") || localStorage.getItem("expires") || localStorage.getItem("rtoken") || localStorage.getItem("token") || localStorage.getItem("avatar") || localStorage.getItem("firebaseId")) {
      if (!(localStorage.getItem("id") && localStorage.getItem("expires") && localStorage.getItem("rtoken") && localStorage.getItem("token") && localStorage.getItem("avatar") && localStorage.getItem("firebaseId"))) {
        console.log("Incorrect localstorage")
        this.props.history.push("/logout")
      } else {
        axios
          .get("/checkLogin", {headers: {expires: localStorage.getItem("expires"), rtoken: localStorage.getItem("rtoken"), token: localStorage.getItem("token")}})
          .then(res => {
            if (res.data.refreshed) {
              localStorage.setItem("token", res.data.token)
              localStorage.setItem("rtoken", res.data.rtoken)
              localStorage.setItem("expires", res.data.expires)
            }
            if (res.data.avatar !== localStorage.getItem("avatar")) {
              localStorage.setItem("avatar", res.data.avatar)
            }
          })
          .catch(err => {
            console.error(err)
            this.props.history.push("/logout")
          })
      }
    }
  }

  render() {
    return (
      <Fragment>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{marginBottom: 15}}>
          <div>
            <a className="navbar-brand" href="/">
              <img src={logo} alt="lol" width="47" height="40" style={{paddingRight: 7}} />
              <span>TumbledMTG</span>
            </a>
          </div>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Rules
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" href="/customrules">
                    Custom Rules
                  </a>
                  <a className="dropdown-item" href="/duplexrules">
                    Duplex Rules
                  </a>
                </div>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/search=&pg=1">
                  Cards
                </a>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Decklists
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" href="/decklists=&pg=1">
                    Browse
                  </a>
                  <a className="dropdown-item" href="/createdecklist">
                    Create
                  </a>
                  <a className="dropdown-item" href={localStorage.getItem("id") ? `/decklists=&pg=1&user=true&id=${localStorage.getItem("id")}` : "https://discord.com/api/oauth2/authorize?client_id=791329045932802049&redirect_uri=https%3A%2F%2Fus-central1-tumbledmtg-website.cloudfunctions.net%2Fapi%2Fcallback&response_type=code&scope=identify"}>
                    My Decklists
                  </a>
                </div>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/tournaments&pg=1">
                  Tournaments
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/replays=&pg=1">
                  Replays
                </a>
              </li>
            </ul>
            {localStorage.getItem("avatar") && localStorage.getItem("id") ? (
              <div>
                <ul className="navbar-nav" style={{marginRight: "100px"}}>
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="/" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src={`https://cdn.discordapp.com/avatars/${localStorage.getItem("id")}/${localStorage.getItem("avatar")}.png`} width="40" height="40" alt="missing" className="rounded-circle" />
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                      <a className="dropdown-item" href={`/profile=${localStorage.getItem("id")}`}>
                        My Profile
                      </a>
                      <a className="dropdown-item" href="/settings">
                        Settings
                      </a>
                      <a className="dropdown-item" href="/logout">
                        Log Out
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            ) : (
              <div>
                {this.props.location.pathname.includes("signup") || this.props.location.pathname.includes("hqpERZ7PVMms6atWuC09") ? (
                  <div></div>
                ) : (
                  <ul className="navbar-nav" style={{marginRight: "100px"}}>
                    <li className="nav-item">
                      <a href="https://discord.com/api/oauth2/authorize?client_id=791329045932802049&redirect_uri=https%3A%2F%2Fus-central1-tumbledmtg-website.cloudfunctions.net%2Fapi%2Fcallback&response_type=code&scope=identify" className="nav-link active">
                        Login/Register
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </nav>
        <div className="footer">
          <h4>
            <a href="https://discord.gg/2G4n5bgPgY">Discord</a>
            <span> | </span>
            <a href="/downloads">Downloads</a>
          </h4>
          <div className="bottomtext">
            <p>Note that TumbledMTG's creators do not accept any compensation of any kind, including donations or entry fees.</p>
          </div>
        </div>
      </Fragment>
    )
  }
}
export default App
