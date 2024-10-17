import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const DashboardScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Dashboard</Text>
      </View>

      {/* Statistics Section */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Tasks Completed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Pending Tasks</Text>
          </View>
        </View>
      </View>

      {/* Recent Tasks Section */}
      <View style={styles.recentTasksSection}>
        <Text style={styles.sectionTitle}>Recent Tasks</Text>
        <View style={styles.taskItem}>
          <Text style={styles.taskTitle}>Finish Dashboard Design</Text>
          <Text style={styles.taskDate}>Due: 12/10/2024</Text>
        </View>
        <View style={styles.taskItem}>
          <Text style={styles.taskTitle}>Review Project Proposal</Text>
          <Text style={styles.taskDate}>Due: 14/10/2024</Text>
        </View>
      </View>

      {/* Navigation Section */}
      <View style={styles.navigationSection}>
        <Text style={styles.sectionTitle}>Navigate to:</Text>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Projects")}
        >
          <Text style={styles.navButtonText}>Projects</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Tasks")}
        >
          <Text style={styles.navButtonText}>Tasks</Text>
        </TouchableOpacity>
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
  navigationSection: {
    marginBottom: 20,
  },
  navButton: {
    backgroundColor: "#2E86C1",
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  navButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DashboardScreen;
