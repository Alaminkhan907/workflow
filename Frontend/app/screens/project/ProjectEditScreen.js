import React, { useState, useEffect } from "react";
import { API_URL } from "@env";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const ProjectEditScreen = ({ route, navigation }) => {
  const { projectId } = route.params;

  const [ProjectName, setProjectName] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [assignee, setAssignee] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/getProject/${projectId}`)
      .then((response) => response.json())
      .then((data) => {
        setProjectName(data.name);
        setDueDate(new Date(data.dueDate));
        setDescription(data.description);
        setStatus(data.status);
        setAssignee(data.assignee);
      })
      .catch((error) => {
        console.error("Error fetching project data: ", error.message);
        Alert.alert("Error", "Failed to load project data.");
      });
  }, [projectId]);

  const handleSubmit = async () => {
    const updatedProject = {
      name: ProjectName,
      dueDate: dueDate.toISOString().split("T")[0],
      description,
      status,
      assignee,
      updatedAt: new Date(),
    };

    try {
      const response = await fetch(`${API_URL}/editProject/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProject),
      });

      if (response.ok) {
        Alert.alert("Success", `Project "${ProjectName}" has been updated.`);
        navigation.replace("ProjectHome");
      } else {
        Alert.alert("Error", "Failed to update Project on the server.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while updating the Project.");
    }
  };

  const showDatePickerModal = () => setShowDatePicker(true);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDueDate(selectedDate);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Edit Project</Text>

      <TextInput
        style={styles.input}
        placeholder="Project Name"
        value={ProjectName}
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

      {/* Date Picker */}
      <TouchableOpacity onPress={showDatePickerModal} style={styles.dateInput}>
        <Text style={styles.dateText}>
          {dueDate ? dueDate.toISOString().split("T")[0] : "Select Due Date"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* Status Picker */}
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

      <TouchableOpacity style={styles.updateButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Update Project</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProjectEditScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    justifyContent: "center",
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  pickerContainer: {
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  label: {
    fontSize: 16,
    margin: 10,
    color: "#555",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  updateButton: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
