import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, ScrollView, StatusBar, Text, View, StyleSheet, Pressable, Alert, Image } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { setEmail, signIn, signUp } from '../../actions';
import User from '../../interfaces/User';
import api from '../../services/api';
import { useNavigation } from '@react-navigation/native';
import { AxiosError } from 'axios';
import Loading from '../../components/Loading';
import { trackPromise } from 'react-promise-tracker';
import * as Google from 'expo-google-app-auth';
import PasswordInputText from 'react-native-hide-show-password-input';
// import PasswordField from 'react-native-password-field';
import RNPasswordStrengthMeter from 'react-native-password-strength-meter';
import { BarPasswordStrengthDisplay } from 'react-native-password-strength-meter';
import config from '../../../config';
import { showMessage } from 'react-native-flash-message';

const ANDROID_CLIENT_ID = "488976892573-e736r27mphc3raqbj69728m8a0ljkur2.apps.googleusercontent.com";
const IOS_CLIENT_ID = "488976892573-4n00tcooi5hnrt80ike55h2e7sr42d8o.apps.googleusercontent.com";

interface Token {
    auth: boolean;
    access_token: string;
    email: string;
}

const ForgotPassword = () => {
    const [emailTerm, setEmailTerm] = useState('');
    const [textVisible, setTextVisible] = useState(true);
    const [showLoading, setShowLoading] = useState(false);

    const navigation = useNavigation();

    function sendEmail() {
        setTextVisible(false);
        setShowLoading(true);
        trackPromise(
            api.post(`/forgotPassword`, { email: emailTerm }).then(response => {
                setTextVisible(true);
                setShowLoading(false);
                navigation.navigate('FillCode', { email: emailTerm, option: 'passwordReset' });
            }).catch((err: AxiosError) => {
                showMessage({
                    message: err.response.data.message,
                    type: "danger",
                });
                setTextVisible(true);
                setShowLoading(false);
            }));
    }

    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Icon name="arrow-left" color="#FFF" size={24} onPress={() => navigation.goBack()} />
                    <Text style={styles.title}>Gamebook</Text>
                </View>

                <View style={styles.resetContainer}>

                    <View style={styles.textContainer}>
                        <Text style={styles.textTitle}>Recuperar minha senha</Text>
                        <Text style={styles.textDescription}>Esqueceu sua senha? Não se preocupe. Insira seu e-mail que enviaremos um código de acesso para você cadastrar uma nova senha.</Text>
                    </View>

                    <TextInput
                        style={styles.emailInput}
                        placeholder="E-mail"
                        onChangeText={setEmailTerm}

                    />


                    <Pressable
                        onPress={sendEmail}
                        style={styles.sendButton}
                    >
                        {showLoading && <Loading login={true} />}
                        {textVisible && <Text style={styles.textStyle}>Enviar para e-mail</Text>}
                    </Pressable>
                </View>
            </View>
        </>
    );
};

export default ForgotPassword;

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

    resetContainer: {
        top: 200
    },

    emailInput: {
        left: 40,
        top: 100,
        // padding: 20,
        borderRadius: 8,
        width: "80%",
        height: 50,
        // textAlign: "left",
        color: "#cecece",
        backgroundColor: "#fff",
        fontSize: 16,
        paddingLeft: 10
    },

    textContainer: {
        width: "90%",
        left: 25
    },

    textTitle: {
        textAlign: "justify",
        color: "#fff",
        fontSize: 22,
        fontWeight: 'bold'
    },

    textDescription: {
        textAlign: "justify",
        color: "#A9A9A9",
        fontSize: 18,
        fontWeight: 'bold'
    },

    sendButton: {
        borderRadius: 8,
        width: 190,
        alignItems: 'center',
        justifyContent: 'center',
        // left: 90,
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 15,
        elevation: 2,
        backgroundColor: "#fff",
        top: 150,
        height: 30
    },

    textStyle: {
        color: "#000",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16
    },
});