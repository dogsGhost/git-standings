# Git Standings

Gather and display commit count by contributors across any number of git projects.

## Restrictions

This project assumes you have a main directory on your local machine where the majority of your projects that use git live. Only repos at the same directory level as this project will be checked.

This only checks your local repos. If your repos have remote origins and are not up-to-date or do not have the main branch checked out your results may be skewed.

## Usage

Clone repo into the same folder as the rest of your git projects.

- Install deps: `npm i`.
- Open `index.js` in an editor and uncomment/change any options desired.
- Generate data: `npm run gs`.
- Start local server on port 3000 to view results: `npm start`.

## Options

- `domain`: Restrict the contributors list to only those with email addresses that use the given domain, such as `'gmail'` or `'gmail.com'`. Omitting this option returns all contributors.
- `limit`: How many contributors to return, starting from highest commit count to lowest. Expects a number. Omitting this option returns all contributors.
- `time`: How far back in the git log to look. Defaults to '14 days'.
