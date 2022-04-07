import React from 'react';
import AppLoading from 'expo-app-loading';
import Routes from './src/routes';
import { useFonts, Roboto_400Regular } from '@expo-google-fonts/roboto';
import { manuallyResetPromiseCounter } from 'react-promise-tracker';
import { useBackHandler } from '@react-native-community/hooks'

export default function App() {
    useBackHandler(() => {
        manuallyResetPromiseCounter();
        return false;
    })

    const [fontsLoaded] = useFonts({
        Roboto_400Regular
    });

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <Routes />
    );
}