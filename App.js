import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import Form from './form'; 
import CheckShop from './checkShop';
import Shop from './shop';
import ViewSales from './viewSales';
import CloseTodaySale from './closeTodaySale';
import ShopToday from './shopToday';
import GalleryButton from './GalleryButton';
import ShopUpdate from './ShopUpdate';
import Walking from './walking';
import Questionnaire from './Questionnaire';
import QCheckShop from './qCheckShop';
import ImageUpload from './ImageUpload';
import CheckOutlet from './checkOutlet';
import OutletToday from './outletToday';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Screen components should be direct children of Stack.Navigator */}
        {/* <Stack.Screen name="Image" component={ImageUpload} /> */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Form" component={Form} />
        <Stack.Screen name="StartSelling" component={CheckShop} />
        <Stack.Screen name="RegisterShop" component={Shop} />
        <Stack.Screen name="ViewSales" component={ViewSales} />
        <Stack.Screen name="CloseTodaySale" component={CloseTodaySale} />
        <Stack.Screen name="GalleryButton" component={GalleryButton} />
        <Stack.Screen name="ShopUpdate" component={ShopUpdate} />
        <Stack.Screen name="Walking" component={Walking} />
        <Stack.Screen name="Questionnaire" component={Questionnaire} />
        <Stack.Screen name="Survey" component={QCheckShop} />
        <Stack.Screen name="ShopToday" component={ShopToday} />
        <Stack.Screen name="Outlet" component={CheckOutlet} />
        <Stack.Screen name="OutletToday" component={OutletToday} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
