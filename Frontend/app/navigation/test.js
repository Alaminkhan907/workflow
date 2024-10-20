import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import ProjectScreen from "../screens/project/ProjectScreen";
import AboutScreen from "../screens/profile/AboutScreen";
import TaskScreen from "../screens/task/TaskScreen";
import TaskDetailScreen from "../screens/task/TaskDetailScreen";
import AddProjectScreen from "../screens/project/AddProjectScreen";
import ProjectEditScreen from "../screens/project/ProjectEditScreen";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const DashboardStack = createNativeStackNavigator();
const ProjectStack = createNativeStackNavigator();
const AboutStack = createNativeStackNavigator();
const TaskStack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const DashboardStackNavigator = () => (
  <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
    <DashboardStack.Screen name="Dashboard" component={DashboardScreen} />
  </DashboardStack.Navigator>
);

const ProjectStackNavigator = () => (
  <ProjectStack.Navigator screenOptions={{ headerShown: false }}>
    <ProjectStack.Screen name="Project" component={ProjectScreen} />
    <ProjectStack.Screen
      name="ProjectEditScreen"
      component={ProjectEditScreen}
    />
    <ProjectStack.Screen name="AddProjectScreen" component={AddProjectScreen} />
  </ProjectStack.Navigator>
);

const TaskStackNavigator = () => (
  <TaskStack.Navigator screenOptions={{ headerShown: false }}>
    <TaskStack.Screen name="Task" component={TaskScreen} />
    <TaskStack.Screen name="TaskDetailScreen" component={TaskDetailScreen} />
  </TaskStack.Navigator>
);

const AboutStackNavigator = () => (
  <AboutStack.Navigator screenOptions={{ headerShown: false }}>
    <AboutStack.Screen name="About" component={AboutScreen} />
  </AboutStack.Navigator>
);

const UserTabs = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Dashboard"
      component={DashboardStackNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home-circle" size={24} color="black" />
        ),
        tabBarLabel: "Dashboard",
      }}
    />
    <Tab.Screen
      name="Project"
      component={ProjectStackNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="tasks" size={24} color="black" />
        ),
        tabBarLabel: "Projects",
      }}
    />
    <Tab.Screen
      name="Task"
      component={TaskStackNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="task" size={24} color="black" />
        ),
        tabBarLabel: "Tasks",
      }}
    />
    <Tab.Screen
      name="About"
      component={AboutStackNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Feather name="info" size={24} color="black" />
        ),
        tabBarLabel: "About",
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <UserTabs />
    </NavigationContainer>
  );
};

export default AppNavigator;
