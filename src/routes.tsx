import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from 'react-redux';

import store from './store';

const AppStack = createStackNavigator();

import Home from './pages/Home';
import Search from './pages/Search';
import Playlist from './pages/Playlist';
import Popular from './pages/Popular';
import GameDetail from './pages/GameDetails';
import Login from './pages/Login';
import Subscribe from './pages/Subscribe';
import Logout from './pages/Logout';
import Platforms from './pages/Platforms';
import FAQ from './pages/FAQ';
import ForgotPassword from './pages/ForgotPassword';
import FillCode from './pages/FillCode';
import ResetPassword from './pages/ResetPassword';
import FlashMessage from "react-native-flash-message";
import { StatusBar } from 'react-native';

const Routes = () => {
    return (
        <Provider store={store}>
            <StatusBar
                backgroundColor="#000"
                barStyle="light-content"
            />
            <NavigationContainer theme={DefaultTheme}>
                <AppStack.Navigator
                    headerMode="none"
                    screenOptions={{
                        cardStyle: {
                            backgroundColor: "#f0f0f5"
                        }
                    }}
                >
                    <AppStack.Screen name="Home" component={Home} />
                    <AppStack.Screen name="Search" component={Search} />
                    <AppStack.Screen name="Playlist" component={Playlist} />
                    <AppStack.Screen name="Popular" component={Popular} />
                    <AppStack.Screen name="GameDetail" component={GameDetail} />
                    <AppStack.Screen name="Login" component={Login} />
                    <AppStack.Screen name="Subscribe" component={Subscribe} />
                    <AppStack.Screen name="Logout" component={Logout} />
                    <AppStack.Screen name="Platforms" component={Platforms} />
                    <AppStack.Screen name="FAQ" component={FAQ} />
                    <AppStack.Screen name="ForgotPassword" component={ForgotPassword} />
                    <AppStack.Screen name="FillCode" component={FillCode} />
                    <AppStack.Screen name="ResetPassword" component={ResetPassword} />
                </AppStack.Navigator>
            </NavigationContainer>
            <FlashMessage position="bottom" />
        </Provider>
    );
};

export default Routes;