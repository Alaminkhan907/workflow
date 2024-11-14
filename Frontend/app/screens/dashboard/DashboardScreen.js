import React, { useState, useEffect, useCallback } from "react";
import { API_URL } from '@env';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
console.log("API_URL:", API_URL);

const DashboardScreen = ({ navigation }) => {
  // const [projects, setProjects] = useState([]);

  // useEffect(() => {
  //   fetch("http://localhost:3000/gettask")
  //     .then((res) => res.json())
  //     .then((data) => setProjects(data));
  // }, []);
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

  const totalProjects = projects.length;
  const pendingProjects = projects.filter(
    (project) => project.status === "pending"
  ).length;

  const sortedProjects = projects.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>Dashboard</Text>
      </View> */}

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{totalProjects}</Text>
            <Text style={styles.statLabel}>Total Projects</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{pendingProjects}</Text>
            <Text style={styles.statLabel}>Pending Projects</Text>
          </View>
        </View>
      </View>

      <View style={styles.recentTasksSection}>
        <Text style={styles.sectionTitle}>Last Activity</Text>

        {/* Map over the sorted projects to display each one */}
        {sortedProjects.map((project) => (
          <TouchableOpacity onPress={() => {
            console.log("This is project:", JSON.stringify(project, null, 2));
            //navigation.navigate("Task", {project})
            navigation.navigate("Tasks", {
              screen: "TaskScreen",
            });
          }
          }>
          <View key={project._id} style={styles.taskItem}>
            <Text style={styles.taskTitle}>{project.name}</Text>
            <Text style={styles.taskDate}>
              Created At: {new Date(project.createdAt).toLocaleString()}
            </Text>
            <Text style={styles.taskDate}>
              Due Date: {new Date(project.dueDate).toLocaleString()}
            </Text>
            <Text style={styles.taskStatus}>Status: {project.status}</Text>
          </View>
          </TouchableOpacity>
        ))}
      </View>
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
  statsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 14,
    color: "#555",
  },
  recentTasksSection: {
    marginBottom: 20,
  },
  taskItem: {
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
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  taskDate: {
    fontSize: 14,
    color: "#777",
  },
  taskStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF6347",
  },
});

export default DashboardScreen;
