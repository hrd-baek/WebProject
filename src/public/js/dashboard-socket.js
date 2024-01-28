const socket = new WebSocket('ws://localhost:3000'); // Replace with the correct WebSocket server URL

// Connection opened
socket.addEventListener('open', (event) => {
    console.log('Connected to WebSocket server');
});

// Listen for messages from the server
socket.addEventListener('message', (event) => {
    const receivedData = event.data;
    console.log('Message from server:', receivedData);

    // Handle the received data as needed
    // For example, update the UI or perform other actions based on the data
});

// Listen for any errors that occur.
socket.addEventListener('error', (event) => {
    console.error('WebSocket Error:', event);
});

// Connection closed
socket.addEventListener('close', (event) => {
    console.log('Connection closed:', event);
});