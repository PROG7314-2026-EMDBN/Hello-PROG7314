# LocalLens: Google SSO and Biometric App Lock

## Overview

In this activity, you will extend **your own working LocalLens application** with:

- Google Sign-In using Firebase Authentication;
- a persistent signed-in session;
- sign-out;
- an optional biometric app lock.

The completed reference implementation is available in the Sandbox project. You should use the Sandbox code to understand the implementation, but you must adapt it to your own LocalLens structure.

Your LocalLens project may use different:

- package names;
- screen names;
- ViewModels;
- navigation structures;
- settings interfaces;
- activity layouts.

Do not replace your working application with the Sandbox structure.

Complete the activity in two stages:

1. Google SSO, followed by testing.
2. Biometrics, followed by testing.


# 0. Prepare your project

Before making changes:
1. Run your LocalLens application.
2. Confirm that news, location and any other existing features work.
3. Commit the working version.


Record the following from your own project:

| Item | Your project |
|---|---|
| `applicationId` | |
| Main Kotlin package | |
| Activity containing `setContent` | |
| Root app composable or `NavHost` | |
| Main news screen | |
| Suitable sign-out location | |
| Suitable biometric setting location | |

You will need these details when adapting the Sandbox implementation.

# Stage 1: Google SSO

## 1. Configure Firebase for your LocalLens app

### 1.1. Register your application

In Firebase Console:

1. Create a Firebase project or open the project you intend to use.
2. Add an Android application.
3. Enter the exact `applicationId` from your own `app/build.gradle.kts`.
4. Do not use the lecturer or Sandbox package name.

### 1.2 Add signing fingerprints

From the project root, run:

#### Windows

```text
gradlew signingReport
```

#### macOS or Linux

```text
./gradlew signingReport
```

Copy the debug **SHA-1** and **SHA-256** values into the Android application settings in Firebase.

#### Troubleshooting steps
If you get an error that Java is not found, you can temporarily set the JAVA_HOME env
1. Go to: File → Settings → Build, Execution, Deployment → Build Tools → Gradle
Look at Gradle JDK.
2. Confirm that your JDK is at: `C:\Program Files\Android\Android Studio\jbr` or `C:\Program Files\Android\Android Studio\jbr\bin`
3. In PowerShell, on Windows, run:
    ```
    $env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
    $env:Path="$env:JAVA_HOME\bin;$env:Path"
    ```
    If using Mac, run:
    ```
    export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
    export PATH="$JAVA_HOME/bin:$PATH"
    ```
4. Then, in your project folder
    ```
    .\gradlew signingReport
    ```
### 1.3 Enable Google authentication

In Firebase Console:

1. Open **Authentication**.
2. Open **Sign-in method**.
3. Enable **Google**.
4. Select a project support email.
5. Save the provider.

### 1.4 Add `google-services.json`

Download a new `google-services.json` after enabling Google authentication.

Place it here:

```text
LocalLens/
└── app/
    └── google-services.json
```

Do not place it in the project root.

## 2. Add the Google SSO code

Use the completed Google SSO implementation in Sandbox as the reference.

Locate and adapt the equivalent files for:

- the Google Services Gradle plugin;
- Firebase Authentication dependencies;
- Credential Manager dependencies;
- `GoogleAuthClient`;
- `AuthRepository`;
- `AuthUiState`;
- `AuthViewModel`;
- the Google sign-in section of `AuthScreen`.

When copying code:

- change all package declarations to match your own project;
- change imports to your own `R` class;
- keep your existing news and location code;
- do not copy unrelated Sandbox features;
- reuse an existing authentication architecture if your project already has one.

After adding the Gradle configuration:

1. Sync Gradle.
2. Rebuild the project.
3. Confirm that this resource resolves:

```kotlin
R.string.default_web_client_id
```

If it does not resolve, check:

- Google authentication is enabled in Firebase;
- the latest `google-services.json` is inside `app/`;
- the Google Services plugin is applied to the app module;
- the Firebase package name matches your `applicationId`.

## 3. Add the Google SSO gate to your app

This step must be completed before testing Google SSO.

Find the part of your project that currently opens the LocalLens content.

It may look similar to one of these:

```kotlin
NewsScreen(...)
```

```kotlin
LocalLensApp(...)
```

```kotlin
AppNavGraph(...)
```

Keep that existing call. Place it behind a Firebase authentication check.

The required behaviour is:

```text
No Firebase user  → show login screen
Firebase user     → show the existing LocalLens app
```

A simplified pattern is:

```kotlin
val currentUser by authViewModel.currentUser.collectAsStateWithLifecycle()

when {
    currentUser == null -> {
        AuthScreen(
            // Adapt the Sandbox arguments to your project
        )
    }

    else -> {
        ExistingLocalLensContent(
            // Keep your existing arguments
        )
    }
}
```

