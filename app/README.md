# Tanken — Companion App

Native companion app for [Tanken](https://tanken.felo.gg), built with **Compose Multiplatform**
(shared screens + logic) and a **native SwiftUI Liquid Glass** navigator on iOS. It talks to the
existing web API; the base URL is configurable in Settings (default `https://tanken.felo.gg`).

This is **not** a web wrapper — it consumes the JSON API and renders native/Compose UI, with native
maps (Apple Maps on iOS, Google Maps on Android) and haptics throughout.

## Architecture

```
iOS:  SwiftUI App → TabView (Liquid Glass) → per-tab ComposeUIViewController (+ native MapKit)
Android: Compose Activity → Material3 Scaffold + NavigationBar (+ Google Maps)
Shared (commonMain): Ktor client · kotlinx.serialization models · repositories · theme ·
  price→colour port · expect/actual (haptics, secure store, geolocation, maps links, map view)
```

| Path | Purpose |
|------|---------|
| `composeApp/src/commonMain` | Shared Compose UI + logic (the bulk of the app) |
| `composeApp/src/androidMain` | Android `MainActivity`, manifest, platform actuals |
| `composeApp/src/iosMain` | iOS Kotlin actuals + `ComposeUIViewController` entry points |
| `iosApp/` | SwiftUI shell + Xcode project (links the `ComposeApp` framework) |
| `altstore/` | AltStore `source.json` generator (Phase 5) |

## Build

Requires JDK 17 and the Android SDK (Android), plus Xcode 26 for the Liquid Glass tab bar (iOS).

```bash
# Android (debug APK)
cd app && ./gradlew :composeApp:assembleDebug
# → composeApp/build/outputs/apk/debug/composeApp-debug.apk

# iOS — open in Xcode and run, or build an unsigned archive from CLI:
cd app
xcodebuild -project iosApp/iosApp.xcodeproj -scheme iosApp -configuration Release \
  -sdk iphoneos -destination 'generic/platform=iOS' \
  -archivePath build/Tanken.xcarchive archive CODE_SIGNING_ALLOWED=NO
```

The iOS Xcode project runs `./gradlew :composeApp:embedAndSignAppleFrameworkForXcode` as a build
phase to produce/link the shared `ComposeApp.framework`.

## CI / Release

- **`.github/workflows/mobile-ci.yml`** — builds the Android APK + an **unsigned** iOS IPA
  (AltStore re-signs on device, so no Apple certificates are needed in CI) on every push/PR.
- Release workflows (rolling **Dev** + tagged **Stable**, AltStore `source.json`) land in Phase 5.
  App tags use the `app-v*` prefix so they don't trigger the web image build.

Version is the single source of truth in `gradle.properties` (`app.versionName` / `app.versionCode`).
