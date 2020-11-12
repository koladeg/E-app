import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { AppLoading } from 'expo';
import AppNavigator from './src/screens';
import { cacheImages } from './src/util/cacheImages';
import { Provider } from 'mobx-react/native';

import { store } from './src/models';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  _loadResourcesAsync = async () => {
    const imageAssets = cacheImages([require('./assets/img/ladiesImg.jpg')])

    await Promise.all([...imageAssets])
  };

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={console.warn}
          onFinish={() => this.setState({ isLoadingComplete: true })}
        />
      );
    } else {
      return (
        <Provider {...store}>
          <AppNavigator />
        </Provider>
      );
    }
  }
  _handleLoadingError = error => {
    //report the error to your error reporting service, for example Sentry
    console.warn(error);
  };
}
