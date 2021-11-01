import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';

const Cover = (props) => {
    const game = props.game;
    const isPopularPage = props.isPopularPage;
    // const navigation = useNavigation();
    const navigation = props.navigation;

    function handleGameSelect(id: number, title: string) {
        // navigation.navigate('GameDetail', { id: id, title: title });
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
                <Image style={styles.cover} source={{ uri: game.imageUrl }} />
            </TouchableOpacity>
        </>
    )
};

export default Cover;

const styles = StyleSheet.create({
    cover: {
        backgroundColor: "#fff",
        borderWidth: 2,
        // borderColor: "#eee", ////
        height: 210,
        width: 150,
        borderRadius: 8,
        marginRight: 10
    },

    coverSpace: {
        marginBottom: 10
    }
});