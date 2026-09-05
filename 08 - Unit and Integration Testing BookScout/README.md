# Unit and Integration Testing BookScout

In BookScout, we already built an Android application that talks to the Open Library API.

We are not going to build another app for this activity.

Instead, we are going back to BookScout and asking a different question:

> How do we know that the logic inside our app keeps working when we change our code?

That is where automated testing comes in.

We will begin with unit tests. Then, we will add one integration test using MockWebServer so that we can see the difference between testing one piece of our code and testing several pieces working together.

## Research

Before you start coding, spend 10–15 minutes researching Android testing.

Answer briefly:
- What is a unit test?
- What is JUnit?
- Where are local unit tests stored in an Android project?
- What is the difference between `src/test` and `src/androidTest`?
- Why should a unit test not depend on a real internet connection?
- What is an assertion?
- What is an edge case?
- What does it mean for a test to be deterministic?
- What is an integration test?
- What is MockWebServer?

Write a short summary in your own words and commit it to your repo.

## 1 - Open Your Existing BookScout Project

Use the BookScout project that you completed earlier in the semester. Do not create another Android app.

Make sure it works:
1. Run BookScout.
1. Search for a book and confirm that the Open Library API still works.

If your app is broken, fix it before adding tests.

## 2 - Find the Test Folder

Locate:

```text
app
└── src
    ├── main
    ├── test
    └── androidTest
```

For this activity, we are working mainly in `app/src/test/`. These tests run locally on the JVM. They do not require an emulator.

## 3 - Check JUnit

Open `app/build.gradle.kts`.

You should already have JUnit configured, for example:

```kotlin
testImplementation(libs.junit)
```

or:

```kotlin
testImplementation("junit:junit:4.13.2")
```

If JUnit is already there, do not add another copy.

Sync Gradle if you made changes.

## 4 - What Are We Going to Test?

We do not want our first test to depend on:
```text
internet
Open Library uptime
network speed
rate limits
```

We will first test small pieces of our own logic.

Examples include:
- trimming search queries;
- rejecting blank searches;
- processing a successful response;
- handling an unsuccessful response;
- handling an empty response body.

The pattern is:
```text
controlled input
      ↓
our code
      ↓
expected output
```

## 5 - Add Testable Search Logic

Your BookScout implementation may not look exactly like the lecturer demo, which is fine. The important idea is to separate small deterministic pieces of logic from the network call.

For example, inside the repository add:

```kotlin
fun normaliseQuery(
    query: String
): String {
    return query.trim()
}

fun isValidQuery(
    query: String
): Boolean {
    return normaliseQuery(query)
        .isNotBlank()
}
```

Use these functions in the appropriate place in your existing search flow but do not rewrite the whole app.

Run BookScout again and confirm that it still behaves correctly.

## 6 - Create Your First Unit Test

Inside `app/src/test/java/...` create a test class such as:

```text
OpenLibraryRepositoryTest.kt
```

Add tests:

```kotlin
@Test
fun normaliseQuery_trimsWhitespace() {

    val result =
        OpenLibraryRepository
            .normaliseQuery(
                "  clean code  "
            )

    assertEquals(
        "clean code",
        result
    )
}
```

## 7 – Run the Test

1. Run the test from Android Studio - it should pass.
1. Now deliberately change the expected value so that it fails.
1. Read the failure output.
1. Put the correct value back and run it again.

## 8 – Add Query Validation Tests

Add a normal case:

```kotlin
@Test
fun isValidQuery_normalQuery_returnsTrue() {

    assertTrue(
        OpenLibraryRepository
            .isValidQuery(
                "Kotlin"
            )
    )
}
```

Then an edge case:

```kotlin
@Test
fun isValidQuery_blankQuery_returnsFalse() {

    assertFalse(
        OpenLibraryRepository
            .isValidQuery(
                "   "
            )
    )
}
```

Run all three tests.

## 9 – Extract Response Handling

Your repository probably already checks whether the Retrofit response succeeded. Move that response handling into a small testable function:

```kotlin
internal fun resolveResponse(
    response: Response<OpenLibrarySearchResponse>
): OpenLibrarySearchResponse {

    if (!response.isSuccessful) {
        throw IllegalStateException(
            "Open Library returned error ${response.code()}."
        )
    }

    return response.body()
        ?: throw IllegalStateException(
            "Open Library returned an empty response."
        )
}
```

Then make your real `searchBooks()` function call `resolveResponse()`.

Run BookScout again before moving on.

## 10 – Test a Successful Response

For a unit test, we do not need to call the real Open Library API. We can construct a Retrofit response ourselves.

For example:

```kotlin
val expected =
    OpenLibrarySearchResponse(
        numberFound = 1,
        docs = listOf(
            OpenLibraryBookDto(
                key = "/works/OL1W",
                title = "Clean Code",
                authorNames =
                    listOf(
                        "Robert C. Martin"
                    ),
                firstPublishYear = 2008
            )
        )
    )

val response =
    Response.success(
        expected
    )
```

Then:

```kotlin
val result =
    OpenLibraryRepository
        .resolveResponse(
            response
        )

assertEquals(
    expected,
    result
)
```

This is still a unit test with no HTTP request and no real server.

## 11 – Test an HTTP Error

Construct an unsuccessful response:

```kotlin
val response =
    Response.error<OpenLibrarySearchResponse>(
        503,
        "{}".toResponseBody(
            "application/json"
                .toMediaType()
        )
    )
```

Then assert that your repository throws the expected exception.

For example:

```kotlin
val exception =
    assertThrows(
        IllegalStateException::class.java
    ) {
        OpenLibraryRepository
            .resolveResponse(
                response
            )
    }
```

