import card from "../resources/Tiblat.jpg"
import card2 from "../resources/Seal.jpg"

const DuplexRules = () => {
  return (
    <div className="container">
      <h2>Duplex Rules</h2>
      <div style={{fontSize: 20, marginTop: 20}}>
        <p>‘Duplex’ is a multiplayer variant of TumbledMTG, similar to commander. Meant to be played with 3+ players.</p>
        <h4>Deck Construction:</h4>
        <ul>
          <li>
            <p>No sideboards</p>
          </li>
          <li>
            <p>One to four commanders (can be any legendary creature that isn't an Eldrazi). For each commander beyond the first, that player begins the game with one fewer command seal (pictured below)</p>
          </li>
          <li>
            <p>Minimum 120 card deck size (instead of 60) (in addition to the commanders)</p>
          </li>
          <li>
            <p>Maximum two copies of any given card (instead of four)</p>
          </li>
          <li>
            <p>Maximum one copy of any given legendary card</p>
          </li>
        </ul>
        <img src={card} className="bigimage" alt="" />
        <div style={{marginBottom: 30}}>
          <h4>Gameplay Rules:</h4>
          <ul>
            <li>
              <p>Commanders begin the game in the ‘command zone’</p>
            </li>
            <li>
              <p>Players may exile a card from their hand to put one of their captains from the command zone into their hand. They may do this during any of their main phases while the stack is empty (ie nonflash speed)</p>
            </li>
            <li>
              <p>Unlike EDH, there is no rule that returns commanders to the command zone when they leave play. However, each player begins the game with up to three Command Seal emblems, depending on how many commanders they choose:</p>
            </li>
          </ul>
        </div>
        <img src={card2} className="bigimage" alt="" />
      </div>
    </div>
  )
}

export default DuplexRules
