import queryString from "query-string"
import {Redirect} from "react-router-dom"

const Temp = props => {
  if (queryString.parse(props.location.search)["error"]) {
    return (
      <div className="container">
        <h5>{queryString.parse(props.location.search)["error"]}</h5>
        <h5>Please try again.</h5>
      </div>
    )
  }
  if (queryString.parse(props.location.search)["account"] === "true") {
    localStorage.setItem("token", queryString.parse(props.location.search)["token"])
    localStorage.setItem("rtoken", queryString.parse(props.location.search)["rtoken"])
    localStorage.setItem("id", queryString.parse(props.location.search)["id"])
    localStorage.setItem("avatar", queryString.parse(props.location.search)["pic"])
    localStorage.setItem("firebaseId", queryString.parse(props.location.search)["fid"])
    let expires = new Date(new Date().getTime() + 604700 * 1000).getTime()
    localStorage.setItem("expires", expires)
    return <Redirect to="/" />
  }
  if (!(queryString.parse(props.location.search)["account"] === "false" && queryString.parse(props.location.search)["token"] && queryString.parse(props.location.search)["rtoken"] && queryString.parse(props.location.search)["name"] && queryString.parse(props.location.search)["id"] && queryString.parse(props.location.search)["pic"])) {
    return <Redirect to="/" />
  } else {
    let expires = new Date(new Date().getTime() + 604700 * 1000).getTime()
    localStorage.setItem("expires", expires)
    props.history.push({
      pathname: "/signup",
      state: {
        isAuthed: true,
        id: queryString.parse(props.location.search)["id"],
        name: queryString.parse(props.location.search)["name"],
        token: queryString.parse(props.location.search)["token"],
        rtoken: queryString.parse(props.location.search)["rtoken"],
        avatar: queryString.parse(props.location.search)["pic"]
      }
    })
    return <div></div>
  }
}

export default Temp
