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

const ResetPassword = (route) => {
    const [passwordTerm, setPasswordTerm] = useState('');
    const [confirmPasswordTerm, setConfirmPasswordTerm] = useState('');
    const [textVisible, setTextVisible] = useState(true);
    const [showLoading, setShowLoading] = useState(false);

    const email = route?.route?.params?.email;

    const navigation = useNavigation();

    const dispatch = useDispatch();
    const inputProps = {
        placeholder: "Senha",
        secureTextEntry: true
    };

    const passwordInputProps = {
        placeholder: "Confirmar senha",
        secureTextEntry: true
    };

    const passwordProps = {
        minLength: 8
    };

    function resetPassword() {
        if (passwordTerm.length < 6) {
            showMessage({
                message: "Sua senha deve conter no mínimo 6 caracteres!",
                type: "danger",
            });
        } else {
            setTextVisible(false);
            trackPromise(
                api.post<Token>(`/resetPassword`, { email: email, password: passwordTerm, confirmPassword: confirmPasswordTerm }).then(response => {
                    showMessage({
                        message: "Senha alterada com sucesso!",
                        type: "success",
                    });
                    setTextVisible(true);
                    navigation.navigate('Login');
                }).catch((err: AxiosError) => {
                    showMessage({
                        message: err.response.data.message,
                        type: "danger",
                    });
                    setTextVisible(true);
                }));
        }
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
                        <Text style={styles.textTitle}>Esqueci minha senha</Text>
                        <Text style={styles.textDescription}>Defina sua nova senha.</Text>
                    </View>

                    <View style={styles.passwordInput}>
                        <RNPasswordStrengthMeter
                            width={10}
                            minLength={8}
                            onChangeText={setPasswordTerm}
                            meterType="text"
                            inputProps={inputProps}
                            passwordProps={passwordProps}
                        />
                    </View>

                    <View style={styles.passwordInput}>
                        <RNPasswordStrengthMeter
                            width={10}
                            minLength={8}
                            onChangeText={setConfirmPasswordTerm}
                            meterType="text"
                            inputProps={passwordInputProps}
                            passwordProps={passwordProps}
                        />
                    </View>


                    <Pressable
                        onPress={resetPassword}
                        style={styles.sendButton}
                    >
                        {showLoading && <Loading login={true} />}
                        {textVisible && <Text style={styles.textStyle}>Alterar senha</Text>}
                    </Pressable>
                </View>
            </View>
        </>
    );
};

export default ResetPassword;

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
        top: 150
    },

    textStyle: {
        color: "#000",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16
    },

    passwordInput: {
        left: 40,
        marginTop: 20,
        top: 100,
        // padding: 20,
        borderRadius: 8,
        width: "80%",
        height: 50,
        // textAlign: "left",
        color: "#cecece",
        backgroundColor: "#fff",
        fontSize: 16,
        // paddingLeft: 10
    },
});