import React, { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckOutlet = () => {
  const navigation = useNavigation();
  const [emailFromStorage, setEmailFromStorage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

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

  useEffect(() => {
    const getEmailFromStorage = async () => {
      try {
        const storedDataString = await AsyncStorage.getItem('userData');
        const storedData = JSON.parse(storedDataString);
        const userEmail = storedData.user.email;
        setEmailFromStorage(userEmail);
      } catch (error) {
        console.error('Error retrieving data from AsyncStorage:', error);
      }
    };

    getEmailFromStorage();
  }, []);

  const handleSubmit = async () => {
    if (!phoneNumber) {
      Alert.alert('Please enter a phone number.');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('https://eliltatradingadmin.com/api/outlet/verifyOutletExistence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await response.json();

      if (data.status=='success') {
        await AsyncStorage.setItem('shopInfo', JSON.stringify(data.outlet));
        //Alert.alert('Outlet Registered Already');
        navigation.navigate('ShopUpdate');
      } else {
        navigation.navigate('RegisterShop', { phNumber: phoneNumber });
        Alert.alert('Outlet does not exist.');
      }
      console.log('Response after shop verification:', data);

    } catch (error) {
      console.error('Error verifying shop existence:', error);
      Alert.alert('Error verifying shop existence. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/check.png')} 
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.label}>Enter Outlet PhoneNumber :</Text>
        
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={(text) => {
          if (/^\d*$/.test(text)) {
            const sanitizedText = text.replace(/\D/g, '');
            if ((sanitizedText.startsWith('9') || sanitizedText.startsWith('7')) &&
              sanitizedText.length <= 9) {
              setPhoneNumber(sanitizedText.slice(0, 9));
            } else {
              if (sanitizedText.length > 9) {
                Alert.alert('Phone number should not exceed 9 digits');
              } else if (sanitizedText.length > 0) {
                Alert.alert('Phone number should start with 9 or 7');
              }
            }
          }
        }}
        keyboardType="numeric"
      />

      <TouchableOpacity
        onPress={handleSubmit}
        style={styles.rightButton}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={{ color: "white", textAlign: "center" }}>Check</Text>
        )}
      </TouchableOpacity>

      {/* <TouchableOpacity
        onPress={() => navigation.navigate('Walking')}
        style={styles.linkText}
      >
        <Text style={{ color: "blue", textAlign: "center" }}>Walking Customer?</Text>
      </TouchableOpacity> */}

      {/* <TouchableOpacity
        onPress={() => navigation.navigate('Survey')}
        style={styles.linkText}
      >
        <Text style={{ color: "blue", textAlign: "center" }}>Questionnaire?</Text>
      </TouchableOpacity> */}

       <View style={styles.bottomContainer}>
        <View style={styles.linkContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('OutletToday')}
            style={styles.linkText}
          >
            <Text style={{ color: "blue", textAlign: "center" }}>View Your Today Outlets</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.linkContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('CloseTodaySale')}
            style={styles.linkText}
          >
            <Text style={{ color: "blue", textAlign: "center" }}>Close Today Sale</Text>
          </TouchableOpacity>
        </View> */}
      </View> 
    </View>
  );
};

export default CheckOutlet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    width: '100%'
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  linkContainer: {
    flex: 1,
  },
  linkText: {
    marginTop: 20,
    marginBottom: 10,
  },
  rightButton: {
    backgroundColor: "black",
    color: "white",
    padding: 8,
    borderRadius: 5,
    textAlign: "center",
    marginTop: 0,
    width: "100%",
  },
});
