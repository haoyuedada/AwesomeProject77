import { View, Button, Text, StyleSheet, TextInput } from 'react-native';
import React, { useState } from 'react';
import ModalBox from 'react-native-modalbox';

export default function YoneTest() {
    const [isOpenVal, setIsOpenVal] = useState(false);

    return (
        <View style={styles.body}>
            <Button title="isOpen" onPress={() => setIsOpenVal(!isOpenVal)} />

            <ModalBox
                style={[styles.modal]}
                isOpen={isOpenVal}
                coverScreen={true}
                entry="bottom">
                <Text style={[styles.modalText]}>Modal is open</Text>
                <TextInput
                    placeholder="text"
                    placeholderTextColor="#9a73ef"
                    autoCapitalize="none"
                />
                <Button
                    title={'close ModalBox'}
                    onPress={() => setIsOpenVal(!isOpenVal)}
                />
            </ModalBox>
        </View>
    );
}

const styles = StyleSheet.create({
    modal: {
        height: 150,
        width: 300,
        marginTop: 50
    },
    modalText: {
        fontSize: 20,
        margin: 10,
        color: 'black',
    },
    body: {
        marginTop: 50
    },
});
