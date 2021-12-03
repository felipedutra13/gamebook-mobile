import React, { useEffect, useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { Text, StyleSheet, View, TouchableOpacity, ScrollView, SafeAreaView, FlatList, TouchableWithoutFeedback, Modal, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectOption, selectPlaylistOption, showPlatformSelection } from '../../actions';
import { RootState } from '../../reducers';
import { RectButton } from 'react-native-gesture-handler';
import api from '../../services/api';
import Option from '../../interfaces/Option';
import GameUser from '../../interfaces/GameUser';
import { GameDetail } from '../../interfaces/GameDetail';
import PlatformsList from '../PlatformsList';
import * as SecureStore from 'expo-secure-store';
import { AxiosError } from 'axios';
import { showMessage } from 'react-native-flash-message';


const GameplayOptions = (props) => {
    const isPlaylistPage = props.page == 'playlist';
    const game: GameDetail = props.game;
    const selectedOption = isPlaylistPage ? useSelector((state: RootState) => state.playlistState) : useSelector((state: RootState) => state.optionState);
    const modalVisible = useSelector((state: RootState) => state.PlatformSelectionState);
    const [auxOption, setAuxOption] = useState<number>();
    const dispatch = useDispatch();

    // const [modalVisible, setModalVisible] = useState(false);

    let options: Option[] = [
        {
            'id': 1,
            'option': 'wishlist',
            'text': 'Lista de desejos',
            'icon': 'gift'
        },
        {
            'id': 2,
            'option': 'backlog',
            'text': 'Backlog',
            'icon': 'info'
        },
        {
            'id': 3,
            'option': 'playing',
            'text': 'Jogando',
            'icon': 'play'
        },
        {
            'id': 4,
            'option': 'completed',
            'text': 'Completados',
            'icon': 'check-circle'
        }

    ];

    useEffect(() => {

        if (isPlaylistPage) {
            return;
        }
        dispatch(selectOption(null));

        if (game) {
            getGameUser();
        }
    }, []);

    async function getGameUser() {
        let token = "";
        await SecureStore.getItemAsync('token').then(res => {
            token = res;
        });
        api.get<GameUser>(`/getGameUser`,
            {
                params: {
                    game_id: game.igdbData.id
                },
                headers: {
                    'x-access-token': token
                }
            }).then(response => {
                let option = null;
                if (response.data && response.data.status_id) {
                    option = response.data.status_id;
                }
                dispatch(selectOption(option));
            });
    }

    async function updateWishlistStatus(status: number) {
        let token = "";
        await SecureStore.getItemAsync('token').then(res => {
            token = res;
        });
        api.post(`/updateGameStatus`, {
            game_id: game.igdbData.id,
            status_id: status
        },
            {
                headers: {
                    'x-access-token': token
                }
            }).then(response => {
            });
    }

    async function removeGame() {
        let token = "";
        await SecureStore.getItemAsync('token').then(res => {
            token = res;
        });
        api.post(`/removeGame`, {
            game_id: game.igdbData.id
        },
            {
                headers: {
                    'x-access-token': token
                }
            }
        ).catch((err: AxiosError) => {
            // Alert.alert(err.response.data.message);
            console.log(err.message);
        });
    }



    function handleSelectedStatus(item: number) {
        if (selectedOption == item) {
            if (isPlaylistPage) {
                dispatch(selectPlaylistOption(null));
            } else {
                dispatch(selectOption(null));
                showMessage({
                    message: `${game.igdbData.title} removido da sua lista!`,
                    type: "success",
                });
                removeGame();
            }

        } else {
            if (!isPlaylistPage && item !== 1) {
                dispatch(showPlatformSelection(true));
                setAuxOption(item);
            } else {
                handlePlaylistPage(item);
                if (!isPlaylistPage) {
                    updateWishlistStatus(item);
                    showMessage({
                        message: `${game.igdbData.title} adicionado a Lista de desejos!`,
                        type: "success",
                    });
                }
            }
        }
    }

    function handlePlaylistPage(item: number) {
        dispatch(selectPlaylistOption(item));
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableWithoutFeedback onPress={() => handleSelectedStatus(item.id)}>
                <View style={styles.button}>
                    <Icon name={item.icon} size={25} style={[selectedOption == item.id ? styles.icon : styles.unselectedIcon]} />
                    <Text style={[selectedOption == item.id ? styles.text : styles.unselectedText]}>{item.text}</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    return (
        <>
            <View style={styles.options}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={true}
                >
                    <FlatList
                        data={options}
                        renderItem={renderItem}
                        keyExtractor={(item) => String(item.id)}
                        numColumns={4}
                        listKey="gamePlayOptions"
                    />
                </ScrollView>
            </View>

            <View>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        // setModalVisible(!modalVisible);
                        dispatch(showPlatformSelection(!modalVisible));
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Selecione a plataforma:</Text>
                            <PlatformsList platforms={game?.igdbData?.platforms} game={game} status={auxOption} />
                            <View style={styles.buttonView}>
                                <Pressable
                                    style={[styles.modalButton, styles.buttonClose]}
                                    onPress={() => dispatch(showPlatformSelection(!modalVisible))}
                                >
                                    <Text style={styles.textStyle}>Fechar</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </>
    );
};

export default GameplayOptions;

const styles = StyleSheet.create({
    options: {
        // left: 
        // flexDirection: "row",
        // justifyContent: "center"
    },

    button: {
        left: 5,
        height: 60,
        // width: 100,
        marginRight: 15,
        flexDirection: "row",
        borderRadius: 10,
        // borderColor: "red",
        borderWidth: 2,
        alignItems: "center",
        // justifyContent: "center",
        color: "#00ff00",
    },

    text: {
        left: 5,
        fontSize: 15,
        color: "#ffff00"
    },

    unselectedText: {
        left: 5,
        fontSize: 15,
        color: "#fff"
    },

    icon: {
        color: "#ffff00"
    },

    unselectedIcon: {
        color: "#fff"
    },

    modalText: {
        color: "white",
        fontSize: 16,
        left: 4
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // marginTop: 55
    },

    buttonView: {
        alignItems: "center"
    },
    modalView: {
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "yellow",
        backgroundColor: "#000",
        padding: 10,
        width: 300,
        // alignItems: "center",
        height: 170
    },

    modalButton: {
        width: 100,
        top: 20,
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#fff",
    },

    textStyle: {
        color: "#000",
        fontWeight: "bold",
        textAlign: "center"
    },
});