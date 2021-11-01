import React from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { usePromiseTracker } from "react-promise-tracker";

const Loading = (props) => {
    const searchTermChanged: boolean = props.searchTermChanged;
    const { promiseInProgress } = usePromiseTracker();

    const styleOption = searchTermChanged ? styles.containerTop : (props.login || props.loginGoogle ? styles.login : (props.subscribe ? props.subscribe : styles.containerBottom));
    let color = "#fff";
    let size: "small" | "large";

    if (props.login) {
        size = "small";
        color = "#000";
    } else if (props.loginGoogle) {
        size = "small";
    } else {
        size = "large";
    }

    return promiseInProgress && (
        <View style={styleOption}>
            <ActivityIndicator size={size} color={color} />
        </View>
    )
};

export default Loading;

const styles = StyleSheet.create({
    containerTop: {
        position: "relative",
        // top: 350,
        top: "50%",
        // left: 170,
        marginLeft: 'auto',
        marginRight: 'auto',
        zIndex: 0.5,
        // justifyContent: "center",
        // alignItems: "center"
    },

    containerBottom: {
        backgroundColor: "#000",
        height: 50,
        width: "100%",
        position: "absolute",
        top: 690,
        left: 0,
        zIndex: 0.5,
        // justifyContent: "center",
        // alignItems: "center"
    },

    login: {
        height: 50,
        width: "100%",
        position: "absolute",
        top: 6,
        zIndex: 0.5
    },

    subscribe: {
        height: 50,
        width: "100%",
        position: "absolute",
        top: 10,
        zIndex: 0.5,
    }
});