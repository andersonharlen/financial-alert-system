using Core.Contracts;
using MassTransit;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Financial.Miner;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly IPublishEndpoint _publishEndpoint;

    public Worker(ILogger<Worker> logger, IPublishEndpoint publishEndpoint)
    {
        _logger = logger;
        _publishEndpoint = publishEndpoint;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("Financial.Miner a executar em: {time}", DateTimeOffset.Now);

            var alertEvent = new PriceAlertCreatedEvent(
                Id: Guid.NewGuid(),
                Ticker: "PETR4",
                TargetPrice: 35.50m,
                PhoneNumber: "5579981394290",
                CreatedAt: DateTime.UtcNow
            );

            await _publishEndpoint.Publish(alertEvent, stoppingToken);
            _logger.LogInformation("Evento de preço publicado no RabbitMQ!");

            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
        }
    }
}