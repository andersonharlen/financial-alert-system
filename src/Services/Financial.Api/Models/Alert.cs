using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Financial.Api.Models;

public class Alert
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Ticker { get; set; } = string.Empty;
    public decimal TargetPrice { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}