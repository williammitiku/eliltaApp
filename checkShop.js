import React from "react";
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";

const CheckShop = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/check.png')} 
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Button for "Today's Shops" */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Today')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Today's Shops</Text>
      </TouchableOpacity>

      {/* Button to create a new shop */}
      <TouchableOpacity
        onPress={() => navigation.navigate('RegisterShop')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Create New Shop</Text>
      </TouchableOpacity>

      {/* Button to see accounts */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Accounts')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>See Your Accounts</Text>
      </TouchableOpacity>

      {/* Button to see stats */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Dashboard')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>See Your Stats</Text>
      </TouchableOpacity>

      {/* Additional buttons */}
      <TouchableOpacity
        onPress={() => navigation.navigate('ManageCredit')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Manage Credit</Text>
      </TouchableOpacity>


    </View>
  );
};

export default CheckShop;

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
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 5,
    width: "80%",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});
