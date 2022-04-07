import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';

const Cover = (props) => {
    const game = props.game;
    const isPopularPage = props.isPopularPage;
    const navigation = props.navigation;

    function handleGameSelect(id: number, title: string) {
        navigation.push('GameDetail', { id: id, title: title });
    }

    return (
        <>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleGameSelect(game.id, game.title)}
                style={[isPopularPage ? styles.coverSpace : {},
                ]}
            >
                {game.imageUrl && game.imageUrl != '' ? <Image style={styles.cover} source={{ uri: game.imageUrl }} /> : null}
            </TouchableOpacity>
        </>
    )
};

export default Cover;

const styles = StyleSheet.create({
    cover: {
        backgroundColor: "#fff",
        borderWidth: 2,
        height: 210,
        width: 150,
        borderRadius: 8,
        marginRight: 10
    },

    coverSpace: {
        marginBottom: 10
    }
});