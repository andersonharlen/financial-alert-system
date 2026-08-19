namespace Core.Contracts;

public record PriceAlertCreatedEvent(
    Guid Id,
    string Ticker,
    decimal TargetPrice,
    string PhoneNumber,
    DateTime CreatedAt
);