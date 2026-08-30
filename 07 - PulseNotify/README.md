# PulseNotify – Background Processing and Local Notifications

In this activity, we are going to build a small Android app that checks an API for messages. This is not really about building another API app. You have done that already. The focus here is what happens when the app is open compared to when the app is not open.

The API will create:
- a foreground message every 5 minutes
- a background message every 15 minutes

The Android app will then:
- check foreground messages every 1 minute while the app is open
- use WorkManager to check background messages approximately every 15 minutes
- show a local notification when a new message is found
- remember which messages it has already handled so that we do not notify the user again and again for the same message

The PulseNotify API is supplied to you with this activity. You will run the API locally and build the Android application yourself.

## Research

Before you code, spend 10–15 minutes exploring foreground and background processing on Android.

Answer briefly:
- What happens to normal code when an Android app is no longer in the foreground?
- What is `WorkManager`?
- Why would we use `WorkManager` instead of a normal coroutine for background work?
- What is the minimum interval for periodic work using `WorkManager`?
- Is periodic WorkManager work guaranteed to run at the exact time requested?
- What is a local notification?
- What is the difference between polling an API and receiving a push notification?
- Why might polling every minute in the background be a bad idea?
- What is the difference between minimising an app, swiping it away from Recents, and force stopping it?

Write a 4–6 sentence summary in your own words and commit it to your repo.

## Requirements

After this activity, your Android application will:

- connect to the supplied PulseNotify API using Retrofit
- poll for foreground messages every minute while the app is visible
- stop foreground polling when the app is no longer visible
- use WorkManager for background polling
- schedule background work every 15 minutes
- only run the background worker when a network connection is available
- store the last processed foreground and background message IDs using DataStore
- create local Android notifications
- request notification permission on Android 13+
- avoid showing duplicate notifications
- allow us to manually trigger a background worker while testing
- demonstrate the difference between foreground work and persistent background work

# 1 – Get the API Running

The API is supplied with this activity.

Extract the API and open a terminal in the project folder.

Run:

```bash
npm install
```

Then:

```bash
npm start
```

You should see something similar to:

```text
PulseNotify API listening on http://localhost:3000
Foreground messages: every 5 minute(s)
Background messages: every 15 minute(s)
```

Open:

```text
http://localhost:3000/health
```

You should receive JSON confirming that the API is running.

## Test the Endpoints

Open:

```text
http://localhost:3000/messages/foreground?afterId=0
```

Then:

```text
http://localhost:3000/messages/background?afterId=0
```

The API starts with one message of each type so that we can test immediately.

The API will automatically create:

```text
foreground message -> every 5 minutes
background message -> every 15 minutes
```

There are also two testing endpoints.

You can create a foreground message immediately in Postman using:

```http
POST http://localhost:3000/messages/foreground
```

You can create a background message immediately using:

```http
POST http://localhost:3000/messages/background
```

These are useful while developing because we do not want to wait five or fifteen minutes every time we test something. The API will still continue generating its normal automatic messages.

# 2 – Create the Android App

Create a new Android Studio project.

Use:

```text
Name: PulseNotify
Package: com.prog7314.pulsenotify
Language: Kotlin
UI: Jetpack Compose
Minimum SDK: API 26
```

Run the blank application before adding anything.

# 3 – Check the Project Configuration

For this activity, use the same general Android project configuration we have been using in class. Your project should be compatible with:

```text
AGP: 9.0.0
Gradle: 9.1.0
Kotlin: 2.0.21
compileSdk: 36
targetSdk: 36
```

# 4 – Add the Dependencies

We need:
- Retrofit
- Kotlin Serialization
- OkHttp logging
- DataStore
- WorkManager

Open your app-level `build.gradle.kts`.

Add:

```kotlin
implementation("androidx.datastore:datastore-preferences:1.1.1")

implementation("androidx.work:work-runtime-ktx:2.10.0")

implementation("com.squareup.retrofit2:retrofit:3.0.0")
implementation("com.squareup.retrofit2:converter-kotlinx-serialization:3.0.0")

implementation("com.squareup.okhttp3:okhttp:5.3.2")
implementation("com.squareup.okhttp3:logging-interceptor:5.3.2")
```

Make sure Kotlin Serialization is enabled in your app-level plugins:

```kotlin
alias(libs.plugins.kotlin.serialization)
```

Your version catalogue should already have the Kotlin Serialization plugin available.

You should also have:

```kotlin
implementation(libs.kotlinx.serialization.json)
```

