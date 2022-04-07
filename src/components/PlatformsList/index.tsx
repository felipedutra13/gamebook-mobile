import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, ScrollView, SafeAreaView, StyleSheet, FlatList, Image, TouchableOpacity, Text, Linking } from 'react-native';
import api from '../../services/api';
import { Platform } from '../../interfaces/Platform';
import { GameDetail } from '../../interfaces/GameDetail';
import { useDispatch, useSelector } from 'react-redux';
import { selectOption, showPlatformSelection } from '../../actions';
import { RootState } from '../../reducers';
import ExternalGame from '../../interfaces/ExternalGame';
import Price from '../../interfaces/Price';
import * as SecureStore from 'expo-secure-store';
import { showMessage } from 'react-native-flash-message';

const PlatformsList = (props) => {
    const statusMap = {
        "4": "Completados",
        "2": "Backlog",
        "3": "Jogando",
        "1": "Lista de desejos"
    };

    const [platforms, setPlatforms] = useState<Platform[]>([]);
    // const modalVisible = useSelector((state: RootState) => state.PlatformSelectionState);
    const game: GameDetail = props.game;
    const prices: Price[] = props.prices;

    const status = props.status;

    const dispatch = useDispatch();

    useEffect(() => {
        let isMounted = true;
        if (props.platforms && props.platforms.length > 0) {
            api.get<Platform[]>(`/getPlatforms`, {
                params: {
                    platformIds: props?.platforms?.map(p => p.id ? p.id : p)
                }
            }).then(response => {
                let tmp = response.data;
                if (prices && prices.length) {
                    prices.forEach(price => {
                        let foundPlatform = tmp.find(p => p.externalId === price.platformId);
                        if (foundPlatform) {
                            foundPlatform.price = price;
                        }
                    });
                }
                if (isMounted) {
                    setPlatforms(tmp);
                }

            });
        }
        return () => isMounted = false;
    }, []);

    async function handleSelectedPlatform(platform: Platform) {
        if (game && status) {
            let token = "";
            await SecureStore.getItemAsync('token').then(res => {
                token = res;
            });
            api.post(`/updateGameStatus`,
                {
                    game_id: game.igdbData.id,
                    status_id: status,
                    platform_id: platform.externalId
                },
                {
                    headers: {
                        'x-access-token': token
                    }
                }).then(response => {
                    showMessage({
                        message: `${game.igdbData.title} adicionado a ${statusMap[status]}!`,
                        type: "success",
                    });
                    dispatch(selectOption(status));
                    dispatch(showPlatformSelection(false));
                });
        } else {
            if (platform.price) {
                Linking.openURL(platform.price.url);
            }
        }
    }

    function hasDiscount(price: Price) {
        if (price.discount != "" && price.discount != null) {
            return true;
        }

        return false;
    }

    function getDiscountPercentage(price: Price, additionalDiscount: boolean) {
        let discountValue = additionalDiscount ? price.additionalDiscount : price.discount;
        if (discountValue) {
            let percentage = (Number(discountValue.replace(/[^\d.-]/g, '')) / Number(price.price.replace(/[^\d.-]/g, ''))) * 100;
            return "-" + (100 - percentage).toFixed(0) + "%";
        }

        return "";
    }

    function getAdditionalInfo(price: Price) {
        if (price.additionalInfo == 'gamePass') {
            return "GAME PASS";
        }

        return "";
    }

    const Item = ({ item }) => (
        <TouchableOpacity
            key={String(item.id)}
            activeOpacity={0.7}
            onPress={() => handleSelectedPlatform(item)}
        >
            <View style={styles.availableContainer}>
                <Image style={styles.platform} source={{ uri: item.image_url }} />
                {item.price && (<Text style={[hasDiscount(item.price) ? styles.priceDiscount : styles.price]}>{item.price.price}</Text>)}
                {item.price && item.price.discount != "" && (<Text style={styles.price}>{item.price.discount}</Text>)}
                {item.price && item.price.discount != "" && (<Text style={styles.discountPercentage}>{getDiscountPercentage(item.price, false)}</Text>)}
                {item.price && item.price.additionalDiscount && item.price.additionalDiscount != "" ? (<Text style={styles.additionalDiscount}>{item.price.additionalDiscount}</Text>) : null}
                {item.price && item.price.additionalDiscount && item.price.additionalDiscount != "" ? (<Text style={styles.additionalDiscountPercentage}>{getDiscountPercentage(item.price, true)}</Text>) : null}
                {item.price && item.price.additionalInfo && item.price.additionalInfo != "" ? (<Text style={styles.additionalInfo}>{getAdditionalInfo(item.price)}</Text>) : null}
            </View>
        </TouchableOpacity>
    );


    const renderItem = ({ item }) => {
        return (
            <Item
                item={item}
            />
        );
    };

    return (
        <>
            <View style={styles.platformContainer}>
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
            </View>
        </>
    )
};

export default PlatformsList;

const styles = StyleSheet.create({
    availableContainer: {
        alignItems: 'center',
        paddingRight: 15
    },

    platform: {
        backgroundColor: "#fff",
        // backgroundColor: "red",
        borderWidth: 2,
        borderColor: "#eee",
        height: 40,
        width: 40,
        borderRadius: 8,
        // paddingHorizontal: 16,
        // paddingTop: 20,
        // paddingBottom: 16,
        // marginRight: 20,
        alignItems: "center"
        // top: 120
    },

    platformContainer: {
        top: 10,
        borderRadius: 8,
        borderWidth: 2,
        // borderColor: "red",
        paddingLeft: 5,
        paddingTop: 5,
        paddingBottom: 5,
    },

    price: {
        color: "#fff",
        left: 2,
        fontSize: 10,
    },

    priceDiscount: {
        color: "#696969",
        left: 0,
        fontSize: 10,
        textDecorationLine: 'line-through'
    },

    discountPercentage: {
        color: "#000000",
        backgroundColor: "#ffffff",
        borderRadius: 5,
        fontSize: 10,
        padding: 2
    },

    additionalDiscount: {
        color: "#FFFF33",
        left: 0,
        fontSize: 10,
    },

    additionalDiscountPercentage: {
        color: "#000000",
        backgroundColor: "#FFFF33",
        borderRadius: 5,
        fontSize: 10,
        padding: 2
    },

    additionalInfo: {
        backgroundColor: "#00CC00",
        color: "#FFFFFF",
        left: 0,
        fontSize: 7,
        borderRadius: 5,
        padding: 2
    }


});