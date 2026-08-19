using MassTransit;
using Notification.Worker;
using Notification.Worker.Consumers;
using Notification.Worker.Services;

var builder = Host.CreateApplicationBuilder(args);

// Registar o HttpClient e o serviço de WhatsApp
builder.Services.AddHttpClient<EvolutionWhatsAppService>();
builder.Services.AddScoped<EvolutionWhatsAppService>();

builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<FinancialAlertConsumer>();

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host("localhost", "/", h =>
        {
            h.Username("guest");
            h.Password("guest");
        });

        cfg.ReceiveEndpoint("price-alert-queue", e =>
        {
            e.ConfigureConsumer<FinancialAlertConsumer>(context);
        });
    });
});

var host = builder.Build();
host.Run();