Explore the new libraries, sync Gradle, and run your app again.

# 5 – Give the App Internet Access

Open `AndroidManifest.xml`

Add internet permission above the `<application>` tag:
```xml
<uses-permission android:name="android.permission.INTERNET" />
```

Our local API uses HTTP instead of HTTPS, so inside the `<application>` tag add:
```xml
android:usesCleartextTraffic="true"
```

This is acceptable for our local development API.

# 6 – Create the Message Model

Create a package `data`

Inside it create `Message.kt`

Add:
```kotlin
import kotlinx.serialization.Serializable

@Serializable
data class Message(
    val id: Int,
    val type: String,
    val title: String,
    val message: String,
    val createdAt: String,
    val source: String
)
```

Look at one of the API responses again.

Make sure you can see how the JSON maps to this Kotlin class.

# 7 – Create the Retrofit API Interface

Inside the `data` package create `MessageApi.kt`

Add:
```kotlin
interface MessageApi {

    @GET("messages/foreground")
    suspend fun getForegroundMessages(
        @Query("afterId") afterId: Int
    ): List<Message>

    @GET("messages/background")
    suspend fun getBackgroundMessages(
        @Query("afterId") afterId: Int
    ): List<Message>
}
```

Add the required Retrofit imports.

## What Does `afterId` Do?

Suppose the app has already processed message `12`. The next request becomes `/messages/foreground?afterId=12`
Then, the server then only sends messages newer than `12` which means we do not keep processing the same messages again.

# 8 – Create the Retrofit Client

Create `ApiClient.kt`

Add:
```kotlin
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.kotlinx.serialization.asConverterFactory

object ApiClient {

    private const val BASE_URL =
        "http://10.0.2.2:3000/"

    private val json = Json {
        ignoreUnknownKeys = true
    }

    private val loggingInterceptor =
        HttpLoggingInterceptor().apply {
            level =
                HttpLoggingInterceptor.Level.BODY
        }

    private val okHttpClient =
        OkHttpClient.Builder()
            .addInterceptor(loggingInterceptor)
            .build()

    val api: MessageApi by lazy {

        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(
                json.asConverterFactory(
                    "application/json".toMediaType()
                )
            )
            .build()
            .create(MessageApi::class.java)
    }
}
```

## Why `10.0.2.2`?

The API is running on your computer:

```text
http://localhost:3000
```

But inside the Android emulator:

```text
localhost
```

means the Android emulator itself.

Android provides:

```text
10.0.2.2
```

as a special address that points back to your computer.

So:

```text
http://10.0.2.2:3000/
```

allows the emulator to access the API.

If you are using a physical Android device, this address will not work. You will need the local network IP address of your computer.

## Why Add Logging?

The logging interceptor will allow us to see requests such as:

```text
GET /messages/foreground?afterId=4
```

in Logcat.

This will help us prove that:

- foreground polling is happening
- the correct `afterId` is being sent
- polling stops when the app is no longer visible

Run your app again.

# 9 – Add a Repository

Create `MessageRepository.kt`

Add:
```kotlin
class MessageRepository(
    private val api: MessageApi = ApiClient.api
) {

    suspend fun getForegroundMessages(afterId: Int): List<Message> {
        return api.getForegroundMessages(afterId)
    }

    suspend fun getBackgroundMessages(afterId: Int): List<Message> {
        return api.getBackgroundMessages(afterId)
    }
}
```

# 10 – Store the Last Processed Message IDs

We will use DataStore to store the latest foreground and background IDs.

Create `MessagePreferences.kt`

Add:
```kotlin
private val Context.messageDataStore by preferencesDataStore(
    name = "message_preferences"
)

class MessagePreferences(
    private val context: Context
) {

    private object Keys {

        val LAST_FOREGROUND_ID =
            intPreferencesKey("last_foreground_id")

        val LAST_BACKGROUND_ID =
            intPreferencesKey("last_background_id")
    }

    suspend fun getLastForegroundId(): Int {

        return context.messageDataStore.data
            .first()[Keys.LAST_FOREGROUND_ID] ?: 0
    }

    suspend fun setLastForegroundId(id: Int) {

        context.messageDataStore.edit { preferences ->
            preferences[Keys.LAST_FOREGROUND_ID] = id
        }
    }

    suspend fun getLastBackgroundId(): Int {

        return context.messageDataStore.data
            .first()[Keys.LAST_BACKGROUND_ID] ?: 0
    }

    suspend fun setLastBackgroundId(id: Int) {

        context.messageDataStore.edit { preferences ->
            preferences[Keys.LAST_BACKGROUND_ID] = id
        }
    }
}
```

