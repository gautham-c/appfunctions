import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View,FlatList } from 'react-native'
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'UserDatabase.db' });


const ViewDatabase = () => {
        let [flatListItems, setFlatListItems] = useState([]);
      
        useEffect(() => {
          db.transaction((tx) => {
            tx.executeSql('SELECT * FROM table_user', [], (tx, results) => {
              var temp = [];
              for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
              setFlatListItems(temp);
            });
          });
        }, []);
        let listItemView = (item) => {
            return (
              <View
                key={item.user_id}
                style={{ backgroundColor: 'white', padding: 20 }}>
                <Text>ID: {item.user_id}</Text>
                <Text>Latitude: {item.latitude}</Text>
                <Text>Longitude: {item.longitude}</Text>
              </View>
            );
          };
    return (
        <View>
            <FlatList
            data={flatListItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => listItemView(item)}
          />
        </View>
    )
}

export default ViewDatabase

const styles = StyleSheet.create({})
