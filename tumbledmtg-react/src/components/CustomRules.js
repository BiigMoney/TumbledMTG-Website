import card1 from "../resources/Player One Emblem.jpg"
import card2 from "../resources/Player Two Emblem.jpg"
import card3 from "../resources/Player Three Emblem.jpg"
import card4 from "../resources/Player Four Emblem.jpg"
import card5 from "../resources/Player Five Emblem.jpg"
import card6 from "../resources/Player Six Emblem.jpg"

const CustomRules = () => {
  return (
    <div className="container">
      <h2>Custom Rules</h2>
      <div style={{fontSize: 20, marginTop: 20}}>
        <ul>
          <li>
            <p>The ‘instant’ card type and ‘flash’ keyword are removed. Instead there is a ‘Flash’ supertype. A card having the Flash supertype can be played any time you have priority, just like an instant. (There are also various other more minor templating changes)</p>
          </li>
          <li>
            <p>When a player searches their library, the last step of searching is always to shuffle their library.</p>
          </li>
          <li>
            <p>The legendary supertype is not a copyable trait. This means that clones and copies of legendary creatures do not trigger the legend rule.</p>
          </li>
          <li>
            <p>When flipping a coin in Cockatrice, it is customary to roll a d20 instead. If the result is 11 or higher, that means heads. Otherwise, the result counts as tails. Players predict heads by default if they do not call it otherwise.</p>
          </li>
          <li>
            <p>Each player begins the game with an emblem (in both 1v1 and multiplayer games):</p>
          </li>
        </ul>
      </div>
      <div className="row">
        <div className="col-md-">
          <img src={card1} className="bigimage" alt="" />
        </div>
        <div className="col-md-4">
          <img src={card2} className="bigimage" alt="" />
        </div>
      </div>
      <div className="row">
        <div className="col-md-3">
          <img src={card3} className="fullimage" alt="" />
        </div>
        <div className="col-md-3">
          <img src={card4} className="fullimage" alt="" />
        </div>
        <div className="col-md-3">
          <img src={card5} className="fullimage" alt="" />
        </div>
        <div className="col-md-3">
          <img src={card6} className="fullimage" alt="" />
        </div>
      </div>
    </div>
  )
}

export default CustomRules
