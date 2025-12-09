# BotOrNot – Human Verification Puzzle Site

BotOrNot is builds a multi-page web site that 
verifies whether a visitor behaves like a human 
or a bot using drag-and-drop puzzles.

## Tech Stack

- HTML5, CSS3
- JavaScript (ES6)
- TypeScript (puzzle data helpers)
- React + React Router (results pages)
- Node.js + Express (local static dev server)

## Running locally

Start the Express server (already set up):
1.	cd "C:\Programs\nvm-workspace\botOrNot\server"
2.	npm install
3.	npm start
4.	Ensure you see "BotOrNot server listening on port 3000"
5.	Open http://localhost:3000/index.html in Edge/Firefox/Chrome.


```bash
# 1. Build TypeScript helpers
cd ts-puzzles
npm install
npx tsc

# 2. Build React results app
cd ../results-app
npm install
npm run build
# copy build/static/js/main.*.js to ../server/public/js/results.bundle.js

# 3. Start Express static server
cd ../server
npm install
npm start   # http://localhost:3000/
