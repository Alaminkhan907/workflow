import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both email and password");
      return;
    }

    const loginData = { email, password };

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      console.log(loginData);
      const data = await response.json();

      if (response.ok) {
        const { role } = data;

        const loginInfo = {
          email,
          role,
          loginTime: Date.now(),
        };
        await AsyncStorage.setItem("loginInfo", JSON.stringify(loginInfo));

        navigation.replace("UserTabs", { role });
      } else {
        Alert.alert("Error", data.message || "Login failed");
      }
    } catch (error) {
      console.error("Network error:", error);
      Alert.alert("Error", "Failed to connect to the server");
    }
  };

  const checkLoginStatus = async () => {
    try {
      const loginInfo = await AsyncStorage.getItem("loginInfo");
      console.log("Login Info:", loginInfo);
      if (loginInfo) {
        const { loginTime, role } = JSON.parse(loginInfo);
        const currentTime = Date.now();

        if (currentTime - loginTime < 3600000) {
          navigation.replace("UserTabs", { role });
        } else {
          await AsyncStorage.removeItem("loginInfo");
        }
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    }
    useEffect(() => {
      checkLoginStatus();
    }, []);

    useFocusEffect(() => {
      React.useCallback(() => {
        checkLoginStatus();
      });
    }, []);
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
