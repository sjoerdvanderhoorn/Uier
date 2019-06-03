@echo off

rem install dependencies

echo client: npm install
cd client
cmd /c npm install
cd..

echo runner: npm install
cd runner
cmd /c npm install
cd..

echo server: npm install
cd server
cmd /c npm install
cd..

pause