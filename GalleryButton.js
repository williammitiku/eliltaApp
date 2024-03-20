import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function GalleryButton() {
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  console.log('here is the base 64 string',base64Image);

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
    } catch (error) {
      console.error('Error converting image to base64:', error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      {base64Image && <Image source={{ uri: base64Image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}
