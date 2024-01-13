import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, Image, View, ScrollView, SafeAreaView, FlatList } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { Feather as Icon } from '@expo/vector-icons';
import api from '../../services/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Platforms from '../../components/Platforms';
import PlatformsList from '../../components/PlatformsList';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reducers';
import { useNavigation } from "@react-navigation/native";

import { Platform } from '../../interfaces/Platform';
import { GameDetail } from '../../interfaces/GameDetail';
import Genre from '../../interfaces/Genre';

import GameplayOptions from '../../components/GameplayOptions';
import YoutubePlayer from "react-native-youtube-iframe";
import GameInfo from '../../components/GameInfo';
import Cover from '../../components/Cover';
import { trackPromise } from 'react-promise-tracker';
import Loading from '../../components/Loading';

const GameDetails = ({ route, navigation }) => {

    const { id, title } = route.params;
    const token = useSelector((state: RootState) => state.authState);
    const showTable = token && token !== '' ? true : false;

    const [gameDetail, setGameDetail] = useState<GameDetail>(null);

    const tableRows = [
        {
            id: 1,
            key: "Rating",
            value: gameDetail => gameDetail.igdbData.aggregatedRating ? gameDetail.igdbData.aggregatedRating : 'N/A',
            complement: ""
        },
        {
            id: 2,
            key: "Gêneros",
            value: gameDetail => gameDetail.igdbData.genres.length > 0 ? gameDetail.igdbData.genres.toString().replace(/,/g, ', ') : 'N/A',
            complement: ""
        },
        {
            id: 3,
            key: "Data de lançamento",
            value: gameDetail => gameDetail.igdbData.releaseDate,
            complement: ""
        },
        {
            id: 4,
            key: "Tempo de gameplay",
            value: gameDetail => gameDetail.hltbData && gameDetail.hltbData.gameplayMain ? gameDetail.hltbData.gameplayMain : 'N/A',
            complement: " horas"
        },
        {
            id: 5,
            key: "Tempo de gameplay + extra",
            value: gameDetail => gameDetail.hltbData && gameDetail.hltbData.gameplayMainExtra ? gameDetail.hltbData.gameplayMainExtra : 'N/A',
            complement: " horas"
        },
        {
            id: 6,
            key: "Tempo de gameplay complecionista",
            value: gameDetail => gameDetail.hltbData && gameDetail.hltbData.gameplayCompletionist ? gameDetail.hltbData.gameplayCompletionist : 'N/A',
            complement: " horas"
        },
        {
            id: 7,
            key: "Modos de jogo",
            value: gameDetail => gameDetail.igdbData.gameModes,
            complement: ""
        },
        {
            id: 8,
            key: "Desenvolvedora",
            value: gameDetail => gameDetail.igdbData.developer ? gameDetail.igdbData.developer : 'N/A',
            complement: ""
        },
        {
            id: 9,
            key: "Publicadora",
            value: gameDetail => gameDetail.igdbData.publisher ? gameDetail.igdbData.publisher : 'N/A',
            complement: ""
        }
    ];

    useEffect(() => {
        setGameDetail(null);
        let isMounted = true;
        trackPromise(
            api.get<GameDetail>(`/getGameDetails`, {
                params: {
                    gameId: id,
                    title: title
                }
            }).then(response => {
                // if (isMounted) {
                setGameDetail(response.data);
                // }
            }));

        isMounted = false;
    }, []);

    return (
        <>
            <View style={styles.container}>
                <Header showBackButton={true} title={title} navigation={navigation} />
                <Loading searchTermChanged={true} />
                <View style={styles.detailContainer}>

                    {gameDetail ? (
                        <View>
                            <ScrollView>
                                <Image style={styles.artwork} source={{ uri: gameDetail.igdbData.artworkUrl }} />

                                {showTable && <GameplayOptions game={gameDetail} />}

                                <Text style={styles.availableText}>Disponível em</Text>
                                <View style={styles.platformsContainer}>
                                    <PlatformsList platforms={gameDetail?.igdbData?.platforms} prices={gameDetail?.igdbData?.prices} />
                                </View>

                                {gameDetail.igdbData.videoIds != null ? (
                                    <View style={styles.trailer}>
                                        <YoutubePlayer
                                            webViewStyle={{ opacity: 0.99 }}
                                            height={300}
                                            playList={gameDetail.igdbData.videoIds}
                                            videoId={gameDetail.igdbData.videoIds[0]}
                                        />
                                    </View>
                                ) : null}

                                <View style={styles.tableData}>
                                    {tableRows.map(tr => (
                                        <View key={String(tr.id)} style={styles.rowWrapper}>
                                            <View style={styles.titleWrapper}>
                                                <Text style={styles.titleText}>{tr.key}</Text>
                                            </View>
                                            <Text style={styles.tableText}>{tr.value(gameDetail) + tr.complement}</Text>
                                        </View>
                                    ))}
                                </View>

                                <View style={styles.summaryContainer}>
                                    <Text style={styles.summaryTitle}>Sumário</Text>
                                    <Text style={styles.summary}>{gameDetail.igdbData.summary}</Text>
                                </View>

                                {gameDetail.igdbData.dlcs.length > 0 && (
                                    <View>
                                        <Text style={styles.summaryTitle}>DLCs</Text>
                                        <View style={styles.dlcsContainer}>
                                            <ScrollView
                                                horizontal
                                                showsHorizontalScrollIndicator={false}>
                                                {gameDetail.igdbData.dlcs.map(dlc => (
                                                    <Cover key={String(dlc.id)} game={dlc} navigation={navigation} />
                                                ))}
                                            </ScrollView>
                                        </View>

                                    </View>
                                )}


                                {gameDetail.igdbData.similarGames.length > 0 && (
                                    <View>
                                        <Text style={styles.summaryTitle}>Jogos similares</Text>
                                        <View style={styles.dlcsContainer}>
                                            <ScrollView
                                                horizontal
                                                showsHorizontalScrollIndicator={false}>
                                                {gameDetail.igdbData.similarGames.map(similarGame => (
                                                    <Cover key={String(similarGame.id)} game={similarGame} navigation={navigation} />
                                                ))}
                                            </ScrollView>
                                        </View>

                                    </View>
                                )}



                            </ScrollView>
                        </View>
                    ) : null}

                </View>
            </View>

        </>
    );
};

