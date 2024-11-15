import React, { useState } from "react";
import { API_URL } from '@env';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const TaskAddScreen = ({ navigation, route }) => {
  const {project} = route.params;
  console.log("Project unpacked ", project);
  
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [assignee, setAssignee] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [urgent, setUrgent] = useState("false");


  const handleSubmit = async () => {
    console.log("Submit task button clicked");
    if (!taskName.trim()) {
      Alert.alert("Validation Error", "Please enter the task name.");
      return;
    }

  
    if (!assignee.trim()) {
      Alert.alert("Validation Error", "Please enter the assignee.");
      return;
    }
  
    // if (!dueDate) {
    //   Alert.alert("Validation Error", "Please select a due date.");
    //   return;

    // }

    if (!urgent) {
      Alert.alert("Validation Error", "Please select if the task is urgent.");
      console.log("Urgency not selected");
      return;
      
    }


    const newTask = {
      name: taskName,
      //dueDate: dueDate.toISOString().split("T")[0], 
      dueDate: "2024-11-10T00:00:00Z",
      description: description,
      status: status,
      assignee: assignee,
      createdAt: new Date(),
      urgent: urgent,
      project: project._id
    };

    console.log("Task Created: ", newTask);

    try {
      const response = await fetch(`${API_URL}/addTask/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask), 
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert(
          "Task Created",
          `Task "${taskName}" has been created on the server.`
        );
        console.log("Response from server: ", data);

        navigation.replace("TaskScreen", {project})
      } else {
        const errorData = await response.json();
        console.error("Error creating task: ", errorData);
        Alert.alert("Error", "Failed to create task on the server.");
      }
    } catch (error) {
      console.error("Network error: ", error);
      Alert.alert(
        "Error",
        "An error occurred while sending the task to the server."
      );
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false); 
    if (selectedDate) {
      setDueDate(selectedDate); }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.top}>
      <TouchableOpacity
        onPress={() => {
          console.log("Back button pressed");
          navigation.replace("TaskScreen");
          // navigation.goBack();
        }}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Task Input Fields */}
      <Text style={styles.title}>Add New Task</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Task Name"
        value={taskName}
        onChangeText={setTaskName}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Assignee"
        value={assignee}
        onChangeText={setAssignee}
      />

      <TouchableOpacity onPress={showDatePickerModal} style={styles.input}>
        <Text>
          {dueDate ? dueDate.toISOString().split("T")[0] : "Select Due Date"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Status Dropdown */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Status:</Text>
        <Picker
          selectedValue={status}
          style={styles.picker}
          onValueChange={(itemValue) => setStatus(itemValue)}
        >
          <Picker.Item label="Pending" value="pending" />
          <Picker.Item label="In Progress" value="in_progress" />
          <Picker.Item label="Completed" value="completed" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Urgent:</Text>
        <Picker
          selectedValue={urgent}
          style={styles.picker}
          onValueChange={(itemValue) => setUrgent(itemValue)}
        >
          <Picker.Item label="No" value="false" />
          <Picker.Item label="Yes" value="true" />
          
        </Picker>
      </View>

      

      {/* Submit Button */}
      <Button title="Create Task" onPress={handleSubmit} />
    </View>
  );
};

export default TaskAddScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  top: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20,
  },
  backButton: {
    alignSelf: "flex-start",
   
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    left: 15,

  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    backgroundColor: "#fff",
  },
});
