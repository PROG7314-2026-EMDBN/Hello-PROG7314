# Introducing Wear OS

We have spent the semester building Android applications for phones. For our final activity, we are going to build a standalone smartwatch application.

The app is called Focus Tally. It is a simple Wear OS application that counts completed focus sessions.

You do not need a smartwatch. We will create a new Android Studio project and run it on a Wear OS emulator.

This is a separate application. Do not use or modify the Sandbox.

## Research

Before starting, spend a few minutes researching Wear OS. Answer these questions briefly, in your own words:

- What is Wear OS?
- How is developing for a smartwatch different from developing for a phone?
- Why do small, round screens affect interface design?
- What is Jetpack Compose for Wear OS?
- Can a Wear OS app work without being connected to an Android phone?

References:
- https://developer.android.com/training/wearables/get-started/creating
- https://developer.android.com/training/wearables/compose


## 1 – Create a New Wear OS Project

Open Android Studio and create an entirely new project:

1. Select New Project.
2. Under Wear OS, select Empty Wear App (the exact template name may vary slightly with Android Studio versions).
3. Use the following configuration:

```text
Name: FocusTallyWearOS
Package name: com.prog7314.focustallywear
Language: Kotlin
Build configuration: Kotlin DSL
```

4. Finish creating the project and wait for Gradle to sync.
5. Find the `MainActivity.kt` that Android Studio created.
6. Run the default watch app before changing its code.

Your new project should look roughly like this:

```text
FocusTallyWearOS/
├── app/
│   └── src/main/
│       ├── AndroidManifest.xml
│       └── java/com/prog7314/focustallywear/MainActivity.kt
├── build.gradle.kts
└── settings.gradle.kts
```

Checkpoint: You should have a separate Wear OS project, not another module inside an existing app.

## 2 – Create a Wear OS Emulator

1. Open Tools → Device Manager in Android Studio.
2. Choose Create Device.
3. Select a Wear OS device profile. Use a round watch profile.
4. Download a suitable Wear OS system image if prompted.
5. Start the emulator.
6. Run your new app on the watch emulator.

You do not need to pair the watch emulator with a phone emulator for this activity.

Checkpoint: Can you install and launch your new application on the watch emulator?

## 3 – Build Focus Tally

Replace the default starter screen with a simple counter. Your application must display:

- the title Focus Tally;
- the number of completed sessions;
- an +1 session button that increases the number; and
- a Reset button that sets the number back to zero.

Use Jetpack Compose for Wear OS. You already know how Compose state and buttons work from the Android applications we built this semester.

Consider the following:

- Use Wear OS-specific Compose components rather than copying a phone screen.
- Make sure the content fits on a small, round watch display.
- Manage the counter using Compose state, such as `rememberSaveable`.
- If necessary, allow the user to scroll so that both buttons remain accessible.

`rememberSaveable` can restore UI state after activity recreation. It does not guarantee that your counter will persist after the application is completely closed and relaunched.

For this activity you do not need an API, database, phone connection, authentication or sensors.

## 4 – Run and Test

Run the application on your Wear OS emulator and check the following:

1. The app launches independently on the watch emulator.
2. The title and counter are readable on the round screen.
3. Tapping +1 session increases the counter by exactly one.
4. Tapping Reset returns the counter to zero.
5. All controls can be reached, including on a small screen.
6. The application does not crash when you switch between it and the watch home screen.

Take a screenshot of the running application.

If the app does not work, start with Build Output and Logcat to investigate the issue.


## 5 – Make One Small Improvement

Choose one of the following improvements:

- Add a -1 session button that never allows a negative number.
- Display a short message when the user reaches five sessions.
- Save the counter so that it remains available after closing and reopening the app.
- Improve the layout for a smaller round watch screen.

Implement your improvement and briefly explain what you changed in your README.

## 6 – Commit and Push

Create a new GitHub repository for Focus Tally. This should not be committed to your Sandbox repository.

Include:
- your working Wear OS project;
- at least one screenshot of the app running in the emulator; and
- a short README explaining your improvement and what you tested.

END!