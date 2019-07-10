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

This is a [Template Repository](https://help.github.com/en/articles/creating-a-template-repository) for creating a working app using [Flagship](https://github.com/brandingbrand/flagship), Branding Brand's open-source React Native framework for e-commerce apps.

The app comes pre-installed with demo commerce integrations for Episerver Commerce, Salesforce Commerce Cloud, and Shopify. It also features implementations of Branding Brand's Inbox and App Builder products.

Flagship can be used to build apps that support Android, iOS, and web with a single shared codebase.

## Setting up your Development Environment

You'll need a Mac with Xcode to build iOS applications. Windows and Linux machines can be used for Android development, though in our experience Windows users may experience issues setting up Node and other dependencies.

We recommend following React Native's [Getting Started](https://facebook.github.io/react-native/docs/getting-started.html) guide for installing all necessary applications and frameworks.

 1. Click the "React Native CLI Quickstart" tab
 1. Select the tab corresponding to your development machine's OS: macOS, Windows, or Linux
 1. Select the tab corresponding to the mobile OS you which to set up: iOS or Android
 1. Follow the steps in the "Installing Dependencies" section
 1. Repeat for all mobile OSes you wish to use

In addition to the dependencies listed by React Native, you'll also need Yarn for package management. Please refer to the [instructions on their website](https://yarnpkg.com/en/docs/install) to install Yarn.

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

If you run `init` without specifying an environment, the `prod` environment will be selected which is configured to use the Episerver data source. You can switch between environment (and thus data sources) without leaving the app when running in development mode.

First, tap on the environment label button on the bottom right of the screen:

![image](https://user-images.githubusercontent.com/2915629/60994880-68dae380-a31f-11e9-9886-00af5ac871fd.png)

Next, tap on the Env Switcher menu item:

![image](https://user-images.githubusercontent.com/2915629/60994980-8f991a00-a31f-11e9-8306-651e20a382a9.png)

Next, tap on an environment to see its settings:

![image](https://user-images.githubusercontent.com/2915629/60995077-ca9b4d80-a31f-11e9-90bc-7516818a548a.png)

Finally, tap on the "Switch to..." button to use the selected environment:

![image](https://user-images.githubusercontent.com/2915629/60995131-e4d52b80-a31f-11e9-8e41-69bce92a15a7.png)

Note that the development menu contains other useful functions such as the ability to reload the app's JS Bundle and reset local storage.