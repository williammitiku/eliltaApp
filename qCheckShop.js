import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

const QCheckShop = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = () => {
    if (!phoneNumber) {
      Alert.alert('Please enter a phone number.');
      return;
    }

    navigation.navigate('Questionnaire', { phoneNumber: phoneNumber });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/check.png')} 
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.label}>Enter Shop PhoneNumber :</Text>
        
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
      >
        <Text style={{ color: "white", textAlign: "center" }}>Submit</Text>
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Walking')}
          style={styles.linkText}
        >
          <Text style={{ color: "blue", textAlign: "center" }}>Walking Customer?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Questionnaire')}
          style={styles.linkText}
        >
          <Text style={{ color: "blue", textAlign: "center" }}>Questionnaire?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QCheckShop;

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
