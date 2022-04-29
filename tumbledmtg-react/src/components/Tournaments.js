import {Component} from "react"
import axios from "axios"
import {Link} from "react-router-dom"
import moment from "moment-timezone"
import TournamentsSkeleton from "./TournamentsSkeleton"
import queryString from "query-string"

class Tournaments extends Component {
  tournamentsPerPage = 10

  state = {
    allTournaments: [],
    tournaments: [],
    pgNum: null
  }

  pgUp = () => {
    this.setState({
      tournaments: this.state.allTournaments.slice(this.state.pgNum * this.tournamentsPerPage, (this.state.pgNum + 1) * this.tournamentsPerPage),
      pgNum: parseInt(this.state.pgNum) + 1
    })
  }

  pgDown = () => {
    this.setState({
      tournaments: this.state.allTournaments.slice((this.state.pgNum - 2) * this.tournamentsPerPage, (this.state.pgNum - 1) * this.tournamentsPerPage),
      pgNum: parseInt(this.state.pgNum) - 1
    })
  }

  componentDidMount = () => {
    this.setState({
      pgNum: parseInt(queryString.parse(this.props.location.pathname)["pg"])
    })
    axios
      .get("/tournaments")
      .then(res => {
        let allTournaments = res.data.body.sort((a, b) => {
          return a.tournament.start_at < b.tournament.start_at ? 1 : b.tournament.start_at < a.tournament.start_at ? -1 : 0
        })
        this.setState({
          allTournaments: allTournaments,
          tournaments: allTournaments.slice((this.state.pgNum - 1) * this.tournamentsPerPage, this.state.pgNum * this.tournamentsPerPage)
        })
      })
      .catch(err => {
        console.error(err)
        this.setState({
          error: "Error getting tournaments, please try again later.",
          isLoading: false
        })
      })
  }

  render() {
    let tournamentsMarkup =
      this.state.allTournaments.length > 0 && this.state.tournaments.length > 0 ? (
        <div>
          <table className="table table-striped table-dark">
            <thead>
              <tr>
                <th scope="col">Entrants</th>
                <th scope="col">Name</th>
                <th scope="col">Status</th>
                <th scope="col">Format</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {this.state.tournaments.map(tournament => {
                return (
                  <tr key={tournament.tournament.id}>
                    <th scope="col">{tournament.tournament.participants_count}</th>
                    <th scope="col">
                      <Link
                        to={{
                          pathname: `/tournament=${tournament.tournament.id}`
                        }}
                      >
                        {tournament.tournament.name}
                      </Link>
                    </th>
                    <th scope="col">{tournament.tournament.state}</th>
                    <th scope="col">{tournament.tournament.tournament_type}</th>
                    <th scope="col">{moment.tz(tournament.tournament.start_at, "America/Los_Angeles").format().split("T")[0]}</th>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : this.state.error ? (
        <div>
          <h2 style={{textAlign: "center"}}>{this.state.error}</h2>
        </div>
      ) : (
        <TournamentsSkeleton />
      )
    return (
      <div className="container">
        <h1>Tournaments</h1>
        <br />
        <h5>To enter the next weekly single elim bracket, direct message the TumbledMTG-Bot with the following: </h5>
        <h5 style={{textIndent: 50}}> -registerweekly (decklist)</h5>
        <h5>To enter the bigger tournaments, direct message the TumbledMTG-Bot with the following:</h5>
        <h5 style={{textIndent: 50}}> -registertourney (decklist)</h5>
        <h5>Your decklist may include titles and catagories</h5>
        <h5>Example:</h5>
        <h5 style={{textIndent: 50}}> -registerweekly {"// IslandStorm"} </h5>
        <h5 style={{textIndent: 50}}> {"// 60 cards"}</h5>
        <h5 style={{textIndent: 50}}> {"// 56 lands"}</h5>
        <h5 style={{textIndent: 50}}> 56 TBLD Island</h5>
        <h5 style={{textIndent: 50}}> {"// Brave fishes"}</h5>
        <h5 style={{textIndent: 50}}> 4 TBLD Determined Koi</h5>
        <h5 style={{textIndent: 50}}> {"// 15 Sideboard"}</h5>
        <h5 style={{textIndent: 50}}> SB: 15 TBLD Island</h5>
        <br />

        {tournamentsMarkup}
        <div className="justify-content-center" style={{display: "flex"}}>
          {!this.state.isLoading && this.state.allTournaments.length > (parseInt(this.state.pgNum) - 1) * this.tournamentsPerPage && this.state.pgNum > 1 ? (
            <Link
              to={{
                pathname: `/tournaments&pg=${parseInt(this.state.pgNum) - 1}`
              }}
            >
              <button onClick={this.pgDown} className="btn btn-outline-success" style={{width: 120}}>
                Previous Page
              </button>
            </Link>
          ) : (
            <button disabled className="btn btn-outline-success" style={{width: 120}}>
              Previous Page
            </button>
          )}
          {!this.state.isLoading && this.state.allTournaments.length > this.tournamentsPerPage && Math.ceil(this.state.allTournaments.length / this.tournamentsPerPage) > this.state.pgNum ? (
            <Link
              to={{
                pathname: `/tournaments&pg=${parseInt(this.state.pgNum) + 1}`
              }}
            >
              <button onClick={this.pgUp} className="btn btn-outline-success" style={{width: 120}}>
                Next Page
              </button>
            </Link>
          ) : (
            <button disabled className="btn btn-outline-success" style={{width: 120}}>
              Next Page
            </button>
          )}
        </div>
      </div>
    )
  }
}

export default Tournaments
