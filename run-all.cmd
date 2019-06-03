@echo off

echo server: start
cd server
start "uier-server" /min npm run dev
cd..

echo client: start
cd client
start "uier-client" /min npm run dev
cd..

echo runner: start
cd runner
start "uier-runner" /min npm run dev
cd..

echo All services started, press any key to close this window.
pause