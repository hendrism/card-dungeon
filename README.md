# Card Dungeon

Card Dungeon is a small browser game that combines a traditional dungeon crawl with a deck of playing cards. Build a party, explore rooms and fight enemies by drawing and playing cards. The project is written in React and uses Vite for development and builds.

## Gameplay

1. **Party Creation** – Choose up to four characters. Each race and role has unique bonuses and abilities.
2. **Dungeon Exploration** – Move from room to room, drawing cards from a shared deck.
3. **Turn‑Based Combat** – Use cards for attacks, healing and buffs. Different suits and card values trigger class abilities and special effects.

## Setup

1. Install [Node.js](https://nodejs.org/).
2. Run `npm install` to download dependencies.
3. Start a development server with `npm start`.
4. Build the production bundle with `npm run build`.

## Deploying to GitHub Pages

The repository includes a deployment script using the `gh-pages` package.

1. Add a `homepage` field to `package.json`:

```json
"homepage": "https://<username>.github.io/<repository>"
```

2. Commit the change and push your repository to GitHub.
3. Execute `npm run deploy` to build and publish the `dist` folder to the `gh-pages` branch.
4. In your repository settings enable GitHub Pages and select the `gh-pages` branch.

After deployment your game will be available at the URL specified in the `homepage` field.
