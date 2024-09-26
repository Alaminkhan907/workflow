import { View, Text } from "react-native";
import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "red",
          },
        }}
      />
    </Stack>
  );
};

export default RootLayout;
