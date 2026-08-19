namespace Financial.Api.DTOs;

public record CreateAlertRequest(
    string Ticker,
    decimal TargetPrice,
    string PhoneNumber
);

public record AlertResponse(
    Guid Id,
    string Ticker,
    decimal TargetPrice,
    string PhoneNumber,
    bool IsActive,
    DateTime CreatedAt
);