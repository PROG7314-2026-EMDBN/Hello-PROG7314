# Country Compass Troubleshooting Challenge

## Overview

Country Compass is an Android application that allows users to search for countries, view country details and explore bordering countries.

The application builds and runs, but testing has identified inconsistent behaviour. Your task is to analyse the application, complete the troubleshooting scenario on Arc, and then implement a reliable correction in code.

## Learning Outcomes

By completing this activity, you should be able to:
* trace data across a Retrofit service, repository, ViewModel and Compose navigation;
* distinguish between values used for searching, displaying and identifying data;
* reproduce a software defect using controlled test cases;
* use evidence to identify a root cause;
* connect multiple symptoms to a common underlying problem;
* implement and verify a correction without patching individual examples.
* 
## Resources

* Country Compass Repository: https://github.com/PROG7314-2026-EMDBN/CountryCompass
* The **Country Compass Troubleshooting Challenge** H5P activity on Arc
* Android Studio
* An Android emulator or device with internet access

## REST Countries API v5 Setup

Country Compass uses the current REST Countries API v5.

You must create a free REST Countries account and use your own API key. **Do not pay for an API key.**

1. Visit `https://restcountries.com` and create an account.
2. Generate or copy an API key from the dashboard.
3. Open `local.properties` in the Android project.
4. Add:

```properties
REST_COUNTRIES_API_KEY=your_api_key_here
```

Do not place the key in a Kotlin file, commit it to Git, include it in screenshots, nor submit `local.properties`.

The supplied project reads the value through `BuildConfig` and sends it to the API as a bearer token.

## Scenario

During testing, the following behaviour was reported:

* A search may return multiple valid countries.
* Selecting one of the displayed countries may open a different country from the one selected.
* Selecting a neighbouring country may fail to load any country information.
* The application does not crash when these issues occur.

Your task is to analyse the application, determine the root cause of the behaviour, and implement an appropriate fix.

Do not begin by rewriting large sections of the application. Reproduce the problem, inspect the existing implementation, trace the relevant values through the application and use the evidence to determine what is going wrong.

## Rules

1. Run and analyse the application before editing it.
2. You may inspect the source code, Logcat and use the debugger during your investigation.
3. Do not modify the source code until you have completed the Arc scenario.
4. Do not replace the API with hard-coded data.
5. Do not add special cases for individual countries.
6. Preserve the existing screen structure and architecture.
7. Your correction must work for both search results and bordering-country navigation.

## Part 1 - Reproduce and Analyse

Do not change the code yet.

1. Open the project in Android Studio and allow Gradle to sync.
2. Run the application.
3. Confirm that the API is working by testing several unique country searches.
4. Test searches that return more than one result.
5. Select different results and compare the country selected with the details displayed.
6. Open a country with land borders and select at least one border.
7. Record the expected and observed behaviour.
8. Inspect the existing code and trace the values passed through the application.
9. Form an initial explanation for the behaviour.

Your initial explanation does not need to be correct. The purpose of this stage is to gather evidence before making changes.

## Part 2 - Arc Scenario Activity

Complete the **Country Compass Troubleshooting Challenge** branching scenario on Arc.

The scenario will present additional evidence and ask you to make troubleshooting decisions based on the behaviour of the application and the existing code.

Complete the scenario individually before modifying the project.

Use the scenario to test your reasoning. If new evidence contradicts your initial explanation, revise your thinking.

## Part 3 - Correct the Code

Return to the Android project and implement a reliable correction.

Your solution must ensure that:

* the country selected in the search results is the country opened;
* the application does not depend on the ordering of search results;
* bordering-country selections load the expected country;
* the same approach works for all countries;
* existing loading and error behaviour remains functional.

Your solution should address the root cause rather than only making the examples you tested work.

Do not submit a correction that hard-codes specific countries or search terms.

## Part 4 - Verify

After implementing your correction, test the application again.

Record at least three tests. Your tests must include:
1. a search that returns a single obvious result;
2. a search that returns multiple results;
3. a bordering-country selection.

For each test, record:

* the search input or selected item;
* the expected result;
* the actual result after the correction;
* evidence confirming that the correct country was loaded.

At least one of your tests should use a country or border that was not used while reproducing the original problem.

## Submission

Claim repo: https://classroom50.org/EMKNDN/emkndn-prog7314-2026/assignments/countrycompass-challenge/accept

Submit in your repo:
* the Android Studio project with the fix
* your updated `README.md` outlining the fix

> Do not submit your API key or `local.properties`.

Fill in this survey: https://forms.cloud.microsoft/r/bAKej1Lbm5

## Reflection

In no more than 100 words, add a short reflection to your `README.md` explaining:
* what you initially thought was causing the problem;
* what evidence changed or confirmed your thinking;
* what you learnt about troubleshooting from the activity.