We are simulating `HTTP 503` without making a network request.

## 12 – Test an Empty Response Body

Also test:

```kotlin
Response.success<OpenLibrarySearchResponse>(
    null
)
```

Your repository should not silently continue with a missing response body.

Assert the expected exception.

At this stage, we have tested:

```text
query handling
successful response handling
HTTP failure handling
empty body handling
```

## 13 – Run All Unit Tests With Gradle

From the project root:

### Windows

```powershell
./gradlew testDebugUnitTest
```

### macOS/Linux

```bash
./gradlew testDebugUnitTest
```

The build should succeed.

Look inside `app/build/reports/tests/` and inspect the generated test report.

## 14 – Unit Test or Integration Test?

Our tests so far look like this:

```text
JUnit
  ↓
controlled values
  ↓
one small piece of our code
```

We have **not** tested:

```text
Retrofit
   ↓
HTTP
   ↓
JSON conversion
   ↓
repository
```

We are now going to add one test that does but in doing so, we do not want to depend on the real Open Library service.

## 15 – Add MockWebServer

For this, we will use MockWebServer. 

1. Open `app/build.gradle.kts` and add:
    ```kotlin
    testImplementation(
        "com.squareup.okhttp3:mockwebserver3:5.3.2"
    )
    ```
1. Sync Gradle.
1. MockWebServer starts a small HTTP server inside the test environment.
1. We control exactly what it returns.

## 16 – Allow the Repository to Use a Test API

The real app should continue using your normal Retrofit client, but the integration test needs to point the repository at MockWebServer.

Keep your normal public function:

```kotlin
suspend fun searchBooks(
    query: String
): OpenLibrarySearchResponse {

    return searchBooks(
        api = RetrofitClient.openLibraryApi,
        query = query
    )
}
```

Then add an internal overload:

```kotlin
internal suspend fun searchBooks(
    api: OpenLibraryApi,
    query: String
): OpenLibrarySearchResponse {

    val cleanQuery =
        normaliseQuery(query)

    require(
        isValidQuery(cleanQuery)
    ) {
        "Search query cannot be blank."
    }

    val response =
        api.searchBooks(
            query = cleanQuery
        )

    return resolveResponse(response)
}
```

The real app still uses the normal API.

## 17 – Create the Integration Test

Create `OpenLibraryIntegrationTest.kt`

Start with:

```kotlin
private lateinit var server:
    MockWebServer

private lateinit var api:
    OpenLibraryApi
```

Then add a setup function:

```kotlin
@Before
fun setUp() {

    server =
        MockWebServer()

    server.start()

    val json =
        Json {
            ignoreUnknownKeys = true
            coerceInputValues = true
            explicitNulls = false
        }

    api =
        Retrofit.Builder()
            .baseUrl(
                server.url("/")
            )
            .addConverterFactory(
                json.asConverterFactory(
                    "application/json"
                        .toMediaType()
                )
            )
            .build()
            .create(
                OpenLibraryApi::class.java
            )
}
```

Clean up afterwards:

```kotlin
@After
fun tearDown() {
    server.close()
}
```

## 18 – Give MockWebServer a Response

Inside the test:

```kotlin
server.enqueue(
    MockResponse.Builder()
        .code(200)
        .body(
            """
            {
              "numFound": 1,
              "docs": [
                {
                  "key": "/works/OL45804W",
                  "title": "Dune",
                  "author_name": [
                    "Frank Herbert"
                  ],
                  "first_publish_year": 1965
                }
              ]
            }
            """.trimIndent()
        )
        .build()
)
```

This looks like an Open Library response but it is completely controlled by the test.

## 19 – Call the Real Retrofit Stack

Now call the repository using the Retrofit instance connected to MockWebServer:

```kotlin
val result =
    OpenLibraryRepository
        .searchBooks(
            api = api,
            query = "  Dune  "
        )
```

Then assert the result:

```kotlin
assertEquals(
    1,
    result.numberFound
)

assertEquals(
    "Dune",
    result.docs.first().title
)

assertEquals(
    listOf("Frank Herbert"),
    result.docs.first().authorNames
)

assertEquals(
    1965,
    result.docs.first()
        .firstPublishYear
)
```

This test is exercising:

```text
repository
   ↓
real Retrofit
   ↓
real HTTP request
   ↓
MockWebServer
   ↓
controlled JSON
   ↓
real Kotlin Serialization
```

## 20 – Inspect the HTTP Request

MockWebServer records the request Retrofit sent.

Add:

```kotlin
val request =
    server.takeRequest()
```

Then:

```kotlin
assertEquals(
    "/search.json",
    request.url.encodedPath
)
```

Test the query:

```kotlin
assertEquals(
    "Dune",
    request.url
        .queryParameter("q")
)
```

You can also check the default limit:

```kotlin
assertEquals(
    "5",
    request.url
        .queryParameter("limit")
)
```

Now we know that Retrofit actually created the expected HTTP request.

## 21 – Why Not Call the Real Open Library API?

We could write a test that calls `https://openlibrary.org/`

But then a failure could mean:
```text
our code is broken
OR
the internet is down
OR
Open Library is unavailable
OR
the service changed
```

That makes automated tests less reliable. MockWebServer lets us test the HTTP stack while keeping the test deterministic. That, coupled with unit tests, allow us to check our own code properly.

## 22 – Run Everything Together

Run `./gradlew testDebugUnitTest`

This now runs:
```text
unit tests
+
MockWebServer integration test
```

Both are under `src/test` and neither requires an emulator.

All tests should pass.

Commit your progress.
