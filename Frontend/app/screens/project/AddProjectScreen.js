import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import RNPickerSelect from "react-native-picker-select";
import { API_URL } from "@env";

const AddProjectScreen = ({ navigation }) => {
  const [ProjectName, setProjectName] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [assignee, setAssignee] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);


  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch(`${API_URL}/profile`);
        if (!response.ok) {
          throw new Error("Failed to fetch profiles");
        }
        const data = await response.json();
        const formattedProfiles = data.map((profile) => ({
          label: profile.name,
          value: profile.name,
        }));
        setProfiles(formattedProfiles);
      } catch (error) {
        console.error("Error fetching profiles:", error.message);
      }
    };

    fetchProfiles();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    const newProject = {
      name: ProjectName,
      dueDate: dueDate.toISOString().split("T")[0],
      description,
      status,
      assignee,
      createdAt: new Date(),
    };

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
          `Project "${ProjectName}" has been created successfully.`
        );
        console.log("Response from server: ", data);
        navigation.replace("ProjectHome");
      } else {
        const errorData = await response.json();
        console.error("Error creating project: ", errorData);
        Alert.alert("Error", "Failed to create the project on the server.");
      }
    } catch (error) {
      console.error("Network error: ", error.message);
      Alert.alert("Error", "An error occurred while creating the project.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.replace("ProjectHome")}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Form Title */}
      <Text style={styles.title}>Add New Project</Text>

      {/* Project Name */}
      <TextInput
        style={styles.input}
        placeholder="Project Name"
        value={ProjectName}
        onChangeText={setProjectName}
      />

      {/* Description */}
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

    <View style={styles.pickerContainer}>

      <Picker
        selectedValue={assignee}
        style={styles.picker}
        onValueChange={(itemValue) => setAssignee(itemValue)}
      >
        <Picker.Item label="Select an assignee" value="" />
        {profiles.map((profile) => (
          <Picker.Item key={profile.value} label={profile.label} value={profile.value} />
        ))}
      </Picker>
    </View>


      {/* Due Date Picker */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text>
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

      {/* Submit Button */}
      <Button title="Create Project" onPress={handleSubmit} />
    </ScrollView>
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

