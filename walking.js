import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  Button,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { AntDesign } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


const Walking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [value, setValue] = useState(null);
  const [totalPriceMinusVat, setTotalPriceMinusVat] = useState(0);
  const [one, setOne] = useState();
  const [vatValue, setVatValue] = useState(0);
  const [two, setTwo] = useState(null);
  const [three, setThree] = useState(null);
  const [valueTwo, setValueTwo] = useState(null);
  const [valueThree, setValueThree] = useState(null);
  const [picture, setPicture] = useState("");
  const [transactionValue, setTransactionValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [productData, setProductData] = useState([]);
  const [productDataTwo, setProductDataTwo] = useState([]);
  const [productDataThree, setProductDataThree] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [quantityTwo, setQuantityTwo] = useState("");
  const [quantityThree, setQuantityThree] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [nameOfShop, setNameOfShop] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nameOfSales, setNameOfSales] = useState("");
  const [amountOfTheProduct, setAmountOfTheProduct] = useState("");
  const [showResults, setShowResults] = useState("");
  const [locationFetched, setLocationFetched] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');


  const [shopInfo, setShopInfo] = useState(null);
  const [userData, setUserData] = useState(null);
  const [shopCodeFetched, setShopCodeFetched] = useState('');
  const [shopCode, setShopCode] = useState('');
  const [shopNameFetched, setShopNameFetched]=useState('');
  const [ftCode, setFtCoode]=useState("");
  
  

  const [phoneNumberFetched, setPhoneNumberFEtched] = useState('');
  const [soldByFetched, setSoldByFetched]=useState('');
    const [salesId, setSalesId] = useState('');
    const [locationCheck, setLocationCheck]= useState(0);
    const data = [
      { label: 'cash', value: 'cash' },
      { label: 'Bank Transaction', value: 'bankTransaction' },
    ];


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

    const handleTransactionTypeChange = (item) => {
      setTransactionValue(item.value);
    };
  

  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('userData');
        if (jsonValue !== null) {
          const data = JSON.parse(jsonValue);
          setSalesId(data.user.salesID); // Assuming salesID is stored as 'salesID'
          console.log('Fetched salesID:', data.user.salesID);
        }
      } catch (error) {
        // Error retrieving data
        console.error(error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('shopInfo');
        if (jsonValue !== null) {
          const data = JSON.parse(jsonValue);
          setShopCodeFetched(data._id);
          setShopCode(data.shopCode);
          setLocationCheck(data.longitude);
          setShopNameFetched(data.shopName)
          //console.log('Longitiude', locationCheck);
          setPhoneNumberFEtched(data.contactInfo.phoneNumber);
        }
      } catch (e) {
        // Error retrieving data
        console.error(e);
      }
    };

    getData();
  }, []);


  const handleShowResults = () => {
    setShowResults(true);
    // You can perform any necessary logic here if needed before showing results
    // For instance, you might want to recalculate the prices here before showing results.
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
    setLocationFetched(true);
  };

  const fetchProductData = async () => {
    try {
      const response = await fetch("https://eliltatradingadmin.com/api/item/getAll");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const products = await response.json();

      const formattedData = products.map((product) => ({
        label: product.itemName,
        value: product.itemName,
        price: product.pricePerPack,
      }));

      setProductData(formattedData);
      console.log(productData);
    } catch (error) {
      console.error("Error fetching product data:", error.message);
    }
  };

  const fetchProductDataTwo = async () => {
    try {
      const response = await fetch("https://eliltatradingadmin.com/api/item/getAll");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const productsTwo = await response.json();

      const formattedDataTwo = productsTwo.map((product) => ({
        label: product.itemName,
        value: product.itemName,
        price: product.pricePerPack,
      }));

      setProductDataTwo(formattedDataTwo);
    } catch (error) {
      console.error("Error fetching product data:", error.message);
    }
  };

  const fetchProductDataThree = async () => {
    try {
      const response = await fetch("https://eliltatradingadmin.com/api/item/getAll");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const productsThree = await response.json();

      const formattedDataThree = productsThree.map((product) => ({
        label: product.itemName,
        value: product.itemName,
        price: product.pricePerPack,
      }));

      setProductDataThree(formattedDataThree);
    } catch (error) {
      console.error("Error fetching product data:", error.message);
    }
  };

  useEffect(() => {
    fetchProductData();
    fetchProductDataTwo();
    fetchProductDataThree();
  }, []);

  const handleGetLocation = () => {
    getLocation();
  };
  const handleQuantityChange = (text) => {
    setQuantity(text);
    calculateTotalPrice();
  };

  const handleQuantityChangeTwo = (text) => {
    setQuantityTwo(text);
    calculateTotalPrice();
  };

  const handleQuantityChangeThree = (text) => {
    setQuantityThree(text);
    calculateTotalPrice();
  };
  const handleShow = () => {
    let selectedProductsCount = 0;

    if (value && quantity) {
      selectedProductsCount++;
    }

    if (valueTwo && quantityTwo) {
      selectedProductsCount++;
    }

    if (valueThree && quantityThree) {
      selectedProductsCount++;
    }

    if (selectedProductsCount === 0) {
      Alert.alert("Please select at least one product and its quantity");
      return;
    }


 

    calculateTotalPrice();
    calculateVatValue();
    calculateTotalPriceMinusVat();
  };
  const calculateTotalPrice = () => {
    let total = 0;
    const selected = [];

    if (value && quantity) {
      const price =
        productData.find((product) => product.value === value)?.price || 0;
      const totalPrice = parseInt(quantity, 10) * price;
      selected.push({
        productName: value,
        quantity: parseInt(quantity, 10),
        totalPrice,
      });
      total += totalPrice;
    }

    if (valueThree && quantityThree) {
      const price =
        productDataThree.find((product) => product.value === valueThree)
          ?.price || 0;
      const totalPrice = parseInt(quantityThree, 10) * price;
      selected.push({
        productName: valueThree,
        quantity: parseInt(quantityThree, 10),
        totalPrice,
      });
      total += totalPrice;
    }

    if (valueTwo && quantityTwo) {
      const price =
        productDataTwo.find((product) => product.value === valueTwo)?.price ||
        0;
      const totalPrice = parseInt(quantityTwo, 10) * price;
      selected.push({
        productName: valueTwo,
        quantity: parseInt(quantityTwo, 10),
        totalPrice,
      });
      total += totalPrice;
    }

    setSelectedProducts(selected);
    setTotalPrice(total);
  };

  const calculateVatValue = () => {
    const vat = totalPrice - totalPrice / 1.15; // Assuming VAT rate of 15%
    setVatValue(vat);
    console.log(vat);
  };

  useEffect(() => {
    calculateTotalPrice();
    calculateVatValue();
  }, [totalPrice]);
  const calculateTotalPriceMinusVat = () => {
    const totalPriceMinusVatValue = totalPrice - vatValue;
    setTotalPriceMinusVat(totalPriceMinusVatValue);
  };

  useEffect(() => {
    calculateTotalPriceMinusVat();
  }, [totalPrice, vatValue]);
  // Update onChange methods of dropdowns to trigger calculateTotalPrice
  // Example for the first dropdown
  const handleConfirmSale = () => {
    // Handle the sale confirmation here
    // You can submit the sale data or perform any other actions
    
    // Hide the modal after the sale is confirmed
    setModalVisible(false);
  };
  const handleClosure = async () => {

      Alert.alert(
        "Confirm",
        "Are you sure about this specific sales?",
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
    setIsLoading(true);

    console.log(transactionValue);

    console.log("Submitting data...");
    console.log("nameOfShop:", nameOfShop);
    console.log("phoneNumber:", phoneNumber);
    console.log("latitude:", latitude);
    console.log("longitude:", longitude);
    console.log("nameOfSales:", nameOfSales);
    console.log("selectedProducts:", selectedProducts);
    console.log("totalPrice:", totalPrice);
    console.log("receiptNumber:", receiptNumber);

    // if (
    //  // !nameOfShop.trim() ||
    //  // !phoneNumber.trim() ||
    //  // !nameOfSales.trim() ||
    // //   !latitude ||
    // //   !longitude
    // ) {
    //   Alert.alert("Please fill in all the required fields");
    //   setIsLoading(false);
    //   return;
    // }

    if (
      !(value && quantity) &&
      !(valueTwo && quantityTwo) &&
      !(valueThree && quantityThree)
    ) {
      Alert.alert("Please select at least one product and its quantity");
      setIsLoading(false);
      return;
    }

    try {
      const productsArray = [];

      if (value && quantity) {
        productsArray.push({
          productName: value,
          quantity: parseInt(quantity, 10),
        });
      }
      if (valueTwo && quantityTwo) {
        productsArray.push({
          productName: valueTwo,
          quantity: parseInt(quantityTwo, 10),
        });
      }
      if (valueThree && quantityThree) {
        productsArray.push({
          productName: valueThree,
          quantity: parseInt(quantityThree, 10),
        });
      }
      console.log(productData);

      if (!receiptNumber) {
        Alert.alert("Please Enter Receipt Number");
        return;
      }

      else{
        const response = await fetch(
          "https://eliltatradingadmin.com/api/sale/createSale",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nameOfTheShop: nameOfShop,
              soldBy:salesId,
              soldTo:shopCodeFetched,
              transactionType:transactionValue,
              phoneNumber: phoneNumber,
              latitude: latitude,
              longitude: longitude,
              nameOfSales: nameOfSales,
              products: selectedProducts, 
              totalPrice: totalPrice,
              receiptNumber:receiptNumber,
              picture:picture, 
              ftCode:ftCode
            }),
          }
        );
      }
  

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const responseData = await response.json();

      if (responseData.message) {
        Alert.alert("Success", responseData.message);
      } else {
        Alert.alert("Success", "Sale registered successfully!");
      }
    } catch (error) {
      console.error("Error submitting data:", error.message);
      Alert.alert("Failed to register sale");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name of the Shop"
        value='Walking'
        onChangeText={setNameOfShop}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value='0909090909'
        onChangeText={setPhoneNumber}
        editable={false}
      />
      <View style={styles.dropdownAndQuantityContainer}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={productData}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Products 1" : "..."}
            searchPlaceholder="Search Products"
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setValue(item.value);
              setIsFocus(false);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color={isFocus ? "blue" : "black"}
                name="Safety"
                size={20}
              />
            )}
          />
        </View>

        <View style={{ flex: 1, marginLeft: 10 }}>
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            keyboardType="numeric"
            value={quantity}
            onChangeText={handleQuantityChange}
          />
        </View>
      </View>

      <View style={styles.dropdownAndQuantityContainer}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={productDataTwo}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Products 2" : "..."}
            searchPlaceholder="Search Products"
            value={valueTwo}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              console.log(item.value);
              setValueTwo(item.value);
              console.log(valueTwo);
              setIsFocus(false);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color={isFocus ? "blue" : "black"}
                name="Safety"
                size={20}
              />
            )}
          />
        </View>

        <View style={{ flex: 1, marginLeft: 10 }}>
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            keyboardType="numeric"
            value={quantityTwo}
            onChangeText={handleQuantityChangeTwo}
          />
        </View>
      </View>
      <View style={styles.dropdownAndQuantityContainer}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={productDataThree}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Products 3" : "..."}
            searchPlaceholder="Search Products"
            value={valueThree}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setValueThree(item.value);
              setIsFocus(false);
              console.log(item.value);
              console.log(valueThree);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color={isFocus ? "blue" : "black"}
                name="Safety"
                size={20}
              />
            )}
          />
        </View>

        <View style={{ flex: 1, marginLeft: 10 }}>
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            keyboardType="numeric"
            value={quantityThree}
            onChangeText={handleQuantityChangeThree}
          />
        </View>
      </View>

      <View style={styles.totalContainer}>
        <View style={styles.inputContainer}>
          
          <TextInput
            style={[styles.input, styles.totalPriceInput]}
            placeholder="Total Price Minus VAT"
            value={totalPriceMinusVat.toFixed(2).toString().trim()} // Trimmed to 6 digits after decimal
            editable={false}
          />
        </View>

        <View style={styles.inputContainer}>
         
          <TextInput
            style={[styles.input, styles.totalPriceInput]}
            placeholder="VAT Value"
            value={vatValue.toFixed(2).toString().trim()}
            editable={false}
          />
        </View>

        <View style={styles.inputContainer}>
         
          <TextInput
            style={[styles.input, styles.totalPriceInput]}
            placeholder="Total Price"
            value={totalPrice.toFixed(2).toString().trim()}
            editable={false}
          />
          
        </View>
      </View>
      <TouchableOpacity
        onPress={handleShow}
        style={[styles.leftButton, styles.input]}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Calculate Price
        </Text>
      </TouchableOpacity>
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
        placeholder="Transaction Type"
        searchPlaceholder="Search..."
        value={transactionValue}
        onChange={item => {
          //handleTransactionTypeChange();
          setTransactionValue(item.value);
        }}
        renderLeftIcon={() => (
          <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
        )}
      />

