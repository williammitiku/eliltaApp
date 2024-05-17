import React, { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Button,
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


const ShopUpdate = ({route}) => {
  
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);
  const [locationCheck, setLocationCheck]= useState(null);
  const [ChannelTypeCheck, setChannelTypeCheck]= useState(null);
  const [value, setValue] = useState(null);
  const [valueTwo, setValueTwo] = useState(null);
  const [valueUpdated, setValueUpdated] = useState(null);
  const [valueTwoUpdated, setValueTwoUpdated] = useState(null);
  const [valueThree, setValueThree] = useState(null);
  const [valueThreeUpdated, setValueThreeUpdated] = useState(null);
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

  const [ShopCodeUpdate, setShopCodeUpdate]=useState("");
  const [ShopNameUpdate, setShopNameUpdate]=useState("");
  const [ShopPhoneNumberUpdate, setShopPhoneNumberUpdate]=useState("");
  const [ShopAreaUpdate, setShopAreaUpdate]=useState("");
  const [ShopchannelTypeUpdate, setShopchannelTypeUpdate]=useState("");
  const [ShopSubLocalityUpdate, setShopSubLocalityUpdate]=useState("");
  const [ShopLocalityUpdate, setShopLocalityUpdate]=useState("");
  const [ShopTypeUpdate, setShopTypeUpdate]=useState("");
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

  const handleLogout = async () => {
    try {
      // Perform any necessary logout actions (e.g., clearing AsyncStorage, resetting state, etc.)
      // For example, you might want to clear the user data from AsyncStorage
      await AsyncStorage.removeItem('userData');
      
      // Navigate to the login or authentication screen
      navigation.navigate('Login'); // Replace 'Login' with the appropriate screen name
      
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  

  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('shopInfo');
        if (jsonValue !== null) {
          const data = JSON.parse(jsonValue);
          console.log(data)
          setShopNameUpdate(data.shopName);
          setShopPhoneNumberUpdate(data.contactInfo.phoneNumber);
          setShopAreaUpdate(data.areaName);
          setShopchannelTypeUpdate(data.channelType);
          setShopSubLocalityUpdate(data.subLocality);
          setShopLocalityUpdate(data.locality);
          setShopTypeUpdate(data.shopType);
          setShopCodeUpdate(data.shopCode)
          setLocationCheck(data.longitude);
          setChannelTypeCheck(data.channelType)
        //   setShopCodeFetched(data._id);
        //   setShopCode(data.shopCode);
        //   setLocationCheck(data.longitude);
        //   //console.log('Longitiude', locationCheck);
        //   setPhoneNumberFEtched(data.contactInfo.phoneNumber);
        }
      } catch (e) {
        // Error retrieving data
        console.error(e);
      }
    };

    getData();
  }, []);

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
    const fetchLocation = async () => {
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
  
    fetchLocation();
  }, []);

  console.log('Location',latitude, longitude);

  const Navigate = async () => {

    
    
    navigation.navigate("Form", {
      ShopCodeUpdate, ShopCodeUpdate
  })
}

console.log('here is the base 64 string',base64Image);


useEffect(() => {
  if (image) {
    convertImageToBase64();
  }
}, [image]);

const pickImage = async () => {
  // Launch the camera to allow the user to take a photo
  let result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  // Check if the user canceled the operation or not
  if (!result.cancelled) {
    // Set the selected image URI to the state
    setImage(result.uri);
  }
};



const handleImageUpload = async () => {
  try {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.cancelled) {
      setImageUri(pickerResult.uri);
    }
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

const handleClosure = async () => {

    Alert.alert(
      "Confirm",
      "Are you sure about this specific Shop Update?",
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
  
};

const handleSubmit = async () => {
    try {
      setIsLoading(true);
     // console.log('ChannelTypeCheck', ChannelTypeCheck);
  
      // Update Channel Type only if ChannelTypeCheck is null
      
        const updateChannelTypeResponse = await fetch(
          'https://eliltatradingadmin.com/api/shop/updateChannelType',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              shopCode: ShopCodeUpdate,
              longitude:longitude,
              latitude:latitude,
              channelType: `${valueTwoUpdated}-${valueUpdated}`,
              shopType:`${valueUpdated}`,
            }),
          }
        );
  
        if (!updateChannelTypeResponse.ok) {
          throw new Error('Failed to update channel type');
        }
  
        // If channel type is updated successfully, show a success message
        Alert.alert('Success', 'Updated successfully');
  
      navigation.navigate('StartSelling');
  
      setIsLoading(false);
    } catch (error) {
      console.error('Error updating data:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to update data');
    }
  };
  

  
  const [shopName, setShopName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
        <Text style={styles.label}>Shop is already registered, Update here:</Text>        

  
  <TextInput
        style={styles.input}
        placeholder="Shop Name"
        value={ShopNameUpdate}
        onChangeText={setShopName}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={ShopPhoneNumberUpdate}
        onChangeText={setPhoneNumber}
        editable={false}
        keyboardType="phone-pad" // Show numeric keyboard
      />
   
      <TextInput
        style={styles.input}
        placeholder="Area Name"
        value={ShopAreaUpdate}
        onChangeText={setShopAreaUpdate}
        editable={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Locality"
        value={ShopLocalityUpdate}
        onChangeText={setShopLocalityUpdate}
        editable={false}
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
        valueField={ShopTypeUpdate}
        placeholder="Select Shop Type"
        searchPlaceholder="Search..."
        value={valueUpdated}
        onChange={item => {
          setValueUpdated(item.value);
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
            valueField={ShopchannelTypeUpdate}
            placeholder="Select Channel Type"
            searchPlaceholder="Search..."
            value={valueTwoUpdated}
            onChange={item => {
              setValueTwoUpdated(item.value);
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
      {/* <TouchableOpacity onPress={handleGetLocation} style={styles.submitButton}>
              <Text style={{ color: "white", textAlign: "center" }}>
                {locationFetched ? "Location Fetched" : "Get Location"}
              </Text>
            </TouchableOpacity> */}
      
      <TouchableOpacity onPress={handleClosure} style={styles.submitButton} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={{ color: "white", textAlign: "center" }}>Update Shop Information</Text>
        )}
      </TouchableOpacity>

      {/* Submit button */}


 
        
      
    </View>
  );
};

export default ShopUpdate;

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
