import React from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { Text, StyleSheet, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { RootState } from '../../reducers';



const Header = (props) => {
    const navigation = useNavigation();

    const token = useSelector((state: RootState) => state.authState);

    function handleConfig() {
        if (token && token !== '') {
            navigation.navigate('Logout');
        } else {
            navigation.navigate('Login');
        }
    }

    function formatName(name: string) {
        if (name?.length > 50) {
            return name.substring(0, 50) + "...";
        }

        return name;
    }

    return (
        <>
            <View style={styles.header}>
                {props.showLogo && <Text style={styles.appTitle}>Gamebook</Text>}
                {props.showBackButton && <Icon name="arrow-left" color="#FFF" size={24} onPress={() => navigation.goBack()} />}
                <Text style={styles.title}>{formatName(props.title)}</Text>
                <TouchableOpacity onPress={handleConfig}>
                    <Icon name="user" color="#FFF" size={24} />
                </TouchableOpacity>
            </View>
        </>
    );
};

export default Header;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },

    header: {
        zIndex: 0.5,
        position: 'absolute',
        flexDirection: 'row',
        top: 45,
        left: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '85%',
        marginLeft: 0
    },

    appTitle: {
        position: 'absolute',
        // left: 20,
        top: 5,
        fontSize: 20,
        color: "#fff"
    },

    searchObj: {
        marginLeft: "auto",
        width: 24,
        height: 24,
    },

    logoImage: {
        width: 60,
        height: 60
    },

    title: {
        color: "#fff",
        fontSize: 20,
        left: 10,
        width: "80%"
    }
});