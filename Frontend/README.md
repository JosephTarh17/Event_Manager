# Gather Frontend

This React/Vite app provides the Gather event interface:

- event listing and search
- event creation and editing
- event details
- event deletion
- monthly calendar
- persistent light/dark theme

## Run

```powershell
npm install
npm run dev
```

The frontend expects the API at `http://localhost:5000/api/events`.
API configuration is currently stored in `src/App.jsx`.

## Validate

```powershell
npm run lint
npm run build
```

For full setup and API details, see the repository
[README](../README.md) and [API reference](../API.md).
