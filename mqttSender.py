# below is to enable pi to send image data to the MQTT broker

from PIL import Image
import numpy as np
from Adafruit_Thermal import *
from signal import pause
from time import sleep
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
user_id = 'A'
mqtt_data = {}
# all_user_ids = ['john', 'ziyi', 'lingke']
# The callback for when the client receives a CONNACK response from the server.


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT Broker!")
    else:
        print("Failed to connect, return code %d\n", rc)

  # Subscribing in on_connect() means that if we lose the connection and
  # reconnect then subscriptions will be renewed.


# publish to MQTT broker

async def ws_on_message(websocket):
    while True:
        message = await websocket.recv()
        # print(message)  # websocket json: {"receiver_id": "john"}
        # with open("/Users/phyllisfei/Desktop/img0.png", "rb") as file:
        with open(r"/home/pi/Desktop/i5/Working/Pictures/sent.jpg", "rb") as file:
            encoded = base64.b64encode(file.read())

        global mqtt_data
        ws_data = json.loads(message)
        mqtt_data = {
            "sender_id": user_id,
            "receiver_id": ws_data["receiver_id"],
            "image": encoded.decode()
        }
        msg = json.dumps(mqtt_data)
        mqtt_client.subscribe(topic)
        mqtt_client.publish(topic, msg)
        # print(ws_data)
        # print(mqtt_data)
        # print('published: ' + msg)


# below is to enable pi to send image data to the MQTT broker

# The callback for when a PUBLISH message is received from the server.
def mqtt_on_message(ws_client, mqtt_client, userdata, msg):
    # websocket json to string:
    global mqtt_data
    print(mqtt_data['sender_id'])
    mqtt_data = json.loads(msg.payload)
    # if receivedpayload.id == user
    if mqtt_data["sender_id"] == user_id:
        # I am the sender
        print('dont print')
        # return
    elif mqtt_data["receiver_id"] == user_id:
        # I am the receiver
        print('print now')
        # ws_client.send(str(msg.payload))
        # print_receipt(mqtt_data["image"])
        # print(mqtt_data["image"])
        with open(r"/home/pi/Desktop/i5/Working/Pictures/received.jpg", "wb") as file:
            # with open("/Users/phyllisfei/Desktop/received.jpg", "wb") as file:
            file.write(base64.b64decode(mqtt_data["image"]))
            file.close()
            print_receipt()

    else:
        # I am a 3rd person
        # ws_client.send(str(msg.payload))
        pass


# import the necessary packages


async def print_receipt():
    # by john
    # pass
    printer = Adafruit_Thermal("/dev/serial0", 19200, timeout=5)

    received = Image.open(r"/home/pi/Desktop/i5/Working/Pictures/received.jpg")
    #printer.printImage(myImage.width, myImage.height, myImage)
    printer.printImage(received, LaaT=False)
    printer.feed(10)


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
