import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const AboutScreen = ({ navigation }) => {
  const handleLogout = () => {
    // Add your logout logic here
    navigation.navigate("Login"); // Navigate to login screen
  };

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
      <Text style={styles.nameText}>Jan</Text>
      <Text style={styles.usernameText}>@Jantheboss</Text>
      <Text style={styles.roleText}>Project Manager</Text>

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
