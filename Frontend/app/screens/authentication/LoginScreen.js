import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const credentials = {
    manager: {
      email: "manager",
      password: "manager",
      role: "manager",
    },
    worker: {
      email: "worker",
      password: "worker",
      role: "worker",
    },
  };

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "manager , manager");
      return;
    }
    if (
      email === credentials.manager.email &&
      password === credentials.manager.password
    ) {
      // Alert.alert("Success", "Logged in as Manager");
      navigation.replace("UserTabs", { role: credentials.manager.role });
    } else if (
      email === credentials.worker.email &&
      password === credentials.worker.password
    ) {
      // Alert.alert("Success", "Logged in as Worker");
      navigation.replace("UserTabs", { role: credentials.worker.role });
    } else {
      Alert.alert("Error", "Invalid email or password");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Workflow</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={() => navigation.replace("ForgotPassword")}>
        <Text style={styles.loginLinkText}>Forgot Password ?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text>or</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace("Signup")}
      >
        <Text style={styles.buttonText}>Sign up</Text>
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
});

export default LoginScreen;
