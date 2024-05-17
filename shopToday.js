import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserInfoCard = ({ shopName, email, phoneNumber, shopCode, channelType, shopType }) => {
    return (
      <View style={styles.card}>
        <Text style={[styles.cardText]}>Shop Code: {shopCode}</Text>
        <Text style={styles.cardText}>Shop Name: {shopName}</Text>
        {/* <Text style={styles.cardText}>Email: {email}</Text> */}
        <Text style={styles.cardText}>Phone Number: {phoneNumber}</Text>
        {/* <Text style={styles.cardText}>Channel Type: {channelType}</Text> */}
        <Text style={styles.cardText}>Shop Type: {shopType}</Text>
      </View>
    );
};

const ShopToday = () => {
  const [shopData, setShopData] = useState([]);
  const [loading, setLoading] = useState(true); 
  
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const storedDataString = await AsyncStorage.getItem('userData');
        const storedData = JSON.parse(storedDataString);
        const userId = storedData.user.salesID;
        
        const response = await fetch('https://eliltatradingadmin.com/api/outlet/getTodayOutletByUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        const data = await response.json();
        if (data.status === 'success') {
          setShopData(data.sales);
          setLoading(false);
        } else {
          console.error('Error fetching shop data:', data.message);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching shop data:', error);
        setLoading(false);
      }
    };

    fetchShopData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.totalShopsCard}>
        <Text style={styles.totalShopsText}>Total Shops Today: {shopData.length}</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="black" />
      ) : (
        shopData.map((shop, index) => (
          <UserInfoCard
            key={shop._id}
            shopName={shop.shopName}
            email={shop.contactInfo.email}
            phoneNumber={shop.contactInfo.phoneNumber}
            shopCode={shop.shopCode}
            channelType={shop.channelType}
            shopType={shop.shopType}
          />
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
    width: '100%',
    paddingTop: 10,
  },
  totalShopsCard: {
    backgroundColor: 'black', // Set background color to black
    padding: 10,
    margin: 10,
    borderRadius: 8,
    width: '90%',
    alignSelf: 'center',
  },
  totalShopsText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white', // Set text color to white
  },
  card: {
    backgroundColor: 'black', // Set background color to black
    padding: 10,
    margin: 10,
    borderRadius: 8,
    width: '90%',
    alignSelf: 'center',
    color: 'white', // Set text color to white
  },  
  cardText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
});


export default ShopToday;
