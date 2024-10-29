import React from "react";
import { API_URL } from '@env';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ProjectDetailScreen = ({ route, navigation }) => {
  const { project } = route.params;
  console.log(project);

  const handleEdit = async () => {
    try {
      navigation.navigate("ProjectEditScreen", { projectId: project._id });
    } catch (error) {
      Alert.alert("Error", "Could not navigate to edit screen.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${API_URL}/deletetask/${project._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Project deleted successfully.");
        // onRefresh();
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to delete the project.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while deleting the project.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          console.log("Back button pressed");
          navigation.replace("Project");
        }}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>{project.name}</Text>
      <Text style={styles.description}>{project.description}</Text>
      <Text style={styles.details}>{project.details}</Text>
      <Text style={styles.details}>{project.status}</Text>
      <Text style={styles.details}>{project.dueDate}</Text>
      <Text style={styles.details}>{project.assignee}</Text>
      <Text style={styles.details}>{project.createdAt}</Text>
      {/* <Text style={styles.title}>{project._id}</Text> */}

      <Button title="Edit" onPress={handleEdit} />
      <Button title="Delete" onPress={handleDelete} color="red" />
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    marginVertical: 8,
  },
  details: {
    fontSize: 14,
    marginVertical: 4,
  },
});

export default ProjectDetailScreen;
