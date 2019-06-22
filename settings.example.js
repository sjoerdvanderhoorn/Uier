exports.shared = {
    // Path that should be allowed by the CORS request
    client_url: "http://localhost:8080",
    // Path and port to the Server
    server_url: "http://localhost:8081",
    server_port: 8081,
    // Session secret for cookies
    server_session_secret: "REPLACE BY YOUR OWN" + process.env.COMPUTERNAME + process.env.PATH,
    // Secret for the Runner to authenticate against the Server
    runner_secret: "REPLACE BY YOUR OWN" + process.env.COMPUTERNAME + process.env.PATH
}