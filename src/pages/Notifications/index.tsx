import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, FlatList, Pressable } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import api from '../../services/api';



import { useNavigation } from "@react-navigation/native";


import GameInfo from '../../components/GameInfo';
import { trackPromise } from 'react-promise-tracker';
import Loading from '../../components/Loading';
import { Game } from '../../interfaces/Game';
import { useSelector } from 'react-redux';
import { RootState } from '../../reducers';

const Notification = (props) => {
    const token = useSelector((state: RootState) => state.authState);
    const notifications = props?.route?.params?.notifications.map(n => n.game_id);
    const navigation = useNavigation();
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        let isMounted = true;
        trackPromise(
            api.get(`/getGamesById`, {
                params: {
                    gamesId: notifications.join(',')
                }
            }).then(response => {
                if (isMounted) {
                    setGames(response.data.games);
                }
            })
        );
        return () => isMounted = false;
    }, []);

    function cleanNotifications() {
        api.delete(`/cleanUserNotifications`, {
            headers: {
                'x-access-token': token
            }
        });
        setGames([]);
    }

    const renderItem = ({ item }) => {
        return (
            <GameInfo key={String(item.id)} game={item} />
        );
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Icon name="arrow-left" color="#FFF" size={24} onPress={() => navigation.goBack()} />
                    <Text style={styles.title}>Notificações</Text>
                </View>

                <Pressable
                    style={styles.modalButton}
                >
                    <Text style={styles.textStyle} onPress={cleanNotifications}>Limpar Notificações</Text>
                </Pressable>

                <View>

                </View>

                <View style={styles.gamesContainer}>

                    <Loading searchTermChanged={false} />

                    <FlatList
                        data={games}
                        renderItem={renderItem}
                        keyExtractor={(item) => String(item.id)}
                        numColumns={1}
                    />

                </View>
            </View>

        </>
    );
};

export default Notification;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },

    header: {
        zIndex: 0.5,
        position: 'absolute',
        flexDirection: 'row',
        top: 45,
        left: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '85%',
        marginLeft: 0
    },

    title: {
        color: "#fff",
        fontSize: 20,
        left: 10,
        width: "80%"
    },

    gamesContainer: {
        flexDirection: "row",
        marginTop: 115,
        left: 10
    },

    modalButton: {
        width: 160,
        top: 90,
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: "white"
    },

    textStyle: {
        color: "#000",
        fontWeight: "bold",
        textAlign: "center"
    }
});