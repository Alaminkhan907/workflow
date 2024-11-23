import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "../screens/authentication/LoginScreen";
import DashboardScreen from "../screens//dashboard/DashboardScreen";
import ProjectScreen from "../screens/project/ProjectScreen";
import AboutScreen from "../screens/profile/AboutScreen";
import NewProjectScreen from "../screens/task/TaskScreen";
import TaskDetailScreen from "../screens/task/TaskDetailScreen";
import ProjectOne from "../screens/project/ProjectOne";
import AddProjectScreen from "../screens/project/AddProjectScreen";
import ProjectDetailScreen from "../screens/project/ProjectDetailScreen";
import ProjectEditScreen from "../screens/project/ProjectEditScreen";
import TaskScreen from "../screens/task/TaskScreen";
import SignupScreen from "../screens/authentication/SignupScreen";
import ForgotPasswordScreen from "../screens/authentication/ForgotScreen";
import Messaging from "../screens/communication/screens/Messaging";
import Chat from "../screens/communication/screens/Chat";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const UserTabs = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="home-circle" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Project"
      component={ProjectScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <FontAwesome5 name="tasks" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="About"
      component={AboutScreen}
      options={{
        tabBarIcon: ({ color }) => (
          <Feather name="info" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Task"
      component={Task}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialIcons name="task" size={24} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Chat"
      component={Chat}
      options={{
        tabBarIcon: ({ color }) => (
          <Feather name="message-circle" size={24} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = ({ route }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> */}
        <Stack.Screen name="UserTabs" component={UserTabs} />
        <Stack.Screen name="NewProject" component={NewProjectScreen} />

        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen name="AddProjectScreen" component={AddProjectScreen} />
        </Stack.Group>

        <Stack.Screen name="Project" component={ProjectScreen} />
        <Stack.Screen name="ProjectEditScreen" component={ProjectEditScreen} />
        <Stack.Screen name="TaskDetailScreen" component={TaskDetailScreen} />
        {/* <Stack.Screen name="Task" component={TaskScreen} /> */}
        <Stack.Screen name="Messaging" component={Messaging} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen
          name="ProjectDetailScreen"
          component={ProjectDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigator;
