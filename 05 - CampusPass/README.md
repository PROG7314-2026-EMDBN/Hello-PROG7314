# CampusPass: An Android Client with a Custom Node API

## Overview

Build CampusPass, a mobile application for campus event registration and QR-based check-in.

The system must include:
- an Android application built with Kotlin and Jetpack Compose;
- a Node.js and Express API;
- MongoDB with Mongoose;
- Firebase Authentication using Google Sign-In;
- Firebase Admin SDK for API authentication;
- Retrofit for Android-to-API communication;
- QR-based attendee check-in.

This activity brings together concepts already covered in PROG7314 and INSY7314. You are expected to apply your prior knowledge over a two-week period.

## Scenario

Campus organisations need a platform where they can create free events, accept registrations and check attendees in at the venue.

### Attendees

Attendees must be able to:
- sign in with Google;
- browse published events;
- view event details;
- register for an event;
- cancel a registration;
- view their registrations;
- display a QR pass.

### Organisers
Organisers must be able to:

- create and manage their own events;
- publish or cancel events;
- view event registrations;
- scan attendee QR passes;
- check attendees in;
- view attendance information.

## Architecture
```text
Android application
        |
        | Firebase ID token
        | HTTPS / JSON
        v
Node.js and Express API
        |
        | Firebase Admin verification
        v
Mongoose
        |
        v
MongoDB
```

Firebase Authentication establishes identity. MongoDB stores CampusPass-specific information such as roles, events, registrations and check-ins. The Android application must not connect directly to MongoDB.

## Required Technology

### Android

- Kotlin
- Jetpack Compose
- Retrofit
- OkHttp
- Firebase Authentication
- Credential Manager
- QR code generation
- QR code scanning

### API

- Node.js
- Express
- MongoDB
- Mongoose
- Firebase Admin SDK
- automated API tests


## 1. Authentication and User Profiles

### Android Requirements

The Android application must:

- use Firebase Authentication with Google Sign-In;
- obtain a current Firebase ID token after successful sign-in;
- include the token in protected API requests;
- call the user synchronisation endpoint after authentication;
- load the returned CampusPass profile and role;
- prevent users from selecting or granting themselves the organiser role;
- handle sign-in failure, sign-out and authentication-state changes.

The token must be sent using:

```http
Authorization: Bearer <firebase-id-token>
```

### API Requirements

The API must:

- verify Firebase ID tokens using Firebase Admin;
- reject missing or invalid tokens with `401 Unauthorized`;
- derive the Firebase UID and email from the verified token;
- create or retrieve a CampusPass user profile;
- assign the `attendee` role to new users by default;
- prevent duplicate profiles for the same Firebase UID;
- protect all non-public routes.

The CampusPass user profile must include at least:

```text
firebaseUid
email
displayName
role
createdAt
updatedAt
```

Supported roles:

```text
attendee
organiser
```

Suggested route:

```http
POST /api/users/sync
```

### Acceptance Criteria

Acceptance criteria for this feature:
- Google Sign-In succeeds;
- the Firebase ID token is accepted by the API;
- a MongoDB user profile is created on first sign-in;
- repeated sign-in does not create duplicate users;
- protected routes reject invalid or missing tokens;
- the Android app receives and uses the CampusPass role.

## 2. Event Management

### Android Requirements

The Android application must provide:

- a published event list;
- an event details screen;
- organiser event creation;
- organiser event editing;
- publishing and cancellation actions;
- clear event status indicators;
- loading, empty and error states;
- role-appropriate controls.

Attendees must not be shown organiser-only actions.

The interface must display validation errors returned by the API.

### API Requirements

Create an Event model containing at least:

```text
title
description
venue
startDateTime
endDateTime
registrationDeadline
capacity
status
organiser
createdAt
updatedAt
```

Supported statuses should include:

```text
draft
published
cancelled
completed
```

#### Required Operations

```http
GET    /api/events
GET    /api/events/:id
POST   /api/events
PUT    /api/events/:id
PATCH  /api/events/:id/status
```

Additional routes may be added where justified.

#### Required Business Rules

The API must enforce that:

- only organisers may create events;
- organisers may update only their own events;
- attendees may browse published events;
- capacity must be greater than zero;
- the end time must be after the start time;
- the registration deadline must be before the event starts;
- cancelled events must not accept registrations;
- completed events must not be edited as active events.

