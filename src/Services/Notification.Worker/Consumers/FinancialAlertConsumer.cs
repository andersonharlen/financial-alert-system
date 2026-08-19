using Core.Contracts;
using MassTransit;
using Microsoft.Extensions.Logging;
using Notification.Worker.Services;

namespace Notification.Worker.Consumers;

public class FinancialAlertConsumer : IConsumer<PriceAlertCreatedEvent>
{
    private readonly ILogger<FinancialAlertConsumer> _logger;
    private readonly EvolutionWhatsAppService _whatsAppService;

    public FinancialAlertConsumer(ILogger<FinancialAlertConsumer> logger, EvolutionWhatsAppService whatsAppService)
    {
        _logger = logger;
        _whatsAppService = whatsAppService;
    }

    public async Task Consume(ConsumeContext<PriceAlertCreatedEvent> context)
    {
        var message = context.Message;
        _logger.LogInformation("Alerta recebido para o ticker {Ticker} com preço alvo {TargetPrice}", message.Ticker, message.TargetPrice);

        try
        {
            // Limpa a formatação da máscara do frontend e adiciona o DDI do Brasil (55)
            // Limpa parênteses, traços e espaços
            string numeroLimpo = message.PhoneNumber
                .Replace("(", "")
                .Replace(")", "")
                .Replace("-", "")
                .Replace(" ", "");

            // Garante que só adiciona 55 se o número ainda NÃO começar por 55
            string numeroFinal = numeroLimpo.StartsWith("55") ? numeroLimpo : $"55{numeroLimpo}";

            // Envia a mensagem via Evolution API usando o número tratado (numeroFinal)
            await _whatsAppService.SendAlertAsync(numeroFinal, $"Alerta Financeiro: A ação {message.Ticker} atingiu o preço alvo de R$ {message.TargetPrice}!");
            
            _logger.LogInformation("Mensagem de WhatsApp enviada com sucesso para {Phone}!", numeroFinal);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao enviar mensagem para o WhatsApp.");
            throw;
        }
    }
}