# 11 – Add Notification Permission

Android 13 and later requires permission before an app can show notifications.

Add this above the `<application>` tag in `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

# 12 – Create the Notification Channel

Create a package `notification`

Create `NotificationHelper.kt`

Start with:
```kotlin
object NotificationHelper {

    const val CHANNEL_ID = "pulse_updates"

    fun createChannel(context: Context) {

        val manager =
            context.getSystemService(
                NotificationManager::class.java
            )

        val channel =
            NotificationChannel(
                CHANNEL_ID,
                "Pulse updates",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description =
                    "Foreground and background PulseNotify updates"
            }

        manager.createNotificationChannel(channel)
    }
}
```

# 13 – Show a Local Notification

Add another function to `NotificationHelper`:

```kotlin
fun showMessage(
    context: Context,
    message: Message
) {

    if (
        ActivityCompat.checkSelfPermission(
            context,
            Manifest.permission.POST_NOTIFICATIONS
        ) != PackageManager.PERMISSION_GRANTED
    ) {
        return
    }

    val intent =
        Intent(
            context,
            MainActivity::class.java
        ).apply {

            flags =
                Intent.FLAG_ACTIVITY_SINGLE_TOP or
                Intent.FLAG_ACTIVITY_CLEAR_TOP
        }

    val pendingIntent =
        PendingIntent.getActivity(
            context,
            message.id,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or
                PendingIntent.FLAG_IMMUTABLE
        )

    val notification =
        NotificationCompat.Builder(
            context,
            CHANNEL_ID
        )
            .setSmallIcon(
                android.R.drawable.ic_dialog_info
            )
            .setContentTitle(message.title)
            .setContentText(
                "${message.type.uppercase()}: ${message.message}"
            )
            .setStyle(
                NotificationCompat.BigTextStyle()
                    .bigText(
                        "${message.type.uppercase()}: ${message.message}"
                    )
            )
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .build()

    NotificationManagerCompat
        .from(context)
        .notify(
            message.id,
            notification
        )
}
```

# 14 – Request Notification Permission

Open `MainActivity.kt`

Create:
```kotlin
private val notificationPermissionLauncher =
    registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { }
```

Then add:

```kotlin
private fun requestNotificationPermissionIfNeeded() {

    if (
        Build.VERSION.SDK_INT >=
        Build.VERSION_CODES.TIRAMISU
    ) {
        notificationPermissionLauncher.launch(
            Manifest.permission.POST_NOTIFICATIONS
        )
    }
}
```

Inside `onCreate()` call:

```kotlin
NotificationHelper.createChannel(this)

requestNotificationPermissionIfNeeded()
```

Run the app.

# 15 – Create the ViewModel

Create `MainViewModel.kt`

Add:
```kotlin
data class PulseUiState(

    val foregroundStatus: String =
        "Waiting for foreground polling...",

    val successfulChecks: Int = 0,

    val latestMessages: List<Message> =
        emptyList(),

    val errorMessage: String? = null
)
```

Then create the ViewModel:
```kotlin
class MainViewModel(
    application: Application
) : AndroidViewModel(application) {

    private val repository =
        MessageRepository()

    private val preferences =
        MessagePreferences(application)

    private val _uiState =
        MutableStateFlow(
            PulseUiState()
        )

    val uiState =
        _uiState.asStateFlow()
}
```

We now have somewhere to manage foreground polling state.

# 16 – Check Foreground Messages Once

Before building a repeating loop, get one request working. Add this function inside `MainViewModel`:

```kotlin
private suspend fun checkForegroundMessages() {

    _uiState.value =
        _uiState.value.copy(
            foregroundStatus =
                "Checking foreground messages...",
            errorMessage = null
        )

    try {

        val lastId =
            preferences.getLastForegroundId()

        val messages =
            repository.getForegroundMessages(lastId)

        messages.forEach { message ->

            NotificationHelper.showMessage(
                getApplication(),
                message
            )
        }

        messages.maxOfOrNull { it.id }
            ?.let { newestId ->

                preferences
                    .setLastForegroundId(newestId)
            }

        _uiState.value =
            _uiState.value.copy(

                foregroundStatus =
                    if (messages.isEmpty()) {

                        "No new foreground messages"

                    } else {

                        "${messages.size} new foreground message(s)"
                    },

                successfulChecks =
                    _uiState.value.successfulChecks + 1,

                latestMessages =
                    messages +
                    _uiState.value.latestMessages
            )

    } catch (exception: Exception) {

        _uiState.value =
            _uiState.value.copy(

                foregroundStatus =
                    "Foreground check failed",

                errorMessage =
                    exception.message
            )
    }
}
```
# 17 – Poll Every Minute

Now add:
```kotlin
suspend fun runForegroundPolling() {

    while (coroutineContext.isActive) {

        checkForegroundMessages()

        delay(60_000)
    }
}
```

We use `coroutineContext.isActive` because this coroutine should stop cleanly when Android cancels it.

# 18 – Make the Polling Lifecycle Aware

In `MainActivity`, add:

```kotlin
private val viewModel:
    MainViewModel by viewModels()
