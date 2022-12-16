import {Component} from "react"
import queryString from "query-string"
import axios from "axios"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import star4 from "../resources/4_stars.png"
import star3 from "../resources/3_stars.png"
import star2 from "../resources/2_stars.png"
import star1 from "../resources/1_stars.png"
import ProfileSkeleton from "./ProfileSkeleton"

export default class Profile extends Component {
  state = {
    isLoading: true,
    discordName: null,
    cockatriceName: null,
    createdAt: null,
    error: null,
    decklists: null,
    tournaments: null
  }

  componentDidMount() {
    const id = queryString.parse(this.props.location.pathname)["/profile"]
    axios
      .get(`/user/${id}`)
      .then(res => {
        this.setState({
          isLoading: false,
          discordName: res.data.discordName,
          cockatriceName: res.data.username,
          createdAt: res.data.createdAt,
          decklists: res.data.decklists,
          tournaments: res.data.tournaments.reverse()
        })
      })
      .catch(err => {
        console.error(err)
        this.setState({
          isLoading: false,
          error: "No account was found for this user."
        })
      })
  }

  render() {
    dayjs.extend(relativeTime)
    return (
      <div className="container">
        {this.state.isLoading ? (
          <ProfileSkeleton />
        ) : (
          <div>
            {this.state.error ? (
              <h5 style={{textAlign: "center", fontSize: 30}}>{this.state.error}</h5>
            ) : (
              <div>
                <h3>Discord Name: </h3>
                <h4>{this.state.discordName}</h4>
                <br />
                <h3>Cockatrice Name: </h3>
                <h4>{this.state.cockatriceName}</h4>
                <br />
                <h3>Account created at: </h3>
                <h4>{this.state.createdAt.substring(0, 10)}</h4>
                <br />
                {this.state.decklists.length > 0 ? (
                  <div>
                    <h3>Most recent decklists: </h3>
                    <table className="table table-striped table-dark">
                      <thead>
                        <tr>
                          <th scope="col" style={{textAlign: "center"}}>
                            Stars
                          </th>
                          <th scope="col">Colors</th>
                          <th scope="col">Title</th>
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
                                <a href={`/decklist=${decklist.decklistId}`} rel="noreferrer" target="_blank">
                                  {decklist.title}
                                </a>
                              </th>
                              <th scope="col">{decklist.duplex ? "Duplex" : "TBLD"}</th>
                              <th scope="col">{dayjs(decklist.createdAt).fromNow()}</th>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                    <h5>
                      <a href={`/decklists=&pg=1&user=true&id=${queryString.parse(this.props.location.pathname)["/profile"]}`} rel="noopener noreferrer" target="_blank">
                        See all decklists by user.
                      </a>
                    </h5>
                  </div>
                ) : null}
                {this.state.tournaments.length > 0 ? (
                  <div>
                    <h3>Most recent tournaments: </h3>
                    <table className="table table-striped table-dark">
                      <thead>
                        <tr>
                          <th scope="col">Place</th>
                          <th scope="col">Bracket Link</th>
                          <th scope="col">Decklist</th>
                          <th scope="col">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.tournaments.map(tournament => {
                          return (
                            <tr key={tournament.url}>
                              <th scope="col">{`${tournament.place}/${tournament.entrants}`}</th>
                              <th scope="col">
                                <a href={tournament.url} rel="noopener noreferrer" target="_blank">
                                  {tournament.url}
                                </a>
                              </th>
                              <th scope="col">
                                <a href={tournament.decklistUsed} rel="noopener noreferrer" target="_blank">
                                  {tournament.decklistUsed}
                                </a>
                              </th>
                              <th scope="col">{tournament.date}</th>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
}
