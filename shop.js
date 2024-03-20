import React, { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';


import * as Location from "expo-location";

const data = [
  { label: 'Mini Shop', value: 'miniShop' },
  { label: 'Super Market Shop', value: 'superMarketShop' },
  { label: 'Pharmacy', value: 'pharmacy' },
  { label: 'Cosmotics', value: 'cosmotics' },
  { label: 'Liquor', value: 'liquor' },
  { label: 'Cafe & Restaurants ', value: 'CafeAndRestaurants' },
  { label: 'Construction', value: 'construction' },
];
const dataTwo = [
  { label: 'Top', value: 'top' },
  { label: 'Medium', value: 'medium' },
  { label: 'Small', value: 'small' },
];
const dataThree = [
  { label: 'Akaky Kaliti', value: 'Akaky Kaliti' },
  { label: 'Addis Ketema', value: 'Addis Ketema' },
  { label: 'Arada', value: 'Arada' },
  { label: 'Bole', value: 'Bole' },
  { label: 'Gulele', value: 'Gulele' },
  { label: 'Kirkos', value: 'Kirkos' },
  { label: 'Kolfe Keranio', value: 'Kolfe Keranio' },
  { label: 'Lideta', value: 'Lideta' },
  { label: 'Nifas Silk-Lafto', value: 'Nifas Silk-Lafto' },
  { label: 'Yeka', value: 'Yeka' },
  { label: 'Lemi Kura', value: 'Lemi Kura' },
];


const Shop = ({route}) => {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);
  const [value, setValue] = useState(null);
  const [valueTwo, setValueTwo] = useState(null);
  const [valueThree, setValueThree] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPriceMinusVat, setTotalPriceMinusVat] = useState(0);
  const [vatValue, setVatValue] = useState(0);
  const [isFocus, setIsFocus] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [quantityTwo, setQuantityTwo] = useState("");
  const [quantityThree, setQuantityThree] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [nameOfShop, setNameOfShop] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [tinNumber, setTinNumber] = useState("");
  const [shopType, setShopType] = useState("");
  const [picture, setPicture] = useState("");


  const [nameOfSales, setNameOfSales] = useState("");
  const [showResults, setShowResults] = useState("");
  const [locationFetched, setLocationFetched] = useState(false);
  const [emailFromStorage, setEmailFromStorage] = useState('');
  const [locality, setLocality]=useState("");
  const [subLocality, setSubLocality]=useState("");
  const [areaName, setAreaName]=useState("");

  useEffect(() => {
    const getEmailFromStorage = async () => {
      try {
        const storedDataString = await AsyncStorage.getItem('userData');
        const storedData = JSON.parse(storedDataString);
        const userEmail = storedData.user.salesID;
        setEmailFromStorage(userEmail);
        console.log('Test', userEmail);
      } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
      }
    };

    getEmailFromStorage();
  }, []);
  

  useEffect(() => {
    if (route && route.params && route.params.phoneNumber) {
      setPhoneNumber(route.params.phoneNumber);
    }
  }, [route]);

  
  
  const handleGetLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      setLocationFetched(true);
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Failed to fetch location");
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
  
      // Perform necessary data validations
      if (!shopName || !phoneNumber || !latitude || !longitude) {
        setIsLoading(false);
        Alert.alert("Missing Information", "Please fill in all the fields and fetch the location.");
        return;
      }
      const shopData = {
        shop: {
          shopCode: "SH123", // Assuming a static shop code or fetch dynamically
          shopName: shopName,
          longitude: parseFloat(longitude), // Store only the numerical value
          latitude: parseFloat(latitude), // Store only the numerical value
          contactInfo: {
            phoneNumber: phoneNumber,
            email: 'shop@elilta.com',
          },
          shopType: value, // Include value
          channelType: `${valueTwo}-${value}`, 
          areaName:areaName,
          locality:locality,
          subLocality:valueThree,
          createdBy:emailFromStorage
        },
      };
      // Perform the POST request to the API endpoint
      const response = await fetch('https://eliltatradingadmin.com/api/shop/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shopData),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // If the request was successful, show a success message
      Alert.alert('Success', 'Shop data submitted successfully');
      navigation.navigate('StartSelling');
  
      setIsLoading(false);
    } catch (error) {
      console.error('Error submitting data:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to submit data');
    }
  };

  
  const [shopName, setShopName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
        <Text style={styles.label}>Shop is not Available :</Text>
        <Text style={styles.label}>Enter Shop Information:</Text>        
  <TextInput
        style={styles.input}
        placeholder="Shop Name"
        value={shopName}
        onChangeText={setShopName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad" // Show numeric keyboard
      />
   
      <TextInput
        style={styles.input}
        placeholder="Area Name"
        value={areaName}
        onChangeText={setAreaName}
      />
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={dataThree}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select Sub City"
        searchPlaceholder="Search..."
        value={valueThree}
        onChange={item => {
          setValueThree(item.value);
        }}
        renderLeftIcon={() => (
          <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Locality"
        value={locality}
        onChangeText={setLocality}
      />
         <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select Shop Type"
        searchPlaceholder="Search..."
        value={value}
        onChange={item => {
          setValue(item.value);
        }}
        renderLeftIcon={() => (
          <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
        )}
      />
    <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={dataTwo}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Channel Type"
            searchPlaceholder="Search..."
            value={valueTwo}
            onChange={item => {
              setValueTwo(item.value);
            }}
            renderLeftIcon={() => (
              <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
            )}
          />


    {/* <TouchableOpacity onPress={handleImageUpload} style={styles.getImageButton}>
  <Text style={{ color: "white", textAlign: "center" }}>
    {imageUri ? "Image Selected" : "Upload Shop Image"}
  </Text>
</TouchableOpacity> */}
      {/* Other input fields, buttons, and components */}

      {/* Get Location button */}
      <TouchableOpacity onPress={handleGetLocation} style={styles.getLocationButton}>
        <Text style={{ color: "white", textAlign: "center" }}>
          {locationFetched ? "Location Fetched" : "Get Location"}
        </Text>
      </TouchableOpacity>

      {/* Submit button */}
      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={{ color: "white", textAlign: "center" }}>Register Shop</Text>
        )}
      </TouchableOpacity>
      
    </View>
  );
};

export default Shop;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    width:'100%'
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  getImageButton: {
    backgroundColor: "black",
    color: "white",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    marginBottom: 10,
    width: "100%",
  },
  
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  getLocationButton: {
    backgroundColor: "black",
    color: "white",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    marginBottom: 10,
    width: "100%",
  },
  submitButton: {
    backgroundColor: "black",
    color: "white",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    marginTop: 10,
    width: "100%",
  },
  // Other styles as needed
});