### Acceptance Criteria

Acceptance criteria for this feature:
- Android displays published events returned by the API;
- attendees cannot create events;
- organisers can create events;
- one organiser cannot edit another organiser’s event;
- invalid dates and capacity values are rejected;
- published, cancelled and completed states are displayed correctly.

## 3. Event Registration

### Android Requirements

Attendees must be able to:

- register for a published event;
- cancel an active registration;
- view their registrations;
- see registration status;
- see when an event is full;
- see when registration has closed;
- view API validation messages.

The Android application must wait for API confirmation before displaying a successful registration or cancellation.

Organisers must be able to view registrations only for events they own.

### API Requirements

Create a Registration model containing at least:

```text
attendee
event
qrToken
status
registeredAt
checkedInAt
```

Supported statuses should include:

```text
active
cancelled
checked_in
```

Use a database-level uniqueness constraint to prevent duplicate registrations for the same attendee and event.

#### Required Operations

```http
POST   /api/events/:eventId/register
DELETE /api/events/:eventId/register
GET    /api/registrations/me
GET    /api/events/:eventId/registrations
```

#### Required Business Rules

The API must prevent:

- duplicate registration;
- registration after the deadline;
- registration for cancelled events;
- registration for completed events;
- registration when capacity has been reached;
- cancellation after check-in;
- organisers viewing registrations for events they do not own.

The API must calculate availability from registration data.

Do not trust availability or registration counts supplied by Android.

### Acceptance Criteria

Acceptance criteria for this feature:
- successful registration;
- duplicate-registration rejection;
- capacity enforcement;
- deadline enforcement;
- successful cancellation;
- retrieval of the signed-in attendee’s registrations;
- organiser access limited to owned events.

## 4. QR Passes and Check-In

### Android Requirements

Attendees must be able to:

- display a QR pass for a valid registration;
- see whether the registration is active, cancelled or checked in;
- avoid displaying a usable pass for cancelled registrations.

Organisers must be able to:

- open a QR scanner;
- scan a pass;
- submit the scanned token to the API;
- display the returned attendee and event details;
- handle invalid, cancelled and already-used passes;
- receive clear success and failure feedback.

The Android application must not mark an attendee as checked in without API confirmation.

### API Requirements

Each active registration must have a secure QR token.

The token must be random and difficult to guess.

Do not use only the MongoDB registration ID as the QR value.

#### Required Operation

```http
POST /api/check-ins
```

Example request:

```json
{
  "qrToken": "secure-token-value"
}
```

#### Required Business Rules

The API must verify that:

- the requester is an organiser;
- the organiser owns the related event;
- the QR token belongs to a valid registration;
- the registration is active;
- the event is not cancelled;
- the attendee has not already checked in.

A successful check-in must:

- change the registration status;
- store the check-in date and time;
- return enough information for the organiser to confirm the attendee and event.

### Acceptance Criteria

Acceptance criteria for this feature:
- successful QR generation;
- successful QR scanning;
- valid check-in;
- invalid-token rejection;
- duplicate-check-in rejection;
- rejection when the organiser does not own the event;
- correct attendee and event confirmation in Android.

## 5. Android-to-API Integration

### Android Requirements

The Android client must:

- communicate with the Node API using Retrofit;
- use an architecture that separates Compose UI, ViewModel, repository and Retrofit service;
- avoid making API calls directly from composables;
- retrieve a current Firebase ID token for protected requests;
- handle Firebase token expiry and refresh;
- use role data returned by the API to control navigation and available actions;
- convert API responses into clear loading, success, empty and error states.

When running the API on the development computer and using the Android emulator, use:

```text
http://10.0.2.2:<port>/
```

Do not use `localhost` from the emulator.

The Android app must handle at least:

- no network connection;
- unavailable API;
- `401 Unauthorized`;
- `403 Forbidden`;
- validation errors;
- full events;
- closed registration;
- duplicate registration;
- invalid QR code;
- duplicate check-in.

Display meaningful user-facing messages rather than raw stack traces or server output.

### API Requirements

The API must:

- expose a consistent JSON contract for Android;
- return appropriate HTTP status codes;
- return predictable error objects;
- support authenticated requests from the Android client;
- avoid relying on values such as role, Firebase UID, organiser ownership or registration counts supplied by Android;
- handle malformed and incomplete requests safely.

Example error response:

