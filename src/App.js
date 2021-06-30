import React, {useState,useEffect} from 'react';
import {StyleSheet, Text, Button, View, TouchableOpacity} from 'react-native';
import Camera from './camera.js';
import Location from './location';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {LoginButton, AccessToken} from 'react-native-fbsdk-next';
import {openDatabase} from 'react-native-sqlite-storage';
import ViewDatabase from './viewDatabase'

var db = openDatabase({name: 'UserDatabase.db'});

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
                console.log(data.accessToken.toString());
                navigation.navigate('home');
                setloggedIn(true);
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
      <Button
        title="VIEW DATABASE"
        color="orange"
        onPress={() => {
          navigation.navigate('database');
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

function viewDatabase(){
  return (
    <View>
      <ViewDatabase />
    </View>
  )
}

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_user', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, latitude INTEGER, longitude INTEGER)',
              [],
            );
          }
        },
      );
    });
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login">
        <Stack.Screen name="login" component={login} />
        <Stack.Screen name="home" component={homeScreen} />
        <Stack.Screen name="camera" component={cameraScreen} />
        <Stack.Screen name="location" component={locationScreen} />
        <Stack.Screen name="database" component={viewDatabase} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
