const Downloads = () => {
  return (
    <div className="container">
      <h2>Download TumbledMTG</h2>
      <div style={{marginTop: 20}}>
        <a href="https://cdn.discordapp.com/attachments/498141191800487942/808187187471450112/TumbledMTG_Launcher.zip">
          <h3>TumbledMTG Launcher with Automatic Updating (Windows only)</h3>
        </a>
      </div>
      <div style={{fontSize: 20, marginTop: 20}}>
        <a href="https://nightly.link/Tumbles/TumbledMTG-Cockatrice/workflows/test/auto/TumbledMTG-Cockatrice-Files.zip">
          <p>Cockatrice files for manual installation</p>
        </a>
        <a href="https://www.dropbox.com/sh/onkhftq8qk141u3/AABlg2-_fUbXXNaB6LlxkZ5la?dl=0">
          <p>Cockatrice files for lightweight update</p>
        </a>
      </div>
    </div>
  )
}

export default Downloads
