import React, {useState} from 'react';
import {Text, View, Button, PermissionsAndroid, StyleSheet} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const Location = () => {
  let [access, setAccess] = useState(true);
  let [latitude, setLatitude] = useState(0);
  let [longitude, setLongitude] = useState(0);
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
