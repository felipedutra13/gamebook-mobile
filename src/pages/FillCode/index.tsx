import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, ScrollView, StatusBar, Text, View, StyleSheet, Pressable, Alert, Image, Animated } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import api from '../../services/api';
import { useNavigation } from '@react-navigation/native';
import { AxiosError } from 'axios';
import Loading from '../../components/Loading';
import { trackPromise } from 'react-promise-tracker';
import { showMessage } from 'react-native-flash-message';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell, } from 'react-native-confirmation-code-field';

const FillCode = (route) => {
    const option = route?.route?.params?.option;
    const [textVisible, setTextVisible] = useState(true);
    const [showLoading, setShowLoading] = useState(false);

    const navigation = useNavigation();

    const email = route?.route?.params?.email;

    const { Value, Text: AnimatedText } = Animated;
    const CELL_COUNT = 4;

    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue, });

    function sendEmail() {
        setTextVisible(false);
        setShowLoading(true);

        if (option == 'passwordReset') {
            trackPromise(
                api.post(`/verifyCode`, { email: email, token: value }).then(response => {
                    setTextVisible(true);
                    setShowLoading(false);
                    navigation.navigate('ResetPassword', { email: email });
                }).catch((err: AxiosError) => {
                    showMessage({
                        message: err.response.data.message,
                        type: "danger",
                    });
                    setTextVisible(true);
                    setShowLoading(false);
                }));
        } else {
            trackPromise(
                api.post(`/confirmAccount`, { email: email, token: value }).then(response => {
                    setTextVisible(true);
                    setShowLoading(false);
                    showMessage({
                        message: `Conta confirmada com sucesso, realize login para continuar!`,
                        type: "success",
                    });
                    navigation.navigate('Login');
                }).catch((err: AxiosError) => {
                    showMessage({
                        message: err.response.data.message,
                        type: "danger",
                    });
                    setTextVisible(true);
                    setShowLoading(false);
                }));
        }
    }

    const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
    const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));
    const animateCell = ({ hasValue, index, isFocused }) => {
        Animated.parallel([
            Animated.timing(animationsColor[index], {
                useNativeDriver: false,
                toValue: isFocused ? 1 : 0,
                duration: 250
            }),
            Animated.spring(animationsScale[index], {
                useNativeDriver: false,
                toValue: hasValue ? 0 : 1
                // duration: hasValue ? 300 : 250
            }),
        ]).start();
    };

    const renderCell = ({ index, symbol, isFocused }) => {
        const hasValue = Boolean(symbol);
        const animatedCellStyle = {
            backgroundColor: hasValue
                ? animationsScale[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
                })
                : animationsColor[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
                }),
            borderRadius: animationsScale[index].interpolate({
                inputRange: [0, 1],
                outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
            }),
            transform: [
                {
                    scale: animationsScale[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.2, 1],
                    }),
                },
            ],
        };

        // Run animation on next event loop tik
        // Because we need first return new style prop and then animate this value
        // setTimeout(() => {
        //     animateCell({ hasValue, index, isFocused });
        // }, 0);

        return (
            <AnimatedText
                key={index}
                style={[styles.cell, animatedCellStyle]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
            </AnimatedText>
        );
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Icon name="arrow-left" color="#FFF" size={24} onPress={() => navigation.goBack()} />
                    <Text style={styles.title}>Gamebook</Text>
                </View>

                <View style={styles.resetContainer}>

                    <View style={styles.textContainer}>
                        <Text style={styles.textTitle}>{option == 'passwordReset' ? 'Esqueci minha senha' : 'Confirmar código'}</Text>
                        <Text style={styles.textDescription}>Insira o código enviado para {email}.</Text>
                    </View>

                    <CodeField
                        ref={ref}
                        {...props}
                        value={value}
                        onChangeText={setValue}
                        cellCount={CELL_COUNT}
                        rootStyle={styles.codeFiledRoot}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        renderCell={renderCell}
                    />

                    <Pressable
                        onPress={sendEmail}
                        style={styles.sendButton}
                    >
                        {showLoading && <Loading login={true} />}
                        {textVisible && <Text style={styles.textStyle}>Continuar</Text>}
                    </Pressable>
                </View>
            </View>
        </>
    );
};

export default FillCode;

export const CELL_SIZE = 55;
export const CELL_BORDER_RADIUS = 8;
export const DEFAULT_CELL_BG_COLOR = '#fff';
export const NOT_EMPTY_CELL_BG_COLOR = '#3557b7';
export const ACTIVE_CELL_BG_COLOR = '#f7fafe';

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

    codeFiledRoot: {
        height: CELL_SIZE,
        marginTop: 30,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    cell: {
        marginHorizontal: 8,
        height: CELL_SIZE,
        width: CELL_SIZE,
        lineHeight: CELL_SIZE - 5,
        fontSize: 30,
        textAlign: 'center',
        borderRadius: CELL_BORDER_RADIUS,
        color: '#C71414',
        backgroundColor: '#fff',

        // IOS
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        // Android
        elevation: 3,
    },

    // =======================

    root: {
        minHeight: 800,
        padding: 20,
    },

    // title: {
    //     paddingTop: 50,
    //     color: '#000',
    //     fontSize: 25,
    //     fontWeight: '700',
    //     textAlign: 'center',
    //     paddingBottom: 40,
    // },
    icon: {
        width: 217 / 2.4,
        height: 158 / 2.4,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    subTitle: {
        paddingTop: 30,
        color: '#000',
        textAlign: 'center',
    },
    nextButton: {
        marginTop: 30,
        borderRadius: 60,
        height: 60,
        backgroundColor: '#3557b7',
        justifyContent: 'center',
        minWidth: 300,
        marginBottom: 100,
    },
    nextButtonText: {
        textAlign: 'center',
        fontSize: 20,
        color: '#fff',
        fontWeight: '700',
    },

});