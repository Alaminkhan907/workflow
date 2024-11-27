import React, { useCallback, useEffect, useState  } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const TestTask = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    taskName: "",
    dueDate: "",
    description: "",
    assignee: "",
  });
  const [isAddTaskVisible, setIsAddTaskVisible] = useState(false);


  const fetchProjects = async () => {
    try {
      const res = await fetch("http://localhost:3000/getProject");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

 
  useFocusEffect(
    useCallback(() => {
      fetchProjects();
    }, [])
  );

  useEffect(() => {
    if (selectedProject) {
      fetch(`http://localhost:3000/getTasksByProject/${selectedProject._id}`)
        .then((response) => response.json())
        .then((data) => setTasks(data))
        .catch((error) => console.error("Error fetching tasks:", error));
    }
  }, [selectedProject]);


  const handleAddTask = () => {
    if (!newTask.taskName || !newTask.dueDate || !selectedProject) {
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
        projectId: selectedProject._id,
        taskName: newTask.taskName,
        dueDate: newTask.dueDate,
        description: newTask.description || "",
        assignee: newTask.assignee || "Unassigned",
      }),
    })
      .then((response) => response.json())
      .then((newTaskData) => {
        setTasks((prevTasks) => [...prevTasks, newTaskData]);
        setNewTask({
          taskName: "",
          dueDate: "",
          description: "",
          assignee: "",
        });
        setIsAddTaskVisible(false);
        Alert.alert("Success", "Task added successfully!");
      })
      .catch((error) => {
        console.error("Error adding task:", error);
        Alert.alert("Error", "Failed to add task. Please try again.");
      });
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
          Alert.alert("Success", "Task deleted successfully!");
        } else {
          console.error("Failed to delete task");
          Alert.alert("Error", "Failed to delete task. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
        Alert.alert("Error", "Failed to delete task. Please try again.");
      });
  };


  useFocusEffect(
    useCallback(() => {
      fetchProjects();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Task Management</Text>

      {/* Project Selector */}
      <FlatList
        data={projects}
        horizontal
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.projectButton}>
            <Button
              title={item.name}
              onPress={() => setSelectedProject(item)}
              color={selectedProject?._id === item._id ? "#007BFF" : "#6c757d"}
            />
          </View>
        )}
        style={styles.projectList}
      />

      {/* Tasks Section */}
      {selectedProject && (
        <View style={styles.tasksContainer}>
          <View style={styles.tasksHeader}>
            <Text style={styles.subheader}>
              Tasks for: {selectedProject.name}
            </Text>
            <TouchableOpacity
              style={styles.addTaskButton}
              onPress={() => setIsAddTaskVisible(true)}
            >
              <Text style={styles.addTaskText}>+ Add Task</Text>
            </TouchableOpacity>
          </View>

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

      {/* Add Task Modal */}
      <Modal
        visible={isAddTaskVisible}
        animationType="slide"
        onRequestClose={() => setIsAddTaskVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.subheader}>Add New Task</Text>
          <TextInput
            style={styles.input}
            placeholder="Task Name"
            value={newTask.taskName}
            onChangeText={(text) =>
              setNewTask((prev) => ({ ...prev, taskName: text }))
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
          <View style={styles.modalActions}>
            <Button
              title="Cancel"
              color="#6c757d"
              onPress={() => setIsAddTaskVisible(false)}
            />
            <Button title="Add Task" onPress={handleAddTask} />
          </View>
        </View>
      </Modal>
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
    marginBottom: 5,
  },
  projectList: {
    marginBottom: 1,
  },
  projectButton: {
    marginRight: 10,
  },
  subheader: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  tasksContainer: {
    flex: 1,
    marginBottom: 5,
  },
  tasksHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addTaskButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  addTaskText: {
    color: "#fff",
    fontWeight: "bold",
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
    marginTop: 5,
  },
  modalContent: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 1,
  },
});

export default TestTask;
