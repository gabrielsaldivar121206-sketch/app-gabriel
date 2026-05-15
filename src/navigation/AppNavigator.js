import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import ExpressiveScreen from '../screens/ExpressiveScreen';
import FlowTimerScreen from '../screens/FlowTimerScreen';
import GroundingScreen from '../screens/GroundingScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Expressive" component={ExpressiveScreen} />
        <Tab.Screen name="Grounding" component={GroundingScreen} />
        <Tab.Screen name="Timer" component={FlowTimerScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
