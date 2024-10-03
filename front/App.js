import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store'; // Adjust the path as necessary
import { AppContext, socket } from './context/appContext'; // Adjust the path as necessary

// Import your pages as components
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Signup from './pages/Signup';

const Stack = createStackNavigator();

function App() {
  // State management
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMsg] = useState({});
  const [newMessages, setNewMessages] = useState({});

  // Provide context and state to your components
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContext.Provider
          value={{
            socket,
            currentRoom,
            setCurrentRoom,
            members,
            setMembers,
            messages,
            setMessages,
            privateMemberMsg,
            setPrivateMsg,
            rooms,
            setRooms,
            newMessages,
            setNewMessages,
          }}
        >
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Signup" component={Signup} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Home" component={HomePage} />
              <Stack.Screen name="Chat" component={Chat} />
            </Stack.Navigator>
          </NavigationContainer>
        </AppContext.Provider>
      </PersistGate>
    </Provider>
  );
}

export default App;
