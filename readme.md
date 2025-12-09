BotOrNot: Human Verification Puzzle Site
Multi-page HTML5/JavaScript application that verifies whether a visitor behaves
like a human or a bot by solving short visual drag-and-drop puzzles.
Tech Stack:
⦁	HTML5
⦁	CSS3
⦁	JavaScript (ES6)
⦁	JSON (static puzzle asset library)
⦁	Node.js + Express (local static dev server only: hosting uses static files)
Project Overview
BotOrNot implements three lightweight, human-intuitive puzzles designed to
distinguish real users from automated scripts. The system displays small sets of
category-based icons (books, boots, tools, food, flowers) and challenges
the visitor to sort or identify them using natural visual reasoning: something bots
historically struggle with without heavy model support. No puzzle uses pre-written
questions. Instead, all puzzles are generated dynamically from a structured JSON image
library, producing thousands of unique combinations.
The project contains:
⦁	Puzzle 1 — Visual Sort
User drags each icon into the correct category bucket.
Two categories (for example, FOOD vs BOOKS) are chosen at random.
2–6 icons from each category are randomly selected.
Items shuffle after each drop to eliminate scripted coordinate replay.
No hints are displayed and category cues come only from the content itself.
⦁	Puzzle 2 — Spot the Odd
User identifies the single icon that does not belong.
One category provides 7 icons.
A different category provides the 8th item — the “odd one.”
User drags only the mismatching item into the drop zone.
The order of icons is randomized each round.
⦁	Puzzle 3 — Find the Perfect Fit
Reverse of Puzzle 2:
The screen shows seven icons from one category.
Below that, the system displays eight candidate icons (one correct, seven incorrect).
User drags the icon that belongs with the top set.
Fully randomized, has no repeated sequences.
Verification Logic
Progress is tracked using localStorage, providing a stateless verification flow:
0 mistakes: human-final.html (success)
1 mistake: suspected-bot-1.html (warning + retry)
2 mistakes: suspected-bot-2.html (final retry)
3 mistakes: bot-final.html (access denied)
This approach avoids server-side identity state and maintains zero storage of personal information.
A reset timer variable (resetClock) clears counts after a chosen interval (2 minutes for testing).
File Structure
server/
├── app.js                (Express static server for local testing)
└── public/
├── index.html       (Home page + puzzle descriptions)
├── puzzles/
│     ├── puzzle1.html
│     ├── puzzle2.html
│     └── puzzle3.html
├── results/
│     ├── human-final.html
│     ├── suspected-bot-1.html
│     ├── suspected-bot-2.html
│     └── bot-final.html
├── css/styles.css   (global styles)
├── js/
│     ├── puzzle1.js
│     ├── puzzle2.js
│     ├── puzzle3.js
│     └── contact.js (feedback form)
├── models/puzzle_items.json
└── images/...       (category icon folders)
How to Run it:
Start the Express server (already set up, use the PowerShell):
1.	cd "C:\Programs\nvm-workspace\botOrNot\server"
2.	npm install
3.	npm start
4.	Ensure you see "BotOrNot server listening on port 3000"
5.	Open http://localhost:3000/index.html in Edge/Firefox/Chrome.
All puzzles also run from the file system (no server required) because the project is fully static.
Validation:
HTML: https://validator.w3.org/
CSS: https://jigsaw.w3.org/css-validator/
JSON: https://jsonlint.com/
Warnings about vendor prefixes (e.g., -webkit-appearance) are intentional, used only for cross-browser rendering consistency.
All pages tested in Edge, Chrome, Firefox.
Design Notes:
⦁	Fully responsive layout with consistent header, footer, hover states, and accessible color contrast.
⦁	All images stored locally, has no third-party pulls.
⦁	Shuffle logic, randomized category selection, and dynamic icon counts reduce the chance of bot exploitation.
