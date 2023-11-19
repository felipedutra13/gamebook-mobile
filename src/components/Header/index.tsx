import React, { useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { Text, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { RootState } from '../../reducers';
import { manuallyResetPromiseCounter } from 'react-promise-tracker';
import api from '../../services/api';
import { useIsFocused } from '@react-navigation/native';

interface Notification {
    id: number;
    game_id: number;
    user_id: number;
    date: Date;
    active: boolean;
};

const Header = (props) => {
    let navigation = props.navigation;
    let notifications = [];
    let [total, setTotal] = useState(0);
    const ifFocused = useIsFocused();

    const token = useSelector((state: RootState) => state.authState);

    if (token && ifFocused) {
        api.get<Notification[]>(`/getUserNotifications`, {
            headers: {
                'x-access-token': token
            }
        }).then(response => {
            if (response?.data) {
                let totalNotifications = response.data.reduce((value, current) => current.active ? ++value : value, 0);
                notifications = response.data;
                setTotal(totalNotifications);
            }
        });
    }

    function handleConfig() {
        if (token && token !== '') {
            navigation.navigate('Logout');
        } else {
            navigation.navigate('Login');
        }
    }

    function handleNotifications() {
        api.post(`/updateUserNotifications`, {
            headers: {
                'x-access-token': token
            }
        });
        navigation.push('Notifications', { notifications });
    }

    function formatName(name: string) {
        if (name?.length > 50) {
            return name.substring(0, 50) + "...";
        }

        return name;
    }

    function goBack() {
        manuallyResetPromiseCounter();
        navigation.goBack();
    }

    return (
        <>
            <View style={styles.header}>
                {props.showLogo && <Text style={styles.appTitle}>Gamebook</Text>}
                {props.showBackButton && <Feather name="arrow-left" color="#FFF" size={24} onPress={goBack} />}
                <Text style={styles.title}>{formatName(props.title)}</Text>
                {token ? (
                    <>
                        <TouchableOpacity onPress={handleNotifications}>
                            <Feather name="bell" color="#FFF" size={24} />
                        </TouchableOpacity>
                        {total > 0 ? (
                            <View style={styles.circle}>
                                <Text style={styles.notificationsSize}>{total}</Text>
                            </View>
                        ) : null}
                    </>
                ) : null}
                <TouchableOpacity onPress={handleConfig}>
                    <Feather name="user" color="#FFF" size={24} />
                </TouchableOpacity>
            </View>
        </>
    );
};

export default Header;

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

    appTitle: {
        position: 'absolute',
        // left: 20,
        top: 5,
        fontSize: 20,
        color: "#fff"
    },

    searchObj: {
        marginLeft: "auto",
        width: 24,
        height: 24,
    },

    logoImage: {
        width: 60,
        height: 60
    },

    title: {
        color: "#fff",
        fontSize: 20,
        left: 10,
        width: "80%"
    },

    modalView: {
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "yellow",
        backgroundColor: "#000",
        padding: 10,
        width: 300,
        // alignItems: "center",
        height: 170
    },

    circle: {
        backgroundColor: "red",
        width: 24,
        height: 24,
        borderRadius: 24 / 2,
        left: -11,
        top: -10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    notificationsSize: {
        color: "white"
        // justifyContent: 'center',
        // alignItems: 'center'
    },
});