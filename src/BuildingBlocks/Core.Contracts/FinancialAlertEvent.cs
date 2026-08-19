namespace Core.Contracts;

public record FinancialAlertEvent(
    string PhoneNumber,
    string Message
);