import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, ScrollView, StatusBar, Text, View, StyleSheet, Pressable, Alert, FlatList } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { logout } from '../../actions';
import User from '../../interfaces/User';
import api from '../../services/api';
import { useNavigation } from '@react-navigation/native';
import { AxiosError } from 'axios';
import Loading from '../../components/Loading';
import { trackPromise } from 'react-promise-tracker';
import * as SecureStore from 'expo-secure-store';

const msgs =
    [
        {
            id: 0,
            question: "Q: O que é Gamebook?",
            answer: "Gamebook é um guia de videogames grátis, feito para ajudar você a encontrar onde jogar seus videogames favoritos. Você pode usar nossos filtros para escolher as plataformas que você possui para ver apenas conteúdo disponível para você."
        },
        {
            id: 1,
            question: "Q: Como nosso conteúdoé criado ?",
            answer: "Nós usamos uma base de dados aberta, igdb.com, como a principal fonte de dados para nosso conteúdo (Imagens, vídeos, títulos, etc). Também obtemos o tempo médio de gameplay de howlongtobeat.com."
        },
        {
            id: 2,
            question: "Q: Procurei um videogame e não o encontrei. Por quê?",
            answer: "O videogame não está listado em nossa fonte igdb.com."
        },
        {
            id: 3,
            question: "Q: O preço listado para um videogame está incorreto. Por quê?",
            answer: "Por favor, nos avise os detalhes e corrigiremos o mais cedo possível."
        },
        {
            id: 4,
            question: "Encontrou um problema relacionado a conteúdo ou disponibilidade ?",
            answer: "Se nada disso está respondendo suas perguntas ou você quer reportar um erro, por favor, nos envie um e-mail para gamebook.atendimento@gmail.com com o problema."
        },
        {
            id: 5,
            question: "Encontrou um bug ou tem uma sugestão ?",
            answer: "Por favor, nos avise sobre quaisquer problemas ou sugestões com nosso aplicativo nos enviando um e-mail para gamebook.atendimento@gmail.com."
        },
    ]

const FAQ = () => {
    const navigation = useNavigation();

    const renderItem = ({ item }) => {
        return (
            <>
                <View style={styles.msgContainer}> 
                    <Text style={styles.question}>{item.question}</Text>
                    <Text style={styles.answer}>{item.answer}</Text>
                </View>
            </>
        );
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Icon name="arrow-left" color="#FFF" size={24} onPress={() => navigation.goBack()} />
                    <Text style={styles.title}>Gamebook</Text>
                </View>
                <View style={styles.faqContainer}>
                    <FlatList
                        data={msgs}
                        renderItem={renderItem}
                        keyExtractor={(item) => String(item.id)}
                    />
                </View>
            </View>
        </>
    );
};

export default FAQ;

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

    title: {
        color: "#fff",
        fontSize: 20,
        left: 10,
        width: "80%"
    },

    question: {
        textAlign: "justify",
        color: "#fff",
        fontSize: 18,
        fontWeight: 'bold'
    },

    answer: {
        color: "#A9A9A9",
        textAlign: "justify",
        fontSize: 15
    },

    faqContainer: {
        top: 100,
        left: 25,
        paddingBottom: 100,
        width: "90%"
    },

    msgContainer: {
        paddingBottom: 35
    }
});