using Core.Contracts;
using MassTransit;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Financial.Miner;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly IBus _bus;

    public Worker(ILogger<Worker> logger, IBus bus)
    {
        _logger = logger;
        _bus = bus;
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

            var endpoint = await _bus.GetSendEndpoint(new Uri("queue:price-alert-queue"));
            await endpoint.Send(alertEvent, stoppingToken);
            
            _logger.LogInformation("Evento enviado diretamente para a fila price-alert-queue!");

            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
        }
    }
}
