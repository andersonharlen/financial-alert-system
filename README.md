# 📈 Financial Alert System & Investment Ecosystem

[![.NET 8](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB?logo=react)](https://reactnative.dev/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-MassTransit-FF6600?logo=rabbitmq)](https://www.rabbitmq.com/)
[![Evolution API](https://img.shields.io/badge/Integration-Evolution_API-25D366?logo=whatsapp)](https://evolution-api.com/)

[English](#-english) | [Português](#-português)

---

## 🇺🇸 English

### 📌 Overview
An **Event-Driven Architecture (EDA)** demonstration built to handle high-throughput financial alert processing and investment simulations. The system decouples API request ingestion from message delivery using **RabbitMQ** and **MassTransit**, ensuring near-zero latency for the mobile client while asynchronously triggering WhatsApp notifications via **Evolution API**.

### 🏗 Architecture & Flow
```mermaid
graph TD
    A[React Native App] -->|POST /alerts| B[Financial.Api .NET 8]
    B -->|Publish PriceAlertCreatedEvent| C[(RabbitMQ Broker)]
    C -->|Consume Message| D[Notification.Worker .NET 8]
    D -->|HTTP POST /message/sendText| E[Evolution API]
    E -->|Send Notification| F[WhatsApp Client]
