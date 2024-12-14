import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { API_URL } from "@env";

const TestProject = () => {
  const [profiles, setProfiles] = useState([]); // State to store profiles
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [assignee, setAssignee] = useState(""); // State for selected assignee


  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch(`${API_URL}/profile`);
        if (!response.ok) {
          throw new Error("Failed to fetch profiles");
        }
        const data = await response.json();
        setProfiles(data); // Store profiles in state
        setLoading(false); // Update loading state
      } catch (error) {
        console.error("Error fetching profiles:", error.message);
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <View>
      <Text>Select Assignee:</Text>
      {loading ? ( // Show loading text while profiles are being fetched
        <Text>Loading profiles...</Text>
      ) : (
        <Picker
          selectedValue={assignee}
          onValueChange={(itemValue) => setAssignee(itemValue)}
          style={{ height: 50, width: 300 }}
        >
          <Picker.Item label="Select Assignee" value="" />
          {profiles.map((profile) => (
            <Picker.Item
              key={profile._id}
              label={profile.name}
              value={profile.email}
            />
          ))}
        </Picker>
      )}
    </View>
  );
};

export default TestProject;
