import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserInfoCard = ({ shopName, email, phoneNumber, shopCode, purchaser, shopType }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.cardText}>Outlet Code: {shopCode}</Text>
        <Text style={styles.cardText}>Outlet Name: {shopName}</Text>
        <Text style={styles.cardText}>Phone Number: {phoneNumber}</Text>
        <Text style={styles.cardText}>Outlet Type: {shopType}</Text>
        <Text style={styles.cardText}>Outlet Purchaser: {purchaser}</Text>
      </View>
    );
};

const OutletToday = () => {
  const [shopData, setShopData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('today');

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
          body: JSON.stringify({ userId, dateRange }),
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
  }, [dateRange]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.buttonContainer}>
        <Button title="Today" onPress={() => setDateRange('today')} />
        <Button title="Weekly" onPress={() => setDateRange('weekly')} />
        <Button title="Monthly" onPress={() => setDateRange('monthly')} />
        <Button title="Yearly" onPress={() => setDateRange('yearly')} />
      </View>
      <View style={styles.totalShopsCard}>
        <Text style={styles.totalShopsText}>Total Outlet {dateRange.charAt(0).toUpperCase() + dateRange.slice(1)}: {shopData.length}</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="black" />
      ) : (
        shopData.map((shop) => (
          <UserInfoCard
            key={shop._id}
            shopName={shop.outletName}
            email={shop.contactInfo.email}
            phoneNumber={shop.contactInfo.phoneNumber}
            shopCode={shop.outletCode}
            shopType={shop.outletType}
            purchaser={shop.purchaser}
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
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

export default OutletToday;
