# BookScout App

## Objective

Build a real-world, user-friendly book discovery app which you can name on your own.

This app must allow users to search for books using the Open Library API, browse the returned results, view more information about a selected book, and handle incomplete or unavailable data without crashing.

Unlike the apps developed earlier, this app will retrieve its content from a live API. You will therefore need to work with HTTP requests, REST APIs, JSON responses, asynchronous programming, and network-related errors.

## App Concept

The app must allow users to discover books using the Open Library API with:
- A search screen where users can search by title, author, or a general keyword
- A results screen with book cover cards
- A details screen showing further information about a selected book
- Loading, empty, success, and error states
- Retry functionality when a request fails
- Pagination or a “Load more” option
- A settings screen for simple display preferences
- All book information loaded from the Open Library API

Your app should have its own name, visual identity, and theme.

## Open Library API

You will use the Open Library API. 

### Official Open Library documentation:

- Open Library APIs: <https://openlibrary.org/developers/api>
- Search API: <https://openlibrary.org/dev/docs/api/search>
- Covers API: <https://openlibrary.org/dev/docs/api/covers>

Not every result will contain a cover, author, publication year, subject, ISBN, or description. Your app must handle missing data correctly.

### Error handling
Your app should respond correctly when:

- The search field is empty
- No books are found
- The user has no internet connection
- The request times out
- The API returns an unsuccessful response
- A response contains incomplete data
- A book does not have a cover
- The user searches repeatedly
- More results are being loaded

The app must not crash in any of these situations.

## Deliverables

You must submit a GitHub repository containing:
- Your project code including:
  - Retrofit and OkHttp configuration
  - Kotlin Serialization configuration- API service interface
  - UI state handling
  - Search and pagination logic
  - DataStore settings persistence
  - Input validation and error handling
- Assets including:
  - App icon
  - Splash screen
  - Any other visual assets used by your app
- A README including:
  - App name and tagline
  - App description
  - Screenshots or emulator screenshots
  - Feature list
  - Architecture overview
  - Open Library API acknowledgement
  - How to run the app
  - Known limitations
  - Gradle build in the pipeline

## Optional Enhancements

You may also add:
- Search suggestions
- Recent searches
- Sorting by publication year or relevance
- Filtering by language
- Filtering by e-book availability
- A share-book intent
- An “Open in Open Library” action
- Animated loading placeholders
- A responsive grid layout
- Unit tests for mapper or ViewModel logic

Good luck!