import React, {useState} from 'react';
import {StyleSheet, Text, Button, View, TouchableOpacity} from 'react-native';
import Camera from './camera.js';
import Location from './location';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {LoginButton, AccessToken} from 'react-native-fbsdk-next';

function login({navigation}) {
  let [loggedIn, setloggedIn] = useState(false);
  return (
    <View
      style={{
        padding: 10,
        borderRadius: 10,
        width: '50%',
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
      <TouchableOpacity>
        <LoginButton
          onLoginFinished={(error, result) => {
            if (error) {
              console.log('login has error: ' + result.error);
            } else if (result.isCancelled) {
              console.log('login is cancelled.');
            } else {
              AccessToken.getCurrentAccessToken().then(data => {
                setloggedIn(true);
                console.log(data.accessToken.toString());
              });
            }
          }}
          onLogoutFinished={() => {
            console.log('logout.');
            setloggedIn(false);
            console.log(loggedIn);
          }}
        />
      </TouchableOpacity>
      {loggedIn ? (
        <Button
          title="next"
          onPress={() => {
            navigation.navigate('home');
          }}
        />
      ) : (
        <Text>Not LoggedIn</Text>
      )}
    </View>
  );
}

function homeScreen({navigation}) {
  return (
    <View
      style={{
        padding: 10,
        borderRadius: 10,
        width: '50%',
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
      <Button
        title="CAMERA"
        onPress={() => {
          navigation.navigate('camera');
        }}></Button>
      <Button
        title="LOCATION"
        color="red"
        onPress={() => {
          navigation.navigate('location');
        }}></Button>
    </View>
  );
}

function cameraScreen() {
  return (
    <View style={{flex: 1}}>
      <Camera />
    </View>
  );
}

function locationScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Location />
    </View>
  );
}

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login">
        <Stack.Screen name="login" component={login} />
        <Stack.Screen name="home" component={homeScreen} />
        <Stack.Screen name="camera" component={cameraScreen} />
        <Stack.Screen name="location" component={locationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
