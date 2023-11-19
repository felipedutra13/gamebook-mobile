import React, { useEffect, useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Text, StyleSheet, TouchableOpacity, Image, View, ScrollView, SafeAreaView, FlatList, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Cover from '../../components/Cover';
import Platforms from '../../components/Platforms';
import { RootState } from '../../reducers';


interface Game {
    id: number;
    name: string;
    imageUrl: string;
};

const Popular = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [offset, setOffset] = useState(0);

    const platforms = useSelector((state: RootState) => {
        return state.platformsState
    });

    useEffect(() => {
        if (platforms.length > 0) {
            api.get<Game[]>(`/getPopulargames`, {
                params: {
                    offset: offset,
                    platformIds: platforms
                }
            }).then(response => {
                let tmp = games;
                let result = tmp.concat(response.data);
                setGames(result);
            });
        }
    }, [offset]);

    useEffect(() => {
        if (platforms.length > 0) {
            api.get<Game[]>(`/getPopulargames`, {
                params: {
                    offset: offset,
                    platformIds: platforms
                }
            }).then(response => {
                setGames(response.data);
            });
        }
    }, [platforms]);

    function getMorePopularGames() {
        let increment = offset + 50;
        setOffset(increment);
    }

    const renderItem = ({ item }) => {
        return (
            <Cover game={item} isPopularPage={true}/>
        );
    };

    return (
        <>
            <View style={styles.container}>

                <Header showLogo={true} />

                <View>

                    <View style={styles.scroll}>
                        <Platforms />
                        <View style={styles.list}>

                            <FlatList
                                data={games}
                                renderItem={renderItem}
                                keyExtractor={(item) => String(item.id)}
                                onEndReachedThreshold={0.5}
                                onEndReached={() => {
                                    getMorePopularGames();
                                }}
                            numColumns={2}
                            />
                        </View>
                    </View>
                </View>
                <Footer option={'Popular'} />
            </View>
        </>
    );
};

export default Popular;

const styles = StyleSheet.create({
    scroll: {
        marginTop: 100,
        // marginBottom: 270,
        height: 540
    },

    container: {
        flex: 1,
        backgroundColor: "#000"
        // marginTop: StatusBar.currentHeight || 0,
    },

    list: {
        left: 40
    },
});