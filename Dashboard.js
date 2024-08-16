import React, { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dashboard = () => {
  const navigation = useNavigation();
  const [dashboardData, setDashboardData] = useState({
    shopsRegisteredToday: 0,
    totalSales: 0,
    creditSales: 0,
    cashSales: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State to manage pull-to-refresh
  const [emailFromStorage, setEmailFromStorage] = useState('');

  useEffect(() => {
    const getEmailFromStorage = async () => {
      try {
        const storedDataString = await AsyncStorage.getItem('userData');
        const storedData = JSON.parse(storedDataString);
        const userEmail = storedData.user._id;
        setEmailFromStorage(userEmail);
        console.log('Test', userEmail);
      } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
      }
    };

    getEmailFromStorage();
  }, [emailFromStorage]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      const salesResponse = await fetch(
        `https://elilta-api.onrender.com/api/sale/SalesReportsByUser?userId=${emailFromStorage}`
      );
      const salesData = await salesResponse.json();
      console.log(salesData, 'Sales Data');
      
      const shopsResponse = await fetch(
        `https://elilta-api.onrender.com/api/shop/getShopsByUser?userId=${emailFromStorage}`
      );
      const shopsData = await shopsResponse.json();
      const length = shopsData.shopsRegisteredToday;

      setDashboardData({
        shopsRegisteredToday: length || 0,
        totalSales: salesData.totalSales || 0,
        creditSales: salesData.creditSales || 0,
        cashSales: salesData.cashSales || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false); // Stop the refresh animation
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleCardPress = (cardType) => {
    // Navigate to Sales screen and pass the selected card type
    navigation.navigate('Sales', { cardType });
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <TouchableOpacity onPress={() => handleCardPress('Shops Registered Today')} style={styles.card}>
        <Text style={styles.cardTitle}>Shops Registered Today</Text>
        <Text style={styles.cardValue}>{dashboardData.shopsRegisteredToday}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleCardPress('Total Sales')} style={styles.card}>
        <Text style={styles.cardTitle}>Total Sales</Text>
        <Text style={styles.cardValue}>ETB: {dashboardData.totalSales}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleCardPress('credit')} style={styles.card}>
        <Text style={styles.cardTitle}>Credit Sales</Text>
        <Text style={styles.cardValue}>ETB: {dashboardData.creditSales}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleCardPress('cash')} style={styles.card}>
        <Text style={styles.cardTitle}>Cash Sales</Text>
        <Text style={styles.cardValue}>ETB: {dashboardData.cashSales}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
});
