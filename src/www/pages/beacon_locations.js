import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet, FlatList
} from 'react-native';
import { Card } from 'react-native-elements'

import socketIOClient from "socket.io-client";
import { Avatar } from 'react-native-elements';



export default function beacon_locations() {

    const [tieto, setTieto] = useState([]);
    const [endpoint, setEndpoint] = useState("http://127.0.0.1:4001")

    useEffect (() => {
        fetch('http://localhost:4000/beacon_locations')
            .then((response) => response.json())
            .then(responseJson => {
                setTieto(...tieto, responseJson)

                
                this.socket = socketIOClient("http://127.0.0.1:4001");
                this.socket.on("emitSocket", data =>  {
                setTieto(...tieto, data);
                
                });
            });
        
    }, []);


        return (
            <View style={styles.container}>
          
            <FlatList style={{}}
                data={tieto}    
                renderItem={({item}) => {

                    if (item.location_type == "red" && item.beacon_user == "Ranneke1") {
                        return <View>
                            <Card>

                            <Avatar
                                size="xlarge"
                                rounded
                                source={require('./img/beaconuser1.jpg')}
                                containerStyle={{ marginLeft: 100, marginRight: 100, marginBottom: 10}}
                            />

                            <Text style={[styles.textFlatlistStyle, {backgroundColor: "red"}]}>Beacon User: {item.beacon_user} </Text>
                             <Text style={[styles.textFlatlistStyle, {backgroundColor: "red"}]}>Beacon ID: {item.receiver_id}</Text>
                             <Text styles={{padding: 5}}> </Text>
                             </Card>
                                 </View>
                    }

                    else if (item.location_type == "red" && item.beacon_user == "Ranneke2") {
                        return <View>
                            <Card>

                            <Avatar
                                size="xlarge"
                                rounded
                                source={require('./img/beaconuser2.jpg')}
                                containerStyle={{ marginLeft: 100, marginRight: 100, marginBottom: 10}}
                            />

                            <Text style={[styles.textFlatlistStyle, {backgroundColor: "red"}]}>Beacon User: {item.beacon_user} </Text>
                             <Text style={[styles.textFlatlistStyle, {backgroundColor: "red"}]}>Beacon ID: {item.receiver_id}</Text>
                             <Text styles={{padding: 5}}> </Text>
                             </Card>
                                 </View>
                    }

                    else if (item.location_type == "red" && item.beacon_user == "Ranneke3") {
                        return <View>
                            <Card>

                            <Avatar
                                size="xlarge"
                                rounded
                                source={require('./img/beaconuser3.jpg')}
                                containerStyle={{ marginLeft: 100, marginRight: 100, marginBottom: 10}}
                            />

                            <Text style={[styles.textFlatlistStyle, {backgroundColor: "red"}]}>Beacon User: {item.beacon_user} </Text>
                             <Text style={[styles.textFlatlistStyle, {backgroundColor: "red"}]}>Beacon ID: {item.receiver_id}</Text>
                             <Text styles={{padding: 5}}> </Text>
                             </Card>
                                 </View>
                    }

                    else if (item.location_type == "yellow" && item.beacon_user == "Ranneke1") {
                        return <View>
                            <Card>

                            <Avatar
                                size="xlarge"
                                rounded
                                source={require('./img/beaconuser1.jpg')}
                                containerStyle={{ marginLeft: 100, marginRight: 100, marginBottom: 10}}
                            />

                            <Text style={[styles.textFlatlistStyle, {backgroundColor: "yellow"}]}>Beacon User: {item.beacon_user} </Text>
                             <Text style={[styles.textFlatlistStyle, {backgroundColor: "yellow"}]}>Beacon ID: {item.receiver_id}</Text>
                             <Text styles={{padding: 5}}> </Text>
                             </Card>
                                 </View>
                    }
                    else if (item.location_type == "yellow" && item.beacon_user == "Ranneke2") {
                        return <View>
                            <Card>

                            <Avatar
                                size="xlarge"
                                rounded
                                source={require('./img/beaconuser2.jpg')}
                                containerStyle={{ marginLeft: 100, marginRight: 100, marginBottom: 10}}
                            />

                            <Text style={[styles.textFlatlistStyle, {backgroundColor: "yellow"}]}>Beacon User: {item.beacon_user} </Text>
                             <Text style={[styles.textFlatlistStyle, {backgroundColor: "yellow"}]}>Beacon ID: {item.receiver_id}</Text>
                             <Text styles={{padding: 5}}> </Text>
                             </Card>
                                 </View>
                    }
                    else if (item.location_type == "yellow" && item.beacon_user == "Ranneke3") {
                        return <View>
                            <Card>

                            <Avatar
                                size="xlarge"
                                rounded
                                source={require('./img/beaconuser3.jpg')}
                                containerStyle={{ marginLeft: 100, marginRight: 100, marginBottom: 10}}
                            />

                            <Text style={[styles.textFlatlistStyle, {backgroundColor: "yellow"}]}>Beacon User: {item.beacon_user} </Text>
                             <Text style={[styles.textFlatlistStyle, {backgroundColor: "yellow"}]}>Beacon ID: {item.receiver_id}</Text>
                             <Text styles={{padding: 5}}> </Text>
                             </Card>
                                 </View>

                    }
                    
                }
                    
                }
                keyExtractor={item => item.beacon_user}
            />
            </View>
        );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        paddingTop: 50
       
    },

    textFlatlistStyle: {
        flex: 1,
        padding:10,
        fontSize: 25,
        backgroundColor: '#DFDFDF',
        paddingHorizontal: 10
    }
})