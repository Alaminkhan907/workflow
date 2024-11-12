import React from 'react';
import { API_URL } from "@env";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
  TextInput,
} from "react-native";
import { Table, Row, Rows } from 'react-native-table-component';
import { useState, useEffect } from 'react';

const TaskScreen = ({ route }) => {
  console.log("This should be route.params.project" + route.params);
  const project = {"_id": "673211b4376082018f99cfa2", "name": "Test project"};
  const tableHead = ['Task', 'Deadline', 'Progress'];
  const [tasks, setTasks] = useState([]);
  console.log("Passing parameter " + project._id);

  useEffect(() => {
    // Fetch tasks for the project
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_URL}/getTasksByProject/${project._id}`); 
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, [project._id]);

  // Map the fetched tasks to the table data format
  const tableData = tasks.map(task => [
    task.name,
    new Date(task.dueDate).toLocaleDateString(), // Format date as needed
    task.status,
  ]);

  const handleClick = () => {
    navigation.replace("TaskAddScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{project.name}
      <TouchableOpacity style={styles.newProjectButton}>
          <Text style={styles.newProjectText} onPress={handleClick}>
            New task →
          </Text>
        </TouchableOpacity>
      </Text>
      <Table borderStyle={{ borderWidth: 1, borderColor: '#000000' }}>
        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
        <Rows data={tableData} textStyle={styles.text} />
      </Table>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  head: { height: 40 },
  text: { margin: 6,textAlign: 'center' },
  newProjectText: {
    backgroundColor: "#F0F0F0",
    padding: 7,
    margin: 15,
    borderRadius: 8,
    fontSize: 16,
  },
});

export default TaskScreen;
