import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, ScrollView, StatusBar, Text, View, StyleSheet, Pressable, Alert } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { signIn, signUp } from '../../actions';
import Header from '../../components/Header';
import User from '../../interfaces/User';
import api from '../../services/api';
import { useNavigation } from '@react-navigation/native';
import { AxiosError } from 'axios';
import { trackPromise } from 'react-promise-tracker';
import Loading from '../../components/Loading';
import RNPasswordStrengthMeter from 'react-native-password-strength-meter';
import { showMessage } from 'react-native-flash-message';

interface Token {
    auth: boolean;
    access_token: string;
}

const Subscribe = () => {
    const [emailTerm, setEmailTerm] = useState('');
    const [passwordTerm, setPasswordTerm] = useState('');
    const [confirmPasswordTerm, setConfirmPasswordTerm] = useState('');
    const [showLoading, setShowLoading] = useState(false);
    const [textVisible, setTextVisible] = useState(true);

    const navigation = useNavigation();

    const dispatch = useDispatch();

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function createAccount() {
        if (passwordTerm.length < 6) {
            showMessage({
                message: "Sua senha deve conter no mínimo 6 caracteres!",
                type: "danger",
            });
        } else if (!validateEmail(emailTerm)) {
            showMessage({
                message: "E-mail inválido!",
                type: "danger",
            });
        } else {
            setTextVisible(false);
            setShowLoading(true);
            trackPromise(
                api.post<Token>(`/signUp`, { email: emailTerm, password: passwordTerm, confirmPassword: confirmPasswordTerm }).then(response => {
                    // dispatch(signUp(response.data.access_token));
                    showMessage({
                        message: `Código de confirmação enviado para ${emailTerm}.`,
                        type: "success",
                    });
                    setTextVisible(true);
                    setShowLoading(false)
                    navigation.navigate('FillCode', { option: 'accountCreation', email: emailTerm });
                }).catch((err: AxiosError) => {
                    Alert.alert(err.response.data.message);
                    setTextVisible(true);
                    setShowLoading(false)
                }));
        }
    }

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

    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Icon name="arrow-left" color="#FFF" size={24} onPress={() => navigation.goBack()} />
                    <Text style={styles.title}>Gamebook</Text>
                </View>
                <View style={styles.loginContainer}>


                    <TextInput
                        style={styles.emailInput}
                        placeholder="E-mail"
                        onChangeText={setEmailTerm}

                    />

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

                    {/* <TextInput
                        style={styles.emailInput}
                        placeholder="Confirmar senha"
                        onChangeText={setConfirmPasswordTerm}

                    /> */}


                    <Pressable
                        onPress={createAccount}
                        // title="Entrar"
                        // color="#f194ff"
                        style={styles.loginButton}
                    >
                        <Loading subscribe={true} />
                        {showLoading && <Loading login={true} />}
                        {textVisible && <Text style={styles.textStyle}>Criar conta</Text>}
                    </Pressable>
                </View>
            </View>
        </>
    );
};

export default Subscribe;

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

    // emailInput: {
    //     left: 40,
    //     top: 100,
    //     padding: 20,
    //     borderRadius: 8,
    //     width: "80%",
    //     // textAlign: "left",
    //     color: "#cecece",
    //     backgroundColor: "#fff",
    //     fontSize: 18
    // },

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
        marginTop: 20,
        paddingLeft: 10
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

    loginContainer: {
        top: 200
    },

    loginButton: {
        borderRadius: 8,
        width: 120,
        alignItems: 'center',
        justifyContent: 'center',
        left: 240,
        padding: 15,
        elevation: 2,
        backgroundColor: "#fff",
        top: 120
    },

    textStyle: {
        color: "#000",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16
    },

    subscribeText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 20
    },

    subscribeButton: {
        top: 200,
        left: 0
    }
});