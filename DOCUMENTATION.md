# Developer Documentation

This page contains some commonly used commands, reasoning behind some of the engineering desicions, aswell as some guidlines for developing.

## Enviroment Setup

For setup of the development enviroment setup consult the [React Native documentation](https://reactnative.dev/).

## Version Control

Always create [atomic commits](https://en.wikipedia.org/wiki/Atomic_commit) with explicit commit messages. Ideally commits should also be signed.
Example: `git commit -S`

## CI/CD

### Creating a release on Github

Github Actions are configured to create a release whenever a commit is tagged with `v*`. In order to create a new release, update the version number in `package.json`, `app/constants.ts` aswell as `android/app/build.gradle` and use the exact same version number for the git tag.

Example: `git tag -s "v1.0"`.

## Building and Bundling

### Building an production APK

1. Provide a Java Keystore in the `android` directory and add the neccessary information to `android/gradle.properties` like this:

```bash:android/gradle.properties
BOUM_UPLOAD_STORE_FILE=example.jks
BOUM_UPLOAD_STORE_PASSWORD=example
BOUM_UPLOAD_KEY_ALIAS=example
BOUM_UPLOAD_KEY_PASSWORD=example
```

2. Run `yarn android-build-release`

### Generating an APK from an AAB

1. Follow the instruction for poviding a `JKS`.

2. Run `yarn android-bundle-release`

3. Download the bundletool from [Google's Github](https://github.com/google/bundletool/releases)

4. Run the following command to generate a universal APK
   `java -jar bundletool-all-1.11.2.jar build-apks --mode=universal --bundle boum/android/app/build/outputs/bundle/release/app-release.aab --output universal.apks`
