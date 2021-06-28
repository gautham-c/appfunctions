import React, {useState} from 'react';
import {Text, View, Button, PermissionsAndroid, StyleSheet} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'UserDatabase.db'});

const Location = () => {
  let [access, setAccess] = useState(true);
  let [latitude, setLatitude] = useState(0);
  let [longitude, setLongitude] = useState(0);
  

  let register_location = () => {
    console.log(latitude,longitude);

    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO table_user (latitude,longitude) VALUES (?,?)',
        [latitude,longitude],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'You are Registered Successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('HomeScreen'),
                },
              ],
              {cancelable: false},
            );
          } else alert('Registration Failed');
        },
      );
    });
  };
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Location App needs access to your location ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Location');
      } else {
        console.log('Location permission denied');
        setAccess(false);
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const componentDidMount = () => {
    requestLocationPermission();
    console.log(access);
    if (access) {
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        error => {
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true},
      );
    }
  };
  return (
    <View>
      <Text style={styles.container}>Location Screen</Text>
      <View
        style={{marginTop: 10, padding: 10, borderRadius: 10, width: '50%'}}>
        <Button
          title="Get Location"
          onPress={() => {
            componentDidMount();
          }}
        />
        <Button
          title="Save Location"
          onPress={() => {
            register_location();
          }}
        />
      </View>
      <Text style={styles.container}>Latitude:{latitude}</Text>
      <Text style={styles.container}>Longitude:{longitude}</Text>
    </View>
  );
};

export default Location;

const styles = StyleSheet.create({
  container: {
    fontSize: 20,
  },
});
