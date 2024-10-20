import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TaskScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([
    { id: "1", name: "Task 1", date: "12/10/2024 12:00", team: ["KT", "RP"] },
    { id: "2", name: "Task 2", date: "12/10/2024 15:00", team: ["LS"] },
    {
      id: "3",
      name: "Task 3",
      date: "13/10/2024 11:00",
      team: ["LS", "KT", "RP"],
    },
  ]);
  const handleClick = () => {
    navigation.replace("TaskDetailScreen");
  };
  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <Text style={styles.taskName}>{item.name}</Text>
      <Text style={styles.taskDate}>{item.date}</Text>
      <View style={styles.teamContainer}>
        {item.team.map((member, index) => (
          <Text key={`${item.id}-${index}`} style={styles.teamMember}>
            {member}
          </Text>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [{ name: "UserTabs" }],
            });
          }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.projectTitle}>New Task</Text>
        <TouchableOpacity>
          <Ionicons name="pencil" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.addTaskSection}>
        <Text style={styles.addTaskText}>Add Task</Text>
        <TouchableOpacity>
          <Ionicons name="add" size={24} color="black" onPress={handleClick} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        style={styles.taskList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    // marginTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  projectTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addTaskSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  addTaskText: {
    fontSize: 18,
  },
  taskList: {
    marginTop: 10,
  },
  taskCard: {
    backgroundColor: "#F0F0F0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  taskDate: {
    fontSize: 14,
    color: "#555",
  },
  teamContainer: {
    flexDirection: "row",
  },
  teamMember: {
    fontSize: 14,
    marginLeft: 10,
  },
});

export default TaskScreen;
