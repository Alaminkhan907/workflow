import React from "react";
import { API_URL } from "@env";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TaskDetailScreen = ({ route, navigation }) => {
  const {task} = route.params;

  const handleEdit = () => {
    navigation.navigate("TaskEditScreen", { projectId: task._id });
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/deletetask/${task._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        Alert.alert("Success", "Task deleted successfully.");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to delete the task. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while deleting the task.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.replace("TaskScreen", {project : task.project})}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>{task.name}</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{task.description || "No description available."}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Details</Text>
        {task.details ? (
          <Text style={styles.details}>{task.details}</Text>
        ) : (
          <Text style={styles.details}>No additional details provided.</Text>
        )}
        <Text style={styles.status}>
          <Ionicons name="checkmark-circle-outline" size={18} color="#4CAF50" />{" "}
          {task.status || "Status not available"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Timeline</Text>
        <Text style={styles.details}>
          <Ionicons name="calendar-outline" size={16} color="#3B82F6" /> Due Date:{" "}
          {task.dueDate || "Not specified"}
        </Text>
        <Text style={styles.details}>
          <Ionicons name="time-outline" size={16} color="#3B82F6" /> Created At:{" "}
          {task.createdAt || "Not specified"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Assigned To</Text>
        <Text style={styles.details}>
          <Ionicons name="person-outline" size={16} color="#3B82F6" />{" "}
          {task.assignee || "No assignee specified"}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons name="create-outline" size={18} color="white" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={18} color="white" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F9F9F9",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#555",
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  details: {
    fontSize: 15,
    color: "#444",
    marginVertical: 4,
  },
  status: {
    fontSize: 15,
    color: "#4CAF50",
    fontWeight: "500",
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E63946",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default TaskDetailScreen;
