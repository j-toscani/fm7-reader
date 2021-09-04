# fm7-reader
A UDP-Streamreader written in NodeJS for Forza Motorsport 7

## Introduction

This package creates a server to read Data from `Data-Out` - UDP-Stream from Forza Motorsport 7. It is documented here: https://forums.forzamotorsport.net/turn10_postst128499_Forza-Motorsport-7--Data-Out--feature-details.aspx?=. This Server needs to run on a seperate device.

It takes inspiration from the folowing Project: https://forums.forzamotorsport.net/turn10_postst128499_Forza-Motorsport-7--Data-Out--feature-details.aspx?=

## Set Up
This Set-Up is meant to be executed on a Machine seperate from that that runs Forza.

Install the folowing software:
- Node verion 12+
- npm 7+
- git

Clone the repo to your local machine:
```
git clone git@github.com:j-toscani/fm7-reader.git
```

Install Dependencies:
```
npm install
```

Build and Start the server
```
npm run build
npm start
```

## Using the server

The server is preconfigured to run on Port `33333`. As of right now it can not run on the same machine Forza runs on. Find the IP-Adress of the machine this server runs on. THen follow the steps below.

- Open Forza Motorsport 7
- Go to Options -> HUD

Here, set the folowing Options:

- Data Out -> ON
- Data Out IP Adress -> The IP-Adress your server runs on
- Data Out IP Port -> Port the server runs on (`33333` on default) 

## Status

The Data stream gets outputted to the console but is unreadable