import React, { Component } from 'react';
import { createAppContainer, createStackNavigator, createBottomTabNavigator, createSwitchNavigator } from 'react-navigation';
import LoginScreen from './LoginScreen';
import WelcomeScreen from './WelcomeScreen';


const AuthNavigator = createStackNavigator({
  Login: { screen: LoginScreen },
}, {
  defaultNavigationOptions: {
    header: null,
  }
});

const MainNavigator = createStackNavigator({
  Welcome: { screen: WelcomeScreen },
});

const AppSwitchNavigator = createSwitchNavigator({
  Login: { screen: LoginScreen },
  Welcome: { screen: MainNavigator },
});
export default createAppContainer(AppSwitchNavigator);
