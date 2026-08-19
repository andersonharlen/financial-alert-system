using Financial.Miner;
using Financial.Miner.Services;
using MassTransit;

var builder = Host.CreateApplicationBuilder(args);

// Registra HttpClient e o serviço de scraping
builder.Services.AddHttpClient<IStockScraperService, StockScraperService>();

// Configura o MassTransit com RabbitMQ
builder.Services.AddMassTransit(x =>
{
    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host("localhost", "/", h =>
        {
            h.Username("guest");
            h.Password("guest");
        });
    });
});

builder.Services.AddHostedService<Worker>();

var host = builder.Build();
host.Run();