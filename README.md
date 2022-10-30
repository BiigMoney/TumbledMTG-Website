## TumbledMTG

The [official website](https://tumbledmtg.com) of the TumbledMTG custom Magic: the Gathering format, built with React and Firebase.

## How to Run

First, make sure [Node.js](https://nodejs.org/en/) is installed. Then configure a [Firebase](https://firebase.google.com/) project and install the [CLI](https://firebase.google.com/docs/cli#windows-npm).

Once that is done you can clone the repository `git clone https://github.com/OKThomas1/TumbledMTG-Website.git`.

### Backend

To run the backend, first `cd tumbledmtg-functions`, then run `firebase init` and set up firebase functions with the project you created. Once your firebase project is configured, you need to set the [secrets](https://firebase.google.com/docs/functions/config-env#set_environment_configuration_with_the) in firebase (see [.runtimeconfig.example.json](tumbledmtg-functions/functions/.runtimeconfig.example.json))

Once firebase is set up, execute:

```
npm install
firebase serve
```

### Frontend

To run the frontend, first `cd tumbledmtg-react`, then create a .env file and set API_ENDPOINT to your custom endpoint (see [.env.example](tumbledmtg-react/.env.example)).

Once that is done, execute:

```
npm install
npm start
```

## Contributing

If you are interesting in contributing, join the [TumbledMTG Discord](https://discord.gg/2G4n5bgPgY) and contact Tumbles#3232 or Big Money#7196.
