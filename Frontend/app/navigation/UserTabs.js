import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import ProjectScreen from "../screens/project/ProjectScreen";
import TaskScreen from "../screens/task/TaskScreen";
import AboutScreen from "../screens/profile/AboutScreen";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const Tab = createBottomTabNavigator();

const UserTabs = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{
        tabBarLabel: "Dashboard",
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home-circle" size={24} color="black" />
        ),
      }}
    />
    <Tab.Screen
      name="Projects"
      component={ProjectScreen}
      options={{
        tabBarLabel: "Projects",
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="tasks" size={24} color="black" />
        ),
      }}
    />
      <Tab.Screen
      name="Tasks"
      component={TaskScreen}
      options={{
        tabBarLabel: "Tasks",
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="task" size={24} color="black" />
        ),
      }}
    />
    <Tab.Screen
      name="About"
      component={AboutScreen}
      options={{
        tabBarLabel: "About",
        tabBarIcon: ({ color, size }) => (
          <Feather name="info" size={24} color="black" />
        ),
      }}
    />
  </Tab.Navigator>
);

export default UserTabs;