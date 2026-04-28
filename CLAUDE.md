# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm start` - Start Metro bundler with cache reset
- `npm run android` - Build and run on Android emulator/device
- `npm run ios` - Build and run on iOS simulator
- `npm run listen` - Setup ADB reverse port forwarding for Android debugging (`adb reverse tcp:8081 tcp:8081`)
- `npm run dev` - Bundle Android app for production

### Code Quality
- `npm run lint` - Run ESLint
- `npm run test` - Run all Jest tests
- `npx jest <test-file-path>` - Run a single test file

### iOS Setup (first time or after native dependency updates)
- `bundle install` - Install CocoaPods
- `bundle exec pod install` - Install iOS dependencies in ios/ directory

## Architecture

This is a React Native playground/experimentation project for testing various React Native libraries and components.

### Entry Point
- `index.js` - Main entry point that imports the currently active test/demo component. Multiple demos are available via commented-out imports - uncomment the one you want to work on.

### Project Structure
- `tests/` - All test/demo components are organized here in subdirectories by feature/topic. Each subdirectory typically contains a self-contained demo.
- `android/` - Android native project files
- `ios/` - iOS native project files
- `assets/` - Static assets
- `__tests__/` - Jest test files

### Key Dependencies
- React Native 0.77.1
- React Navigation (native-stack, material-top-tabs)
- React Native Reanimated v3 - animations
- React Native Gesture Handler - gesture detection
- React Native Reanimated Carousel - carousel component
- Other experimental libraries: react-native-modalbox, react-native-cardview, react-native-pager-view

### Workflow
To work on a new demo or experiment:
1. Create a new subdirectory under `tests/`
2. Add your component file
3. Update the import in `index.js`
4. Run the app via `npm run android` or `npm run ios`

The project uses npm for package management (package-lock.json checked in).
