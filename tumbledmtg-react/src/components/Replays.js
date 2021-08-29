import {Component} from "react"
import axios from "axios"
import {Link} from "react-router-dom"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import queryString from "query-string"
import ReplaySkeleton from "./ReplaySkeleton"

class Replays extends Component {
  replaysPerPage = 25

  state = {
    allReplays: [],
    replays: [],
    isLoading: true,
    pgNum: 0
  }

  pgUp = () => {
    this.setState({
      replays: this.state.allReplays.slice(this.state.pgNum * this.replaysPerPage, (this.state.pgNum + 1) * this.replaysPerPage),
      pgNum: parseInt(this.state.pgNum) + 1
    })
  }

  pgDown = () => {
    this.setState({
      replays: this.state.allReplays.slice((this.state.pgNum - 2) * this.replaysPerPage, (this.state.pgNum - 1) * this.replaysPerPage),
      pgNum: parseInt(this.state.pgNum) - 1
    })
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
      pgNum: parseInt(queryString.parse(window.location.pathname)["pg"])
    })
    axios
      .get("/replays")
      .then(res => {
        this.setState({
          allReplays: res.data,
          replays: res.data.slice((this.state.pgNum - 1) * this.replaysPerPage, this.state.pgNum * this.replaysPerPage),
          isLoading: false
        })
      })
      .catch(err => {
        console.error(err)
        this.setState({
          isLoading: false
        })
      })
  }

  render() {
    dayjs.extend(relativeTime)
    let replaysMarkup =
      this.state.replays.length > 0 && !this.state.isLoading ? (
        <div>
          <table className="table table-striped table-dark">
            <thead>
              <tr>
                <th scope="col" style={{textAlign: "center"}}>
                  Lobby Name
                </th>
                <th scope="col" style={{textAlign: "center"}}>
                  Host
                </th>
                <th scope="col" style={{textAlign: "center"}}>
                  Duration
                </th>
                <th scope="col" style={{textAlign: "center"}}>
                  Date
                </th>
                <th scope="col" style={{textAlign: "center"}}>
                  Download
                </th>
              </tr>
            </thead>
            <tbody>
              {this.state.replays.map(replay => {
                return (
                  <tr key={replay.id}>
                    <th scope="col" style={{textAlign: "center"}}>
                      {replay.lobbyName}
                    </th>
                    <th scope="col" style={{textAlign: "center"}}>
                      {replay.host}
                    </th>
                    <th scope="col" style={{textAlign: "center"}}>
                      {replay.duration > 3600 ? new Date(replay.duration * 1000).toISOString().substr(11, 8) : new Date(replay.duration * 1000).toISOString().substr(14, 5)}
                    </th>
                    <th scope="col" style={{textAlign: "center"}}>
                      {dayjs(replay.createdAt).fromNow()}
                    </th>
                    <th scope="col" style={{textAlign: "center"}}>
                      <a href={replay.url}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
                          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                          <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                        </svg>
                      </a>
                    </th>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : this.state.replays.length === 0 && !this.state.isLoading ? (
        <div className="bigcard">
          <h2>Error getting replays, please try again later.</h2>
        </div>
      ) : (
        <ReplaySkeleton />
      )
    return (
      <div className="container">
        <div className="pagebuttons">
          {!this.state.isLoading && this.state.allReplays.length > (parseInt(this.state.pgNum) - 1) * this.replaysPerPage && this.state.pgNum > 1 ? (
            <Link
              to={{
                pathname: `/replays=${queryString.parse(this.props.location.pathname)["/replays"]}&pg=${parseInt(this.state.pgNum) - 1}`
              }}
            >
              <button onClick={this.pgDown}>Previous Page</button>
            </Link>
          ) : (
            <button disabled>Previous Page</button>
          )}
          {!this.state.isLoading && this.state.allReplays.length > this.replaysPerPage && Math.ceil(this.state.allReplays.length / this.replaysPerPage) > this.state.pgNum ? (
            <Link
              to={{
                pathname: `/replays=${queryString.parse(this.props.location.pathname)["/replays"]}&pg=${parseInt(this.state.pgNum) + 1}`
              }}
            >
              <button onClick={this.pgUp}>Next Page</button>
            </Link>
          ) : (
            <button disabled>Next Page</button>
          )}
        </div>
        {replaysMarkup}
        {!this.state.isLoading && this.state.replays.length > 15 ? (
          <div className="pagebuttons">
            {!this.state.isLoading && this.state.allReplays.length > (parseInt(this.state.pgNum) - 1) * this.replaysPerPage && this.state.pgNum > 1 ? (
              <Link
                to={{
                  pathname: `/replays=${queryString.parse(this.props.location.pathname)["/replays"]}&pg=${parseInt(this.state.pgNum) - 1}`
                }}
              >
                <button onClick={this.pgDown}>Previous Page</button>
              </Link>
            ) : (
              <button disabled>Previous Page</button>
            )}
            {!this.state.isLoading && this.state.allReplays.length > this.replaysPerPage && 1 + Math.floor(this.state.allReplays.length / this.replaysPerPage) > this.state.pgNum ? (
              <Link
                to={{
                  pathname: `/replays=${queryString.parse(this.props.location.pathname)["/replays"]}&pg=${parseInt(this.state.pgNum) + 1}`
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

export default Replays
