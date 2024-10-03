import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { AppContext } from '../context/appContext';

function MessageForm() {
  const user = useSelector((state) => state.user);
  const scrollViewRef = useRef(null);
  const [message, setMessage] = useState("");
  const { socket, currentRoom, messages, setMessages, privateMemberMsg } = useContext(AppContext);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }

  function getFormattedDate() {
    const date = new Date();
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${month}/${day}/${year}`;
  }

  const todayDate = getFormattedDate();

  useEffect(() => {
    socket.off("room-messages").on("room-messages", (roomMessages) => {
      setMessages(roomMessages);
    });
  }, [socket, setMessages]);

  function handleSubmit() {
    if (!message) {
      return;
    }
    const today = new Date();
    const minutes = today.getMinutes().toString().padStart(2, '0');
    const time = `${today.getHours()}:${minutes}`;
    const roomId = currentRoom;
    socket.emit('message-room', roomId, message, user, time, todayDate);
    setMessage("");
  }

  return (
    <>
      <ScrollView style={styles.messagesOutput} ref={scrollViewRef} onContentSizeChange={scrollToBottom}>
        {user && !privateMemberMsg?._id && (
          <View style={styles.alert}>
            <Text style={styles.alertText}>You are in {currentRoom}</Text>
          </View>
        )}
        {user && privateMemberMsg?._id && (
          <View style={styles.conversationalInfo}>
            <Text style={styles.alertText}>Your conversation with {privateMemberMsg.name}</Text>
            <Image source={{ uri: privateMemberMsg.picture }} style={styles.converPic} />
          </View>
        )}
        {!user && (
          <View style={styles.alertDanger}>
            <Text style={styles.alertText}>Please login to your account</Text>
          </View>
        )}
        {user && messages.map(({ _id: date, messagesByDate }, idx) => (
          <View key={idx}>
            <Text style={styles.messageDateIndicator}>{date}</Text>
            {messagesByDate?.map(({ content, time, from: sender }, msgidx) => (
              <View style={sender?.email === user?.email ? styles.message : styles.incomingMessage} key={msgidx}>
                <View style={styles.messageInner}>
                  <View style={styles.messageHeader}>
                    <Image source={{ uri: sender.picture }} style={styles.senderPic} />
                    <Text style={styles.messageSender}>{sender._id === user?._id ? "You" : sender.name}</Text>
                  </View>
                  <Text style={styles.messageContent}>{content}</Text>
                  <Text style={styles.messageTimestamp}>{time}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Your Message"
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <Button title="Send" onPress={handleSubmit} color="#ff9900" disabled={!user} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  messagesOutput: {
    flex: 1,
    padding: 5,
    backgroundColor: 'black', 
    color:'white'// Light grey background for message list
  },
  alert: {
    backgroundColor: 'red', // Light blue alert
    padding: 10,
    // borderRadius: 5,
    
    marginBottom: 10,
  },
  conversationalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white', // Same light blue for conversation info
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    
  },
  converPic: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginLeft: 10,
    
  },
  alertDanger: {
    backgroundColor: '#f8d7da', // Light red alert for danger
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  alertText: {
    // color: 'white',
    fontWeight:'700',// Dark green alert text
    color:'black',
  },
  messageDateIndicator: {
    textAlign: 'center',
    backgroundColor: 'orangered', // Light grey date indicator
    color: 'white', // Grey text
    padding: 5,
    fontWeight:'700',
    borderRadius: 5,
    marginBottom: 10,
  },
  message: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6', // Light green for outgoing messages
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    maxWidth: '80%',
  },
  incomingMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff', // White for incoming messages
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    maxWidth: '80%',
  },
  messageInner: {
    flexDirection: 'column',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  senderPic: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 10,
  },
  messageSender: {
    fontWeight: 'bold',
    color: '#007bff', 
  },
  messageContent: {
    color: 'white', // Dark grey for message text
    marginBottom: 5,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10, // Increased padding for better spacing
    borderColor: 'grey', // Border color to match other elements
    backgroundColor: 'black', // Light background for the message content
    fontWeight:'500'
  },
  messageTimestamp: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: 'red', // Grey for timestamp
  },
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'grey',
     // Very light grey for form background
     
  },
  input: {
    flex: 1,
    borderWidth: 3,
    borderColor: '#ced4da', // Light grey border for input
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    color: 'white',
    backgroundColor:'black' // Dark grey for input text
  },
});

export default MessageForm;
