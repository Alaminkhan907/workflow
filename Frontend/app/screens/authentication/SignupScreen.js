import React, { useState } from "react";
import { API_URL } from '@env';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

console.log("API_URL:", API_URL);

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password || !role) {
      Alert.alert("Error", "Please fill out all the fields");
      return;
    }
    const signupData = {
      name,
      email,
      password,
      role,
    };

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert("Success", `Registered as ${data.role}`);
        navigation.replace("Login");
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to sign up");
      }
    } catch (error) {
      console.error("Network error:", error);
      Alert.alert("Error", "Failed to connect to the server.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up for Workflow</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Select Role</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          style={styles.picker}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          <Picker.Item label="Select role" value="" />
          <Picker.Item label="Manager" value="manager" />
          <Picker.Item label="Worker" value="worker" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => navigation.replace("Login")}
      >
        <Text style={styles.loginLinkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#01CBC6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2B2B52",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  label: {
    width: "100%",
    textAlign: "left",
    marginBottom: 5,
    fontSize: 16,
    color: "#2B2B52",
  },
  pickerContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  picker: {
    width: "100%",
    height: 50,
  },
  button: {
    backgroundColor: "#0A79DF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    width: "50%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FF3031",
    fontWeight: "bold",
    textAlign: "center",
  },
  loginLink: {
    marginTop: 20,
  },
  loginLinkText: {
    color: "#FF3031",
    fontWeight: "bold",
  },
});

export default SignupScreen;
