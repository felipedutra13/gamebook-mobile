import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, ScrollView, StatusBar, Text, View, StyleSheet, Pressable, Alert, Image } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { setEmail, signIn, signUp } from '../../actions';
import api from '../../services/api';
import { useNavigation } from '@react-navigation/native';
import { AxiosError } from 'axios';
import Loading from '../../components/Loading';
import { trackPromise } from 'react-promise-tracker';
import * as Google from 'expo-google-app-auth';
import RNPasswordStrengthMeter from 'react-native-password-strength-meter';
import config from '../../../config';
import { showMessage } from 'react-native-flash-message';

const ANDROID_CLIENT_ID = "488976892573-e736r27mphc3raqbj69728m8a0ljkur2.apps.googleusercontent.com";
const IOS_CLIENT_ID = "488976892573-4n00tcooi5hnrt80ike55h2e7sr42d8o.apps.googleusercontent.com";
const ANDROID_STANDALONE_CLIENT_ID = "488976892573-dr4mcdfintus991ju1qnf7gtpn4d173i.apps.googleusercontent.com"

interface Token {
    auth: boolean;
    access_token: string;
    email: string;
}

const Login = () => {
    const [emailTerm, setEmailTerm] = useState('');
    const [passwordTerm, setPasswordTerm] = useState('');
    const [textVisible, setTextVisible] = useState(true);
    const [textGoogleVisible, setTextGoogleVisible] = useState(true);
    const [showLoadingCom, setShowLoadingCom] = useState(false);
    const [showLoadingComGoogle, setShowLoadingComGoogle] = useState(false);

    const navigation = useNavigation();

    const dispatch = useDispatch();

    function logIn() {
        setTextVisible(false);
        setShowLoadingCom(true);
        trackPromise(
            api.post<Token>(`/signIn`, { email: emailTerm, password: passwordTerm, confirmPassword: "" }).then(response => {
                dispatch(signIn(response.data.access_token));
                dispatch(setEmail(response.data.email));
                showMessage({
                    message: "Login efetuado com sucesso!",
                    type: "success",
                });
                navigation.goBack();
                setTextVisible(true);
                setShowLoadingCom(false);
            }).catch((err: AxiosError) => {
                Alert.alert(err.response.data.message);
                setTextVisible(true);
                setShowLoadingCom(false);
            }));
    }

    async function signInWithGoogleAux() {
        try {
            const response = await Google.logInAsync({
                androidClientId: ANDROID_CLIENT_ID,
                iosClientId: IOS_CLIENT_ID,
                androidStandaloneAppClientId: ANDROID_STANDALONE_CLIENT_ID,
                scopes: ['profile', 'email'],
            });

            if (response.type === 'success') {
                api.post<Token>(`/signInWithGoogle`, { email: response.user.email, user_id: response.user.id }).then(response => {
                    dispatch(signIn(response.data.access_token));
                    dispatch(setEmail(response.data.email));
                    showMessage({
                        message: "Login efetuado com sucesso!",
                        type: "success",
                    });
                    navigation.goBack();
                }).catch((err: AxiosError) => {
                    Alert.alert(err.response.data.message);
                });
            } else {
                Alert.alert("Não foi possível realizar o login!");
            }
        } catch (e) {
            // Alert.alert("Não foi possível realizar o login!");
            Alert.alert("Erro: " + e);
        }
    }

    async function signInWithGoogle() {
        setShowLoadingComGoogle(true);
        setTextGoogleVisible(false);
        await trackPromise(signInWithGoogleAux());
        setTextGoogleVisible(true);
        setShowLoadingComGoogle(false);
    }

    const inputProps = {
        placeholder: "Senha",
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

                    {/* <TextInput style={styles.passwordInput} onChangeText={setPasswordTerm} />
                    <BarPasswordStrengthDisplay
                        password={passwordTerm}
                    /> */}
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

                    <Pressable
                        onPress={logIn}
                        style={styles.loginButton}
                    >
                        {showLoadingCom && <Loading login={true} />}
                        {textVisible && <Text style={styles.textStyle}>Entrar</Text>}
                    </Pressable>

                    <Pressable
                        onPress={signInWithGoogle}
                        style={styles.loginGoogleButton}
                    >
                        {showLoadingComGoogle && <Loading loginGoogle={true} />}
                        {textGoogleVisible &&
                            (
                                <View>
                                    <Image style={styles.googleLogo} source={{ uri: config.SERVER_URL + "/uploads/google.png" }} />
                                    <Text style={styles.textStyleGoogle}>Entrar com Google</Text>
                                </View>
                            )
                        }
                    </Pressable>

                    <Pressable
                        onPress={() => navigation.navigate('ForgotPassword')}
                        style={styles.forgotPassword}
                    >
                        {/* {showLoadingCom && <Loading login={true} />} */}
                        <Text style={styles.textStyle}>Esqueci minha senha</Text>
                    </Pressable>

                    <Pressable style={styles.subscribeButton} onPress={() => navigation.navigate('Subscribe')}>
                        <Text style={styles.subscribeText}>Novo por aqui? Inscreva-se agora</Text>
                    </Pressable>

                </View>
            </View>
        </>
    );
};

export default Login;

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
        top: 100
    },

    loginButton: {
        borderRadius: 8,
        width: 90,
        alignItems: 'center',
        justifyContent: 'center',
        left: 260,
        padding: 15,
        elevation: 2,
        backgroundColor: "#fff",
        top: 115,
        height: 30
    },

    forgotPassword: {
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
        top: 220,
        height: 30
    },

    loginGoogleButton: {
        flexDirection: 'row',
        borderRadius: 8,
        width: 210,
        alignItems: 'center',
        justifyContent: 'center',
        // left: 90,
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: 15,
        // elevation: 2,
        backgroundColor: "#4285F4",
        top: 170,
        height: 30
    },

    textStyle: {
        color: "#000",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16
    },

    textStyleGoogle: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
        top: -14,
        left: 10
    },

    subscribeText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16
    },

    subscribeButton: {
        top: 340,
        left: 0
    },

    googleLogo: {
        top: 10,
        borderWidth: 2,
        borderColor: "#eee",
        height: 30,
        width: 30,
        borderRadius: 8,
        left: -15
        // paddingHorizontal: 16,
        // paddingTop: 20,
        // paddingBottom: 16,
        // marginRight: 8,
        // alignItems: "center"
    },

    googleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: "center",
        width: 240,
        margin: 5
    }
});