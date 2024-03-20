import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const Questionnaire = ({ route }) => {
  const [mostUsedBrand1, setMostUsedBrand1] = useState('');
  const [mostUsedBrand2, setMostUsedBrand2] = useState('');
  const [mostUsedBrand3, setMostUsedBrand3] = useState('');
  const [weeklyDemand360ml, setWeeklyDemand360ml] = useState('');
  const [weeklyDemand600ml, setWeeklyDemand600ml] = useState('');
  const [weeklyDemand1L, setWeeklyDemand1L] = useState('');
  const [weeklyDemand2L, setWeeklyDemand2L] = useState('');
  const [preferredBrand, setPreferredBrand] = useState('');

  const [selectedBrand, setSelectedBrand] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const phoneNumber = route.params.phoneNumber;

  const handleNumericInputChange = (text, setterFunction) => {
    // Accept only numeric characters
    const numericRegex = /^[0-9\b]+$/;
    if (numericRegex.test(text)) {
      setterFunction(text);
    }
  };

  const handleTextInputChange = (text, setterFunction) => {
    // Accept only text characters
    const textRegex = /^[a-zA-Z\s]*$/;
    if (textRegex.test(text)) {
      setterFunction(text);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true); // Set loading state to true
      const data = {
        MostBrand1: mostUsedBrand1,
        MostBrand2: mostUsedBrand2,
        MostBrand3: mostUsedBrand3,
        WeeklyDemand360ML: weeklyDemand360ml,
        WeeklyDemand600ML: weeklyDemand600ml,
        WeeklyDemand1L: weeklyDemand1L,
        WeeklyDemand2L: weeklyDemand2L,
        preferredBrand: selectedBrand,
        phoneNumber: phoneNumber, // Add phoneNumber to the data object
      };

      const response = await axios.post('https://nodewithsql.onrender.com/surveys', data);

      console.log('Survey data submitted:', response.data);
      Alert.alert('Survey Successfully Submitted');
    } catch (error) {
      console.error('Error submitting survey data:', error);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Questionnaire</Text>

      <Text style={styles.label}>Most used brands:</Text>
      <TextInput
        style={styles.input}
        placeholder="Brand 1"
        value={mostUsedBrand1}
        onChangeText={(text) => handleTextInputChange(text, setMostUsedBrand1)}
      />
      <TextInput
        style={styles.input}
        placeholder="Brand 2"
        value={mostUsedBrand2}
        onChangeText={(text) => handleTextInputChange(text, setMostUsedBrand2)}
      />
      <TextInput
        style={styles.input}
        placeholder="Brand 3"
        value={mostUsedBrand3}
        onChangeText={(text) => handleTextInputChange(text, setMostUsedBrand3)}
      />

      <Text style={styles.label}>Weekly demand:</Text>
      <TextInput
        style={styles.input}
        placeholder="360ml"
        value={weeklyDemand360ml}
        onChangeText={(text) => handleNumericInputChange(text, setWeeklyDemand360ml)}
        keyboardType="numeric" 
      />
      <TextInput
        style={styles.input}
        placeholder="600ml"
        value={weeklyDemand600ml}
        onChangeText={(text) => handleNumericInputChange(text, setWeeklyDemand600ml)}
        keyboardType="numeric" 
      />
      <TextInput
        style={styles.input}
        placeholder="1L"
        value={weeklyDemand1L}
        onChangeText={(text) => handleNumericInputChange(text, setWeeklyDemand1L)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="2L"
        value={weeklyDemand2L}
        onChangeText={(text) => handleNumericInputChange(text, setWeeklyDemand2L)}
        keyboardType="numeric" 
      />

      <Text style={styles.label}>Which brand would you prefer:</Text>
      <TouchableOpacity
        onPress={() => setSelectedBrand('Miawa')}
        style={selectedBrand === 'Miawa' ? styles.selectedOption : styles.option}
      >
        <Text>Miawa</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setSelectedBrand('Daily')}
        style={selectedBrand === 'Daily' ? styles.selectedOption : styles.option}
      >
        <Text>Daily</Text>
      </TouchableOpacity>

      <Button 
        title={isLoading ? "Submitting..." : "Submit Survey"} 
        onPress={handleSubmit} 
        color="black" // Set the background color to black
        disabled={isLoading} // Disable the button while loading
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#e30174',
    color:'white', 
    padding: 10,
    borderRadius: 5,
  },
});

export default Questionnaire;
