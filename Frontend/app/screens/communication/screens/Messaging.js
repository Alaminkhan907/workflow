import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, TextInput, Text, FlatList, Pressable } from "react-native";
import socket from "../utils/socket";
import MessageComponent from "../component/MessageComponent";
import { styles } from "../utils/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Messaging = ({ route, navigation }) => {
  const [user, setUser] = useState("");
  const { name, id } = route.params;
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");

  const getUsername = async () => {
    try {
      const value = await AsyncStorage.getItem("username");
      if (value !== null) {
        setUser(value);
      }
    } catch (e) {
      console.error("Error while loading username!");
    }
  };

  const handleNewMessage = () => {
    const hour = new Date().getHours().toString().padStart(2, "0");
    const mins = new Date().getMinutes().toString().padStart(2, "0");

    if (user) {
      socket.emit("newMessage", {
        message,
        room_id: id,
        user,
        timestamp: { hour, mins },
      });
      setMessage("");
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({ title: name });
    getUsername();
    socket.emit("findRoom", id);
    socket.on("foundRoom", (roomChats) => setChatMessages(roomChats));
  }, []);

  useEffect(() => {
    socket.on("foundRoom", (roomChats) => setChatMessages(roomChats));
  }, [socket]);

  return (
    <View style={styles.messagingscreen}>
      <View
        style={[
          styles.messagingscreen,
          { paddingVertical: 15, paddingHorizontal: 10 },
        ]}
      >
        {chatMessages[0] ? (
        <FlatList
        data={chatMessages}
        renderItem={({ item }) => <MessageComponent item={item} user={user} />}
        keyExtractor={(item, index) => item.id || index.toString()}
      />
        ) : (
          <Text>No messages yet</Text>
        )}
      </View>

      <View style={styles.messaginginputContainer}>
        <TextInput
          style={styles.messaginginput}
          placeholder="Type a message"
          value={message}
          onChangeText={(value) => setMessage(value)}
        />
        <Pressable
          style={styles.messagingbuttonContainer}
          onPress={handleNewMessage}
        >
          <Text style={{ color: "#f2f0f1", fontSize: 20 }}>SEND</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Messaging;
