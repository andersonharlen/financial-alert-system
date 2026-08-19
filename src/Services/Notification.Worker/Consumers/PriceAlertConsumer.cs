using MassTransit;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;
using Core.Contracts;

public class PriceAlertCreatedConsumer : IConsumer<PriceAlertCreatedEvent>
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<PriceAlertCreatedConsumer> _logger;

    public PriceAlertCreatedConsumer(HttpClient httpClient, ILogger<PriceAlertCreatedConsumer> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<PriceAlertCreatedEvent> context)
    {
        var messageData = context.Message;

        // Formata a mensagem usando Ticker e TargetPrice
        string messageText = $@"🚨 *[Financial Alert] Alerta de Preço*

Olá! O ativo que você monitora acabou de atingir a meta configurada.

• *Ativo:* {messageData.Ticker}
• *Preço Alvo:* R$ {messageData.TargetPrice:N2}

Acesse o painel do sistema para acompanhar as movimentações.";

        // Payload para a Evolution API (envia para o PhoneNumber que veio no evento)
        var payload = new
        {
            number = messageData.PhoneNumber, // <-- Aqui vai o número do destinatário que veio no evento
            text = messageText
        };

        try
        {
            var response = await _httpClient.PostAsJsonAsync("message/sendText/MinhaInstancia", payload);

            if (response.IsSuccessStatusCode)
            {
                _logger.LogInformation("Mensagem de WhatsApp enviada com sucesso para {Phone}!", messageData.PhoneNumber);
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Erro ao enviar mensagem via WhatsApp: {Error}", errorContent);
                throw new Exception($"Falha ao enviar WhatsApp: {errorContent}");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro de conexão ao tentar comunicar com a API do WhatsApp.");
            throw; 
        }
    }
}