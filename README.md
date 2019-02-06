# Status-Bot

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/b60512c7a77f4f6caae8640a73932302)](https://www.codacy.com/app/Thedude7054/status-discord-bot?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Thedude7054/status-discord-bot&amp;utm_campaign=Badge_Grade)

## Requirements

- Docker
- node.js if planning on developing this image

## Installation

Literally pull the repository.
> For a guide on installing docker, please refer the [official documentation](https://docs.docker.com/docker-for-windows/install/)

## Configuration

This is run with Docker, using environment variables. *All environment variables are required*
The enviornment variables consist of;
* ```CHECK_NAME``` - What you want the bot to say it's taking the status of.
* ```PING_URL``` - The URL you'd like to check the status of. Make sure you include the protocal you intend to use, in the URL.
* ```BOT_TOKEN``` - The token of the Discord bot you intend to run

> You can find these in the included example.env file

## Running

To run this in detached mode, using the environment variables in the .env file: 
> Before running this, please make sure your environment variables have been propperly entered.
```bash
docker run -d status-bot --env-file .env --name status-bot
```
Let's break this down, for those that aren't familiar with Docker. The ```-d``` flag runs the image in detached mode. ```--env-file``` pulls environment variables from the file specified, in this case the file we're pulling from is ```.env```. It is important to note, you can have as many .env files you'd like, and rename them to whatever you'd like for different configurations. ```name``` specifies a name for the image we're about to run, to make it easier to control later; This is removes a lot of headache later when running in detached mode.

It is important to note, that because we can have multiple .env files to specify different configurations, we can run multiple instances of this image on one machine, without conflict.