import {Component, Fragment} from "react"
import logo from "./resources/tumbled-mtg (1).png"
import axios from "axios"
import {Link} from "react-router-dom"

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
            console.log(res.data)
            if (res.data.refreshed) {
              try {
                localStorage.setItem("token", res.data.token)
                localStorage.setItem("rtoken", res.data.rtoken)
                localStorage.setItem("expires", res.data.expires)
              } catch (e) {
                console.error(e)
              }
            }
            if (res.data.avatar !== localStorage.getItem("avatar")) {
              try {
                localStorage.setItem("avatar", res.data.avatar)
              } catch (e) {
                console.error(e)
              }
            }
          })
          .catch(err => {
            console.error(err)
            console.log(err?.response)
            console.log(err?.response?.data)
            this.props.history.push("/logout")
          })
      }
    }
  }

  render() {
    return (
      <Fragment>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{marginBottom: 15}}>
          <Link to="/">
            <span className="navbar-brand" href="/">
              <img src={logo} alt="lol" width="47" height="40" style={{paddingRight: 7}} />
              <span>TumbledMTG</span>
            </span>
          </Link>
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
                  <Link to="/standardrules">
                    <span className="dropdown-item">Standard Rules</span>
                  </Link>
                  <Link to="/duplexrules">
                    <span className="dropdown-item">Duplex Rules</span>
                  </Link>
                </div>
              </li>
              <li className="nav-item">
                <Link to="/search=&pg=1">
                  <span className="nav-link active" aria-current="page">
                    Cards
                  </span>
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Decklists
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <Link to="/decklists=&pg=1">
                    <span className="dropdown-item">Browse</span>
                  </Link>
                  <Link to="/createdecklist">
                    <span className="dropdown-item">Create</span>
                  </Link>
                  {localStorage.getItem("avatar") && localStorage.getItem("id") ? (
                    <Link to={localStorage.getItem("id") ? `/decklists=&pg=1&user=true&id=${localStorage.getItem("id")}` : "https://discord.com/api/oauth2/authorize?client_id=791329045932802049&redirect_uri=https%3A%2F%2Fus-central1-tumbledmtg-website.cloudfunctions.net%2Fapi%2Fcallback&response_type=code&scope=identify"}>
                      <span className="dropdown-item">My Decklists</span>
                    </Link>
                  ) : null}
                </div>
              </li>
              <li className="nav-item">
                <Link to="/tournaments&pg=1">
                  <span className="nav-link active" aria-current="page">
                    Tournaments
                  </span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/replays=&pg=1">
                  <span className="nav-link active" aria-current="page">
                    Replays
                  </span>
                </Link>
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
                      <Link to={`/profile=${localStorage.getItem("id")}`}>
                        <span className="dropdown-item">My Profile</span>
                      </Link>
                      <Link to="/settings">
                        <span className="dropdown-item">Settings</span>
                      </Link>
                      <Link to="/logout">
                        <span className="dropdown-item">Log Out</span>
                      </Link>
                    </div>
                  </li>
                </ul>
              </div>
            ) : (
              <div>
                {this.props.location.pathname.includes("signup") || this.props.location.pathname.includes("hqpERZ7PVMms6atWuC09") ? null : (
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
            <a href="https://discord.gg/2G4n5bgPgY" rel="noopener noreferrer" target="_blank">
              Discord
            </a>
            <span> | </span>
            <Link to="/downloads">
              <span>Downloads</span>
            </Link>
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
