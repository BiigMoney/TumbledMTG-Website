import {Component} from "react"
import axios from "axios"
import moment from "moment-timezone"
import queryString from "query-string"

class Tournament extends Component {
  state = {
    tournament: null,
    participants: null,
    isLoading: true,
    description: null,
    placedParticipants: []
  }

  onReady() {
    this.setState({
      isLoading: false
    })
    const description = this.state.description
    const placedParticipants = this.state.placedParticipants
    const state = this.state.tournament.state
    if (state === "complete" || state === "underway" || state === "awaiting_review") {
      for (var i = 0; i < this.state.participants.length; i++) {
        placedParticipants.push({
          participant: this.state.participants[i],
          decklist: description[this.state.participants.indexOf(this.state.participants[i])].decklist
        })
      }
      if (state === "complete") {
        placedParticipants.sort((a, b) => {
          return a.participant.participant.final_rank > b.participant.participant.final_rank ? 1 : a.participant.participant.final_rank < b.participant.participant.final_rank ? -1 : 0
        })
      }
      this.setState({
        placedParticipants: placedParticipants
      })
    }
  }

  componentDidMount() {
    axios
      .get(`/tournament/${queryString.parse(this.props.location.pathname)["/tournament"]}`)
      .then(res => {
        this.setState({
          tournament: res.data.tournament,
          description: res.data.description,
          participants: res.data.participants,
          isLoading: false
        })
        this.onReady()
      })
      .catch(err => {
        console.error(err)
        this.setState({
          isLoading: false,
          error: "Error getting tournament, please try again later."
        })
      })
  }

  render() {
    let tournamentsMarkup =
      this.state.tournament && !this.state.isLoading ? (
        <div>
          <h2>{this.state.tournament.name}</h2>
          <h3>
            {moment.tz(this.state.tournament.start_at, "America/Los_Angeles").format().split("T")[0]} - {this.state.tournament.state}
          </h3>
          <br />
          {this.state.tournament.state === "underway" ? (
            <div>
              <h3>Participants:</h3>
              {this.state.participants.map(participant => {
                return (
                  <div key={participant.participant.name}>
                    <h4>
                      {participant.participant.name.split("#")[0]}
                      <a target="_blank" rel="noreferrer" href={this.state.description.filter(a => a.name === participant.participant.name)[0].decklist}>
                        decklist
                      </a>
                    </h4>
                  </div>
                )
              })}
            </div>
          ) : this.state.tournament.state === "complete" ? (
            <div>
              <h3>Placings:</h3>
              {this.state.placedParticipants.map(participant => {
                return (
                  <div key={participant.participant.participant.name}>
                    <h4>
                      {participant.participant.participant.final_rank}. {participant.participant.participant.name.split("#")[0]},{" "}
                      <a rel="noreferrer" target="_blank" href={this.state.description.filter(a => a.name === participant.participant.participant.name)[0].decklist}>
                        decklist
                      </a>
                    </h4>
                  </div>
                )
              })}
            </div>
          ) : (
            <div>
              {this.state.participants.length > 0 ? (
                <div>
                  <h3>Participants: </h3>

                  {this.state.participants.map(participant => {
                    return <h4>{participant.participant.name.split("#")[0]}</h4>
                  })}
                  <br />
                  <h3>Decklists will become available once the tournament begins.</h3>
                </div>
              ) : (
                <h3>There are currently 0 people registered.</h3>
              )}
            </div>
          )}
          <br />
          <h5>
            Bracket:{" "}
            <a href={`${this.state.tournament.full_challonge_url}`} rel="noreferrer" target="_blank">
              {this.state.tournament.full_challonge_url}{" "}
            </a>
          </h5>
        </div>
      ) : this.state.error ? (
        <div>
          <h2 style={{textAlign: "center"}}>{this.state.error}</h2>
        </div>
      ) : this.state.isLoading ? (
        <div>
          <p>Loading...</p>
        </div>
      ) : (
        <div>
          <h2 style={{textAlign: "center"}}>Unknown error</h2>
        </div>
      )
    return <div className="container">{tournamentsMarkup}</div>
  }
}

export default Tournament