{transactionValue === 'bankTransaction' && (
        <TextInput
          style={styles.input}
          placeholder="FT Code"
          value={ftCode}
          onChangeText={setFtCoode}
          //editable={false}
        />
      )}

{transactionValue === 'bankTransaction' && (
    <TouchableOpacity onPress={pickImage} style={[styles.leftButton, styles.input]}>
        <Text style={{ color: "white", textAlign: "center" }}>
          {picture ? "Transactiion Image Uploaded" : "Upload Transactiion Image"}
        </Text>
      
      </TouchableOpacity>
      )}
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        {/* Get Location button aligned left */}


        {/* Submit button aligned right */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.rightButton}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ color: "white", textAlign: "center" }}>Complete the Sale</Text>
          )}
        </TouchableOpacity>
      </View>
       
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Enter Receipt Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter receipt number"
              value={receiptNumber}
              onChangeText={text => setReceiptNumber(text)}
            />
            <View style={styles.buttonContainer}>
              <Button title="Complete" onPress={handleSubmit} style={styles.button} />
              <Button title="Close" onPress={() => setModalVisible(false)} style={styles.button} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Walking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black background
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5, // for Android shadow
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    width: '48%', // 50% width for each button with 2% space between them
  },
  logo: {
    width: 800, // Adjust the width of the logo as needed
    height: 100, // Adjust the height of the logo as needed
    resizeMode: "contain", // Choose the appropriate resizeMode for your logo
    marginBottom: 20, // Adjust the margin as needed
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  leftButton: {
    backgroundColor: "black",
    color: "white",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    marginBottom: 0,
    width: "50%", // Adjust width for alignment
  },

  dropdownAndQuantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },

  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
  },
  // Submit button styles
  rightButton: {
    backgroundColor: "black",
    color: "white",
    padding: 8,
    borderRadius: 5,
    textAlign: "center",
    marginTop: 0,
    width: "100%", // Adjust width for alignment
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  icon: {
    marginRight: 5,
  },
  submitButton: {
    backgroundColor: "green",
    color: "white",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    marginTop: 10,
    width: "100%",
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  totalPriceInput: {
    backgroundColor: "#f0f0f0", // Set background color for differentiation
    color: "black", // Set text color
    fontWeight: "bold", // Apply bold font weight
  },
  getLocationButton: {
    backgroundColor: "blue",
    color: "white",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    marginBottom: 10,
    width: "100%",
  },
});