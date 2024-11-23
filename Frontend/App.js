// import "./global.css";
// import React from "react";
// import AppNavigator from "./app/navigation/AppNavigator";
// import Entry from "./app/navigation/Entry";

// export default function App() {
//   return <AppNavigator />;
//   // return <Entry />;
// }

import React from "react";

//👇🏻 app screens
import Login from "./app/screens/communication/screens/Login";
import Messaging from "./app/screens/communication/screens/Messaging";
import Chat from "./app/screens/communication/screens/Chat";

//👇🏻 React Navigation configurations
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{
            title: "Chats",
            headerShown: false,
          }}
        />
        <Stack.Screen name="Messaging" component={Messaging} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
