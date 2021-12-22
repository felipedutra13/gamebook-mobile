import React, { useEffect, useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, Image, View, ScrollView, Alert, Modal, Text, Pressable, SafeAreaView, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addSelectedPlaform, removeSelectedPlaform, replacePlatforms } from '../../actions';
import api from '../../services/api';
import { Platform } from '../../interfaces/Platform';
import { RootState } from '../../reducers';
import { useNavigation } from '@react-navigation/core';

// let count = 0;

const Platforms = () => {
    const navigation = useNavigation();

    const selectedPlatforms = useSelector((state: RootState) => state.platformsState); // plataformas que devem aparecer como opção
    const filteredPlatforms = useSelector((state: RootState) => state.filteredPlatformsState); // plataformas filtradas
    const token = useSelector((state: RootState) => state.authState);
    const dispatch = useDispatch();

    const [platforms, setPlatforms] = useState<Platform[]>([]); // sao de fato oq aparece na tela
    const [platformsData, setPlatformsData] = useState<Platform[]>([]);

    useEffect(() => {
        let mounted = true;
        api.get<Platform[]>(`/getPlatforms`).then(response => {
            if (mounted) {
                setPlatformsData(response.data);
                let userPlaforms = response.data.filter(p => selectedPlatforms.find(t => t === p.externalId));
                setPlatforms(userPlaforms);
            }
        });
        return () => mounted = false;
    }, []);

    useEffect(() => {
        let userPlaforms = platformsData.filter(p => selectedPlatforms.find(t => t === p.externalId));
        setPlatforms(userPlaforms);
    }, [selectedPlatforms]);

    function handleSelectPlatform(id: number) {
        const alreadySelected = filteredPlatforms.includes(id);
        if (alreadySelected) {
            dispatch(removeSelectedPlaform(id));
        } else {
            dispatch(addSelectedPlaform(id));
        }
    }

    function handleAddPlataform() {
        navigation.navigate('Platforms');
    }

    const Item = ({ platform }) => (
        <TouchableOpacity
            key={String(platform.id)}
            activeOpacity={0.7}
            onPress={() => handleSelectPlatform(platform.externalId)}
            style={[
                filteredPlatforms.includes(platform.externalId) ? styles.unSelectedPlatform : {}
            ]}
        >
            <Image style={styles.platform} source={{ uri: platform.image_url }} />
        </TouchableOpacity>
    );


    const renderItem = ({ item }) => {
        return (
            <Item
                platform={item}
            />
        );
    };

    return (
        <>
            <View style={styles.platformsContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        <FlatList
                            data={platforms}
                            renderItem={renderItem}
                            keyExtractor={(item) => String(item.id)}
                            numColumns={99}
                        />
                    </ScrollView>
                    <TouchableOpacity activeOpacity={0.7}>
                        <Icon name="plus-square" size={40} style={styles.plusIcon} onPress={handleAddPlataform} />
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </>
    );
};

export default Platforms;

const styles = StyleSheet.create({
    platformsContainer: {
        flexDirection: "row",
        marginTop: 10,
        marginBottom: 32,
    },

    platform: {
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#eee",
        height: 30,
        width: 30,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginRight: 8,
        alignItems: "center"
    },

    unSelectedPlatform: {
        opacity: 0.5
    },

    plusIcon: {
        color: "white",
        opacity: 0.5
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 55
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        padding: 35,
        width: 300,
        alignItems: "center",
        height: 600
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },

    platformOption: {
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: "center",
        width: 240,
        backgroundColor: 'blue',
        margin: 5
    },

    selectIcon: {
        position: 'absolute',
        right: 15
    }
});