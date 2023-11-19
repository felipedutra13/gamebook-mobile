import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import Routes from './src/routes';
import { useFonts, Roboto_400Regular } from '@expo-google-fonts/roboto';
import * as Font from 'expo-font';
import { Feather } from '@expo/vector-icons';
import { manuallyResetPromiseCounter } from 'react-promise-tracker';
import { useBackHandler } from '@react-native-community/hooks';

function cacheFonts(fonts) {
    return fonts.map(font => Font.loadAsync(font));
}

export default function App() {
    useBackHandler(() => {
        manuallyResetPromiseCounter();
        return false;
    });

    const [appIsReady, setAppIsReady] = useState(false);

    const [fontsLoaded] = useFonts({
        Roboto_400Regular
    });

    useEffect(() => {
        async function loadResourcesAndDataAsync() {
            try {
                SplashScreen.preventAutoHideAsync();
                const fontAssets = cacheFonts([{ Feather: Feather.font.feather }]);
                await Promise.all([...fontAssets]);
            } catch (e) {
                // You might want to provide this error information to an error reporting service
                console.warn(e);
            } finally {
                setAppIsReady(true);
                SplashScreen.hideAsync();
            }
        }

        loadResourcesAndDataAsync();
    }, []);

    if (!appIsReady || !fontsLoaded) {
        return null;
    }

    return (
        <Routes />
    );
}