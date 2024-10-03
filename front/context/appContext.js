import React, { createContext } from 'react';
import io from 'socket.io-client';

const socket = io('http://10.1.32.237:5001'); // Replace with your server URL

const AppContext = createContext();

export { AppContext, socket };
