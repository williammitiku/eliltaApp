import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator, // Import ActivityIndicator
} from "react-native";

const Login = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleLogin = async () => {
    setLoading(true); // Set loading to true on login attempt
    try {
      const response = await fetch('https://eliltatradingadmin.com/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, password }),
      });
     
      if (response.ok) {
      
        const data = await response.json();
        if (data.status === 'success') {
          await AsyncStorage.setItem('userData', JSON.stringify(data));
          navigation.navigate('Outlet');
        } else {
          Alert.alert('Login Failed: Status is not success');
        }
      } else {
        Alert.alert('Login Failed: Network Error');
      }
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setLoading(false); // Set loading to false after login attempt (success or failure)
    }
  };

  return (
    <View style={styles.container}>
       <Image
        source={require('./assets/login.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.label}>Enter Your Login Details Here :</Text>
    
      <TextInput
        style={styles.input}
        placeholder="Enter your Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="name-phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <TouchableOpacity
        onPress={handleLogin}
        style={styles.loginButton}
        disabled={loading} // Disable button while loading
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  logo: {
    width: 200, // Adjust width as needed
    height: 100, // Adjust height as needed
    marginBottom: 20, // Optional margin
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    width:'100%'
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    width: "100%",
  },
  loginButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
