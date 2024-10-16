// app/navigation/AppNavigator.js

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import ProjectScreen from "../screens/ProjectScreen";
import AboutScreen from "../screens/AboutScreen";
import NewProjectScreen from "../screens/NewProjectScreen";
import TaskDetailScreen from "../screens/TaskDetailScreen";
import ProjectOne from "../screens/PorjectOne";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const UserTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Project" component={ProjectScreen} />
    <Tab.Screen name="About" component={AboutScreen} />
    <Tab.Screen name="New Project" component={NewProjectScreen} />
    <Tab.Screen name="Task Details" component={TaskDetailScreen} />
    <Tab.Screen name="Task 1" component={ProjectOne} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="UserTabs" component={UserTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
