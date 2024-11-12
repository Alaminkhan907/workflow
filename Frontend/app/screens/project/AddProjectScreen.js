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

const AddProjectScreen = ({ navigation }) => {
  
  const [projectName, setProjectName] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [assignee, setAssignee] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);


  const handleSubmit = async () => {
    if (!projectName.trim()) {
      Alert.alert("Validation Error", "Please enter the project name.");
      return;
    }

  
    if (!assignee.trim()) {
      Alert.alert("Validation Error", "Please enter the assignee.");
      return;
    }
  
    if (!dueDate) {
      Alert.alert("Validation Error", "Please select a due date.");
      return;
    }
    const newProject = {
      name: projectName,
      dueDate: dueDate.toISOString().split("T")[0], 
      description: description,
      status: status,
      assignee: assignee,
      createdAt: new Date(),
    };

    console.log("Project Created: ", newProject);

    try {
      const response = await fetch(`${API_URL}/addProject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject), 
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert(
          "Project Created",
          `Project "${projectName}" has been created on the server.`
        );
        console.log("Response from server: ", data);

        navigation.replace("Project");
      } else {
        const errorData = await response.json();
        console.error("Error creating project: ", errorData);
        Alert.alert("Error", "Failed to create project on the server.");
      }
    } catch (error) {
      console.error("Network error: ", error);
      Alert.alert(
        "Error",
        "An error occurred while sending the project to the server."
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
      <TouchableOpacity
        onPress={() => {
          console.log("Back button pressed");
          navigation.replace("Project");
          // navigation.goBack();
        }}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Project Input Fields */}
      <Text style={styles.title}>Add New Project</Text>
      <TextInput
        style={styles.input}
        placeholder="Project Name"
        value={projectName}
        onChangeText={setProjectName}
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

      {/* Submit Button */}
      <Button title="Create Project" onPress={handleSubmit} />
    </View>
  );
};

export default AddProjectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
