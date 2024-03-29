import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, ScrollView } from 'react-native';
import api from '../../services/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Platforms from '../../components/Platforms';
import Cover from '../../components/Cover';
import { replacePlatforms } from '../../actions';
import { setEmail, signIn } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reducers';
import { GamesByCategory } from '../../interfaces/GamesByCategory';
import { trackPromise } from 'react-promise-tracker';
import Loading from '../../components/Loading';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const Home = ({ navigation }) => {
    const dispatch = useDispatch();

    const [gamesByCategory, setGamesByCategory] = useState<GamesByCategory[]>([]);

    const selectedPlatforms = useSelector((state: RootState) => {
        return state.platformsState
    });

    const filteredPlatforms = useSelector((state: RootState) => {
        return state.filteredPlatformsState
    });

    const token = useSelector((state: RootState) => {
        return state.authState
    });

    function defineInterceptor() {
        api.interceptors.response.use(response => {
            return response;
        }, err => {
            return new Promise((resolve, reject) => {
                const originalReq = err.config;
                if (err.response && err.response.status === 401 && err.config && !err.config.retry) {
                    originalReq.retry = true;
                    SecureStore.getItemAsync('token').then(res => {
                        api.put(`/refreshToken`, null,
                            {
                                headers: {
                                    'x-access-token': res
                                }
                            }).then(response => {
                                dispatch(signIn(response.data.access_token));
                                dispatch(setEmail(response.data.email));
                                originalReq.headers['x-access-token'] = response.data.access_token;
                                return axios(originalReq);
                            });
                        resolve(res);
                    });
                } else {
                    reject(err);
                }
            });
        });
    }


    useEffect(() => {
        setGamesByCategory([]);
        console.log("api", api.defaults)
        if (navigation.isFocused()) {
            trackPromise(
                api.get<GamesByCategory[]>(`/getGamesList`, {
                    params: {
                        platformIds: selectedPlatforms.filter(p => !filteredPlatforms.find(f => f == p))
                    }
                }).then(response => {
                    setGamesByCategory(response.data);
                }).catch(err => {
                    console.log("CAIU NO CATCH 77", err);
                })
            );
        } else {
            api.get<GamesByCategory[]>(`/getGamesList`, {
                params: {
                    platformIds: selectedPlatforms.filter(p => !filteredPlatforms.find(f => f == p))
                }
            }).then(response => {
                setGamesByCategory(response.data);
            }).catch(err => {
                console.log("CAIU NO CATCH 88", err);
            })
        }
    }, [selectedPlatforms, filteredPlatforms]);

    useEffect(() => {
        defineInterceptor();
    }, []);

    useEffect(() => {
        SecureStore.getItemAsync('token').then(res => {
            if (res !== null && res !== '') {
                dispatch(signIn(res));

                api.get<string[]>(`/getPlatformPreferences`, {
                    headers: {
                        'x-access-token': res
                    }
                }).then(response => {
                    if (response?.data?.length > 0) {
                        dispatch(replacePlatforms(response.data.map(p => Number(p))));
                    }
                });
            }
        }).catch(err => {
            console.log("catch na linha 112", err, "acho q eh so nao fazer nada!");
        });
        SecureStore.getItemAsync('email').then(res => {
            if (res !== null && res !== '') {
                dispatch(setEmail(res));
            }
        }).catch(err => {
            console.log("catch na linha 119", err, "acho q eh so nao fazer nada!");
        });
    }, [token]);

    return (
        <>
            <View style={styles.container}>

                <Header showLogo={true} navigation={navigation} />
                <Loading searchTermChanged={true} />
                <View>

                    <ScrollView style={styles.scroll}>

                        <Platforms />

                        <View>

                            {gamesByCategory.map(gameByCategory => (
                                <View key={String(gameByCategory.id)} style={styles.categoryContainer}>
                                    <Text style={styles.categoryTitle}>{gameByCategory.title}</Text>
                                    <View style={styles.gamesContainer}>
                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}>
                                            {gameByCategory.games.map(game => (
                                                <Cover key={String(game.id)} game={game} navigation={navigation} />
                                            ))}
                                        </ScrollView>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
                <Footer option='Home' />
            </View>

        </>
    );
};

export default Home;

const styles = StyleSheet.create({
    scroll: {
        marginTop: 100,
        marginBottom: 70
    },

    appTitle: {
        position: 'absolute',
        left: 20,
        top: 5
    },

    container: {
        flex: 1,
        backgroundColor: '#000',
    },

    gamesContainer: {
        flexDirection: "row",
        marginTop: 10,
        marginLeft: 10
    },

    text: {
        color: "#fff",
        fontSize: 16,
    },

    game: {
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#eee",
        height: 210,
        width: 150,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginRight: 8,
        alignItems: "center",
        justifyContent: "space-between"
    },

    gameTitle: {
        position: "relative",
        left: 10,
        color: "#fff",
        fontSize: 16
    },

    categoryContainer: {
        marginBottom: 30
    },

    categoryTitle: {
        left: 10,
        fontSize: 18,
        fontFamily: "Roboto_400Regular",
        color: "white"
    }
});