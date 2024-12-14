import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView ,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "@env";
import { Ionicons } from "@expo/vector-icons";

const EditProfile = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');

  const fetchProfile = async () => {
    try {
      const usernameFromStorage = await AsyncStorage.getItem("username");
      if (!usernameFromStorage) {
        console.error('No username found');
        return;
      }
      setUsername(usernameFromStorage);
      const response = await fetch(`${API_URL}/profile/${usernameFromStorage}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      console.log(data)
      setName(data.name);
      setAddress(data.address);
      setDob(data.dob);
      setPhone(data.phone);
    } catch (error) {
      setError(error.message);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/profile/${username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          password,
          address,
          dob,
          phone,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      navigation.replace("AboutHome");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}> 
      <TouchableOpacity
        onPress={() => navigation.replace("AboutHome")}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Edit Profile</Text>
     
      <View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Name"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Address"
        />
        <TextInput
          style={styles.input}
          value={dob}
          onChangeText={setDob}
          placeholder="Date of Birth"
        />
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone"
        />
        <Button title="Save Changes" onPress={updateProfile} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default EditProfile;