```json
{
  "message": "Registration has closed"
}
```

### Acceptance Criteria

Acceptance criteria for this feature:
- Android can call public and protected endpoints;
- authenticated requests include a valid Firebase ID token;
- expired or invalid authentication is handled correctly;
- API validation messages are displayed appropriately;
- the emulator communicates successfully with the locally running API.

## 6. Application Quality

### Android Requirements

The Android project must include:

- clear separation between UI, state and data access;
- lifecycle-aware asynchronous work;
- stable navigation;
- reusable Compose components where appropriate;
- input validation;
- meaningful loading and error states;
- no secrets committed to source control.

### API Requirements

The API must use a maintainable structure with appropriate separation of responsibilities.

The implementation should include:

- routes;
- controllers;
- services where appropriate;
- Mongoose models;
- authentication middleware;
- role and ownership checks;
- input validation;
- centralised error handling;
- environment-based configuration;
- consistent JSON responses.

Do not expose:

- Firebase service-account data;
- MongoDB credentials;
- stack traces;
- internal security fields;
- private keys.

## 7. Testing

### Android Requirements

Test at least:
- successful Google Sign-In;
- failed sign-in;
- user synchronisation;
- event loading;
- empty event list;
- event creation and editing;
- registration;
- cancellation;
- QR display;
- QR scanning;
- organiser and attendee role behaviour;
- API and network errors;
- sign-out.

### API Requirements

Create automated tests for at least:
- Firebase authentication middleware;
- role-based protection;
- user synchronisation;
- event creation;
- event ownership;
- event validation;
- duplicate registration;
- capacity enforcement;
- registration deadlines;
- valid check-in;
- invalid QR token;
- duplicate check-in.

Mock Firebase token verification where appropriate.

### Regression Testing

After each major stage, confirm that completed functionality still works.

Recommended checkpoints:

```text
Authentication
User synchronisation
Event management
Registration
QR pass
Check-in
```


## 8. Security Requirements

### Android Requirements

The Android application must:

- obtain identity through Firebase Authentication;
- send current Firebase ID tokens only over appropriate network connections;
- avoid storing Google passwords;
- avoid treating hidden UI controls as authorization;
- avoid sending trusted role or ownership decisions to the API;
- keep local configuration and secrets out of Git.

### API Requirements

The API must:

- keep `.env` out of Git;
- keep Firebase Admin credentials out of Git;
- keep MongoDB credentials out of Git;
- verify Firebase ID tokens on protected routes;
- enforce roles;
- enforce event ownership;
- validate input;
- prevent duplicate registration at database level;
- use secure QR tokens;
- reject reused QR tokens;
- avoid trusting role, identity or ownership data supplied by Android.

The Android user interface is not the security boundary.

## 9. Development Checkpoints

### Checkpoint 1 — Authentication

#### Android

- Google Sign-In works;
- the Firebase ID token is obtained;
- the CampusPass profile and role are loaded.

#### API

- Firebase ID tokens are verified;
- MongoDB profiles are synchronised;
- attendee and organiser roles are enforced.

### Checkpoint 2 — Events

#### Android

- attendees browse published events;
- organisers create and manage their own events.

#### API

- event validation works;
- organiser ownership is enforced;
- invalid state changes are rejected.

### Checkpoint 3 — Registrations

#### Android

- attendees register and cancel;
- registration history and statuses are displayed.

#### API

- duplicate registration is prevented;
- capacity and deadlines are enforced;
- organiser access is restricted correctly.

### Checkpoint 4 — QR Check-In

#### Android

- valid QR passes are displayed;
- organisers scan and submit passes;
- check-in results are displayed.

#### API

- QR tokens are validated;
- duplicate check-in is prevented;
- event ownership is enforced.

### Checkpoint 5 — Testing and Documentation

- automated API tests pass;
- Android workflows are tested;
- error handling is complete;
- documentation is complete.

Commit after each meaningful milestone.

## 10. Submission Requirements

Submit:
- Monorepo with Android app and Node API repository;
- README including:
  - API endpoint documentation;
  - environment-variable template;
  - setup instructions;
  - automated test evidence;
  - screenshots or a screen recording;
  - explanation of the data model and business rules.

Do not submit:
- Actual `.env`;
- MongoDB credentials;
- Firebase private keys;
- Firebase service-account files;
- build output;
- IDE-specific temporary files.

