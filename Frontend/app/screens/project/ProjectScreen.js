import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const ProjectScreen = () => {
  const [projects, setProjects] = useState([
    { id: "1", name: "Project 1", description: "Short description (optional)" },
    { id: "2", name: "Project 2", description: "Short description (optional)" },
    { id: "3", name: "Project 3", description: "Short description (optional)" },
  ]);

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };
  const handleClick = () => {
    navigation.replace("UNewProjectScreen");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Projects</Text>
        <TouchableOpacity style={styles.newProjectButton}>
          <Text style={styles.newProjectText} onPress={handleClick}>
            New project →
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.projectCard}>
            <Text style={styles.projectTitle}>{item.name}</Text>
            <Text style={styles.projectDescription}>{item.description}</Text>
          </View>
        )}
      />

      {/* Current Date Section */}
      <View style={styles.dateSection}>
        <Text style={styles.currentDateTitle}>Current date</Text>

        <View style={styles.datePickerSection}>
          <Text style={styles.selectDateLabel}>Select date</Text>
          <TextInput
            style={styles.dateInput}
            value={date.toLocaleDateString()}
            editable={false}
          />
          <Button title="Select Date" onPress={() => setShowPicker(true)} />
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default ProjectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  newProjectButton: {
    backgroundColor: "#E0E0E0",
    padding: 10,
    borderRadius: 5,
  },
  newProjectText: {
    fontSize: 16,
  },
  projectCard: {
    backgroundColor: "#F0F0F0",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  projectDescription: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
  dateSection: {
    marginTop: 20,
  },
  currentDateTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  datePickerSection: {
    backgroundColor: "#F0F0F0",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  selectDateLabel: {
    fontSize: 14,
    marginBottom: 10,
  },
  dateInput: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CCCCCC",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});
