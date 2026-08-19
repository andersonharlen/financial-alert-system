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

    ⚡ Key Features
Event-Driven Architecture: Complete separation between user actions and background notification processing.

B3 Asset Selection: Interface for setting stock price alerts (e.g., PETR4, VALE3).

Investment Simulator: Integrated tool for calculating monthly yield projections.

Resilient Messaging: Background Worker Service configured with automatic retries via MassTransit.

📸 Demonstration
1. Event-Driven WhatsApp Alert Flow

2. Investment Simulator Module

🇧🇷 Português
📌 Visão Geral
Demonstração de uma Arquitetura Orientada a Eventos (EDA) projetada para processamento de alertas financeiros e simulação de investimentos com alta capacidade de escala. O sistema desacopla a recepção das requisições do envio das mensagens utilizando RabbitMQ e MassTransit, garantindo baixíssima latência para o aplicativo mobile enquanto dispara notificações no WhatsApp via Evolution API.

🏗 Arquitetura e Fluxo
Snippet de código
graph TD
    A[React Native App] -->|POST /alerts| B[Financial.Api .NET 8]
    B -->|Publica PriceAlertCreatedEvent| C[(RabbitMQ Broker)]
    C -->|Consome Mensagem| D[Notification.Worker .NET 8]
    D -->|HTTP POST /message/sendText| E[Evolution API]
    E -->|Envia Notificação| F[WhatsApp Client]
⚡ Principais Funcionalidades
Arquitetura Orientada a Eventos: Separação total entre a ação do usuário no app e o serviço de notificação em segundo plano.

Seleção de Ativos B3: Interface para definir ativos e valores de gatilho para os alertas (ex: PETR4, VALE3).

Simulador de Investimentos: Módulo integrado para cálculo rápido de projeções financeiras.

Mensageria Resiliente: Worker Service configurado com políticas de retry via MassTransit.

📸 Demonstração
1. Fluxo de Alertas e Notificação no WhatsApp

2. Módulo Simulador de Investimentos

🛠 Tech Stack / Tecnologias
Backend: C#, .NET 8, Worker Services, MassTransit.

Frontend: React Native, Expo, TypeScript.

Messaging & Gateway: RabbitMQ, Evolution API (WhatsApp).

DevOps: Docker, Docker Compose.
