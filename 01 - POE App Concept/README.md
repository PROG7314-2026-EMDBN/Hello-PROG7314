# Activity 1 – App Concept and API Proposal

## Objective

Your task is to define a suitable mobile application concept for your PROG7314 Portfolio of Evidence (POE).

This activity will help you identify a genuine problem, define the users who experience that problem, and determine whether your proposed application is suitable for a native Android solution.

You will also begin thinking about the custom REST API that your application will use.

By completing this activity, you will have a clear app concept that can be submitted to your lecturer for approval before you begin your formal research and design work.

## Activity Description

You need to propose an original Android application that your group will research, design, build, test, and prepare for publication during the semester.

Your app must solve a clear problem for a specific group of users.

The application must be large enough to demonstrate intermediate Android development skills, but it must still be realistic for a group of no more than four students to complete during the semester.

Your app must use a custom hosted REST API that your group creates. The API must be connected to a database and must perform meaningful work for the application.

> Note: A simple app that only stores and displays basic records will not be sufficient. Your API and your user-defined features must contribute meaningfully to the main purpose of the application.

## Idea requirements
As this module and qualification encourage the development of applications that contribute positively to society, students are requested not to propose or develop applications centred on alcohol, gambling, or interest-based financial products. The lecturer is not sufficiently familiar with these domains to provide appropriate guidance on their development. App concepts should instead focus on constructive, ethical, and socially beneficial use cases. Games are acceptable, provided they do not fall within the categories listed above.

## Group Requirements

Your group must:
- Include no more than four students
- Select one person to submit the proposal
- Ensure that every group member contributes to the idea
- Agree on the problem, target users, and main purpose of the app
- Ensure that the proposed scope is achievable within the semester

## App Concept

Provide the following information about your proposed application:

### App Name

Provide a working name for your application.

The name can change later, but it should clearly relate to the purpose of the app.

### Problem Statement

Explain:

- What problem your app will solve
- Who experiences this problem
- Why the problem is worth solving
- What users currently do without your app

### Target Users

Describe the main users of your application.

Include:

- Who they are
- What they need
- How they are expected to use the app
- Why a mobile app is appropriate for them

### Proposed Solution

Explain how the app will solve the identified problem.

Your explanation should include:

- The main purpose of the app
- The main user journey
- The most important actions users will perform
- The value the app will provide

## Why This Should Be a Mobile App

Explain why your solution is suitable for a native Android application rather than only a website or desktop application.

Consider features such as:

- Notifications
- Camera or image capture
- Location
- Offline use
- Biometrics
- Device storage
- Quick access while away from a computer
- Other Android device capabilities

You do not need to use all these features. Select only those that make sense for your app.

## Custom REST API

Your application must connect to a custom REST API created by your group.

Explain:

- What information the API will store
- What processing or business logic the API will perform
- Which features will depend on the API
- Why the API is necessary
- What would stop working if the API were unavailable

List at least five possible API endpoints.

For example:

```text
GET /api/items
GET /api/items/{id}
POST /api/items
PUT /api/items/{id}
DELETE /api/items/{id}
```

Your endpoints must relate to your own application. Do not copy the example endpoint names.

## Required POE Features

Explain briefly how your concept could make sensible use of each of the following:

### Single Sign-On

Explain why users need accounts and what will be linked to their profiles.

### Settings

Identify at least three settings that would meaningfully affect the application.

### Biometric Authentication

Explain what part of the application could be protected using fingerprint or facial recognition.

### Offline Mode and Synchronisation

Identify at least one useful action that users should be able to perform without an internet connection.

Explain what should happen when the device reconnects.

### Real-Time Notifications

Explain what meaningful event could cause the user to receive a notification.

### Multi-Language Support

Identify at least two official South African languages that could be supported.

Explain why these languages are appropriate for your target users.

## User-Defined Features

List at least five additional features that are specific to your app.

For each feature:

- Give it a clear name
- Explain what it does
- Explain why users need it

Your features must support the main purpose of the app.

Do not add random features only to increase the feature count.

## Similar Applications

Identify three existing Android applications that are similar to your idea.

They do not need to be identical to your proposed app.

Each app should include at least some similar:

- Features
- User journeys
- Target users
- Interface ideas
- Technical capabilities

For each app, provide:

- App name
- Google Play Store link
- A short explanation of why it is relevant

> Note: This is not your formal POE research report. At this stage, you are only confirming that suitable applications exist for later comparison.

## Technical Feasibility

Provide an initial proposal for the following:

- Android development language
- UI framework
- API development technology
- API database
- Hosting platform
- Authentication provider
- External libraries or SDKs that may be required

You may change these choices later if your research identifies a better option.

## Risks and Limitations

Identify at least three possible risks.

Examples include:

- The scope may be too large
- An external service may require payment
- An API may have usage limits
- The app may require sensitive personal data
- A feature may be difficult to test
- Group members may not have access to suitable devices
- The concept may depend too heavily on an external service

For each risk, briefly explain how the group could reduce it.

## Submission for Approval

Prepare a short proposal using the headings in this activity. You will discuss this with your lecturer in class on 17 July 2027 (5 to 10 mins per group).

Your group must submit the proposal to your lecturer for approval before beginning the formal POE research and planning documents.

Your lecturer may respond with one of the following:

- **Approved** – You may continue with the proposed concept
- **Approved with changes** – You may continue after making the required changes
- **Not approved** – You must revise the idea or submit a different concept

Do not assume that submitting the proposal means that it has been approved.

## Minimum Requirements

To be considered complete, your proposal must:

- Identify a clear problem
- Identify suitable target users
- Explain why a native Android app is appropriate
- Describe a realistic and coherent solution
- Include a meaningful custom REST API
- List at least five possible API endpoints
- Explain how all compulsory POE features could fit the app
- Include at least five meaningful user-defined features
- Identify three similar Android applications
- Include an initial technology proposal
- Identify at least three risks
- Be submitted for lecturer approval

## Optional Enhancements

You may also include:

- A simple app icon concept
- A rough screen sketch
- A basic navigation flow
- A draft data model
- A diagram showing the app, API, and database
- A short recorded concept pitch

These additions are optional and do not replace any of the minimum requirements.

## Reflection

Be prepared to explain:

- Why this app is worth building
- Why the API is important to the solution
- Which feature will be the most technically challenging
- Which feature provides the most value to users
- What you would remove first if the project became too large
- How your app differs from the three similar applications

