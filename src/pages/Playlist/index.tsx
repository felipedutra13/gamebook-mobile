import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, FlatList } from 'react-native';
import api from '../../services/api';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Platforms from '../../components/Platforms';
import GameplayOptions from '../../components/GameplayOptions';
import GameInfo from '../../components/GameInfo';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reducers';
import { trackPromise } from 'react-promise-tracker';
import Loading from '../../components/Loading';
import RNPickerSelect from 'react-native-picker-select';
import { setGamesTotal } from '../../actions';

interface Game {
    id: number;
    name: string;
    imageUrl: string;
};




const Playlist = () => {
    const selectedOption = useSelector((state: RootState) => state.playlistState);
    const selectedPlatforms = useSelector((state: RootState) => state.platformsState);
    const filteredPlatforms = useSelector((state: RootState) => state.filteredPlatformsState);
    const token = useSelector((state: RootState) => state.authState);
    // const gamesTotal = useSelector((state: RootState) => state.gamesTotalState);

    const [offset, setOffset] = useState(0);
    const [games, setGames] = useState<Game[]>([]);
    const [gamesTotal, setGamesTotal] = useState(0);

    const [moreGames, setMoreGames] = useState(true);
    const [orderBy, setOrderBy] = useState('name');

    let onEndReachedCalledDuringMomentum = true;

    const dispatch = useDispatch();

    useEffect(() => {
        setMoreGames(false);
        setOffset(0);
        // dispatch(setGamesTotal(0));
        setGamesTotal(0);
        setGames([]);

        let mounted = true;
        trackPromise(
            api.get(`/getGamesByStatus`, {
                params: {
                    status_id: selectedOption,
                    platform_ids: selectedPlatforms.filter(p => !filteredPlatforms.find(f => f == p)),
                    offset: 0,
                    order_by: orderBy
                },
                headers: {
                    'x-access-token': token
                }
            }
            ).then(response => {
                if (mounted) {
                    // const gamesWithPlatforms = response.data.games
                    //     .filter(game => game.platforms
                    //         .filter(p => selectedPlatforms.find(f => f == p || f == p.id) && !filteredPlatforms
                    //             .find(f => f == p || f == p.id)));
                    // setGames(gamesWithPlatforms);
                    setGames(response.data.games);
                    // dispatch(setGamesTotal(response.data.total));
                    setGamesTotal(response.data.total);

                }
            })
        );

        return () => mounted = false;
    }, [selectedOption, selectedPlatforms, filteredPlatforms, orderBy]);

    // Busca mais resultados
    useEffect(() => {
        let mounted = true;

        if (offset > 0) {
            trackPromise(
                api.get(`/getGamesByStatus`, {
                    params: {
                        status_id: selectedOption,
                        platform_ids: selectedPlatforms.filter(p => !filteredPlatforms.find(f => f == p)),
                        offset: offset,
                        order_by: orderBy
                    },
                    headers: {
                        'x-access-token': token
                    }
                }
                ).then(response => {
                    if (mounted) {
                        let tmp = games;
                        let result = tmp.concat(response.data.games);
                        setGames(result);
                        // dispatch(setGamesTotal(response.data.total));
                        // setGamesTotal(response.data.total);
                    }
                })
            );
        }

        return () => mounted = false;
    }, [offset]);

    function getMoreGames() {
        if (games.length < gamesTotal) {
            setMoreGames(true);
            let increment = offset + 10;
            setOffset(increment);
        }
    }

    const renderItem = ({ item }) => {
        return (
            <GameInfo key={String(item.id)} game={item} />
        );
    };

    const renderHeader = (total) => {
        return (
            <>
                <Platforms />

                <GameplayOptions page='playlist' />

                <View style={styles.list}>
                    <Text style={styles.textList}>
                        {total} títulos
                    </Text>
                    <Text style={styles.textList}>organizados por</Text>
                    <RNPickerSelect
                        style={{
                            ...pickerSelectStyles, iconContainer: {
                                top: 8,
                                right: 0,
                            }
                        }}
                        useNativeAndroidPickerStyle={false}
                        onValueChange={(value) => setOrderBy(value)}
                        value={orderBy}
                        items={[
                            { label: 'Preço', value: 'price' },
                            { label: 'Desconto (%)', value: 'discountPercent' },
                            { label: 'Rating', value: 'aggregated_rating' },
                            { label: 'Data de lançamento', value: 'first_release_date' }
                        ]}
                        placeholder={{ label: 'Nome', value: 'name' }}
                        Icon={() => {
                            return (
                                <View
                                    style={{
                                        backgroundColor: 'transparent',
                                        borderTopWidth: 10,
                                        borderTopColor: '#fff',
                                        borderRightWidth: 10,
                                        borderRightColor: 'transparent',
                                        borderLeftWidth: 10,
                                        borderLeftColor: 'transparent',
                                        width: 0,
                                        height: 0,
                                    }}
                                />
                            );
                        }}
                    />
                </View>
            </>
        );
    };



    return (
        <>
            <View style={styles.container}>


                <Header showLogo={true} />

                <Loading searchTermChanged={!moreGames} />

                <View style={styles.scrollteste}>
                    <FlatList
                        data={games}
                        renderItem={renderItem}
                        keyExtractor={(item) => String(item.id)}
                        onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum = false; }}
                        // initialNumToRender={2}
                        onEndReachedThreshold={0.5}
                        onEndReached={() => onEndReachedCalledDuringMomentum = true}
                        onMomentumScrollEnd={() => {
                            onEndReachedCalledDuringMomentum && getMoreGames()
                            onEndReachedCalledDuringMomentum = false
                        }}
                        numColumns={1}
                        ListHeaderComponent={() => renderHeader(gamesTotal)}
                    />
                </View>

                <Footer option='Playlist' />

            </View>
        </>
    );
};

export default Playlist;

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'white',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        // paddingLeft: -30,
        top: -3,
        // left: -40,
        fontSize: 14,
        color: "#fff",
        // paddingHorizontal: 10,
        // paddingVertical: 8,
        // borderWidth: 0.5,
        // borderColor: 'red',
        // borderRadius: 8,
        // color: 'red',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});

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
        marginRight: 10,
        fontSize: 14,
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
    },

    pickerSelect: {
        color: "#fff"
    }
});