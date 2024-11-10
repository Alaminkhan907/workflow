import React, { useState, useEffect, useCallback } from "react";
import { API_URL } from '@env';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
  TextInput,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
console.log("API_URL:", API_URL);

const ProjectScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/getProject`);
      const data = await response.json();
      setProjects(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProjects();
    }, [])
  );

  const handleClick = () => {
    navigation.replace("AddProjectScreen");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>List of Projects</Text>
        <TouchableOpacity style={styles.newProjectButton}>
          <Text style={styles.newProjectText} onPress={handleClick}>
            New project →
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={projects}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ProjectDetailScreen", { project: item })
            }
          >
            <View style={styles.projectCard}>
              <Text style={styles.projectTitle}>{item.name}</Text>
              <Text style={styles.projectDescription}>{item.description}</Text>
              <Text style={styles.teamContainer}>{item.assignee}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ProjectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },

  newProjectText: {
    backgroundColor: "#5A81F7",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    color: "#fff",
    fontSize: 16,
  },
  projectCard: {
    backgroundColor: "#F0F0F0",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  projectDescription: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
  teamContainer: {
    flexDirection: "row",
  },
});
