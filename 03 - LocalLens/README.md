# LocalLens App

## Objective

Build a real-world, user-friendly location-aware news app which you can name on your own.

This app must allow users to:
* Retrieve news from the World News API,
* View news from their current country based on their location.
* Manually select another country
* Browse the returned results
* Read a selected article
* Handle incomplete or unavailable data without crashing.

Unlike the previous app, this app will connect to an API that requires an API key and will use the device location. You will therefore need to work with authenticated HTTP requests, runtime permissions, location services, reverse geocoding, REST APIs, JSON responses, asynchronous programming, and network-related errors.

## App Concept

The app must allow users to discover news using the World News API with:
* A home screen displaying news from a selected country
* An option to use the device location to determine the user’s current country
* The latitude and longitude retrieved from the device displayed to the user
* A manual country selection option
* A results screen containing news article cards
* Article cards showing suitable information such as:
  * Headline
  * Summary
  * Source country
  * Category
  * Authors, where available
  * Publication date
  * Article image, where available
* An action to open the full article in the device browser
* Filtering by news category
* Loading, empty, success, permission, and error states
* Retry functionality when a request fails
* Pagination or a “Load more” option
* All news information loaded from the World News API

Your app should have its own name, visual identity, and theme.

## World News API

You will use the World News API.

### Official World News API documentation:

* World News API documentation: https://worldnewsapi.com/docs/
* Search News endpoint: https://worldnewsapi.com/docs/search-news/
* Authentication: https://worldnewsapi.com/docs/authentication/
* Rate limiting and quotas: https://worldnewsapi.com/docs/quotas-and-rate-limiting/
* Country codes: https://worldnewsapi.com/docs/country-codes/
* News sources by country: https://worldnewsapi.com/docs/news-sources/

You must register for your own API key - DO NOT PAY!

Do not place your API key directly inside a Kotlin source file and do not commit it to GitHub.

A suitable request may resemble:

```http
GET https://api.worldnewsapi.com/search-news
    ?source-countries=za
    &language=en
    &earliest-publish-date=2026-07-09
    &number=20
    &offset=0
    &api-key=YOUR_API_KEY
```

The actual earliest publication date should be calculated dynamically rather than hardcoded permanently.

The API response provides information such as:

* Article ID
* Title
* Full text
* Summary
* URL
* Image URL
* Video URL
* Publication date
* Authors
* Category
* Language
* Source country
* Sentiment
* Total number of available results

Not every article will contain an image, summary, author, category, video, or other optional field. Your app must handle missing and `null` data correctly.

### API key handling

Store the API key using an appropriate local configuration approach, such as `local.properties`, and expose it to the app through a generated configuration field.

Your repository must:

* Exclude the working API key from version control
* Include instructions explaining how another developer can add their own key
* Fail gracefully when the API key is missing
* Avoid printing the full key in logs or error messages

Keeping the key outside the Git repository prevents accidental exposure in source control, but does not make it completely secret inside a compiled Android application.

### Pagination and quota use

The API supports the `number` and `offset` parameters.

For example:

```text
First request:
number=20
offset=0

Second request:
number=20
offset=20

Third request:
number=20
offset=40
```

Avoid requesting 100 articles every time. Use a smaller page size and load more results only when requested by the user. Your app should avoid unnecessary repeated calls because the API account has a daily request quota.

## Location Guidance
The app must use Android location services to retrieve the device location.

### Official Android documentation:
* Location permissions: https://developer.android.com/develop/sensors-and-location/location/permissions
* Retrieve the current location: https://developer.android.com/develop/sensors-and-location/location/retrieve-current
* Request runtime permissions: https://developer.android.com/training/permissions/requesting
* Geocoder: https://developer.android.com/reference/android/location/Geocoder
* Fused Location Provider: https://developers.google.com/location-context/fused-location-provider

The expected flow is:

```text
User selects “Use my location”
        ↓
App requests location permission
        ↓
FusedLocationProvider retrieves the current location
        ↓
Latitude and longitude are displayed
        ↓
Geocoder converts the coordinates into a country
        ↓
The country code is sent to the World News API
        ↓
News from that country is displayed
```

The app only requires location while it is being used. Background location is not required.

### Basic location guidance
Your solution will need to:
* Add the required coarse and fine location permissions to the manifest
* Request location permission at runtime
* Accept either approximate or precise location permission
* Create a `FusedLocationProviderClient`
* Request a fresh current location
* Read the latitude and longitude from the returned location
* Use `Geocoder` to retrieve the country name and two-letter country code
* Pass the country code to the World News API
* Display the retrieved coordinates in the interface
* Provide a manual country selection fallback

A current-location request may still return a cached location. When requesting a fresh location, investigate options such as:

```text
PRIORITY_HIGH_ACCURACY
setMaxUpdateAgeMillis(0)
```

The app should not assume that location retrieval or reverse geocoding will always succeed.

## Testing Location in the Emulator

You can simulate the emulator being located in Durban.

1. Run the app in the Android Emulator.
2. Open the emulator’s **Extended Controls** using the three-dot button.
3. Select **Location**.
4. Enter the following coordinates:

```text
Latitude: -29.8587
Longitude: 31.0218
```

5. Select **Set location**.
6. Return to the app.
7. Select **Use my location**.

The app should display coordinates close to:

```text
-29.8587, 31.0218
```

The reverse-geocoded country should be:

```text
South Africa
```

The country code sent to the World News API should be:

```text
za
```

After changing the emulator location, request the location again from the app.

## Error Handling

Your app should respond correctly when:

* The API key is missing
* The API key is invalid
* The API quota has been reached
* Too many requests are made
* The user has no internet connection
* The request times out
* The API returns an unsuccessful response
* No articles are returned
* A response contains incomplete or `null` data
* An article does not have an image
* An article does not have authors
* An article URL is invalid
* Location permission is denied
* Only approximate location permission is granted
* Location services are disabled
* The device location cannot be retrieved
* A cached location is returned
* Reverse geocoding fails
* The detected country has no returned news
* The user changes countries repeatedly
* The user changes categories repeatedly
* More results are being loaded

The app must not crash in any of these situations.

## Deliverables

You must submit a GitHub repository containing:

* Your project code including:
  * Retrofit and OkHttp configuration
  * Kotlin Serialization or Gson configuration
  * World News API service interface
  * API key configuration
  * Repository implementation
  * UI state handling
  * Location permission handling
  * Fused Location Provider integration
  * Reverse-geocoding logic
  * Country selection logic
  * Category filtering
  * Pagination or “Load more” logic
  * Input validation and error handling
* Assets including:
  * App icon
  * Splash screen
  * Any other visual assets used by your app
* A README including:
  * App name and tagline
  * App description
  * Screenshots or emulator screenshots
  * Feature list
  * Architecture overview
  * World News API acknowledgement
  * Explanation of API key handling
  * How to configure the API key
  * Explanation of the location flow
  * How to test the app using a simulated Durban location
  * How to run the app
  * Known limitations
* A Gradle build in the pipeline

Your repository must not contain a working API key.

## Optional Enhancements

You may also add:

* Keyword search
* Recent searches
* Saved articles
* Sharing an article
* Pull-to-refresh
* Sorting by publication date
* Filtering by language
* A preferred-country setting
* Remembering the last selected country
* A permission rationale screen
* An option to open device location settings
* Date and time formatting
* Sentiment indicators
* Animated loading placeholders
* A responsive grid layout
* Offline caching
* Unit tests for mapper, repository, or ViewModel logic
* UI tests for permission and error states

Good luck!