```

Then inside `onCreate()` add:

```kotlin
lifecycleScope.launch {

    repeatOnLifecycle(
        Lifecycle.State.STARTED
    ) {

        viewModel.runForegroundPolling()
    }
}
```

What have we achieved?
- When the Activity becomes `STARTED`, foreground polling begins.
- When the Activity leaves the foreground, the coroutine is cancelled.
- When the user returns, foreground polling starts again.
- This is not background processing. This is foreground work that is linked to the Activity lifecycle.

# 19 – Create a Basic UI

We do not need a complicated interface.

Display:
- current foreground polling status
- number of successful checks
- latest foreground messages
- a button for testing background work

Collect the state:

```kotlin
val uiState by
    viewModel.uiState.collectAsState()
```

A simple starting point could be:
```kotlin
LazyColumn(
    modifier = Modifier
        .fillMaxSize()
        .padding(16.dp),
    verticalArrangement =
        Arrangement.spacedBy(12.dp)
) {

    item {

        Text(
            text = "PulseNotify",
            style =
                MaterialTheme.typography.headlineMedium
        )
    }

    item {

        Text(
            uiState.foregroundStatus
        )
    }

    item {

        Text(
            "Successful checks: " +
                uiState.successfulChecks
        )
    }

    item {

        uiState.errorMessage?.let { error ->

            Text(
                "Error: $error"
            )
        }
    }

    item {

        Button(
            onClick = {
                // Background worker comes next
            }
        ) {

            Text(
                "Run background check now"
            )
        }
    }
}
```

# 20 – Test Foreground Polling

- Make sure the API is running and create a foreground message in Postman `POST http://localhost:3000/messages/foreground`
- Leave PulseNotify open.
- Within the next minute:
    - the app should retrieve the new message
    - a notification should appear
    - the foreground status should change
    - DataStore should update the last processed foreground ID
- Now wait for another poll.
- The same notification should not appear again.
- Then press the Home button.
- Watch Logcat.
- The one-minute foreground polling should stop.
- Return to PulseNotify.
- Polling should begin again.

Do not move onto WorkManager until this works.

# 21 – Create the Background Worker

Create a package `worker`
Inside it create `BackgroundMessageWorker.kt`

Add:
```kotlin
class BackgroundMessageWorker(
    appContext: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(
    appContext,
    workerParams
) {

    private val preferences =
        MessagePreferences(appContext)

    private val repository =
        MessageRepository()

    override suspend fun doWork(): Result {

        return try {

            val lastId =
                preferences.getLastBackgroundId()

            val messages =
                repository
                    .getBackgroundMessages(lastId)

            messages.forEach { message ->

                NotificationHelper.showMessage(
                    applicationContext,
                    message
                )
            }

            messages.maxOfOrNull { it.id }
                ?.let { newestId ->

                    preferences
                        .setLastBackgroundId(newestId)
                }

            Result.success()

        } catch (exception: IOException) {

            Result.retry()

        } catch (exception: Exception) {

            Result.failure()
        }
    }
}
```

Look carefully at:

```kotlin
Result.success()
Result.retry()
Result.failure()
```

These tell WorkManager what happened to the job.

---

# 22 – Add a Network Constraint

Create `WorkScheduler.kt`

Add:
```kotlin
object WorkScheduler {

    private const val PERIODIC_WORK_NAME =
        "background_message_poll"

    private fun connectedConstraint(): Constraints {

        return Constraints.Builder()
            .setRequiredNetworkType(
                NetworkType.CONNECTED
            )
            .build()
    }
}
```

Our worker needs a network connection because it must call the API.

WorkManager can wait until the required constraint is satisfied.


# 23 – Schedule Periodic Background Work

