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

## Environment setup

The backend requires a `.env` file in the project root. Create it before running:

```sh
cp .env.example .env   # then fill in your values
```

Required variables:

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `RESEND_API_KEY` | Resend API key for sending verification emails |

### Setting up Resend (email verification)

Resend is used to send account verification emails when a user signs up.

1. Create a free account at [resend.com](https://resend.com)
2. Go to **API Keys** in the dashboard and create a new key with **Full access**
3. Copy the key and add it to your `.env`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
   ```
4. **During development**, emails can only be sent to the address on your Resend account (the free plan sandbox restriction). To send to any address, add and verify a custom domain under **Domains** in the dashboard.

> The app uses Resend's shared `onboarding@resend.dev` sender by default. If you add a verified domain, update the `from` field in `backend/services/email.js` to use it.

## Getting started
1. Install dependencies:
   ```sh
   npm install
   ```
2. Set up your `.env` file (see above)
3. Start the dev server:
   ```sh
   npm run dev
   ```
4. Open the app:
   - Vite will print a local URL in the terminal (usually http://localhost:5173)

## Available scripts
- `npm run dev` - start the dev server
- `npm run build` - create a production build

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
