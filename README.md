# BetaBuddies

BetaBuddies (攀岩石樂樂) 
A platform designed for bouldering enthusiasts to exchange insights on bouldering problems.
* [[Click to see Website](https://deercodeweb.com/)]
* [[Click to see Demo](https://youtu.be/p6bnUINLLmQ)]

## Tech Stack 
* Server: Javascript, Node.js, Express
* Database: MySQL, MongoDB, Elasticsearch
* Cloud Service: AWS CDK, Lambda, RDS, ElastiCache, S3, CloudFront
* Others: RESTful API, Socket.IO, NGINX
  
## Server Structure
* Created a stateless server architecture using AWS services, including RDS to manage data, ElastiCache for faster data access, CloudFront for quicker content delivery, and S3 for storing images and videos.

![架構圖](https://github.com/Deercoding/PersonalProjectBetaBuddies/assets/106392618/967ba116-6377-4f28-8c42-eab73d800aad)

## Entity Relationship Diagram 
*  Developed RESTful API with CRUD operation on MySQL and MongoDB to enable gym owners to initiate competition and create advertisements.

![er model betabuddies drawio](https://github.com/Deercoding/PersonalProjectBetaBuddies/assets/106392618/134c52fb-8e84-4ca8-9137-d3a88e0253d0)


## Features

1. :pencil2: **Gym owners can use color detection tool to quikly build chat rooms.**
   * Implemented AWS Lambda functions for serverless processes on color detection for bouldering routes.
   * Integrated Redis to reduce server load by optimizing storage of advertisement Images and by saving hashed image strings along with their corresponding color detection results.

https://github.com/Deercoding/PersonalProjectBetaBuddies/assets/106392618/fb671188-7594-42ae-bcb4-b7b05a38ac71

2. :iphone: User can discuss in real-time chat room, watch videos, and participate competitions.
    *  Incorporated Socket.IO to improve user engagement in real-time chatrooms.
    *   Leveraged Elasticsearch to improve search efficiency by using autocomplete feature and IK analyzer.

https://github.com/Deercoding/PersonalProjectBetaBuddies/assets/106392618/226f3908-c8d4-40b6-b70a-b5ded2ea59b5

3. :trophy: Gym owners can initiate competition and create advertisements.
   *   Executed SQL locking mechanisms to prevent race conditions, guaranteeing the integrity and reliability of booking processes and competition results.

https://github.com/Deercoding/PersonalProjectBetaBuddies/assets/106392618/7a0ee867-4c9a-4312-92b5-a220bbd8acec
