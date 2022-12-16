import image from "../resources/discord.png"

const HomePage = () => {
  return (
    <div className="container">
      <div style={{fontSize: 25}}>
        <h1>What is TumbledMTG?</h1>
        <p>TumbledMTG is a fan-made Magic: the Gathering format. It contains both ‘canon’ cards and custom cards, all individually selected to form a cohesive constructed experience. TBLD is in some ways a reboot of magic, deconstructing it and rebuilding it with a consistent approach to design and balance.</p>
        <p></p>
        <p>We have an active player base and regular free to enter tournaments with cash prizes! Join our discord and jump in!</p>
      </div>
      <div className="centerimage">
        <a href="https://discord.gg/2G4n5bgPgY">
          <img src={image} alt="discord logo" width="50%" />
        </a>
      </div>
      <h2>Download TumbledMTG</h2>
      <div style={{marginTop: 20}}>
        <a href="https://cdn.discordapp.com/attachments/498141191800487942/808187187471450112/TumbledMTG_Launcher.zip">
          <h3>TumbledMTG Launcher with Automatic Updating (Windows only)</h3>
        </a>
      </div>
      <div style={{fontSize: 20, marginTop: 20}}>
        <a href="https://nightly.link/OKThomas1/TumbledMTG-Cockatrice/workflows/build/auto/TumbledMTG-Cockatrice-Files.zip">
          <p>Cockatrice files for manual installation</p>
        </a>
        <a href="https://www.dropbox.com/sh/6pfwfl2hefzkdc2/AAA6r-63bnFkTVhNxiMF7ITxa?dl=0">
          <p>Cockatrice files for lightweight update</p>
        </a>
      </div>
      <div className="server">
        <p style={{marginRight: 25}}>Cockatrice Server</p>
        <p>Host: servatrice.tumbledmtg.com</p>
        <p>Port: 4747</p>
      </div>
    </div>
  )
}

export default HomePage
