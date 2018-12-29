# Blockchain-notary-service

One of the most important features of a blockchain is that ensures data security is the ability for a transaction
on the blockchain to be signed and validated. Given the distributed nature of blockchain, signing and
validation are vital to securing information.

Data stored on a blockchain can vary from digital assets (e.g. documents, media) to copyrights and patent
ownership. These pieces of data need to be reliably secured, and require a way to prove they exist—this is
where signing and validation are key.

## About the Project

A blockchain notary service API can be used to secure digital assets. The project will focus on how to encrypt and decrypt the target data (into a digest) and how to publicly prove who rightfully owns it. You will also configure your notary web service using a RESTful web client to post new blocks to the blockchain. Along the way, you will also explore how to handle the limitations of block size when handling digital data.

In this project, you will build a Star Registry Service that allows users to claim ownership of their favorite star in the night sky.

## What will you need to do?

### Create a Blockchain dataset that allow you to store a Star
- The application will persist the data (using LevelDB).
- The application will allow users to identify the Star data with the owner.

### Create a Mempool component
- The mempool component will store temporal validation requests for 5 minutes (300 seconds).
- The mempool component will store temporal valid requests for 30 minutes (1800 seconds).
- The mempool component will manage the validation time window.

### Create a REST API that allows users to interact with the application.
- The API will allow users to submit a validation request.
- The API will allow users to validate the request.
- The API will be able to encode and decode the star data.
- The API will allow be able to submit the Star data.
- The API will allow lookup of Stars by hash, wallet address, and height.

## Build your Project

