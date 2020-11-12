import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { inject } from 'mobx-react/native';

import * as Google from 'expo-google-app-auth';
import Svg, { Image, Circle, ClipPath } from 'react-native-svg';
import Animated, {Easing} from 'react-native-reanimated';
import { TapGestureHandler, State } from 'react-native-gesture-handler';

const {width, height} = Dimensions.get('window')

const { Value,
        event,
        block,
        cond,
        eq,
        set,
        Clock,
        startClock,
        stopClock,
        debug,
        timing,
        clockRunning,
        interpolate,
        Extrapolate,
        concat
        } = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    timing(clock, state, config),
    cond(state.finished, debug('stop clock', stopClock(clock))),
    state.position
  ]);
}

@inject('currentUser')

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    state = {
      email: '',
      phone: '',
      error: '',
  };
    this.buttonOpacity = new Value(1);

    this.onStateChange = event([
      {
        nativeEvent:( {state} )=> block([
          cond(eq(state, State.END),
          set(this.buttonOpacity, runTiming(new Clock, 1,0)))
        ])
      }
    ])
    this.onCloseState = event([
      {
        nativeEvent:( {state} )=> block([
          cond(eq(state, State.END),
          set(this.buttonOpacity, runTiming(new Clock, 0,1)))
        ])
      }
    ])

    this.buttonY = interpolate(this.buttonOpacity,{
      inputRange: [0,1],
      outputRange: [100, 0],
      extrapolate: Extrapolate.CLAMP
    })

    this.bgY = interpolate(this.buttonOpacity,{
      inputRange: [0,1],
      outputRange: [-height / 3 -50, 0],
      extrapolate: Extrapolate.CLAMP
    })

    this.textInputZindex = interpolate(this.buttonOpacity,{
      inputRange: [0,1],
      outputRange: [1, -1],
      extrapolate: Extrapolate.CLAMP
    })

    this.textInputY = interpolate(this.buttonOpacity,{
      inputRange: [0,1],
      outputRange: [0, 100],
      extrapolate: Extrapolate.CLAMP
    })

    this.textInputOpacity = interpolate(this.buttonOpacity,{
      inputRange: [0,1],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP
    })

    this.rotateCross = interpolate(this.buttonOpacity,{
      inputRange: [0,1],
      outputRange: [180, 360],
      extrapolate: Extrapolate.CLAMP
    })
  }

  onGooglePress = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId: "955090941360-vupr8g0a0g8nbn8cphni3s85aeibm4hs.apps.googleusercontent.com",
        iosClientId: "955090941360-qucp1avubiop8dc506cg5v4tfdonq4ge.apps.googleusercontent.com",
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        let aToken = result.accessToken
        await this.props.currentUser.login(aToken, "GOOGLE")
      }

      return console.log('No success');
    } catch (error) {
      return Promise.reject(error);
    }
  };
  onButtonPress = () => {
    const { email, phone } = this.state;

    this.setState({ error : '' });
  }
  render() {

    console.log('props ', this.props);
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <Animated.View style=
        {{ ...StyleSheet.absoluteFill,
        transform:[{translateY:this.bgY}]}}
        >
          <Svg height={height + 50} width={width}>
            <ClipPath id="clip">
              <Circle r={height + 50} cx={width / 2}/>
            </ClipPath>
            <Image
              href={require('../../assets/img/ladiesImg.jpg')}
              width= {width}
              height= {height + 50}
              preserveAspectRatio="xMidYMid slice"
              clipPath='url(#clip)'
            />
          </Svg>
        </Animated.View>
        <View style={{ height: height/ 3, justifyContent: 'center'}}>
          <TapGestureHandler onHandlerStateChange={this.onStateChange}>
            <Animated.View
              style={{...styles.button, opacity: this.buttonOpacity,
                transform:[{translateY:this.buttonY}]
            }}>
              <Text style={{ fontSize: 20, fontWeight:'bold' }}>SIGN IN</Text>
            </Animated.View>
          </TapGestureHandler>
            <TouchableOpacity onPress={this.onGooglePress}>
              <Animated.View
              style={{...styles.button, backgroundColor:'#4285F4',
                opacity: this.buttonOpacity,
                transform:[{translateY:this.buttonY}]}}
              >
                <Text style={{ fontSize: 20, fontWeight:'bold', color: 'white' }}>Sign in with Google</Text>
              </Animated.View>
            </TouchableOpacity>
            <Animated.View style={{
              zIndex: this.textInputZindex, opacity: this.textInputOpacity,
              transform:[{translateY: this.textInputY}],height: height/3,
            ...StyleSheet.absoluteFill, top: null, justifyContent: 'center',
            backgroundColor: '#fff',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,}}>

            <TapGestureHandler onHandlerStateChange={this.onCloseState}>
              <Animated.View style={styles.closeButton}>
                <Animated.Text style={{ fontSize: 15, transform:[
                  {rotate: concat(this.rotateCross, 'deg')}]
                }}
                >
                  X
                </Animated.Text>
              </Animated.View>
            </TapGestureHandler>

              <TextInput
                placeholder="Email"
                style={styles.textInput}
                placeholderTextColor="black"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={email => this.setState({ email })}
                returnKeyType="next"
              />
              <TextInput
                ref={(ref) => this._passwordRef = ref}
                placeholder="Phone Number"
                style={styles.textInput}
                placeholderTextColor="black"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={phone => this.setState({ phone })}
              />
              <TouchableOpacity onPress={this.onButtonPress}>
                <Animated.View style={styles.button}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold'}}> SIGN IN </Text>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
        </View>
      </KeyboardAvoidingView >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: 'white',
    height: 70,
    marginHorizontal: 20,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    elevation: 2
  },
  closeButton:{
    height: 40,
    width: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -20,
    left: width / 2 - 20,
    elevation: 1
  },
  textInput:{
    height: 50,
    borderRadius: 25,
    borderWidth: 0.5,
    marginHorizontal: 20,
    paddingLeft: 10,
    marginVertical: 5,
    borderColor: 'rgba(0,0,0,0.2)'
  },
  errorText:{
    fontSize:20,
    alignSelf: 'center',
    color: 'red'
  }
});
