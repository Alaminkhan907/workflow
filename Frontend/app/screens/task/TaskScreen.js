import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";


const TaskScreen = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    Task: "",
    dueDate: "",
    description: "",
    assignee: "",
    priority: "",
  });

  // Fetch all projects
  useEffect(() => {
    fetch("http://localhost:3000/getProject")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch tasks for selected project
  useEffect(() => {
    if (selectedProject) {
      fetch(`http://localhost:3000/getTask/${selectedProject._id}`)
        .then((response) => response.json())
        .then((data) => setTasks(data))
        .catch((error) => console.error("Error fetching tasks:", error));
      console.log(data);
    }
  }, [selectedProject]);

  const handleAddTask = () => {
    if (!newTask.name || !newTask.dueDate || !selectedProject) {
      Alert.alert(
        "Error",
        "Please provide all task details and select a project."
      );
      return;
    }

    fetch(`http://localhost:3000/addTask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ProjectId: selectedProject._id,
        taskName: newTask.name,
        dueDate: newTask.dueDate,
        description: newTask.description || "",
        assignee: newTask.assignee || "Unassigned",
        priority: newTask.priority,
      }),
    })
      .then((response) => response.json())
      .then((newTaskData) => {
        // Update tasks list with the newly added task
        setTasks((prevTasks) => [...prevTasks, newTaskData]);
        // Reset the new task form
        setNewTask({ name: "", dueDate: "", description: "", assignee: "", priority: "" });
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  const handleDeleteTask = (taskId) => {
    fetch(`http://localhost:3000/deleteTasks/${taskId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task._id !== taskId)
          );
        } else {
          console.error("Failed to delete task");
        }
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Task Management</Text>

      {/* Project Selector */}
      <FlatList
        data={projects}
        horizontal
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Button
            title={item.name}
            onPress={() => setSelectedProject(item)}
            color={selectedProject?._id === item._id ? "red" : "#6c757d"}
          />
        )}
        style={styles.projectList}
      />

      {/* Tasks List */}
      {selectedProject && (
        <View style={styles.tasksContainer}>
          <Text style={styles.subheader}>Tasks for {selectedProject.name}</Text>

          {tasks.length > 0 ? (
            <ScrollView>
              {tasks.map((task) => (
                <View key={task._id} style={styles.taskItem}>
                  <View style={styles.taskDetails}>
                    <Text style={styles.taskName}>{task.taskName}</Text>
                    <Text style={styles.taskText}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </Text>
                    <Text style={styles.taskText}>{task.description}</Text>
                    <Text style={styles.taskText}>
                      Assignee: {task.assignee}
                    </Text>
                    <Text style={styles.taskText}>{task.priority}</Text>
                  </View>
                  <Button
                    title="Delete"
                    onPress={() => handleDeleteTask(task._id)}
                    color="red"
                  />
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyText}>
              No tasks found for this project.
            </Text>
          )}
        </View>
      )}

      {/* Add Task Form */}
      {/* {selectedProject && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Task Name"
            value={newTask.name}
            onChangeText={(text) =>
              setNewTask((prev) => ({ ...prev, name: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Due Date (YYYY-MM-DD)"
            value={newTask.dueDate}
            onChangeText={(text) =>
              setNewTask((prev) => ({ ...prev, dueDate: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={newTask.description}
            onChangeText={(text) =>
              setNewTask((prev) => ({ ...prev, description: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Assignee"
            value={newTask.assignee}
            onChangeText={(text) =>
              setNewTask((prev) => ({ ...prev, assignee: text }))
            }
          />
          <Button title="Add Task" onPress={handleAddTask} />
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  projectList: {
    marginBottom: 20,
  },
  subheader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  tasksContainer: {
    flex: 1,
    marginBottom: 20,
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
  },
  taskDetails: {
    flex: 1,
    marginRight: 10,
  },
  taskName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  taskText: {
    color: "#6c757d",
  },
  emptyText: {
    textAlign: "center",
    color: "#6c757d",
    marginTop: 20,
  },
  form: {
    marginVertical: 20,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});

export default TaskScreen;
