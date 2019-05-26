# Uier

Uier (UI[test]er) is a tool that provides codeless or low-code test editing. Uier generates Selenium compatible scripts for visual testing. When running a script, results are fed back to the user interface to visually inspect failures. Each step captures screenshots and the full browser state.

* https://www.seleniumhq.org/selenium-ide/docs/en/api/commands/

Uier tends to be a free alternative to **applitools**, **endtest**, **Ghost Inspector**, **Screenster** and many others.

## Prerequisites

* Install MongoDB as a service and open on port 27017

## Setup

**Client**
``` bash
cd client

# install dependencies
npm install
```

**Server**
``` bash
cd server

# install dependencies
npm install
```

## Start

**Client**
```bash
# serve with hot reload at localhost:8080
run-client.cmd
```

**Server**
```bash
# serve with hot reload at localhost:8081
run-server.cmd
```