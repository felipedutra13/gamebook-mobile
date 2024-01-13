import React, { useEffect, useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { Button, SafeAreaView, ScrollView, StatusBar, Text, View, StyleSheet, Pressable, Alert, Image, FlatList, TouchableOpacity } from 'react-native';
import api from '../../services/api';
import { Platform } from '../../interfaces/Platform';
import { addSelectedPlaform, removeSelectedPlaform, replacePlatforms } from '../../actions';
import { RootState } from '../../reducers';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';


const Platforms = () => {
    const navigation = useNavigation();

    const [allPlatforms, setAllPlatforms] = useState<Platform[]>([]);
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const selectedPlatforms = useSelector((state: RootState) => state.platformsState);
    const token = useSelector((state: RootState) => state.authState);
    const dispatch = useDispatch();

    useEffect(() => {
        api.get<Platform[]>(`/getPlatforms`).then(response => {
            setAllPlatforms(response.data);
            let userPlaforms = response.data.filter(p => selectedPlatforms.find(t => t === p.externalId));
            setPlatforms(userPlaforms);
        });
    }, []);

    function conclude() {
        if (!isListDifferent()) {
            dispatch(replacePlatforms(platforms.map(p => p.externalId)));
            if (token && token !== '') {
                api.post(`/setPlatformPreferences`,
                    {
                        platforms: platforms.map(p => p.externalId)
                    },
                    {
                        headers: {
                            'x-access-token': token
                        }
                    });
            }
        }
        navigation.goBack();
    }

    function isListDifferent() {
        return platforms.length === selectedPlatforms.length && platforms.every(p => selectedPlatforms.find(s => s === p.externalId));
    }

    function markPlaform(item: Platform) {
        const alreadySelected = platforms.findIndex(p => p.id === item.id);

        if (alreadySelected >= 0) {
            const filteredItems = platforms.filter(p => p.id !== item.id);
            setPlatforms(filteredItems);
        } else {
            setPlatforms([...platforms, item]);
        }
    }

    const renderPlatformOption = ({ item }) => {
        const checked = platforms.find(p => p.id == item.id) ? "check-square" : "square";


        return (
            <TouchableOpacity
                key={String(item.id)}
                activeOpacity={0.7}
                style={styles.platformOption}
                onPress={() => markPlaform(item)}
            >
                <Image style={styles.platform} source={{ uri: item.image_url }} />
                <Text style={styles.platformName}>{item.name}</Text>
                <Icon name={checked} size={25} style={styles.selectIcon} />
            </TouchableOpacity>
        );
    };

    return (
        <>
            <View style={styles.container}>
                <View>
                    <Text style={styles.text}>
                        Plataformas
                    </Text>
                    <Text style={styles.textSelect}>
                        Selecione suas plataformas
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={styles.closeContainer}
                        onPress={conclude}>
                        <Icon name="check" color="#FFF" size={24} style={styles.closeIcon} />
                        <Text style={styles.closeText}>Concluído</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.listContainer}>
                    <Text style={styles.textColor}>Escolha suas plataformas. Apenas serão exibidos os conteúdos disponíveis sobre as plataformas selecionadas aqui.</Text>
                    <View style={styles.modalView}>
                        <FlatList
                            data={allPlatforms}
                            renderItem={renderPlatformOption}
                            keyExtractor={(item) => String(item.id)}
                        />
                    </View>
                </View>
            </View>
        </>
    );
};

export default Platforms;


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#000"
    },

    text: {
        position: 'absolute',
        left: 20,
        top: 55,
        fontSize: 20,
        color: "#fff"
    },

    textSelect: {
        position: 'absolute',
        left: 20,
        top: 80,
        fontSize: 16,
        color: "#fff"
    },

    closeText: {
        position: 'absolute',
        fontSize: 16,
        color: "#fff",
        left: 130
    },

    closeContainer: {
        left: 150,
        top: 55,
        flexDirection: "row"
    },

    closeIcon: {
        top: 2,
        left: 100
    },

    platformsContainer: {
        flexDirection: "row",
        marginTop: 10,
        marginBottom: 32,
    },

    listContainer: {
        top: 100
    },

    textColor: {
        color: "#fff",
        fontSize: 16,
        left: 20,
        width: "95%"
    },

    platform: {
        backgroundColor: "#fff",
        borderWidth: 2,
        // borderColor: "#eee",
        margin: 10,
        height: 35,
        width: 35,
        borderRadius: 8,
        // paddingHorizontal: 16,
        // paddingTop: 20,
        // paddingBottom: 16,
        // marginRight: 8,
        alignItems: "center"
    },

    platformName: {
        color: "#fff",
        fontSize: 16
    },

    unSelectedPlatform: {
        opacity: 0.1
    },

    plusIcon: {
        color: "white"
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 55
    },
    modalView: {
        // margin: 20,
        backgroundColor: "#000",
        // padding: 35,
        // width: 300,
        alignItems: "center"
        // height: 600
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
        borderWidth: 2,
        borderRadius: 8,
        flexDirection: 'row',
        width: "85%",
        left: 20,
        alignItems: 'center',
        textAlign: "center",
        // width: 240,
        // backgroundColor: '#403F3F',
        margin: 5
    },

    selectIcon: {
        position: 'absolute',
        right: 15,
        color: "#fff"
    }
});