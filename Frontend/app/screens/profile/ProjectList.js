import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ProjectList = ({ route , navigation }) => {
  const { projects = [] } = route.params || {};
  // console.log(projects);

  return (
    <ScrollView style={styles.container}>

    <TouchableOpacity
        onPress={() => navigation.replace("AboutHome")}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      {projects.length === 0 ? (
        <View style={styles.emptyState}>
          <Image
            source={require("../../../assets/icon.png")}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>No Task found</Text>
        </View>
      ) : (
        <>
          <View style={styles.header}>
          <Text style={styles.headerText}>List Of Task for {projects[0]?.assignee}</Text>
          </View>

          <View style={styles.projectSection}>
            <Text style={styles.sectionTitle}>Task</Text>

            {projects.map((project) => (
              <View key={project._id} style={styles.projectItem}>
                <Text style={styles.projectTitle}>{project.taskName}</Text>
                <Text style={styles.projectDetail}>
                  Assignee: {project.assignee}
                </Text>
                <Text style={styles.projectDetail}>
                  Description: {project.description}
                </Text>
                <Text style={styles.projectDetail}>
                  Priority: {project.priority}
                </Text>
                <Text style={styles.dealine}>
                  Due Date: {new Date(project.dueDate).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F8F8",
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  projectSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  projectItem: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  projectDetail: {
    fontSize: 14,
    color: "#777",
  },
  dealine:{
    fontSize: 14,
    fontWeight:700,
    color: "#ff0000",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#555",
  },
});

export default ProjectList;
