import {Redirect} from "react-router-dom"

const Logout = () => {
  localStorage.removeItem("id")
  localStorage.removeItem("token")
  localStorage.removeItem("rtoken")
  localStorage.removeItem("avatar")
  localStorage.removeItem("firebaseId")
  localStorage.removeItem("expires")

  return <Redirect to="/" />
}

export default Logout
