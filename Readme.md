# ipm package: IoT-MQTT-Cloud-Server

## Overview
IoT Cloud Server based on ClearBlade IoT Platform. 
This server uses MQTT Protocol to communicate with IoT devices.
Uses code services hosted on ClearBlade IoT Platform. 

## Code Services

1. myService1: receives a batch of CPU Process Information (memory usage and timestamp). 
      This service is triggered by a MQTT publish to a topic to the server. 
      The service processes the MQTT message and adds each CPU Process from the batch to a row in the Collection. 
      The service then signals a analytics code service to start analyzing by publishing message to a shared topic.

2. myService2: after receiving signal from myService1, this service queries the collection by batch number. 
      Retrieves a batch of CPU Process Information, and publishes analytics. 
      Analytics contain 5 processes that has the most memory usage in a given batch of processes. 
      This service then publishes to 'analytics' topic. 
      Process Information it publishes are PID, Process Name, Timestamp and Memory Usage. 

## Setup
A client can connect to this server using an API with a key.
Client side setup with key can be obtained [here](https://github.com/sulo1337/IoT-MQTT-device-client)

## Definitions
batch - a group(list) of process information taken in a single timestamp
Process Information - PID, Name, Timestamp, Memory Usage of a process.
client - IoT device or user that connects to the server

This is an ipm package, which contains one or more reusable assets within the ipm Community. The 'package.json' in this repo is a ipm spec's package.json, [here](https://docs.clearblade.com/v/3/6-ipm/spec), which is a superset of npm's package.json spec, [here](https://docs.npmjs.com/files/package.json).

[Browse ipm Packages](https://ipm.clearblade.com)
