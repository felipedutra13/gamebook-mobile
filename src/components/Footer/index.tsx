import React, { useEffect } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { Text, StyleSheet, View, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { selectTab } from '../../actions';
import { RootState } from '../../reducers';

const Footer = (props) => {
    const selectedOption = useSelector((state: RootState) => state.tabState);
    const token = useSelector((state: RootState) => state.authState);
    const dispatch = useDispatch();

    const navigation = useNavigation();

    function handleSelectedOption(tab: string) {
        // dispatch(selectTab(tab));
        // navigation.navigate(tab);
        if (tab === "Playlist") {
            if (!token || token === '') {
                Alert.alert("Realize login para continuar!");
                navigation.navigate('Login');
            } else {
                dispatch(selectTab(tab));
                navigation.navigate(tab);
            }
        } else {
            dispatch(selectTab(tab));
            navigation.navigate(tab);
        }
    }

    useEffect(() => {
        navigation.addListener('focus', () => {
            dispatch(selectTab(props.option));
        });
    }, [])

    return (
        <View style={styles.footer}>
            <TouchableOpacity style={styles.tab} onPress={() => handleSelectedOption('Home')}>
                <Feather name="home" style={[
                    selectedOption == 'Home' ? styles.selectedOption : styles.unselectedOption,
                ]} size={22} />
            </TouchableOpacity >

            <TouchableOpacity style={styles.tab} onPress={() => handleSelectedOption('Search')}>
                <Feather name="search" style={[
                    selectedOption == 'Search' ? styles.selectedOption : styles.unselectedOption,
                ]} size={22} />
            </TouchableOpacity >

            <TouchableOpacity style={styles.tab} onPress={() => handleSelectedOption('Playlist')}>
                <Feather name="list" style={[
                    selectedOption == 'Playlist' ? styles.selectedOption : styles.unselectedOption,
                ]} size={22} />
            </TouchableOpacity >
        </View>
    );
};

export default Footer;

const styles = StyleSheet.create({
    unselectedOption: {
        color: '#fff',
        opacity: 0.4
    },

    selectedOption: {
        color: '#fff'
    },

    footer: {
        position: 'absolute',
        flexDirection: 'row',
        bottom: 35,
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%'
    },

    tab: {
        alignItems: 'center'
    }
});