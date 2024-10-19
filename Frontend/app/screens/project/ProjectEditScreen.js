import React, { useState } from "react";
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

const ProjectEditScreen = ({ navigation }) => {
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [assignee, setAssignee] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [projects, setProjects] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/gettask")
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, []);

  const handleSubmit = async () => {
    const newTask = {
      name: taskName,
      dueDate: dueDate.toISOString().split("T")[0],
      description: description,
      status: status,
      assignee: assignee,
      createdAt: new Date(),
    };

    console.log("Task Created: ", newTask);

    try {
      const response = await fetch(
        `http://localhost:3000/edittask/${project._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTask),
        }
      );

      if (response.ok) {
        const data = await response.json();
        Alert.alert(
          "Task Created",
          `Task "${taskName}" has been created on the server.`
        );
        console.log("Response from server: ", data);
        navigation.replace("NewProject");
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
      setDueDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => {
          console.log("Back button pressed");
          navigation.replace("NewProject");
        }}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Add New Task</Text>

      <TextInput
        style={styles.input}
        placeholder="Task Name"
        value={projects.name}
        onChangeText={setTaskName}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={projects.description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Assignee"
        value={projects.assignee}
        onChangeText={setAssignee}
      />

      <TouchableOpacity onPress={showDatePickerModal} style={styles.input}>
        <Text>
          {dueDate ? dueDate.toISOString().split("T")[0] : "Select Due Date"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={projects.dueDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Status Dropdown */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Status:</Text>
        <Picker
          selectedValue={projects.status}
          style={styles.picker}
          onValueChange={(itemValue) => setStatus(itemValue)}
        >
          <Picker.Item label="Pending" value="pending" />
          <Picker.Item label="In Progress" value="in_progress" />
          <Picker.Item label="Completed" value="completed" />
        </Picker>
      </View>

      {/* Submit Button */}
      <Button title="Create Task" onPress={handleSubmit} />
    </View>
  );
};

export default ProjectEditScreen;

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
