# PulseNotify API

This API is supplied for the PROG7314 PulseNotify activity.

Students do **not** need to build the backend.

## Run

```bash
npm install
npm start
```

The API runs at:

```text
http://localhost:3000
```

## Endpoints

```text
GET  /health
GET  /messages
GET  /messages/foreground?afterId=0
GET  /messages/background?afterId=0
POST /messages/foreground
POST /messages/background
```

## Automatic Messages

The server creates:

```text
foreground message -> every 5 minutes
background message -> every 15 minutes
```

Messages are stored in memory and reset when the server restarts.

## Android Emulator

Use:

```text
http://10.0.2.2:3000/
```

from the Android emulator.
