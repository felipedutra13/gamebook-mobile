import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import PlatformsList from '../PlatformsList';

const GameInfo = (props) => {
    const game = props.game;

    const navigation = useNavigation();

    function handleGameSelect(id: number, title: string) {
        navigation.navigate('GameDetail', { id: id, title: title });
    }

    function formatName(name: string) {
        if (name.length > 40) {
            return name.substring(0, 40) + "...";
        }

        return name;
    }

    return (
        <>
            <TouchableOpacity
                key={String(game.id)}
                style={styles.gameContainer}
                onPress={() => handleGameSelect(game.id, game.title)}
            >
                {game.imageUrl != "" &&
                    <View style={styles.imageContainer}>
                        <Image style={styles.gameImage} source={{ uri: game.imageUrl }} />
                    </View>
                }

                <View style={styles.info}>
                    <Text style={styles.title}>{formatName(game.title)}</Text>
                    <Text style={styles.releaseDate}>{game.releaseDate}</Text>
                    <Text style={styles.rating}>{game.aggregatedRating}</Text>
                    <View style={styles.platformsContainer}>
                        {game.platforms &&
                            <PlatformsList platforms={game.platforms} prices={game.prices}/>
                        }
                    </View>
                </View>
            </TouchableOpacity>
        </>
    )
};

export default React.memo(GameInfo);

const styles = StyleSheet.create({
    // cover: {
    //     backgroundColor: "#fff",
    //     borderWidth: 2,
    //     borderColor: "#eee",
    //     height: 210,
    //     width: 150,
    //     borderRadius: 8,
    //     marginRight: 10
    // },

    // coverSpace: {
    //     marginBottom: 10
    // }
    gameContainer: {
        left: 20,
        marginBottom: 10,

        // backgroundColor: "#fff",
        borderWidth: 2,
        // borderColor: "#fff",
        height: 188, //220,
        width: 320, // 350
        borderRadius: 8,
        // paddingHorizontal: 16,
        // paddingTop: 20,
        // paddingBottom: 16,
        // marginRight: 8,
        // alignItems: "center",
        // justifyContent: "space-between"
    },

    imageContainer: {
        position: 'absolute',
        // left: 0,
        // top: 0,
        width: 165,
        height: "100%"
    },

    gameImage: {
        position: 'absolute',
        // left: 0,
        // top: 0,
        width: 165,
        height: "100%"
    },

    info: {
        left: 180,
        width: 160,
        height: "100%"
    },

    title: {
        paddingTop: 10,
        color: "#fff",
        fontSize: 16
    },

    releaseDate: {
        paddingTop: 5,
        color: "#AEA4A4",
        fontSize: 14
    },

    rating: {
        paddingTop: 5,
        color: "#AEA4A4",
        fontSize: 14
    },

    platformsContainer: {
        position: "absolute",
        bottom: 0
    }
});