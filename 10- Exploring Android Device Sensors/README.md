# Exploring Android Device Sensors

So far, we have built Android applications that work with APIs, location, authentication and other services. This time, we are going to investigate the hardware inside Android devices.

Different Android devices support different sensors. The Android Emulator can simulate some sensor readings, but we should not assume that a sensor will always be available.

For this activity, you will research the sensors available to you and build your own Sensor Explorer application using Kotlin and Jetpack Compose.

This is a new standalone Android application. Do not use or modify the Sandbox. You do not need a physical Android phone; the emulator is enough to complete the activity.

## Research

Before coding, investigate Android sensors and answer the following questions briefly, in your own words:

- What are the main categories of Android sensors?
- What is the difference between a physical sensor and a virtual/software-based sensor?
- What do an accelerometer, gyroscope, magnetometer, proximity sensor, light sensor and pressure sensor measure?
- What is the purpose of `SensorManager`, `Sensor`, `SensorEvent` and `SensorEventListener`?
- How can an app discover which sensors are available at runtime?
- Why might two Android devices report different sensors?
- Why can some sensors return three values while others return only one?
- Why must we register and unregister sensor listeners carefully?
- What permissions or special APIs might be needed for step counting, body sensors or trigger sensors?
- Is GPS/location accessed in exactly the same way as `SensorManager` sensors?

References:
- https://developer.android.com/develop/sensors-and-location/sensors/sensors_overview
- https://developer.android.com/develop/sensors-and-location/sensors/sensors_motion
- https://developer.android.com/develop/sensors-and-location/sensors/sensors_position
- https://developer.android.com/develop/sensors-and-location/sensors/sensors_environment

## 1 – Investigate the Android Emulator

1. Open Android Studio → Tools → Device Manager and start an Android phone emulator.
2. Open the emulator's Extended Controls (the three-dot menu).
3. Locate Virtual sensors → Device Pose and Additional sensors, where available.
4. Investigate which controls allow you to simulate movement, rotation, light, proximity, pressure and other values.
5. Record the emulator device profile and Android version.
6. Make a table of the sensors you expect to be able to test. Include how you will change the readings.

Use the [Android Emulator Extended Controls documentation](https://developer.android.com/studio/run/emulator-extended-controls) to help you.

Important: A sensor shown in emulator controls is not necessarily exposed by every Android Virtual Device. Your application will need to check what Android reports at runtime.

## 2 – Investigate a Physical Android Device (Optional)

If you have access to a physical Android phone or tablet, research its manufacturer, model, Android version and available sensors.

Compare these with your emulator. Consider which sensor readings you can change using real movement or changes in the environment.

Check the sensors reported through Android wherever possible rather than relying only on a manufacturer's specification sheet.

Physical-device testing is optional. You will not lose out because you do not have a particular sensor or a physical device.

## 3 – Create a New Android Project

Create an entirely new project in Android Studio:

1. Choose New Project → Phone and Tablet → Empty Activity (the Compose template).
2. Configure the project:

```text
Name: SensorExplorer
Package name: com.prog7314.sensorexplorer
Language: Kotlin
Minimum SDK: API 26
Build configuration: Kotlin DSL
```

3. Wait for Gradle to sync.
4. Run the starter app on your emulator before modifying it.
5. Create a new GitHub repository for this project. Do not commit it to the Sandbox repository.

Your project will initially contain a single `:app` module. There is no need to add a second module or connect to another application.

## 4 – Design Your Sensor Explorer

Before coding, plan a simple interface that allows a user to:

- view the sensors reported by their device;
- select a sensor and read its name, type, manufacturer and other useful information;
- start and stop listening to live sensor readings;
- see values and units clearly labelled; and
- understand when a sensor is missing, requires permission or cannot be observed with a normal listener.

Think about a reusable Compose interface. An accelerometer might provide X, Y and Z values, while an ambient light sensor might provide only one value.

You do not need to create a completely different screen for every sensor.

## 5 – Discover Sensors at Runtime

Use the Android Sensor Framework to find the sensors actually available on the emulator or device running your app.

Your application should display a list of the available sensors, with enough information to distinguish them.

Research `SensorManager` and the method used to return all sensors. Do not hard-code a list and assume that every device has the same capabilities.

Run your application and compare what Android reports with the list you created in Section 1.

## 6 – Display Live Sensor Readings

Allow the user to select a supported sensor and observe its actual readings.

For each sensor you can reasonably support:

1. Show the latest reported values.
2. Identify the values and include units where applicable.
3. Update the interface when new sensor events arrive.
4. Allow the user to stop listening.
5. Stop unnecessary listeners when the application leaves the foreground.
6. Handle unsupported sensors and permission restrictions without crashing.

Aim to support as many available, testable sensors as you reasonably can. Some sensors are event-based, some require special permissions and some use APIs other than a standard `SensorEventListener`. Investigate and explain these limitations rather than displaying invented readings.

Do not use random values and present them as real sensor readings.

## 7 – Build Two Sensor-Driven Features

Numbers alone are not very interesting. Build at least two meaningful features that respond to sensor data.

You could, for example:

- detect tilt or shaking using an accelerometer;
- change the appearance of a screen based on ambient light;
- respond when an object approaches a proximity sensor;
- show a change in atmospheric pressure; or
- use orientation information to change something in the interface.

These are suggestions. You may choose other suitable features.

Your features must do something with the readings, not merely display the same numbers again. Choose features you can demonstrate using the sensors your emulator or physical device actually supports.

Explain your two features in your README.

## 8 – Test Your Sensor Explorer

Use the emulator's Extended Controls to change the available simulated readings and check whether your app responds.

For each sensor you can test, document:

- the sensor and its reported values before the change;
- what you changed in the emulator;
- how the reading or app behaviour changed; and
- any limitations you encountered.

Also check that the app does not crash when a sensor is unavailable, and that listeners stop when not needed.

If you have a physical Android device, install the application there and compare the results. This is optional.

Where appropriate, add unit tests for your own calculations (for example, tilt thresholds or sensor-value classifications). These can be tested without real hardware.

Use Build Output, Logcat and the debugger when troubleshooting.

## 9 – Document and Commit Your Work

Commit once done