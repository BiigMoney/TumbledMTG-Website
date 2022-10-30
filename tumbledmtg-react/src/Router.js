import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom"
import App from "./App"
import CardList from "./components/CardList"
import Card from "./components/Card"
import HomePage from "./components/HomePage"
import CustomRules from "./components/CustomRules"
import Decklists from "./components/Decklists"
import Tournaments from "./components/Tournaments"
import Downloads from "./components/Downloads"
import DuplexRules from "./components/DuplexRules"
import AdvancedSearch from "./components/AdvancedSearch"
import Decklist from "./components/Decklist"
import CreateDecklist from "./components/CreateDecklist"
import NotFound from "./components/NotFound"
import AdvDeckklistSearch from "./components/AdvDecklistSearch"
import Tournament from "./components/Tournament"
import Temp from "./components/Temp"
import SignUp from "./components/SignUp"
import Profile from "./components/Profile"
import Settings from "./components/Settings"
import Logout from "./components/Logout"
import Replays from "./components/Replays"
import axios from "axios"

axios.defaults.baseURL = process.env.API_ENDPOINT

const Router = () => {
  return (
    <div className="page-container content-wrap">
      <BrowserRouter>
        <Route path="/" component={App} />
        <Switch>
          <Route path="/" component={HomePage} exact />
          <Route path="/search">
            <Redirect to="/search=&pg=1" />
          </Route>
          <Route path="/search=:id" component={CardList} />
          <Route path="/card=:id" component={Card} />
          <Route path="/standardrules" component={CustomRules} />
          <Route path="/duplexrules" component={DuplexRules} />
          <Route path="/decklists">
            <Redirect to="/decklists=&pg=1" />
          </Route>
          <Route path="/decklists=:id" component={Decklists} />
          <Route path="/tournaments">
            <Redirect to="/tournaments&pg=1" />
          </Route>
          <Route path="/tournaments&pg=:id" component={Tournaments} />
          <Route path="/downloads" component={Downloads} />
          <Route path="/advancedsearch" component={AdvancedSearch} />
          <Route path="/decklist=:decklistId" component={Decklist} />
          <Route path="/createdecklist" component={CreateDecklist} />
          <Route path="/advdecklistsearch" component={AdvDeckklistSearch} />
          <Route path="/tournament=:id" component={Tournament} />
          <Route path="/hqpERZ7PVMms6atWuC09" component={Temp} />
          <Route path="/signup" component={SignUp} />
          <Route path="/profile=:id" component={Profile} />
          <Route path="/settings" component={Settings} />
          <Route path="/logout" component={Logout} />
          <Route path="/replays">
            <Redirect to="/replays&pg=1" />
          </Route>
          <Route path="/replays=:id" component={Replays} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default Router
