import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import ProjectScreen from "../screens/project/ProjectScreen";
import AboutScreen from "../screens/profile/AboutScreen";
import TaskScreen from "../screens/task/TaskScreen";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Chat from "../screens/communication/screens/Chat";

const Tab = createBottomTabNavigator();

const UserTabs = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home-circle" size={24} color="black" />
        ),
        tabBarLabel: "Dashboard",
      }}
    />
    <Tab.Screen
      name="Project"
      component={ProjectScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="tasks" size={24} color="black" />
        ),
        tabBarLabel: "Projects",
      }}
    />
    <Tab.Screen
      name="Task"
      component={TaskScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="task" size={24} color="black" />
        ),
        tabBarLabel: "Tasks",
      }}
    />
    <Tab.Screen
      name="About"
      component={AboutScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Feather name="info" size={24} color="black" />
        ),
        tabBarLabel: "About",
      }}
    />{" "}
    <Tab.Screen
      name="Chat"
      component={Chat}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Feather name="info" size={24} color="black" />
        ),
        tabBarLabel: "Chat",
      }}
    />
  </Tab.Navigator>
);

export default UserTabs;
