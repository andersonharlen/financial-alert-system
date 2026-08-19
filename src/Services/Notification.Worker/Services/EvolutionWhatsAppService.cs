using System.Net.Http.Json;

namespace Notification.Worker.Services;

public class EvolutionWhatsAppService
{
    private readonly HttpClient _httpClient;

    public EvolutionWhatsAppService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task SendAlertAsync(string phoneNumber, string message)
    {
        // A Evolution API exige 'number' e 'text'
        var payload = new
        {
            number = phoneNumber,
            text = message
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "http://localhost:8080/message/sendText/MinhaInstancia")
        {
            Content = JsonContent.Create(payload)
        };
        
        // Adicione aqui a apikey configurada na sua Evolution API
        request.Headers.Add("apikey", "sua_chave_secreta");

        var response = await _httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Erro na Evolution API: {response.StatusCode} - {errorContent}");
        }
    }
}