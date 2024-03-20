import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserInfoCard = ({ name, email, sales, salesCode, transactionType }) => {
    const transactionTextColor = transactionType === 'cash' ? 'red' : 'green';
  
    return (
      <View style={styles.card}>
        <Text style={[styles.cardText]}>Sale Code: {salesCode}</Text>
        <Text style={styles.cardText}>Name: {name}</Text>
        <Text style={styles.cardText}>Email: {email}</Text>
        <Text style={styles.cardText}>Total Price: {sales}</Text>
        <Text style={[styles.cardText, { color: transactionTextColor }]}>Transaction Type: {transactionType}</Text>
      </View>
    );
};
  

const ViewSales = () => {
  const [salesData, setSalesData] = useState([]);
  const [emailFromStorage, setEmailFromStorage] = useState('');
  const [loading, setLoading] = useState(true); // State for loading indicator
  
  useEffect(() => {
    const getEmailFromStorage = async () => {
      try {
        const storedDataString = await AsyncStorage.getItem('userData');
        const storedData = JSON.parse(storedDataString);
        const userEmail = storedData.user.salesID;
        setEmailFromStorage(userEmail);
        
        // Fetch sales data using the retrieved email
        const fetchSalesData = async () => {
          try {
            const response = await fetch('https://eliltatradingadmin.com/api/sale/YourTodaySales', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ salesID: userEmail }),
            });
    
            const data = await response.json();
            setSalesData(data);
            setLoading(false); // Set loading to false when data is fetched
          } catch (error) {
            console.error('Error fetching sales data:', error);
            setLoading(false); // Set loading to false in case of error
          }
        };
    
        fetchSalesData();
      } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
        setLoading(false); // Set loading to false in case of error
      }
    };
  
    getEmailFromStorage();
  }, []);
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {loading ? ( // Show loading indicator if loading is true
        <ActivityIndicator size="large" color="black" />
      ) : (
        salesData.map((sale) => (
          sale.shopInfo ? (
            <UserInfoCard
              key={sale._id}
              name={sale.shopInfo.shopName}
              email={sale.shopInfo.contactInfo.email}
              sales={sale.totalPrice}
              salesCode={sale.saleCode}
              transactionType={sale.transactionType}
            />
          ) : (
            // Render different content when sale.shopInfo is null
            <UserInfoCard
              key={sale._id}
              name='Walking'
              email='Walking'
              sales={sale.totalPrice}
              salesCode={sale.saleCode}
              transactionType={sale.transactionType}
            />
          )
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 350,
    paddingTop: 10,
  },
  card: {
    backgroundColor: 'lightblue',
    padding: 10,
    margin: 10,
    borderRadius: 8,
    width: '100%', // Use '100%' to make it full width
    maxWidth: 300, // Set a maxWidth if you want a maximum width for each card
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ViewSales;
