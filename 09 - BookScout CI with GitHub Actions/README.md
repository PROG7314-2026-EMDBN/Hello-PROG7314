# BookScout – Continuous Integration with GitHub Actions

In the previous activity, we added unit tests and an integration test to BookScout.

We can run all of them locally with:

```powershell
./gradlew testDebugUnitTest
```

That is useful, but it still depends on us remembering to run the tests.

In this activity, we are going to make GitHub do it for us.

Every time we push code, GitHub Actions will:

```text
check out BookScout
       ↓
set up Java and Gradle
       ↓
run unit and integration tests
       ↓
build an APK
       ↓
build an AAB
       ↓
store both as workflow artifacts
```

We are building a simple Continuous Integration pipeline for Android.

## Research

Before you start, spend 10–15 minutes researching GitHub Actions and Android Continuous Integration.

Answer briefly:

- What is Continuous Integration?
- What is GitHub Actions?
- What is a workflow?
- What is a job?
- What is a step?
- What is a runner?
- What is YAML?
- What is a workflow artifact?
- What is an APK?
- What is an Android App Bundle (AAB)?
- Why should tests run before the APK and AAB are built?
- Can MockWebServer integration tests run inside GitHub Actions?

Write a short summary in your own words and commit it to your repo.

## 1 - Start From Your Tested BookScout Project

Use the same BookScout repository from Activity 08. Do not create a new Android project or a new repository.

Make sure everything works locally:

1. Run:

    ```powershell
    ./gradlew testDebugUnitTest
    ```

1. Confirm that both your unit tests and MockWebServer integration test pass.

1. Run:

    ```powershell
    ./gradlew assembleDebug
    ```

1. Run:

    ```powershell
    ./gradlew bundleDebug
    ```

All three commands should complete successfully before you add GitHub Actions.

Do not build a CI pipeline around a project that is already failing locally.

## 2 - Create the Workflow Folder

At the root of your repository, create:

```text
.github
└── workflows
    └── android-ci.yml
```

The exact location matters.

GitHub automatically looks inside `.github/workflows/` for workflow files.

## 3 - Name the Workflow

Open `.github/workflows/android-ci.yml` and add:

```yaml
name: BookScout Android CI
```

This is the name that will appear under the **Actions** tab in GitHub.

## 4 - Decide When the Workflow Runs

Add:

```yaml
on:
  push:
    branches:
      - main

  pull_request:
    branches:
      - main
```

This tells GitHub to run the workflow when:

```text
code is pushed to main
OR
a pull request targets main
```

If your repository uses `master`, use `master` instead.

Do not blindly copy a branch name that does not exist in your repository.

## 5 - Create the Job

Add:

```yaml
jobs:

  test-and-build:

    runs-on: ubuntu-latest
```

We now have one job called:

```text
test-and-build
```

GitHub will run it on an Ubuntu runner.

## 6 - Check Out the Repository

Add the first step:

```yaml
steps:

  - name: Check out repository
    uses: actions/checkout@v4
```

A GitHub runner starts as a clean machine.

This step downloads your repository onto the runner so that the workflow can work with your code.

## 7 - Set Up Java

Add:

```yaml
  - name: Set up Java
    uses: actions/setup-java@v4
    with:
      distribution: temurin
      java-version: "17"
```

Android and Gradle need Java to run.

We are explicitly setting up Java rather than assuming that the runner has the exact version we want.

## 8 - Set Up Gradle

Add:

```yaml
  - name: Set up Gradle
    uses: gradle/actions/setup-gradle@v4
```

This prepares Gradle on the GitHub runner.

Then add:

```yaml
  - name: Make Gradle wrapper executable
    run: chmod +x gradlew
```

The GitHub runner is Linux-based, so the Gradle wrapper must be executable.

## 9 - Run Unit and Integration Tests

Add:

```yaml
  - name: Run unit and integration tests
    run: ./gradlew testDebugUnitTest
```

This is the same command that you ran locally in Activity 08.

It runs:

```text
OpenLibraryRepositoryTest
+
OpenLibraryIntegrationTest
```

The MockWebServer integration test still does not call the real Open Library API.

MockWebServer runs locally inside the GitHub Actions runner.

If any test fails, the workflow should stop here.

## 10 - Build the APK

Add:

```yaml
  - name: Build APK
    run: ./gradlew assembleDebug
```

If the build succeeds, Gradle should create:

```text
app/build/outputs/apk/debug/app-debug.apk
```

An APK can be installed directly on a compatible Android device.

## 11 - Build the AAB

Add:

```yaml
  - name: Build AAB
    run: ./gradlew bundleDebug
```

If the build succeeds, Gradle should create:

```text
app/build/outputs/bundle/debug/app-debug.aab
```

