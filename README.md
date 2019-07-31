<p align="center">
  <a href="https://github.com/brandingbrand/flagship">
    <img alt="Flagship"
      src="https://user-images.githubusercontent.com/556070/39432976-bd8520f4-4c62-11e8-863b-fe7ee694a4a0.png"
      height="250">
  </a>
</p>

# Flagship Template

  * [Setting up your Development Environment](#setting-up-your-development-environment)
  * [Running an App for the First Time](#running-an-app-for-the-first-time)
  * [Using the Environment Switcher](#using-the-environment-switcher)
  * [Customizing Your App](#customizing-your-app)
    + [Editing the Environment Properties](#editing-the-environment-properties)
    + [Add Custom App Icons](#add-custom-app-icons)
    + [Add Custom Launch Screens](#add-custom-launch-screens)
    + [Customize the Tabs](#customize-the-tabs)
    + [Customize the App's Color Scheme](#customize-the-apps-color-scheme)
    + [Add New Screens](#add-new-screens)

This is a [Template Repository](https://help.github.com/en/articles/creating-a-template-repository) for creating a working app using [Flagship](https://github.com/brandingbrand/flagship), Branding Brand's open-source React Native framework for e-commerce apps.

Simply click the "Use Template" button on the homepage to copy a fully functioning Flagship demo app to your own repository.

The app comes pre-installed with demo commerce integrations for Episerver Commerce, Salesforce Commerce Cloud, and Shopify. It also features implementations of Branding Brand's Inbox and App Builder products.

Flagship can be used to build apps that support Android, iOS, and web with a single shared codebase.

## Setting up your Development Environment

Please see the [Flagship documentation](https://github.com/brandingbrand/flagship/wiki/Setting-up-Your-Development-Environment) for instructions on how to install the dependencies and tools you'll need to develop Flagship applications.

## Running an App for the First Time

First, navigate to your project's directory and run `yarn` to install all dependencies.

Next, run `yarn run init` in order to invoke the Flagship initialization process. This does the following:
 * Generates `ios` and `android` directories in your project folder
 * Initializes the native apps with settings from your configuration (e.g., app name and bundle identifier)
 * Compiles native dependencies and runs `react-native link`

By default, init will use the `prod` environment. Environments are configured in the `env` directory; you can see that a number of environments are provided in the template repository. To specify a different repository, use the `--env` flag when running init, such as `yarn run init --env=uat` or `yarn run init--env=store`.

After init, if you're using a Mac try running `yarn run ios`. This will boot an iOS simulator and, if everything goes well, the app will run inside of it.

To test Android, you'll either need to spin up an Android emulator through Android Studio or connect an Android phone that has developer mode enabled to your computer via USB. You can then run `yarn run android` to launch the application on your emulator or phone.

## Using the Environment Switcher

You can use the Flagship environment switcher to view the app running against Episerver, Demandware, and Shopify. For information on how to select an environment, please refer to the appropriate [Flagship documentation](https://github.com/brandingbrand/flagship/wiki/Managing-Environments#selecting-the-environment).

## Customizing Your App

### Editing the Environment Properties

Open `env/common.js` in your editor. There are a few values you'll need to change to make the app your own:

* **name**: This is the internal code-friendly name of your app which will be used for such tasks as naming the internal Xcode and Android project files.
* **displayName:** This is the user-facing name of the app which will be displayed on the user's home screen.
* **bundleIds:** These should match the identifiers registered with the App and Google Play stores (e.g., com.bestbargains.ios).
* **cmsPropertyId:** This is the app's identifier if using the Branding Brand CMS.

### Add Custom App Icons

These are the icons users see on their home screens to launch the app. See the [Flagship documentation](https://github.com/brandingbrand/flagship/wiki/Creating-App-Icons) to see how to add custom icons for your app.

### Add Custom Launch Screens

These are the splash screens that users see while the app is loading. See the [Flagship Documentation](https://github.com/brandingbrand/flagship/wiki/Creating-Launch-Screens) to see how to customize the launch screens.

### Customize the Tabs

Your app can have up to five tabs at the bottom that serve as starting points for different sections of your application. Each tab has its own navigation stack.

Tabs are configured in the settings passed into FSApp. You can view this configuration in `src/index.ts`. You'll see a `tabs` array containing a number of objects, each having these properties:

* screen: The screen to be displayed by the app. This should be a screen that is registered to React Native Navigation.
* label: The value of the text label displayed under the tab icon.
* title: The name displayed on the screen corresponding to the tab, if said screen has the navigation bar enabled.
* icon: This should `require()` an image that has 1x, 2x, and 3x variants.

### Customize the App's Color Scheme

The `src/styles/variables.ts` file contains color constants that are applied throughout the application. By updating the `primary`, `secondary`, and `accent` colors you'll cover a lot of ground getting the app to your preferred color scheme.

The `src/styles/Navigation.ts` file contains all of the styles for [React Native Navigation](https://x-guard.github.io/react-native-navigation/#/styling-the-navigator). These control the styles of the tab bar, status bar, and navigation bar.

 ### Add New Screens
 
Screens are simply React components that have some default properties passed in through React Native Navigation and Flagship. The screens for the app are located in `src/screens/`. Each screen needs to be registered in `src/screens.tsx` before it can be used by React Native Navigation.
