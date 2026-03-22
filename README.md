# Sports Tracker

## Prerequisites
- **Node.js**
- **npm** (comes with Node.js)

### First‑time Node.js setup
1. Download and install **Node.js LTS** from https://nodejs.org/
2. Verify installation:
   ```sh
   node -v
   npm -v
   ```

## Getting started
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the dev server:
   ```sh
   npm run dev
   ```
3. Open the app:
   - Vite will print a local URL in the terminal (usually http://localhost:5173)

## Available scripts
- `npm run dev` — start the dev server
- `npm run build` — create a production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint
- `npm test` — run tests in watch mode (re-runs on file changes)
- `npm run test:run` — run tests once and exit
- `npm run test:coverage` — run tests and generate a coverage report

## Testing

Tests are located in the `tests/` folder, split by area:

```
tests/
  setup.js          — global test setup (runs before every test file)
  backend/          — tests for Express routes and backend logic
  frontend/         — tests for React components
```

To run the tests:
```sh
npm run test:run
```

To run in watch mode while developing:
```sh
npm test
```

## Project structure
```
sports_tracker/
  public/
  src/
    App.jsx
    App.css
    main.jsx
    index.css
```

## Notes
- Edit `src/App.jsx` to change the UI.
- Global styles live in `src/index.css`.
- Component styles live in `src/App.css`.

## Troubleshooting
- If `npm install` fails, delete `node_modules` and `package-lock.json`, then run `npm install` again.
- Ensure Node.js is installed and `node -v` works in your terminal.