import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const AddTaskScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          console.log("Back button pressed");
          navigation.replace("NewProject");
        }}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.text}>AddTaskScreen</Text>
    </View>
  );
};

export default AddTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
