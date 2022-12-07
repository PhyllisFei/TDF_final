# below is to enable pi to send image data to the MQTT broker

import base64
import asyncio
import websockets
import json
# import MQTT library
from paho.mqtt import client as mqtt
# import paho.mqtt.client as mqtt

# cluster & web client info from hivemq.cloud
broker = 'b34d25a1f44a4d4eb2b7b0157d810da7.s2.eu.hivemq.cloud'
broker_port = 8883
# keepAlive = 43200  # keep the connection alive for 12hrs
topic = 'phyllis_subs'
user_id = 'phyllis'
all_user_ids = ['john', 'ziyi', 'lingke']
# The callback for when the client receives a CONNACK response from the server.


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT Broker!")
    else:
        print("Failed to connect, return code %d\n", rc)

  # Subscribing in on_connect() means that if we lose the connection and
  # reconnect then subscriptions will be renewed.


# publish to MQTT broker


async def ws_on_message(websocket):  # {"receiver_id": "john"}
    while True:
        message = await websocket.recv()
        print(message)
        with open("/Users/phyllisfei/Desktop/img0.png", "rb") as file:
            encoded = base64.b64encode(file.read())

            ws_data = json.loads(message)
            mqtt_data = {
                "sender_id": user_id,
                "receiver_id": ws_data["receiver_id"],
                "image": encoded.decode()
            }
            msg = json.dumps(mqtt_data)
            mqtt_client.subscribe(topic)
            mqtt_client.publish(topic, msg)
            # print('published: ' + msg)


# below is to enable pi to send image data to the MQTT broker

# The callback for when a PUBLISH message is received from the server.
def mqtt_on_message(ws_client, mqtt_client, userdata, msg):
    # print(str(msg.payload))
    # with open("/Users/phyllisfei/Desktop/test.json", "wb") as file:
    #     file.write(msg.payload)
    #     file.close()
    mqtt_data = json.loads(msg.payload)
    if mqtt_data["sender_id"] == user_id:
        # I am the sender
        return
    if mqtt_data["receiver_id"] == user_id:
        # I am the receiver
        ws_client.send(str(msg.payload))
        print_receipt(mqtt_data["image"])
        print(mqtt_data["image"])
        with open("/Users/phyllisfei/Desktop/received_img0.png", "wb") as file:
            file.write(base64.b64decode(mqtt_data["image"]))
            file.close()
    else:
        # I am a 3rd person
        ws_client.send(str(msg.payload))


async def print_receipt():
    # by john
    pass


if __name__ == "__main__":
    # create and set up clients
    ws_client = None
    mqtt_client = mqtt.Client(user_id)
    mqtt_client.username_pw_set('zpfei', 'phyFei_2022')
    mqtt_client.tls_set('isrgrootx1.pem')
    mqtt_client.on_connect = on_connect

    # define how to handle received messages
    mqtt_client.on_message = lambda mqtt_client, userdata, msg: mqtt_on_message(
        ws_client, mqtt_client, userdata, msg)

    mqtt_client.connect(broker, broker_port)
    mqtt_client.loop_start()

    async def main():
        async with websockets.serve(ws_on_message, "", 38001):
            await asyncio.Future()  # run forever

    if __name__ == "__main__":
        asyncio.run(main())
