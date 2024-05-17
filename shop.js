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
  Alert,
} from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage'
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

const frequency = [
  { label: 'Every Month', value: 'monthly' },
  { label: 'Every 15 Days', value: 'twoTimesAmonth' },
  { label: 'Every Week ', value: 'weekly' },
  { label: 'Every Day ', value: 'daily' },
];

const dayData = [
  { label: 'Monday', value: 'Monday' },
  { label: 'Tuesday', value: 'Tuesday' },
  { label: 'Wednesday', value: 'Wednesday' },
  { label: 'Thursday', value: 'Thursday' },
  { label: 'Friday', value: 'Friday' },
  { label: 'Saturday', value: 'Saturday' },
  { label: 'Sunday', value: 'Sunday' },
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

const formFields = [
  {
    step: 1,
    label: 'Outlet Information',
    fields: [
      { label: 'Outlet Name', key: 'outletName', placeholder: 'Enter Outlet Name' },
     // { label: 'Phone Number', key: 'phoneNumber', placeholder: 'Enter Phone Number', keyboardType: 'phone-pad' },
      //{ label: 'Preferred Ordering Day', key: 'preferredDay', placeholder: 'Enter Preferred Ordering Day' },
      //{ label: 'Frequency', key: 'frequency', placeholder: 'Frequency' }
    ]
  },
  {
    step: 2,
    label: 'Location Details',
    fields: [
      { label: 'Area Name', key: 'areaName', placeholder: 'Enter Area Name' },
      { label: 'Locality', key: 'locality', placeholder: 'Enter Locality' },
      { label: 'Sub Locality', key: 'subLocality', placeholder: 'Enter Sub Locality' },
      
    ]
  },
  {
    step: 3,
    label: 'Shop Details',
    fields: [
      { label: 'Outlet Capacity', key: 'outletCapacity', placeholder: 'Outlet Capacity' },
      { label: 'Purchaser Name', key: 'purchaser', placeholder: 'Enter Purchase or Manager Name' }
    ]
  }
];

const Shop = ({ route }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);
  const [value, setValue] = useState(null);
  const [valueTwo, setValueTwo] = useState(null);
  const [valueThree, setValueThree] = useState(null);
  const { phNumber } = route.params;

  const [valuePreferredDay, setValuePreferredDay] = useState(null);
  const [valueFrequency, setValueFrequency] = useState(null);
  const [valueSubCity, setValueSubCity] = useState(null);
  const [valueOutletType, setValueOutletType] = useState(null);
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

  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

  

  const handleInputChange = (key, value) => {
    setFormData(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  useEffect(() => {
    if (phNumber) {
      setPhoneNumber(phNumber);
    }
  }, [phNumber]);

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
  
        // Log the fetched location
        console.log("Fetched Location:", location.coords.latitude, location.coords.longitude);
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert("Error", "Failed to fetch location");
      }
    };
  
    fetchLocation();
  }, []);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      
      // if (formData.phoneNumber && !/^(9|7)\d{8}$/.test(formData.phoneNumber)) {
      //   Alert.alert(
      //     'Invalid Phone Number',
      //     'Please enter a valid 9-digit number starting with 9 or 7.'
      //   );
      //   return; 
      // }
    
      if (formData.outletCapacity && isNaN(formData.outletCapacity)) {
        Alert.alert(
          'Invalid Outlet Capacity',
          'Outlet capacity should be a number.'
        );
        return; 
      }
    
      if (formData.shopName && !isNaN(formData.shopName)) {
        Alert.alert(
          'Invalid Outlet Name',
          'Outlet name should not be a number.'
        );
        return; 
      }
      setIsLoading(true);

      const storedDataString = await AsyncStorage.getItem('userData');
      const storedData = JSON.parse(storedDataString);
      const userId = storedData.user.salesID;

      const shopData = {
        outlet: {
          outletName: formData.outletName,
          longitude: parseFloat(longitude), 
          latitude: parseFloat(latitude), 
          contactInfo: {
            phoneNumber: phNumber,
            email: 'shop@elilta.com',
          },
          areaName: formData.areaName,
          outletType: valueOutletType,
          locality: formData.locality,
          subLocality: formData.subLocality,
          subCity: valueSubCity,
          outletCapacity: formData.outletCapacity,
          frequency: valueFrequency,
          purchaser: formData.purchaser,
          createdBy: userId
        },
      };
      console.log('fhghfgfjgff',shopData);
      const response = await fetch('https://eliltatradingadmin.com/api/outlet/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(shopData),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        
        Alert.alert('Success', 'Shop data submitted successfully');
      //  navigation.navigate('StartSelling');
    
      setIsLoading(false);
      } catch (error) {
        console.error('Error submitting data:', error);
        setIsLoading(false);
        Alert.alert('Error', 'Failed to submit data');
      }
      console.log('Form Data:', formData);
    };
  return (
    <View style={styles.container}>
    <Text style={styles.stepLabel}>{formFields[currentStep].label} for {phNumber}</Text>
    {formFields[currentStep].fields.map((field, index) => (
      <View key={index} style={styles.inputContainer}>
        <Text style={styles.label}>{field.label}</Text>
        <TextInput
          style={styles.input}
          placeholder={field.placeholder}
          value={formData[field.key] || ''}
          onChangeText={value => handleInputChange(field.key, value)}
          keyboardType={field.keyboardType || 'default'}
        />
      </View>
    ))}
        {currentStep === 0 && (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Select Preferred Day of Order </Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={dayData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select Preferred Day of Order"
          searchPlaceholder="Search..."
          value={valuePreferredDay}
          onChange={item => {
            setValuePreferredDay(item.value);
          }}
          renderLeftIcon={() => (
            <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
          )}
        />

<Text style={styles.label}>Select Frequency</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={frequency}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select Frequency of Need"
          searchPlaceholder="Search..."
          value={valueFrequency}
          onChange={item => {
            setValueFrequency(item.value);
          }}
          renderLeftIcon={() => (
            <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
          )}
        />
      </View>
      
    )}

    {currentStep === 1 && (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Select Sub City</Text>
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
          value={valueSubCity}
          onChange={item => {
            setValueSubCity(item.value);
          }}
          renderLeftIcon={() => (
            <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
          )}
        />

      <Text style={styles.label}>Select Outlet Type</Text>
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
          placeholder="Select Outlet Type"
          searchPlaceholder="Search..."
          value={valueOutletType}
          onChange={item => {
            setValueOutletType(item.value);
          }}
          renderLeftIcon={() => (
            <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
          )}
        />
      </View>
      
    )}
    <View style={styles.buttonContainer}>
      {currentStep > 0 && (
        <TouchableOpacity onPress={handlePrev} style={styles.button}>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>
      )}
      {currentStep < formFields.length - 1 ? (
        <TouchableOpacity onPress={handleNext} style={styles.button}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        {/* Conditional rendering based on isLoading state */}
        {isLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>
      )}
    </View>
  </View>
  );
};

export default Shop;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  stepLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
