import React, { useState, useEffect, useCallback } from "react";
import { API_URL } from "@env";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
  TextInput,
  Icon,
} from "react-native";
import { Table, Row, Rows } from 'react-native-table-component';
import { useFocusEffect } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const TaskScreen = ({ route, navigation }) => {
  console.log("This should be route.params " + JSON.stringify(route.params?.project, null, 2));
  //const project = {"_id": "673211b4376082018f99cfa2", "name": "Test project"};
  const {project} = route.params;
  console.log("Project unpacked ", project);
  const tableHead = ['Task', 'Deadline', 'Progress'];
  const [tasks, setTasks] = useState([]);
  console.log("Passing parameter " + project._id);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/getTasksByProject/${project._id}`); 
      const data = await response.json();
      setTasks(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );


  const handleClick = () => {
    navigation.navigate("TaskAddScreen", {project});
  };


  const handleEditClick = (task) => {
    console.log(console.log("handleEditClick is sending  " + JSON.stringify(route.params, null, 2)));
    navigation.navigate("TaskDetailScreen", {task});
  };

  // Map the fetched tasks to the table data format
  const tableData = tasks.map(task =>
    task.urgent
      ? [
          [task.name,
          <View style={styles.urgentIcon}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={24}
              color="black"
            />
          </View>],
          new Date(task.dueDate).toLocaleDateString(), // Format date as needed
          [task.status, <div style={styles.editIcon} >
            <MaterialCommunityIcons onPress={() => handleEditClick(task)}
              name="circle-edit-outline"
              size={24}
              color="black"
            />
          </div>]
      
        ]
      : [
          task.name,
          new Date(task.dueDate).toLocaleDateString(),
          [task.status, <div style={styles.editIcon} >
            <MaterialCommunityIcons onPress={() => handleEditClick(task)}
              name="circle-edit-outline"
              size={24}
              color="black"
            />
          </div>]
      
        ]
  );




  return (
    <View style={styles.container}>
      <Text style={styles.header}>{project.name}
      
        <TouchableOpacity
          >
            <View style={styles.newProjectButton}>
            <Text style={styles.newProjectText} onPress={handleClick}>
            New task →
          </Text>
            </View>
          </TouchableOpacity>

      </Text>
      <Table borderStyle={{ borderWidth: 1, borderColor: '#000000' }}>
        <Row data={tableHead} style={styles.head} textStyle={styles.text} />
        <Rows data={tableData} textStyle={styles.text} />
      </Table>
    </View>
  );
};

export default TaskScreen;

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
  urgentIcon:{
    float: "right",
  },

  editIcon:{
    float: "right",
  }
});


