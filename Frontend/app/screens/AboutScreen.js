import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";

const AboutScreen = ({ navigation }) => {
  const handleLogout = () => {
    // Add your logout logic here (e.g., clear user data, navigate to login screen)
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
      <View style={styles.infoContainer}>
        <Text style={styles.nameText}>Jan Khan</Text>
        <Text style={styles.roleText}>Manager</Text>
        <Text style={styles.emailText}>john.khan@google.com</Text>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          Jan has been with the company for 500 years, overseeing operations and
          managing a team of talented individuals. Passionate about technology
          and leadership, John ensures smooth project delivery.
        </Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAEDED",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  roleText: {
    fontSize: 18,
    color: "#777",
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    color: "#555",
  },
  descriptionContainer: {
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#D9534F",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AboutScreen;