Add:
```kotlin
fun schedulePeriodic(context: Context) {

    val request =
        PeriodicWorkRequestBuilder<
            BackgroundMessageWorker
        >(
            15,
            TimeUnit.MINUTES
        )
            .setConstraints(
                connectedConstraint()
            )
            .build()

    WorkManager
        .getInstance(context)
        .enqueueUniquePeriodicWork(
            PERIODIC_WORK_NAME,
            ExistingPeriodicWorkPolicy.KEEP,
            request
        )
}
```

## Why 15 Minutes?

Periodic WorkManager jobs cannot run more frequently than Android's minimum periodic interval. Android does not want every application waking the device every minute forever. This is why we used a one-minute lifecycle-aware coroutine for the foreground work, but WorkManager for persistent background work.

## Why Unique Work?

If we scheduled a new periodic worker every time the Activity started, we could end up with multiple workers. Unique periodic work allows us to keep one named background task.

# 24 – Start the Background Worker

Inside `MainActivity.onCreate()` add:

```kotlin
WorkScheduler.schedulePeriodic(
    applicationContext
)
```

Now the app has persistent periodic background work scheduled. However, waiting 15 minutes every time we test is not practical. So we will add a manual test.

# 25 – Add a One-Time Background Worker

Add this to `WorkScheduler`:

```kotlin
fun runOnce(context: Context) {

    val request =
        OneTimeWorkRequestBuilder<
            BackgroundMessageWorker
        >()
            .setConstraints(
                connectedConstraint()
            )
            .build()

    WorkManager
        .getInstance(context)
        .enqueue(request)
}
```

This uses the same worker but runs it as a one-time task. This is for testing. It does not replace our periodic background work.

# 26 – Connect the Test Button

Add this to `MainViewModel`:

```kotlin
fun runBackgroundCheckNow() {

    WorkScheduler.runOnce(
        getApplication()
    )
}
```

Then update your button:

```kotlin
Button(
    onClick =
        viewModel::runBackgroundCheckNow
) {

    Text(
        "Run background check now"
    )
}
```

Run the app again.

# 27 – Test Background Work

- Create a background message in Postman `POST http://localhost:3000/messages/background`
- Then press `Run background check now`
- You should receive a notification.
- Press the button again.
- You should not receive another notification for the same message.
- Create another background message.
- Run the worker again.
- You should now receive the new message only.

# 28 – Minimise the App

Now we want to see the difference between foreground and background work:
- Launch PulseNotify.
- Wait until you see the foreground polling request in Logcat.
- Now press the Home button.
- The Activity is no longer visible. What should happen?
    - Foreground polling -> stops
    - WorkManager -> remains scheduled
- Create a background message in Postman.
- The background worker can still run even though PulseNotify is not on screen.
- This is the important difference.



# 29 – Swipe the App Away From Recents

- Open PulseNotify again.
- Then open the Android recent-apps screen and swipe PulseNotify away.
- This is not the same thing as Force Stop.
- WorkManager work that has already been scheduled can still remain eligible to run.
- The application process may no longer be actively running, but Android can later start what it needs in order to execute the worker.
- Create another background message.
- Observe what happens when WorkManager eventually executes.
- Do not expect the foreground one-minute coroutine to continue as that code belongs to the Activity lifecycle.

# 30 – Force Stop the App

- Now close or force-stop the app. Force stopping an app is much stronger than minimising it or swiping it away.
- After Force Stop, Android places the application in a stopped state.
- Background work will not continue normally until the user launches the app again.

This is a useful distinction:
- Home / minimise -> background work can continue
- Swipe from Recents -> WorkManager can still remain scheduled
- Force Stop -> app is stopped until the user launches it again


# 31 – Test the Real 15-Minute Behaviour
Now test what this activity is actually about by letting the activity run on its own without generating manual messages: 
- Do not use the manual worker button for this test.
- Keep the Node API running.
- The API automatically creates:
    - foreground message -> every 5 minutes
    - background message -> every 15 minutes

## Foreground Test
- Keep PulseNotify visible.
- The app polls every minute.
- When the API creates a five-minute foreground message, the app should retrieve it on the next poll.

## Background Test
- Leave PulseNotify.
- The foreground polling should stop.
- The API continues generating background messages.
- WorkManager should eventually run and retrieve unseen background messages.

Remember:
- 15 minutes does not mean exactly every 15:00 on the clock
- Periodic WorkManager execution is inexact.
- Android decides the actual execution time based on device conditions and optimisation.
