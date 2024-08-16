import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, FlatList, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

// Dummy data for credits
const allCredits = [
    { id: '1', amount: 100, status: 'Pending' },
    { id: '2', amount: 200, status: 'Accepted' },
    { id: '3', amount: 150, status: 'Pending' },
];

const CreditList = ({ status }) => {
    const [credits, setCredits] = useState(allCredits.filter(credit => credit.status === status));
    const [selectedCredit, setSelectedCredit] = useState(null);
    const [newAmount, setNewAmount] = useState('');

    const handleAcceptMoney = () => {
        if (selectedCredit) {
            setCredits(credits.map(credit =>
                credit.id === selectedCredit.id
                    ? { ...credit, status: 'Accepted', amount: parseFloat(newAmount) || credit.amount }
                    : credit
            ));
            setNewAmount('');
            setSelectedCredit(null);
            Alert.alert('Success', 'Credit accepted and updated successfully');
        } else {
            Alert.alert('Error', 'No credit selected');
        }
    };

    const handleSelectCredit = (credit) => {
        setSelectedCredit(credit);
        setNewAmount(credit.amount.toString());
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{status} Credits</Text>

            {selectedCredit && (
                <View style={styles.creditDetails}>
                    <Text style={styles.detailsText}>Selected Credit ID: {selectedCredit.id}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter new amount"
                        keyboardType="numeric"
                        value={newAmount}
                        onChangeText={setNewAmount}
                    />
                    <Button title="Accept Money" onPress={handleAcceptMoney} />
                </View>
            )}

            <FlatList
                data={credits}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleSelectCredit(item)}
                    >
                        <Text style={styles.cardText}>ID: {item.id}</Text>
                        <Text style={styles.cardText}>Amount: ${item.amount}</Text>
                        <Text style={styles.cardText}>Status: {item.status}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const Tab = createBottomTabNavigator();

const ManageCreditTabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Pending" children={() => <CreditList status="Pending" />} />
            <Tab.Screen name="Accepted" children={() => <CreditList status="Accepted" />} />
        </Tab.Navigator>
    );
};

const ManageCredit = () => {
    return (
        <NavigationContainer>
            <ManageCreditTabs />
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f0f0f0',
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    creditDetails: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    detailsText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
    },
    input: {
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 10,
        fontSize: 16,
    },
    card: {
        padding: 15,
        marginBottom: 15,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    cardText: {
        fontSize: 16,
        color: '#333',
    },
});

export default ManageCredit;