An AAB is an Android App Bundle.

Google Play normally uses an AAB to generate optimised APKs for different devices.

For this activity, we are only building the AAB. We are not publishing the app.

## 12 - Upload the APK

The GitHub runner is temporary.

If we want to keep the APK after the workflow finishes, we need to upload it as an artifact.

Add:

```yaml
  - name: Upload APK
    uses: actions/upload-artifact@v4
    with:
      name: bookscout-debug-apk
      path: app/build/outputs/apk/debug/app-debug.apk
      if-no-files-found: error
```

After a successful workflow run, GitHub will keep the APK as a downloadable artifact.

## 13 - Upload the AAB

Add:

```yaml
  - name: Upload AAB
    uses: actions/upload-artifact@v4
    with:
      name: bookscout-debug-aab
      path: app/build/outputs/bundle/debug/app-debug.aab
      if-no-files-found: error
```

We now preserve both Android build outputs.

## 14 - Check the Complete Workflow

Your complete `.github/workflows/android-ci.yml` should look similar to:

```yaml
name: BookScout Android CI

on:
  push:
    branches:
      - main

  pull_request:
    branches:
      - main

jobs:

  test-and-build:

    runs-on: ubuntu-latest

    steps:

      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Java
        uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: "17"

      - name: Set up Gradle
        uses: gradle/actions/setup-gradle@v4

      - name: Make Gradle wrapper executable
        run: chmod +x gradlew

      - name: Run unit and integration tests
        run: ./gradlew testDebugUnitTest

      - name: Build APK
        run: ./gradlew assembleDebug

      - name: Build AAB
        run: ./gradlew bundleDebug

      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: bookscout-debug-apk
          path: app/build/outputs/apk/debug/app-debug.apk
          if-no-files-found: error

      - name: Upload AAB
        uses: actions/upload-artifact@v4
        with:
          name: bookscout-debug-aab
          path: app/build/outputs/bundle/debug/app-debug.aab
          if-no-files-found: error
```

If your repository uses `master`, change the branch name before continuing.

## 15 - Commit and Push the Workflow

Commit `.github/workflows/android-ci.yml`.

Then push your changes to GitHub.

Open your repository and select:

```text
Actions
```

You should see:

```text
BookScout Android CI
```

running.

Open the workflow run and watch the steps.

Do not only wait for a green tick. Open the steps and see what GitHub is actually doing.

## 16 - Check the Test Step

Open:

```text
Run unit and integration tests
```

GitHub should run:

```powershell
./gradlew testDebugUnitTest
```

This should execute both types of tests from Activity 08:

```text
unit tests
+
MockWebServer integration test
```

If one of these tests fails, the workflow should stop and the APK and AAB should not be built.

That is exactly what we want.

## 17 - Check the APK Build

Open:

```text
Build APK
```

The command should be:

```powershell
./gradlew assembleDebug
```

If successful, GitHub will create:

```text
app-debug.apk
```

on the runner.

## 18 - Check the AAB Build

Open:

```text
Build AAB
```

The command should be:

```powershell
./gradlew bundleDebug
```

If successful, GitHub will create:

```text
app-debug.aab
```

on the runner.

## 19 - Download the Artifacts

After the workflow completes successfully, open the workflow run and find the artifacts.

You should see:

```text
bookscout-debug-apk
bookscout-debug-aab
```

Download both.

The APK and AAB were built by GitHub Actions, not by Android Studio on your own computer.

## 20 - Prove That the Pipeline Protects the Project

Temporarily break one of your Activity 08 tests.

For example, change an expected value so that the test fails.

1. Commit and push the broken test.

1. Open GitHub Actions.

1. Confirm that the workflow fails during:

    ```text
    Run unit and integration tests
    ```

1. Confirm that the APK and AAB build steps do not complete.

1. Fix the test.

1. Commit and push again.

The workflow should return to green.

A green pipeline should mean that the tests passed and the application could be built successfully.

## 21 - What If Your App Uses Secrets?

BookScout does not need a secret to call Open Library.

Your own POE might use:

```text
API keys
Firebase configuration
backend URLs
other credentials
```

Do not hard-code private secrets into your workflow file.

GitHub Actions provides:

```text
Repository
    ↓
Settings
    ↓
Secrets and variables
    ↓
Actions
```

for values that should not be committed to your repository.

For example, a project that requires `google-services.json` can recreate that file inside the runner from a GitHub Actions secret.

Do not add secrets just for the sake of demonstrating secrets. Use them when your project actually needs them.

## 22 - Run Through the Pipeline One Last Time

Make sure your final workflow completes successfully.

Confirm that:

```text
unit tests pass
integration test passes
APK builds
AAB builds
APK artifact is available
AAB artifact is available
```

You can download both artifacts if you'd like.