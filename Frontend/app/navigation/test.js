import React , {useState} from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import ProjectScreen from "../screens/project/ProjectScreen";
import AboutScreen from "../screens/profile/AboutScreen";
import NewProjectScreen from "../screens/task/TaskScreen";
import TaskAddScreen from "../screens/task/TaskAddScreen";
import AddProjectScreen from "../screens/project/AddProjectScreen";
import ProjectDetailScreen from "../screens/project/ProjectDetailScreen";
import ProjectEditScreen from "../screens/project/ProjectEditScreen";
import TaskScreen from "../screens/task/TaskScreen";
import LoginScreen from "../screens/authentication/LoginScreen";
import SignupScreen from "../screens/authentication/SignupScreen";
import ForgotPasswordScreen from "../screens/authentication/ForgotScreen";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import TaskDetailScreen from "../screens/task/TaskDetailScreen";
import TaskEditScreen from "../screens/task/TaskEditScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ProjectStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProjectScreen" component={ProjectScreen} />
    <Stack.Group screenOptions={{ presentation: "modal" ,headerShown: false }}>
        <Stack.Screen name="AddProjectScreen" component={AddProjectScreen} />
      </Stack.Group>
    <Stack.Screen name="NewProject" component={NewProjectScreen} />
    <Stack.Screen  name="ProjectDetailScreen" component={ProjectDetailScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ProjectEditScreen" component={ProjectEditScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);
const AboutStack =()=>(
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="About" component={AboutScreen}/>
  </Stack.Navigator>
)
const DashboardStack =()=>(
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DashboardScreen" component={DashboardScreen}/>
  </Stack.Navigator>
)

const TaskStack =()=>(
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TaskScreen" component={TaskScreen}/>
    <Stack.Screen name="TaskAddScreen" component={TaskAddScreen}/>
    <Stack.Screen name="TaskEditScreen" component={TaskEditScreen}/>
    <Stack.Screen name="TaskDetailScreen" component={TaskDetailScreen}/>
  </Stack.Navigator>
)

const AuthenticationStack =({ onLogin })=>(
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login">
      {(props) => <LoginScreen {...props} onLogin={onLogin} />} 
    </Stack.Screen>
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
)




const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  console.log(isLoggedIn)
  return (
    <NavigationContainer>
      {isLoggedIn ?(<Tab.Navigator>
      {/* <Tab.Screen
      name="Authentication"
      component={AuthenticationStack}
      options={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    /> */}
      <Tab.Screen
      name="Dashboard"
      component={DashboardStack}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home-circle" size={24} color={color} />
        ),
        tabBarLabel: "Dashboard",
      }}
    />
    <Tab.Screen
      name="Projects"
      component={ProjectStack}
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="tasks" size={24} color={color} />
        ),
        tabBarLabel: "Projects",
      }}
    />
    <Tab.Screen
      name="Tasks"
      component={TaskStack}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="task" size={24} color={color} />
        ),
        tabBarLabel: "Tasks",
      }}
    />
    <Tab.Screen
      name="About"
      component={AboutStack}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Feather name="info" size={24} color={color} />
        ),
        tabBarLabel: "About",
      }}
    />
      </Tab.Navigator>):(<AuthenticationStack onLogin={handleLogin}/>)}
 
    </NavigationContainer>
  );
};

export default AppNavigator;
