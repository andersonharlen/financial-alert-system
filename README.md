# 📈 Financial Alert System

An Event-Driven Architecture (EDA) project featuring real-time financial alerts and investment simulations.

[🇧🇷 Português](#-português) | [🇺🇸 English](#-english)

---

## 🏗 Architecture / Arquitetura
```mermaid
graph TD
    A[React Native App] -->|POST /alerts| B[Financial.Api .NET 8]
    B -->|Publish Event| C[(RabbitMQ)]
    C -->|Consume| D[Notification.Worker .NET 8]
    D -->|Send| E[Evolution API]
    E -->|Notify| F[WhatsApp]
📸 Demo / DemonstraçãoFeature / FuncionalidadePreviewWhatsApp AlertsInvestment Simulator🇺🇸 EnglishOverviewThis project demonstrates a decoupled system using .NET 8 and RabbitMQ. It handles high-throughput financial alerts and provides an investment simulation tool.Backend: .NET 8 (API + Worker Services).Frontend: React Native (Expo).Messaging: MassTransit with RabbitMQ.Integration: Evolution API for WhatsApp notifications.🇧🇷 PortuguêsVisão GeralProjeto de arquitetura orientada a eventos para processamento de alertas financeiros e simulação de investimentos. Sistema robusto com desacoplamento total entre requisições e processamento em segundo plano.Backend: .NET 8 (API + Worker Services).Frontend: React Native (Expo).Mensageria: MassTransit com RabbitMQ.Integração: Evolution API para envio de mensagens via WhatsApp.