Understand the rubrics![https://review.udacity.com/#!/rubrics/2098/view]

### Project Setup

Use the Private Blockchain application that you built and use in Project 2 and Project 3.

## Install Dependencies

Set up a Node.js Project with the following dependencies:

```
"dependencies": {
   "bitcoinjs-lib": "^4.0.2",
   "bitcoinjs-message": "^2.0.0",
   "body-parser": "^1.18.3",
   "crypto-js": "^3.1.9-1",
   "express": "^4.16.4",
   "hex2ascii": "0.0.3",
   "level": "^4.0.0",
 }
```

## Star Coordinates

Before building this service you'll need to understand a few details about how star data is represented. Understanding this will impact how you store and retrieve data on your private blockchain.

Here is an example of how star coordinates are represented:

```
RA 13h 03m 33.35sec, Dec -49° 31’ 38.1” Mag 4.83 Cen
```

These coordinates are similar to latitude and longitude but instead relate to coordinates in the sky.

### Resources for Discovering Stars

I have used the Google Sky[https://www.google.com/sky/] for locating stars.

Sequential diagram

## Blockchain ID validation routine

1. User submits a validation request - POST Endpoint

Use the URL for the endpoint: http://localhost:8000/requestValidation

**Request** 

{ address : 1JY9vD6nD4K42XGQTkmTd7FEkdWmLD1o8Q }

**_Response_**

```
{
    "walletAddress": "1JY9vD6nD4K42XGQTkmTd7FEkdWmLD1o8Q",
    "requestTimeStamp": "1546070725",
    "message": "1JY9vD6nD4K42XGQTkmTd7FEkdWmLD1o8Q:1546070725:starRegistry",
    "validationWindow": 300
}
```
![Request Validation](https://github.com/gowrieswaran/blockchain-notary-service/blob/master/screenshots/requestValidation.PNG)

2. User will send a request with signature - POST Endpoint

Get the **Message** returned in the previous step and use your electrum wallet to sign that message.

![Sign using Electrum wallet](https://github.com/gowrieswaran/blockchain-notary-service/blob/master/screenshots/sign-msg.PNG)

Use the URL for the endpoint: http://localhost:8000/message-signature/validate

**Request**
```
{
address :1JY9vD6nD4K42XGQTkmTd7FEkdWmLD1o8Q
signature: H2PgPVp+MxMUrcJhFHm+N5QX96WhiCfRpfVCg8X4wsvmUezMxC+rZgmk7oYXXoVpD5RCi1ig6IHu7hAGrHRUF1E=
}
```
**_Response_**

```
{
    "registerStar": true,
    "status": {
        "address": "1JY9vD6nD4K42XGQTkmTd7FEkdWmLD1o8Q",
        "requestTimeStamp": "1546070725",
        "message": "1JY9vD6nD4K42XGQTkmTd7FEkdWmLD1o8Q:1546070725:starRegistry",
        "validationWindow": 244,
        "messageSignature": true
    }
}
```
![Validate Sign](https://github.com/gowrieswaran/blockchain-notary-service/blob/master/screenshots/sign-validate.PNG)

3. Star registration Endpoint

Web API POST endpoint with JSON response that submits the Star information to be saved in the Blockchain.

Use the Url for the endpoint:http://localhost:8000/block

**Request**

```
{
"address": "1JY9vD6nD4K42XGQTkmTd7FEkdWmLD1o8Q",
    "star": {
            "dec": "70° 11' 57.0",
            "ra": "8h 39m 35.0s",
            "story": "Found star using https://www.google.com/sky/"
        }
}
```

**_Response_**

```
{
    "hash": "d47dfb6019c67bbc41b5288db952f8768b1a60422cfc41ed8b8ebb480b3e0752",
    "height": 8,
    "body": {
        "address": "1JY9vD6nD4K42XGQTkmTd7FEkdWmLD1o8Q",
        "star": {
            "dec": "70° 11' 57.0",
            "ra": "8h 39m 35.0s",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storydecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "time": "1546070798",
    "previousBlockHash": "0c549e3dd3f262785a014d8ced9318db40b5252f7c5635b1b3ff0699bf676851"
}
```
![Register star data](https://github.com/gowrieswaran/blockchain-notary-service/blob/master/screenshots/add-star-to-db.PNG)

## Star Lookup

1. Get Star block by hash with JSON response.

Use the URL: http://localhost:8000/stars/hash:[HASH]

**Request**

http://localhost:8000/stars/hash:21968303558f10c3f35bd4e4af769723c74f2ec4f4bcb6320435b5dd4c36c691

**_Response_**

```
{
    "hash": "21968303558f10c3f35bd4e4af769723c74f2ec4f4bcb6320435b5dd4c36c691",
    "height": 4,
    "body": {
        "address": "1JY9vD6nD4K42XGQTkmTd7FEkdWmLD1o8Q",
        "star": {
            "dec": "-26° 29' 24.9",
            "ra": "16h 29m 1.0s",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storydecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "time": "1545994505",
    "previousBlockHash": "31c8d12e6f94a410ea5a101e041b70bfe119f88b1c73fb368149e93d33f33949"
}

```
![Star lookup by hash](https://github.com/gowrieswaran/blockchain-notary-service/blob/master/screenshots/get-star-by-hash.PNG)

2.Get Star block by wallet address (blockchain identity) with JSON response.

Use the URL:http://localhost:8000/stars/address:[ADDRESS]

**Request**

http://localhost:8000/stars/address:1JY9vD6nD4K42XGQTkmTd7FEkdWmLD1o8Q

**_Response_**

```
{
        "hash": "31c8d12e6f94a410ea5a101e041b70bfe119f88b1c73fb368149e93d33f33949",
        "height": 3,
        "body": {
            "address": "1JY9vD6nD4K42XGQTkmTd7FEkdWmLD1o8Q",
            "star": {
                "dec": "69° 27' 37.6",
                "ra": "13h 29m 2.0s",
                "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
                "storydecoded": "Found star using https://www.google.com/sky/"
            }
        },
        "time": "1545993753",
        "previousBlockHash": "820e54e137248d9c03d8c5dd4c750831b21dd0b2d741ef15613027450fe3c7d4"
    },
    {
        "hash": "21968303558f10c3f35bd4e4af769723c74f2ec4f4bcb6320435b5dd4c36c691",
        "height": 4,
        "body": {
            "address": "1JY9vD6nD4K42XGQTkmTd7FEkdWmLD1o8Q",
            "star": {
                "dec": "-26° 29' 24.9",
                "ra": "16h 29m 1.0s",
                "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
                "storydecoded": "Found star using https://www.google.com/sky/"
            }
        },
        "time": "1545994505",
        "previousBlockHash": "31c8d12e6f94a410ea5a101e041b70bfe119f88b1c73fb368149e93d33f33949"
    }
```
![Star lookup by address](https://github.com/gowrieswaran/blockchain-notary-service/blob/master/screenshots/get-star-by-address.PNG)

3.Get star block by star block height with JSON response.

Use the URL:http://localhost:8000/block/[HEIGHT]

**Request**

http://localhost:8000/block/3

**_Response_**

```
{
    "hash": "31c8d12e6f94a410ea5a101e041b70bfe119f88b1c73fb368149e93d33f33949",
    "height": 3,
    "body": {
        "address": "1JY9vD6nD4K42XGQTkmTd7FEkdWmLD1o8Q",
        "star": {
            "dec": "69° 27' 37.6",
            "ra": "13h 29m 2.0s",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storydecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "time": "1545993753",
    "previousBlockHash": "820e54e137248d9c03d8c5dd4c750831b21dd0b2d741ef15613027450fe3c7d4"
}
```
![Star lookup by block height](https://github.com/gowrieswaran/blockchain-notary-service/blob/master/screenshots/get-star-by-height.PNG)

