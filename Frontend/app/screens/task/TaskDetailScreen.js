import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const TaskDetailScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header with Edit and Delete icons */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            console.log("Back button pressed");
            navigation.replace("Task");
          }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.projectTitle}>Add Task</Text>
      </View>

      {/* Description input */}
      <TextInput
        style={styles.descriptionInput}
        placeholder="Description (optional)"
        placeholderTextColor="#B0B0B0"
      />

      {/* Add assignee text */}
      <Text style={styles.addAssigneeText}>Add Assignee</Text>

      {/* Done button with more options */}
      <View style={styles.bottomRow}>
        <TouchableOpacity>
          <Entypo name="dots-three-horizontal" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.doneButton}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
    marginTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 16,
    fontWeight: "500",
  },
  icons: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 15,
  },
  descriptionInput: {
    backgroundColor: "#F0F0F0",
    height: 40,
    marginTop: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  addAssigneeText: {
    marginTop: 15,
    fontSize: 16,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  doneButton: {
    backgroundColor: "#000",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  doneButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default TaskDetailScreen;