export default GameDetails;

const styles = StyleSheet.create({
    head: { height: 40, backgroundColor: '#f1f8ff' },
    // title: { flex: 1, backgroundColor: '#f6f8fa' },
    text: { textAlign: 'center' },
    container: {
        flex: 1,
        backgroundColor: '#000',
    },

    detailContainer: {
        marginTop: 95
        // height: 700
    },

    arrowIcon: {
        top: 50,
        left: 20
    },

    artwork: {
        left: 0,
        top: 0,
        width: "100%",
        height: 300
    },

    title: {
        top: 120,
        textAlign: "center",
        color: "#fff",
        fontSize: 30
    },

    platformsContainer: {
        // flexDirection: "row",
        // justifyContent: 'space-around',
        // marginTop: 10,
        // marginBottom: 32,
        top: 10,
        // left: 20,
        // borderColor: "#FFCC00",
        // borderRadius: 10,
        // borderWidth: 2,
        // width: "85%",
    },

    platform: {
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#eee",
        height: 50,
        width: 50,
        borderRadius: 8,
        // paddingHorizontal: 16,
        // paddingTop: 20,
        // paddingBottom: 16,
        marginRight: 8,
        alignItems: "center"
        // top: 120
    },

    availableText: {
        top: 10,
        left: 20,
        fontSize: 18,
        color: "#fff"
    },

    trailer: {
        top: 50
    },

    tableData: {
        width: "95%",
        top: 10,
        left: 10,
        borderColor: "#4F4F4F",
        borderWidth: 1,
        borderRadius: 8
    },

    tableText: {
        margin: 10,
        fontSize: 16,
        color: "#fff",
        width: "40%"
    },

    rowText: {
        color: "yellow",
        margin: 10,
        fontSize: 18
    },

    summaryContainer: {
        top: 25,
        left: 10,
        paddingBottom: 40,
        width: "95%"
        // height: "100%"
    },

    summary: {
        top: 5,
        // color: "#fff",
        color: "#A9A9A9",
        fontSize: 16,
        // left: 5,
        textAlign: "justify"
        // justifyContent: "center"
    },
    wrapper: {
        flexDirection: 'row'
    },

    rowWrapper: {
        flexDirection: 'row'
    },

    titleWrapper: {
        width: 200
    },

    titleText: {
        margin: 10,
        color: "#A9A9A9",
        fontSize: 16
    },

    summaryTitle: {
        // color: "#A9A9A9",
        color: "#fff",
        fontSize: 18,
        left: 10
    },

    dlcsContainer: {
        left: 10,
        top: 10,
        marginBottom: 20
    },

    similarGamesContainer: {

    }
});