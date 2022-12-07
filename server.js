let broker = 'b34d25a1f44a4d4eb2b7b0157d810da7.s2.eu.hivemq.cloud';
let broker_port = '8883';
let websocket_path = '8884';
let clientId = 'mqttjs_';// + parseInt(Math.random() * 100);
let topic = 'phyllis_subs';
let username = 'zpfei';
let password = 'phyFei_2022';

const socket = new WebSocket('ws://127.0.0.1:38001/ws')

// socket.onopen = onConnected;
socket.onmessage = onMessageArrived;
socket.onerror = onConnectionLost;

// called when the client connects
function onConnected() {
    // Once a connection has been made, make a subscription and send a message.
    socket.send(JSON.stringify({ receiver_id: 'phyllis' })); //ziyi
}

// called when a message arrives
function onMessageArrived(message) {
    let msg = JSON.parse(message);
    console.log("onMessageArrived: " + message);

    //if btn is clicked — send
    // client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost: " + responseObject.errorMessage);
    }
}

// let client = new Paho.MQTT.Client(broker, Number(8884), clientId);

// // set callback handlers
// client.onConnectionLost = onConnectionLost;
// client.onMessageArrived = onMessageArrived;

// // connect the client
// client.connect({
//     onSuccess: onConnected,
//     useSSL: true,
//     userName: 'zpfei',
//     password: 'phyFei_2022'
// });

// let express = require('express');
// let socket = require('socket.io');

//Setup options for the MQTT connection
// let options = {
//     broker_port: 8883,
//     clientId: 'mqttjs_' + parseInt(Math.random() * 100),
//     topic: 'phyllis_subs',
//     username: "zpfei",
//     password: 'phyFei_2022'
// };

// //Store the express functions to the app
// let app = express();
// //Create a server on localhost:3000
// let server = app.listen(process.env.PORT || 3000);
// app.use(express.static('public')); //Server page as static
// console.log("Node is running on port 3000...");

// //Assign the server to the socket
// let io = socket(server);

// io.set('transports', ['websocket',
//     'flashsocket',
//     'htmlfile',
//     'xhr-polling',
//     'jsonp-polling',
//     'polling']);

// //MQTT Message
// client.on('connect', function (connack) { // When connected
//     console.log('connected:' + clientId);
//     //Subscribe to a topic
//     client.subscribe(topic, function () {
//         //When a message arrives, print it to the console
//         client.on('message', function (topic, payload, packet) {
//             if (error) {
//                 console.log(error);
//             } else {
//                 console.log('Published')
//             }
//             //Get the message (as buffer), and convert it to a String,
//             //and following that to an integer number (if needed)
//             let getMessage = new Paho.MQTT.Message(JSON.parse(message.toString()));
//             console.log("Message: " + getMessage);

//             //Use the sockets to send the message with a name and value
//             // io.sockets.emit('ServerToClient', getMessage);

//             console.log("Received '" + message + "' on '" + topic + "'");
//             //Publish to the topic
//             client.send(message);
//         });
//     });
// });
