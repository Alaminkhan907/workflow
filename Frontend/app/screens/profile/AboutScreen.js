import React, { useState, useCallback } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { API_URL } from "@env";

const AboutScreen = ({ navigation }) => {
  const [getProfile, setProfile] = useState(null);

  const handleLogout = () => {
    navigation.navigate("Login");
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/profile`);
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      // Use the first object if the API returns an array
      setProfile(data[0] || null);
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  if (!getProfile) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <Image
        style={styles.profileImage}
        source={{
          uri: "https://media.istockphoto.com/id/1290233518/photo/ginger-cat-portrait.jpg?s=1024x1024&w=is&k=20&c=NnYxt2tf_enXHQF-KPJ-ryAzWm7yfmP13mmriJYNGO0=",
        }}
      />

      {/* User Info */}

      <Text style={styles.nameText}>{getProfile.name}</Text>
      <Text style={styles.usernameText}>{getProfile.email}</Text>
      <Text style={styles.roleText}>{getProfile.role}</Text>

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.editProfileButton}>
        <Text style={styles.editProfileButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Menu List */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={24} color="black" />
          <Text style={styles.menuItemText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <MaterialIcons name="assignment-ind" size={24} color="black" />
          <Text style={styles.menuItemText}>Responsibility</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="location-outline" size={24} color="black" />
          <Text style={styles.menuItemText}>Address</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="lock-closed-outline" size={24} color="black" />
          <Text style={styles.menuItemText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={24} color="black" />
          <Text style={styles.menuItemText}>Support & Help</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="exit-outline" size={24} color="black" />
          <Text style={styles.menuItemText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 50,
    marginBottom: 20,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  usernameText: {
    fontSize: 16,
    color: "#777",
    marginBottom: 5,
  },
  roleText: {
    fontSize: 18,
    color: "#777",
    marginBottom: 30,
  },
  editProfileButton: {
    backgroundColor: "#5A81F7",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 30,
  },
  editProfileButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  menuContainer: {
    width: "100%",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default AboutScreen;
