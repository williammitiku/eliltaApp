import React, { useState, useEffect } from 'react';
import { View, Image, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImageUpload() {
    const [image, setImage] = useState(null);

    useEffect(() => {
      (async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access media library is required!');
        }
      })();
    }, []);
  
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        uploadImageToServer(result.assets[0].uri);
      }
    };
  
    const uploadImageToServer = async (imageUri) => {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: 'image.jpg',
        type: 'image/jpeg'
      });
  
      try {
        const response = await fetch('http://192.168.0.107:3008/upload', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('FOrm Data', formData);
        const data = await response.text();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </View>
    );
  }
