import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SalesCard = ({ sale }) => {
  const {
    saleCode,
    transactionType,
    shopInfo,
    totalPrice,
    createdAt,
    products,
  } = sale;

  return (
    <TouchableOpacity style={styles.card} onPress={() => alert(`Clicked on ${saleCode}`)}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>Sale Code: {saleCode}</Text>
        <Text style={styles.cardDetail}>Transaction Type: {transactionType}</Text>
        <Text style={styles.cardDetail}>Shop Name: {shopInfo.shopName}</Text>
        <Text style={styles.cardValue}>Total Price: ETB {totalPrice}</Text>
        <Text style={styles.cardDetail}>Date: {new Date(createdAt).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Dashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    const fetchSalesData = async () => {
      if (emailFromStorage) {
        try {
          const response = await axios.get(
            `https://elilta-api.onrender.com/api/sale/SalesByUserAndType?userId=${emailFromStorage}&transactionType=credit`
          );
          setSalesData(response.data.sales);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSalesData();
  }, [emailFromStorage]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={salesData}
        renderItem={({ item }) => <SalesCard sale={item} />}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  card: {
    width: '100%',
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: '#ff7e5f', // A gradient-like effect can be achieved with a solid color
  },
  cardContent: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  cardDetail: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});
