# Fitness App Microservices

## Overview
Fitness App is a microservices-based application designed to manage user fitness profiles and provide personalized activity recommendations. It leverages modern technologies to deliver a seamless and scalable experience.

## Features
- **Microservices Architecture**: Built with Spring Boot for backend services.
- **Frontend**: Developed using React with Keycloak for authentication and authorization.
- **Queueing**: RabbitMQ is used for message queueing between services.
- **AI Integration**: Activity recommendations are generated using Gemini AI.
- **Databases**:
    - PostgreSQL for user data.
    - MongoDB for activity and recommendation data.

## Technologies Used
- **Backend**: Spring Boot, RabbitMQ, Keycloak
- **Frontend**: React
- **Databases**: PostgreSQL, MongoDB
- **AI**: Gemini AI

## Project Structure
- **User Service**: Manages user profiles and authentication.
- **AI Service**: Handles activity recommendations using Gemini AI.
- **Frontend**: React-based user interface with Keycloak integration.

## How It Works
1. Users register and log in via the React frontend with Keycloak for authentication.
2. User data is stored in PostgreSQL.
3. Activities and recommendations are processed and stored in MongoDB.
4. RabbitMQ facilitates communication between services, such as sending activity data to the AI service.
5. The AI service generates personalized recommendations using Gemini AI.

## Prerequisites
- **Eureka Service**: Java 17
- **Gateway Service**: Java 21
- **User Service**: Java 21
- **Activity Service**: Java 21
- **AI Service**: Java 21
- **Config Server**: Java 21
- Node.js and npm
- PostgreSQL
- MongoDB
- RabbitMQ
- Keycloak

## Setup
1. Clone the repository.
2. Configure the databases and RabbitMQ in the `application.yml` files for each service.
3. Start the backend services using Maven.
4. Start the frontend using npm.
5. Access the application via the frontend URL.
