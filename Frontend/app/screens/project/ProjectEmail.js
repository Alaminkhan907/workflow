import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";

const ProjectEmail = () => {
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    text: "",
    html: "",
  });

  const sendEmail = async () => {
    try {
      const response = await fetch("http://localhost:3000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Email sent successfully!");
      } else {
        Alert.alert("Error", result.error || "Failed to send email.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      Alert.alert("Error", "Failed to send email. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Recipient Email"
        value={emailData.to}
        onChangeText={(text) => setEmailData((prev) => ({ ...prev, to: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Subject"
        value={emailData.subject}
        onChangeText={(text) =>
          setEmailData((prev) => ({ ...prev, subject: text }))
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Text Content"
        value={emailData.text}
        onChangeText={(text) => setEmailData((prev) => ({ ...prev, text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="HTML Content"
        value={emailData.html}
        onChangeText={(text) => setEmailData((prev) => ({ ...prev, html: text }))}
      />
      <Button title="Send Email" onPress={sendEmail} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});

export default ProjectEmail;
