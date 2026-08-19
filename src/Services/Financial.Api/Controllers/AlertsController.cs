using Core.Contracts;
using MassTransit;
using Microsoft.AspNetCore.Mvc;

namespace Financial.Api.Controllers;

public record CreateAlertDto(string Ticker, decimal TargetPrice, string PhoneNumber);

[ApiController]
[Route("api/[controller]")]
public class AlertsController : ControllerBase
{
    private readonly IPublishEndpoint _publishEndpoint;

    public AlertsController(IPublishEndpoint publishEndpoint)
    {
        _publishEndpoint = publishEndpoint;
    }

    [HttpPost]
    public async Task<IActionResult> CreateAlert([FromBody] CreateAlertDto dto)
    {
        // Passa os 5 parâmetros exigidos pelo PriceAlertCreatedEvent
        await _publishEndpoint.Publish(new PriceAlertCreatedEvent(
            Guid.NewGuid(),
            dto.Ticker,
            dto.TargetPrice,
            dto.PhoneNumber,
            DateTime.UtcNow
        ));

        return Ok(new { status = "Alerta publicado no RabbitMQ com sucesso!" });
    }
}