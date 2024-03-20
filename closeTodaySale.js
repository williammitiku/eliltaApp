import React, { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  TextInput,
  View,
  Image, 
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
  const [imageassets, setImageassets] = useState(null);
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
  const [expectedCash, setExpectedCash] = useState("");


  const [nameOfSales, setNameOfSales] = useState("");
  const [showResults, setShowResults] = useState("");
  const [locationFetched, setLocationFetched] = useState(false);
  const [emailFromStorage, setEmailFromStorage] = useState('');
  const [locality, setLocality]=useState("");
  const [subLocality, setSubLocality]=useState("");
  const [areaName, setAreaName]=useState("");

  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  console.log('here is the base 64 string',picture);

  useEffect(() => {
    if (image) {
      convertImageToBase64();
    }
  }, [image]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const convertImageToBase64 = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(image);
      const fileContent = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setBase64Image(`data:image/${fileInfo.uri.split('.').pop()};base64,${fileContent}`);
      setPicture(`data:image/${fileInfo.uri.split('.').pop()};base64,${fileContent}`);
    } catch (error) {
      console.error('Error converting image to base64:', error);
    }
  };

  
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
    const fetchTotalAmount = async () => {
      try {
        const response = await fetch('https://eliltatradingadmin.com/api/sale/YourTodayCashSales', {
          method: 'POST', // Update to POST method
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ soldBy: emailFromStorage }), // Add soldBy to the request body
        });
  
        if (response.ok) {
          const data = await response.json();
          setExpectedCash(data.totalAmount);
         // console.log(data.totalAmount);
        } else {
          Alert.alert('Failed to fetch total amount');
        }
      } catch (error) {
        console.error('Error dassetsng fetch:', error);
      }
    };
  
    fetchTotalAmount();
  }, [emailFromStorage]);
  
  
  

  useEffect(() => {
    const fetchCloses = async () => {
      try {
        const response = await fetch('https://eliltatradingadmin.com/api/closeDay/getYourCloses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ salesId: emailFromStorage }),
        });

        if (response.ok) {
          const data = await response.json();
          setCloseExist(data.data);
          if(data.data === "Yes")
          {
            setExist(true);
          }
        
          //console.log('length', data.data);
        } else {
          Alert.alert('Failed to fetch total amount');
        }
      } catch (error) {
        console.error('Error dassetsng fetch:', error);
      }
    };

    fetchCloses();
  }, [emailFromStorage]);

  
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

  const [errors, setErrors] = useState({
    ftCode: "",
    amount: "",
    picture: "",
  });

  const validateInputs = () => {
    let isValid = true;
    const newErrors = { ftCode: "", amount: "", picture: "" };

    // Validate FT Code
    if (!ftCode.trim()) {
      newErrors.ftCode = "FT Code is required";
      isValid = false;
    }
    if (!ftCode.length < 10) {
      newErrors.ftCode = "FT Code is Too Short";
      isValid = false;
    }


    // Validate Amount
    if (!amount.trim() || isNaN(Number(amount))) {
      newErrors.amount = "Valid amount is required";
      isValid = false;
    }

    if (!amount == 0 ) {
      newErrors.amount = "0 is invalid";
      isValid = false;
    }

    

    // Validate Picture
    if (!picture) {
      newErrors.picture = "FT image is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCloseDay = async () => {
    if (validateInputs()) {
      // Only proceed if all inputs are valid

      Alert.alert(
        "Confirm",
        "Are you sure you want to close your day?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: handleSubmit,
          },
        ],
        { cancelable: false }
      );
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
  
      // Perform necessary data validations
  
      const shopData = {
        salesId: emailFromStorage,
        ftCode: ftCode, // Assuming a static shop code or fetch dynamically
        amount: amount,
        exactAmount: expectedCash, // Store only the numerical value
        difference: expectedCash - amount,
        picture: picture, // Store only the numerical value
      };
  
      // Perform the POST request to the API endpoint
      const response = await fetch(
        'https://eliltatradingadmin.com/api/closeDay/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(shopData),
        }
      );
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.json();
  
      // Check if the API response contains a message
      if (responseData.message) {
        // If the request was successful, show the API response message
        Alert.alert('Message', responseData.message);
      } else {
        // If the API response doesn't contain a message, show a default success message
        Alert.alert('Success', 'Day Closed successfully');
      }
  
      //navigation.navigate('StartSelling');
      setIsLoading(false);
    } catch (error) {
      console.error('Error submitting data:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to submit data');
    }
  };
  
  
  const [shopName, setShopName] = useState("");
  const [exist, setExist]=useState(false);
  const [closeExist, setCloseExist]=useState("");
  const [ftCode, setFtCode]=useState("");
  const [difference, setDifference]=useState("");
  const [amount, setAmount]=useState("");

  return (
    <View style={styles.container}>
        <Text style={styles.label}>Close Your Day :</Text>
        <Text style={styles.label}>Expected Cash : {expectedCash}</Text>        
        <TextInput
        style={styles.input}
        placeholder="FT Code"
        value={ftCode}
        onChangeText={setFtCode}
      />
      <Text style={styles.errorText}>{errors.ftCode}</Text>

      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="phone-pad"
      />
      <Text style={styles.errorText}>{errors.amount}</Text>

      <TouchableOpacity
        onPress={pickImage}
        style={styles.getImageButton}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          {picture ? "Image Uploaded" : "Upload Shop Image"}
        </Text>
        {image && <Image source={{ uri: image }} style={{ width: 350, height: 200 }} />}
      </TouchableOpacity>
      <Text style={styles.errorText}>{errors.picture}</Text>

    {/* <TouchableOpacity onPress={handleImageUpload} style={styles.getImageButton}>
  <Text style={{ color: "white", textAlign: "center" }}>
    {imageassets ? "Image Selected" : "Upload Shop Image"}
  </Text>
</TouchableOpacity> */}
      {/* Other input fields, buttons, and components */}

      {/* Get Location button */}


      <TouchableOpacity onPress={handleCloseDay} style={styles.submitButton} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={{ color: "white", textAlign: "center" }}>Close Your Day</Text>
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
  errorText: {
    color: "red",
    marginBottom: 10,
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