`ExistingLocalLensContent` is a placeholder. Replace it with the root content already used by your application.

## 5. Sign-out

Add a visible sign-out action to an appropriate screen in your own app.

On sign-out:

1. sign out of Firebase;
2. clear Credential Manager state using the Sandbox implementation;
3. return to the login interface.

## 6. Test Google SSO

Complete all tests before adding biometrics.

### 6.1 Signed-out state

1. Clear the app data or sign out.
2. Launch LocalLens.
3. Confirm that the news interface is not shown.
4. Confirm that the Google sign-in option is shown.

### 6.2 Sign in

1. Select Continue with Google.
2. Choose a Google account.
3. Confirm that LocalLens opens after successful authentication.
4. Confirm that the Firebase Console shows the user under Authentication → Users.

### 6.3 Session persistence

1. Close LocalLens.
2. Open it again.
3. Confirm that the user remains signed in.

### 6.4 Sign out

1. Use the sign-out action.
2. Confirm that the login interface returns.
3. Sign in with the same or another Google account.

### 6.5 Regression testing

Confirm that your original LocalLens features still work, including:

- news retrieval;
- loading and error states;
- location permission;
- location detection;
- article interaction;
- any additional features in your version.

Do not continue until Google SSO works correctly.



# Stage 2: Biometric app lock

## 1. Add biometric support

Use the completed biometric implementation in Sandbox as the reference.

Locate and adapt the equivalent code for:

- the AndroidX Biometric dependency;
- the DataStore Preferences dependency;
- `BiometricPreferencesRepository`;
- `BiometricAuthManager`;
- `BiometricLockScreen`;
- the biometric setting in `SettingsScreen`.

Your app may not have a `SettingsScreen`. Place the setting in a suitable existing location, such as:

- a settings screen;
- a profile screen;
- a toolbar menu;
- a security dialog.

The setting must allow the user to:

- enable biometric locking;
- authenticate before enabling it;
- disable biometric locking.

Biometrics must not replace Firebase Authentication. They only unlock a Firebase session that already exists on the device.

---

## 2. Update the app gate for biometrics

After the biometric classes and setting are complete, update the same root authentication gate used in Stage 1.

The final behaviour must be:

```text
Preference loading        → show loading state
No Firebase user          → show login screen
Signed in and locked      → show biometric lock screen
Signed in and unlocked    → show existing LocalLens app
```

### Important state rules

The biometric preference must initially load as `null`, not `false`:

```kotlin
val biometricEnabled by biometricRepository.enabled.collectAsState(
    initial = null
)
```

A fresh app process must begin locked:

```kotlin
var sessionUnlocked by rememberSaveable {
    mutableStateOf(false)
}
```

Do not initialise `sessionUnlocked` using the temporary initial DataStore value.

Use the following order in your root `when` block:

```kotlin
when {
    biometricEnabled == null -> {
        LoadingContent()
    }

    currentUser == null -> {
        AuthScreen(...)
    }

    biometricEnabled == true && !sessionUnlocked -> {
        BiometricLockScreen(
            onUnlock = {
                // Call BiometricAuthManager as demonstrated in Sandbox
            },
            onLogout = {
                // Sign out and clear credential state
            }
        )
    }

    else -> {
        ExistingLocalLensContent(...)
    }
}
```

Replace `LoadingContent` and `ExistingLocalLensContent` with suitable code from your own application.

If `BiometricPrompt` requires it, change the activity from:

```kotlin
ComponentActivity
```

to:

```kotlin
FragmentActivity
```

Keep the rest of your existing activity logic intact.

Suggested commit:

```text
feat: add biometric app lock
```

---

## 3. Test biometrics

### 3.1 Prepare the device or emulator

The device must have:

- a PIN, password or pattern;
- at least one enrolled fingerprint or supported biometric.

On the emulator, enrol a fingerprint in Android settings. Use the emulator extended controls to send the enrolled fingerprint during testing.

### 3.2 Enable biometric locking

1. Sign in to LocalLens.
2. Enable biometric locking.
3. Complete the biometric confirmation.
4. Leave and reopen the setting.
5. Confirm that the setting remains enabled.

### 3.3 Test a fresh launch

1. Force-stop LocalLens.
2. Open it again.
3. Confirm that the biometric lock screen is shown.
4. Press **Unlock**.
5. Send the emulator fingerprint or authenticate on the physical device.
6. Confirm that LocalLens opens.

### 3.4 Test sign-out from the lock screen

1. Force-stop and reopen LocalLens.
2. From the biometric lock screen, choose sign-out.
3. Confirm that the Google login interface is shown.

### 3.5 Disable biometric locking

1. Sign in and unlock the app.
2. Disable biometric locking.
3. Force-stop and reopen LocalLens.
4. Confirm that the signed-in app opens without the biometric lock screen.

### 3.6 Final regression test

Confirm again that all original LocalLens features still work.

