# Uier

Uier (UI[test]er) is a tool that provides codeless or low-code User Experience test editing and management. Uier uses Selenium to perform testing or UI automation. When running a script, results are fed back to the user interface to visually inspect failures. Each step captures screenshots and the full browser state.

* https://www.seleniumhq.org/selenium-ide/docs/en/api/commands/
* https://www.seleniumhq.org/download/

Uier tends to be a free alternative to **Applitools**, **Endtest**, **Ghost Inspector**, **Usetrace**, **Screenster** and many others.

## Structure

Uier consists out of three individual pilars that communicate with each other through a REST API.

* **client**
  * HTTP client (port 8080)
  * User facing.
* **server**
  * REST API server (port 8081)
  * Talks to MongoDB service.
  * Facilitates communication between client and runner
* **runner**
  * Selenium backend. 
  * Runs scripts defined by client and reports back status.
  * Needs to run on a Windows environment.

## Prerequisites

* Windows environment (required for Runner browser drivers)
  * Chrome
  * Firefox
* MongoDB as a service (port 27017)

## Setup

1. Copy the `settings.example.js` file to `settings.js` and adjust where required.

2. Install all npm dependencies by running the below batch file.

```bash
npm-install.cmd
```

## Start

To run all three services at once, start below batch file. Services can also be started individually.

```bash
run-all.cmd
```

Individual start commands:
```bash
run-server.cmd
run-client.cmd
run-runner.cms
```