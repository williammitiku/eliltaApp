import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const TodayAccounts = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [shopData, setShopData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [emailFromStorage, setEmailFromStorage] = useState('');
  
    useEffect(() => {
        const getEmailFromStorage = async () => {
            try {
                const storedDataString = await AsyncStorage.getItem('userData');
                const storedData = JSON.parse(storedDataString);
                const userEmail = storedData.user._id;
                setEmailFromStorage(userEmail);
            } catch (error) {
                console.error('Error retrieving data from AsyncStorage:', error);
            }
        };

        getEmailFromStorage();
    }, []);
  
    useEffect(() => {
        const fetchData = async () => {
            if (!emailFromStorage) return; // Prevent the fetch from running until the email is loaded
        
            // Get the current day index (0: Sunday, 1: Monday, ..., 6: Saturday)
            const dayIndex = new Date().getDay();
            const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const currentDay = daysOfWeek[dayIndex];
            console.log(currentDay); // Should log only the weekday name (e.g., "Wednesday")
        
            const baseUrl = 'https://elilta-api.onrender.com/api/shop/getTodayShopsAccount';
            const url = `${baseUrl}?createdBy=${emailFromStorage}&day=${currentDay}`;
        
            try {
                const response = await fetch(url);
                const data = await response.json();
        
                if (data.status === 'success') {
                    setShopData(data.shops);
                } else if (data.status === 'error' && data.message === 'No shops found') {
                    setError('No shops found');
                    setShopData([]);  // Clear the shop data if no shops are found
                } else {
                    setError('Failed to fetch data');
                }
            } catch (err) {
                setError('An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };
               
        

        fetchData();
    }, [emailFromStorage]); // Only run when emailFromStorage is set
  
    const filteredData = shopData.filter(item =>
        item.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shopCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.contactInfo.phoneNumber.includes(searchQuery)
    );
  
    const handleCardClick = (shop) => {
        Alert.alert(
            'Confirm',
            `Do you want to sell to ${shop.shopName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Yes', onPress: async () => {
                    try {
                        await AsyncStorage.setItem('shopInfo', JSON.stringify(shop));
                        Alert.alert('Success', 'Shop information stored successfully');
                        navigation.navigate('Form');
                    } catch (err) {
                        Alert.alert('Error', 'Failed to store shop information');
                    }
                }}
            ]
        );
    };
  
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Shop Information</Text>
            <TextInput
                style={styles.searchBar}
                placeholder="Search by Shop Name, Code, or Number"
                value={searchQuery}
                onChangeText={text => setSearchQuery(text)}
            />
            {loading ? (
                <Text style={styles.loading}>Loading...</Text>
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : filteredData.length > 0 ? (
                filteredData.map((item) => (
                    <TouchableOpacity key={item._id} onPress={() => handleCardClick(item)} style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Shop Name:</Text>
                            <Text style={styles.value}>{item.shopName}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Shop Code:</Text>
                            <Text style={styles.value}>{item.shopCode}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Phone Number:</Text>
                            <Text style={styles.value}>{item.contactInfo.phoneNumber}</Text>
                        </View>
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={styles.noResults}>No Shops Available</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    searchBar: {
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        marginBottom: 20,
        borderColor: '#ddd',
        borderWidth: 1,
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    value: {
        fontSize: 16,
        color: '#555',
        flex: 2,
    },
    noResults: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    loading: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    error: {
        fontSize: 16,
        color: '#f00',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default TodayAccounts;
