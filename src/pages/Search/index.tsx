import React, { useEffect, useState } from 'react';
import { Text, TextInput, StyleSheet, TouchableOpacity, Image, View, ScrollView, FlatList } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { Feather as Icon } from '@expo/vector-icons';
import GameInfo from '../../components/GameInfo';
import Loading from '../../components/Loading';
import { trackPromise } from 'react-promise-tracker';

import api from '../../services/api';
import Footer from '../../components/Footer';

interface Game {
    id: number,
    title: string,
    imageUrl: string;
    platforms: any[];
};

const Search = () => {
    const navigation = useNavigation();

    const [searchString, setSearchString] = useState('');
    const [searchTermChanged, setSearchTermChanged] = useState(false);
    const [selectedGames, setSelectedGames] = useState<Game[]>([]);
    const [offset, setOffset] = useState(0);

    // quando altera a busca
    useEffect(() => {
        setOffset(0);
        setSelectedGames([]);
        const delayDebounceFn = setTimeout(() => {
            if (searchString != "") {
                setSearchTermChanged(true);
                trackPromise(
                    api.get<Game[]>(`/search?title=${searchString}&offset=${offset}`).then(response => {
                        setSelectedGames(response.data);
                        
                    }).catch(err => {
                        console.log(err.toString());
                    }));
            }
        }, 2000)

        return () => clearTimeout(delayDebounceFn)
    }, [searchString]);

    // buscando mais resultados
    useEffect(() => {
        // Send Axios request here
        if (searchString != "" && offset > 0) {
            setSearchTermChanged(false);
            trackPromise(
                api.get<Game[]>(`/search?title=${searchString}&offset=${offset}`).then(response => {
                    let tmp = selectedGames;
                    let result = tmp.concat(response.data);
                    setSelectedGames(result);
                }));
        }
    }, [offset]);

    function getMoreGames() {
        let increment = offset + 50;
        setOffset(increment);
    }

    const renderItem = ({ item }) => {
        return (
            <GameInfo key={String(item.id)} game={item} isSearchPage={true}/>
        );
    };

    return (
        <>
            <View style={styles.container}>
                <Loading searchTermChanged={searchTermChanged} />
                <View style={styles.limitContainer}>



                    <View style={styles.searchContainer}>
                        <Icon name="arrow-left" color="#FFF" size={24} style={styles.arrowIcon} onPress={() => navigation.goBack()} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar"
                            placeholderTextColor="#fff" 
                            onChangeText={setSearchString}
                            autoCompleteType="off"
                        />
                    </View>

                    <View style={styles.gamesContainer}>



                        <FlatList
                            data={selectedGames}
                            renderItem={renderItem}
                            keyExtractor={(item) => String(item.id)}
                            onEndReachedThreshold={0.5}
                            onEndReached={() => {
                                getMoreGames();
                            }}
                            numColumns={1}
                        />


                    </View>
                </View>
                <Footer option='Search' />
            </View>
        </>
    );
};

export default Search;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },

    searchContainer: {
        position: "absolute",
        margin: 10,
        width: 350,
        height: 50,
        left: 20,
        top: 50,
        backgroundColor: "#000",
        borderColor: "#696969",
        borderRadius: 10,
        borderWidth: 2
    },

    searchInput: {
        left: 40,
        top: -12,
        textAlign: "left",
        color: "#fff",
        fontSize: 18
    },

    arrowIcon: {
        top: 12
    },

    gamesContainer: {
        flexDirection: "row",
        marginTop: 140,
        left: 10
        // marginLeft: 30
    },

    text: {
        color: "#fff",
        fontSize: 16,
        left: 20,
        paddingBottom: 10
    },

    game: {
        height: 200,
        width: 800
    },

    gameImage: {
        marginTop: 10,
        width: 120,
        height: 170,
        left: 29
    },

    gameTitle: {
        position: "relative",
        left: 10,
        color: "#fff",
        fontSize: 16
    },

    limitContainer: {
        marginBottom: 70
    }
});