import React, { useEffect, useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { Text, StyleSheet, TouchableOpacity, Image, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { useFonts, Roboto_400Regular } from '@expo-google-fonts/roboto';
import { RectButton } from 'react-native-gesture-handler';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Platforms from '../../components/Platforms';
import GameplayOptions from '../../components/GameplayOptions';
import GameInfo from '../../components/GameInfo';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reducers';
import { trackPromise } from 'react-promise-tracker';
import Loading from '../../components/Loading';
import * as SecureStore from 'expo-secure-store';


interface Platform {
    id: number;
    namge: string;
    image_url: string;
};

interface Game {
    id: number;
    name: string;
    imageUrl: string;
};

const Playlist = () => {
    const navigation = useNavigation();

    const selectedOption = useSelector((state: RootState) => state.optionState);
    const selectedPlatforms = useSelector((state: RootState) => state.platformsState);
    const filteredPlatforms = useSelector((state: RootState) => state.filteredPlatformsState);
    const token = useSelector((state: RootState) => state.authState);

    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        setGames([]);
        trackPromise(
            api.get<Game[]>(`/getGamesByStatus`, {
                params: {
                    status_id: selectedOption,
                    platform_ids: selectedPlatforms.filter(p => !filteredPlatforms.find(f => f == p))
                },
                headers: {
                    'x-access-token': token
                }
            }
            ).then(response => {
                setGames(response.data);
            })
        );
    }, [selectedOption, selectedPlatforms, filteredPlatforms]);

    return (
        <>
            <View style={styles.container}>


                <Header showLogo={true} />

                <Loading searchTermChanged={true} />

                <View>
                    {games && (
                        <ScrollView style={styles.scrollteste}>

                            <Platforms />

                            <GameplayOptions page='playlist' />

                            <View style={styles.list}>
                                <Text style={styles.textList}>
                                    {games.length} títulos
                                </Text>
                                {/* <Text style={styles.textList}>
                                ordernado por Relevância
                            </Text> */}
                            </View>

                            <View>
                                {games.map(game => (
                                    <GameInfo key={String(game.id)} game={game} />
                                ))}
                            </View>

                        </ScrollView>
                    )}
                </View>

                <Footer option='Playlist' />

            </View>
        </>
    );
};

export default Playlist;

const styles = StyleSheet.create({
    test: {
        color: "#fff"
    },

    scrollteste: {
        marginTop: 100,
        marginBottom: 70
    },

    header: {
        position: 'absolute',
        width: 500,
        height: 25,
        left: 0,
        top: 55
    },

    list: {
        left: 25,
        flexDirection: "row",
        marginBottom: 10
    },

    textList: {
        marginRight: 30,
        fontSize: 16,
        color: "#fff"
    },

    button: {
        height: 60,
        width: 90,
        marginRight: 25,
        flexDirection: "row",
        borderRadius: 10,
        borderColor: "#ffff00",
        borderWidth: 5,
        alignItems: "center",
        justifyContent: "center"
    },

    buttonPlaying: {
        position: 'absolute',
        backgroundColor: "#34CB79",
        height: 60,
        width: 90,
        left: 150,
        flexDirection: "row",
        borderRadius: 10,
        overflow: "hidden",
        alignItems: "center",
        marginTop: 8,
    },

    buttonCompleted: {
        position: 'absolute',
        backgroundColor: "#34CB79",
        height: 60,
        width: 90,
        left: 350,
        flexDirection: "row",
        borderRadius: 10,
        overflow: "hidden",
        alignItems: "center",
        marginTop: 8,
    },


    footer: {
        position: 'absolute',
        marginTop: 745
    },

    home: {
        left: 50,
        position: 'absolute',
        alignItems: 'center',
        width: 80,
    },

    icons: {
        color: "#FFF"
    },

    options: {
        flexDirection: "row",
        justifyContent: "center"
    },

    homeText: {

    },

    backlog: {
        position: 'absolute',
        width: 80,
        alignItems: 'center',
        left: 160
    },

    completed: {
        width: 80,
        alignItems: 'center',
        position: 'absolute',
        left: 270
    },

    unselectedOption: {
        color: '#fff'
    },

    selectedOption: {
        color: '#ff0000'
    },

    appTitle: {
        position: 'absolute',
        left: 20,
        top: 5
    },

    searchObj: {
        position: 'absolute',
        width: 24,
        height: 24,
        left: 305,
        top: 1
    },

    settingsObj: {
        position: 'absolute',
        width: 24,
        height: 24,
        left: 345,
        top: 1
    },

    platformsContainer: {
        flexDirection: "row",
        marginTop: 10,
        marginBottom: 32,
    },

    platform: {
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#eee",
        height: 50,
        width: 50,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginRight: 8,
        alignItems: "center"
    },

    container: {
        flex: 1,
        backgroundColor: '#000',
    },

    searchContainer: {
        position: "absolute",
        margin: 10,
        width: 306,
        height: 50,
        left: 28,
        top: 50,
        backgroundColor: "#000",
        borderColor: "#fff",
        borderRadius: 10,
        borderWidth: 2
    },

    searchInput: {
        left: 70,
        textAlign: "left",
        color: "#fff",
        fontSize: 16,
        justifyContent: "center"
    },

    text: {
        color: "#fff",
        fontSize: 16,
    },

    gameContainer: {
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#eee",
        height: 280,
        width: 370,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginRight: 8,
        alignItems: "center",
        justifyContent: "space-between"
    },

    gameImage: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 170,
        height: 280
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
        fontSize: 25,
        fontFamily: "Roboto_400Regular"
    }
});