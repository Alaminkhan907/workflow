import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";

const TaskDetailScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header with Edit and Delete icons */}
      <View style={styles.header}>
        <Text style={styles.date}>12/10/2024 12:00</Text>
        <View style={styles.icons}>
          <TouchableOpacity style={styles.icon}>
            <FontAwesome name="pencil" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <FontAwesome name="trash" size={24} color="black" />
          </TouchableOpacity>
        </View>
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
    padding: 20,
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    width: 400,
    height: 250,
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
