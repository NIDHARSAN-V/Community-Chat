import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

function HomePage() {
  const [auth, setAuth] = useState(true);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [success, setSuccess] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://10.1.32.237:5001/");
        console.log(res.data.success);

        if (res.data.success) {
          setAuth(true);
          setUserId(res);
          navigation.navigate("Home");
        } else {
          setAuth(false);
          setMessage(res.data.error);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkAuth();
  }, [navigation]);

  return (
    <View style={styles.container}>
      {auth ? (
        <View style={styles.homeContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to Community Chat</Text>
            <TouchableOpacity style={styles.getStartedButton} onPress={() => navigation.navigate('Chat')}>
              <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.main}>
            <Text style={styles.mainText}>We are glad to have you here. Explore our services and offerings.</Text>
          </View>
        </View>
      ) : (
        <View style={styles.notAuthorizedContainer}>
          <Text style={styles.notAuthorizedText}>You Are Not Authorized to the Home Page</Text>
          <Text style={styles.noWayHome}>NO WAY HOME</Text>
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  getStartedButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
  },
  getStartedText: {
    color: 'white',
    fontSize: 16,
  },
  main: {
    alignItems: 'center',
  },
  mainText: {
    fontSize: 16,
    textAlign: 'center',
  },
  notAuthorizedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  notAuthorizedText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noWayHome: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HomePage;
