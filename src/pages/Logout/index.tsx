import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, ScrollView, StatusBar, Text, View, StyleSheet, Pressable, Alert } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setEmail } from '../../actions';
import User from '../../interfaces/User';
import api from '../../services/api';
import { useNavigation } from '@react-navigation/native';
import { AxiosError } from 'axios';
import Loading from '../../components/Loading';
import { trackPromise } from 'react-promise-tracker';
import * as SecureStore from 'expo-secure-store';
import { RootState } from '../../reducers';

interface Token {
    auth: boolean;
    access_token: string;
}

const Logout = () => {
    const [emailTerm, setEmailTerm] = useState('');
    const [passwordTerm, setPasswordTerm] = useState('');
    const [textVisible, setTextVisible] = useState(true);

    const emailUser = useSelector((state: RootState) => state.emailState);

    const navigation = useNavigation();

    const dispatch = useDispatch();

    function logOut() {
        dispatch(logout());
        dispatch(setEmail(""));
        Alert.alert("Saída efetuada com sucesso!");
        navigation.navigate('Home');
    }

    function showAlert() {
        Alert.alert("Tem certeza que deseja excluir sua conta?", "",
            [
                {
                    text: "Sim",
                    onPress: deleteUser
                },
                {
                    text: "Não"
                }
            ]);
    }

    async function deleteUser() {
        let token = "";
        await SecureStore.getItemAsync('token').then(res => {
            token = res;
        });
        api.post(`/deleteUser`, null,
            {
                headers: {
                    'x-access-token': token
                }
            }).then(response => {
                logOut();
            }).catch((err: AxiosError) => {
                Alert.alert(err.response.data.message);
            });
    }

    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Icon name="arrow-left" color="#FFF" size={24} onPress={() => navigation.goBack()} />
                    <Text style={styles.title}>Gamebook</Text>
                </View>

                <ScrollView style={styles.loginContainer}>
                    <Text style={[styles.nameTextStyle, styles.option]}>Olá {emailUser}</Text>

                    <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Platforms')} >
                        <View style={styles.optionView}>
                            <Icon name="monitor" color="#FFF" size={24} />
                            <Text style={styles.textStyle}>Plataformas</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('FAQ')}>
                        <View style={styles.optionView}>
                            <Icon name="help-circle" color="#FFF" size={24} />
                            <Text style={styles.textStyle}>FAQ</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option} onPress={logOut} >
                        <View style={styles.optionView}>
                            <Icon name="log-out" color="#FFF" size={24} />
                            <Text style={styles.textStyle}>Sair</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.option} onPress={showAlert} >
                        <View style={styles.optionView}>
                            <Icon name="trash-2" color="#FFF" size={24} />
                            <Text style={styles.textStyle}>Excluir minha conta permanentemente</Text>
                        </View>
                    </TouchableOpacity>

                </ScrollView>

                <View style={[styles.optionView, styles.version]}>
                    <Icon name="hash" color="gray" size={12} style={styles.test}/>
                    <Text style={styles.versionTextStyle}>Version 1.0.0</Text>
                </View>
                {/* </View> */}
            </View>
        </>
    );
};

export default Logout;

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

    emailInput: {
        left: 40,
        top: 100,
        padding: 20,
        borderRadius: 8,
        width: "80%",
        // textAlign: "left",
        color: "#cecece",
        backgroundColor: "#fff",
        fontSize: 18
    },

    passwordInput: {
        left: 40,
        marginTop: 20,
        top: 100,
        padding: 20,
        borderRadius: 8,
        width: "80%",
        // textAlign: "left",
        color: "#cecece",
        backgroundColor: "#fff",
        fontSize: 18
    },

    loginContainer: {
        top: 120,
        left: 10,
        width: "95%"
    },

    option: {
        padding: 10,
        flexDirection: "row"
    },

    optionView: {
        flexDirection: "row"
    },

    logoutButton: {
        borderRadius: 8,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
        left: 130,
        padding: 15,
        elevation: 2,
        backgroundColor: "red",
        top: 150,
        height: 50
    },

    nameTextStyle: {
        color: "white",
        fontWeight: "bold",
        // textAlign: "center",
        fontSize: 16,
        paddingLeft: 20,
        paddingBottom: 50
    },

    textStyle: {
        color: "white",
        fontWeight: "bold",
        // textAlign: "center",
        fontSize: 16,
        paddingLeft: 20
    },

    name: {
        color: "white",
        fontWeight: "bold",
        // textAlign: "center",
        fontSize: 20
    },

    subscribeButton: {
        top: 200,
        left: 0
    },

    version: {
        // top: 00i
        marginLeft: "auto",
        marginRight: "auto"
    },

    versionTextStyle: {
        color: "gray",
        fontSize: 12
    },

    test: {
        top: 2
    }
});