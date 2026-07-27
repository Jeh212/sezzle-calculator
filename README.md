# sezzle-calculator

A full-stack calculator app with a Go REST API backend and a React Native (Expo) frontend. The same frontend codebase runs natively on iOS/Android **and** in a plain web browser (via Expo's `react-native-web` support) — no simulator or emulator required to review it.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Go 1.22+, `net/http` (stdlib only) |
| Frontend | React Native, TypeScript, Expo (+ `react-native-web` for browser support) |
| Containerization | Docker, docker-compose |

## Project Structure

```
sezzle-calculator/
├── backend/
│   ├── calculator/       # Pure math logic (unit-testable, no HTTP)
│   ├── handlers/         # HTTP handler (decode → delegate → encode)
│   ├── models/           # Shared request/response structs
│   ├── main.go           # Server bootstrap + CORS middleware
│   └── Dockerfile
├── frontend/             # Expo React Native app (+ react-native-web)
│   ├── App.tsx           # Calculator UI
│   ├── App.test.tsx      # Frontend unit tests
│   └── src/
│       ├── api/          # fetch wrapper
│       ├── components/   # display and keypad components
│       ├── hooks/        # calculator state machine
│       ├── types/        # TypeScript types matching the API contract
│       └── styles/       # StyleSheet definitions (responsive, window-size aware)
└── docker-compose.yml    # Runs the backend
```

## Prerequisites

You need the backend running (either via Docker or Go) **and** the frontend running (via Expo) at the same time — they're two separate processes in two separate terminals.

| Tool | Needed for | Check installed | Install |
|---|---|---|---|
| Docker Desktop | Running the backend in a container | `docker --version` | `brew install --cask docker` |
| Go 1.22+ | Running the backend without Docker, or running tests | `go version` | `brew install go` |
| Node.js 18+ | Running the frontend | `node --version` | `brew install node` |

Everything above is all you need if you review the frontend in a browser (`npm run web`). The following are only needed for the native mobile preview:

| Tool | Needed for | Install |
|---|---|---|
| Expo Go app | Testing on a physical phone | App Store / Google Play |
| Xcode (macOS only) | iOS Simulator | Mac App Store |
| Android Studio | Android Emulator | [developer.android.com](https://developer.android.com/studio) |

## Quick Start

**Terminal 1 — start the backend:**
```bash
cd sezzle-calculator
docker compose up --build
```
Wait until you see the backend accept connections on `http://localhost:8090`.

**Terminal 2 — start the frontend:**

The fastest way to review the app — no simulator, emulator, or phone needed:
```bash
cd sezzle-calculator/frontend
npm install
npm run web
```
This opens the calculator in your default browser at `http://localhost:19006` (or similar), running the exact same component code as the mobile app via `react-native-web`.

To preview it as a native app instead:
```bash
npx expo start
```
Then in the terminal that opens:
- Press `i` → opens in the iOS Simulator
- Press `a` → opens in the Android Emulator
- Scan the QR code with the **Expo Go** app on your phone (phone and computer must be on the same Wi-Fi network)

## Using the Calculator

Once the app opens you'll see a dark-themed calculator screen:

1. Tap digits (`0`-`9`) and `.` to build a number in the display.
2. Tap an operator (`÷`, `×`, `−`, `+`) to lock in the first operand.
3. Type the second number.
4. Tap `=` to send the calculation to the backend. The result replaces the display.
5. Tap `C` to clear and start over.
6. If you divide by zero, the display shows the error message `Cannot divide by zero` in red instead of a number — tap `C` or any digit to dismiss it and continue.

Every tap of `=` makes a real network request to the Go backend — nothing is calculated client-side, so this also demonstrates the loading state (the `=` button shows `…` briefly while waiting for the response).

## Manual Setup (without Docker)

**Backend:**
```bash
cd backend
go run ./...
# Backend listening on :8090
```

**Frontend:** same as Quick Start above (`npm install && npx expo start`).

## Configuring the API URL

`frontend/src/api/calculate.ts` hardcodes the backend URL. Depending on where the frontend runs, you may need to change it:

| Environment | URL to use |
|---|---|
| Web browser (`npm run web`) | `http://localhost:8090` (default, no change needed) |
| iOS Simulator | `http://localhost:8090` (default, no change needed) |
| Android Emulator | `http://10.0.2.2:8090` |
| Physical device (Expo Go) | `http://<your-computer's-local-IP>:8090` (find it with `ipconfig getifaddr en0` on macOS) |

## API Contract

```
POST /api/calculate
Content-Type: application/json

Request:
  { "operand1": 10, "operand2": 5, "operation": "divide" }

Response (200 OK — success):
  { "result": 2, "error": null }

Response (400 Bad Request — divide by zero or unknown operation):
  { "result": null, "error": "Cannot divide by zero" }
```

Supported operations: `add`, `subtract`, `multiply`, `divide`. Any error case (divide by zero, unknown operation, malformed JSON) returns HTTP 400 with the error message in the `error` field — the response body shape is always `{ result, error }`, so the frontend never has to special-case parsing based on status code.

## API Examples (curl)

```bash
# Divide — 200 OK
curl -i -X POST http://localhost:8090/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operand1":10,"operand2":5,"operation":"divide"}'
# → HTTP/1.1 200 OK
# → {"result":2,"error":null}

# Divide by zero — 400 Bad Request
curl -i -X POST http://localhost:8090/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operand1":10,"operand2":0,"operation":"divide"}'
# → HTTP/1.1 400 Bad Request
# → {"result":null,"error":"Cannot divide by zero"}

# Add — 200 OK
curl -X POST http://localhost:8090/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operand1":3,"operand2":4,"operation":"add"}'
# → {"result":7,"error":null}

# Unknown operation — 400 Bad Request
curl -i -X POST http://localhost:8090/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"operand1":1,"operand2":1,"operation":"modulo"}'
# → HTTP/1.1 400 Bad Request
# → {"result":null,"error":"unknown operation: modulo"}
```

## Running Tests

**Backend:**
```bash
cd backend
go test ./... -cover
```
Covers the `calculator` package (table-driven math tests) and the `handlers` package (`httptest`-based HTTP tests: success, divide-by-zero, unknown operation, wrong method, malformed JSON). Current coverage is 100% for both tested packages; the root `main` package reports 0% because it only contains server bootstrap code.

**Frontend:**
```bash
cd frontend
npm test -- --runInBand
```
Covers the calculator's state machine end-to-end using `@testing-library/react-native`: digit entry, decimal point guarding, sending `{operand1, operand2, operation}` to the backend on `=`, displaying the backend's error message (divide by zero), recovering from an error state, and clearing.

## Troubleshooting

**`bind: address already in use` when starting the backend**
Another process on your machine is already using port 8090. Find and stop it, or change the port:
```bash
lsof -i :8090 -sTCP:LISTEN
```
If you change the port, update it consistently in `backend/main.go`, `docker-compose.yml`, and `frontend/src/api/calculate.ts`.

**`go: command not found`**
Go isn't installed, or your shell hasn't picked up the PATH change yet. Run `brew install go`, then open a new terminal tab (or `source ~/.zshrc`).

**Frontend can't reach the backend / network request fails**
Check the "Configuring the API URL" section above — `localhost` from an Android emulator or a physical phone does not point at your computer.

**CORS errors in the browser console (Expo web preview)**
The backend allows all origins (`Access-Control-Allow-Origin: *`) by default, so this shouldn't happen in local dev. If it does, confirm the backend is actually running and reachable at the URL configured in `calculate.ts`.

## Design Decisions

**Separate `calculator` package from HTTP handler**
The math logic lives in `backend/calculator/calculator.go` with no HTTP imports. The handler in `backend/handlers/` is responsible only for decoding the request, calling `calculator.Calculate()`, and encoding the response. This separation means the business logic can be unit-tested directly without spinning up an HTTP server, and the handler tests use `httptest` only to verify the HTTP layer.

**Pointers for `result` and `error` in Go**
Both fields in `CalculateResponse` are pointer types (`*float64`, `*string`). This is intentional: a non-pointer `float64` with `omitempty` would omit the field when the result is `0`, hiding a valid answer. Pointers serialize to JSON `null` when `nil`, exactly matching the API contract.

**HTTP 400 for domain errors (divide by zero, unknown operation)**
Both are treated as invalid input from the client's perspective — the request asked for something the server cannot produce a valid answer for. The response body always keeps the same `{ result, error }` shape regardless of status code, so the frontend can always attempt to parse the JSON body and read `error` even on a non-2xx response; it only treats the request as a hard failure (network/server error) when the body itself can't be parsed as JSON.

**TypeScript literal union for `operation`**
`operation: 'add' | 'subtract' | 'multiply' | 'divide'` in `CalculateRequest` catches typos at compile time. The alternative (`operation: string`) would push errors to runtime.

**CORS via middleware**
A thin `corsMiddleware` wraps the route in `main.go` rather than putting CORS headers in each handler. It responds to `OPTIONS` preflight requests with `204 No Content` and sets `Access-Control-Allow-Origin: *`. This is appropriate for a local development environment; production would restrict the origin.

**React Native / Expo, with `react-native-web` for browser support**
React Native gives a genuine native calculator feel (no browser chrome, native tap feedback, proper mobile layout) if built as a native app. Rather than choosing between a native app and a web app, Expo's `react-native-web` support lets the exact same component code run in a plain browser (`npm run web`) — verified end-to-end with a headless-browser test that drives the UI through a real `10 ÷ 0 =` flow against the Go backend and confirms the error renders correctly. `fetch` and `useWindowDimensions` work identically on both targets, so there's no separate web-only code path to maintain.

**Responsive layout via `useWindowDimensions`**
Button and font sizes are computed from the current window width inside the component (`useWindowDimensions()`), not read once at module load. This keeps the layout correct across device rotation, window resizing in the browser, and different screen sizes generally.

**Port 8090 instead of the more common 8080**
`8080` and `8081` are common defaults that frequently collide with other local services (Kafka UI, the Expo Metro bundler itself, etc.). `8090` was picked specifically to avoid clashing with Expo's own dev server.

---

## AI Prompts Used

The following prompts were submitted to Claude (via Conductor) during development:

1. **Repository structure & API contract**
   > "Define the JSON format the frontend will send and the backend will respond with. Avoid confusion during iterations."

2. **Backend scaffold**
   > "I need to build a REST API in Go for a calculator. Use `net/http`, POST `/api/calculate` accepting `{operand1, operand2, operation}`. Separate the math logic from the HTTP handler into its own package so it can be unit-tested. Handle divide by zero. Enable CORS."

3. **Go unit tests**
   > "Write table-driven unit tests for the calculator package and httptest-based tests for the HTTP handler. Cover: all four operations, divide by zero, unknown operation, wrong HTTP method, malformed JSON."

4. **Frontend (Expo React Native)**
   > "Create a React Native calculator UI using Expo with TypeScript. Real calculator buttons (0-9, operators, C, =), display area, state machine for operand/operation flow. On = press, call POST /api/calculate and show the result or error in the display."

5. **Docker**
   > "Create a docker-compose.yml to run the Go backend. The Expo frontend runs locally via Expo CLI so it doesn't need Docker."

6. **Calculator button styling fix**
   > "The calculator buttons look like ovals instead of circles, and the layout looks disorganized. Can you fix the styling?"

7. **Port conflict resolution**
   > "Port 8080 is already in use by another Docker container. Move the backend to a different port and update all references consistently."

8. **README**
   > "Write a README with everything needed to use the app: prerequisites, quick start, how to use the calculator UI, API contract, curl examples, design decisions, troubleshooting, and an AI prompts section."

9. **Rigorous self-review against the original assignment**
   > "Act as a Senior Software Engineer and Technical Interviewer at Sezzle. Rigorously review my code against the exact requirements: checklist (PASS/FAIL/NEEDS IMPROVEMENT), edge cases, code quality, testing, README analysis, and a final verdict with the #1 thing to fix."

10. **Resolving the review findings**
    > "Resolve all the basic points [from the review]." This covered: changing divide-by-zero/unknown-operation to HTTP 400, fixing a frontend bug where non-2xx error bodies were discarded instead of read, making the layout responsive to window size changes via `useWindowDimensions`, rounding displayed floating-point results, removing editor/scaffold files from the frontend's git tracking, adding a frontend test suite (`@testing-library/react-native`), and verifying `react-native-web` support with a real headless-browser run against the live backend.
