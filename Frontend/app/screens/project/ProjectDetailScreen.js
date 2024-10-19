import React from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";

const ProjectDetailScreen = ({ route, navigation }) => {
  const { project } = route.params;
  console.log(project);

  const handleEdit = async () => {
    try {
      navigation.navigate("EditProjectScreen", { projectId: project._id });
    } catch (error) {
      Alert.alert("Error", "Could not navigate to edit screen.");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/deletetask/${project._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Project deleted successfully.");
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
    padding: 16,
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
