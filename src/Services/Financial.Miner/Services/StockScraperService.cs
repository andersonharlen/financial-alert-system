using AngleSharp.Html.Parser;
using System.Globalization;

namespace Financial.Miner.Services;

public interface IStockScraperService
{
    Task<decimal?> GetStockPriceAsync(string ticker);
}

public class StockScraperService : IStockScraperService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<StockScraperService> _logger;
    private readonly HtmlParser _htmlParser;

    public StockScraperService(HttpClient httpClient, ILogger<StockScraperService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
        _htmlParser = new HtmlParser();

        // Configura User-Agent para evitar bloqueios HTTP 403
        _httpClient.DefaultRequestHeaders.Add("User-Agent", 
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
    }

    public async Task<decimal?> GetStockPriceAsync(string ticker)
    {
        try
        {
            var url = $"https://statusinvest.com.br/acoes/{ticker.ToLower()}";
            _logger.LogInformation("🔍 Extraindo cotação em tempo real para {Ticker} via {Url}...", ticker, url);

            var html = await _httpClient.GetStringAsync(url);
            var document = await _htmlParser.ParseDocumentAsync(html);

            // Seletor CSS da cotação atual no StatusInvest
            var priceElement = document.QuerySelector("div[title='Valor atual do ativo'] strong.value");

            if (priceElement == null || string.IsNullOrWhiteSpace(priceElement.TextContent))
            {
                _logger.LogWarning("⚠️ Não foi possível localizar o elemento de preço para o ativo {Ticker}.", ticker);
                return null;
            }

            var rawPrice = priceElement.TextContent.Trim().Replace(".", "");
            
            if (decimal.TryParse(rawPrice, NumberStyles.Number, new CultureInfo("pt-BR"), out var price))
            {
                _logger.LogInformation("✅ Cotação extraída com sucesso: {Ticker} = R$ {Price}", ticker, price);
                return price;
            }

            _logger.LogWarning("⚠️ Falha ao converter o valor extraído '{RawPrice}' para decimal.", rawPrice);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erro ao realizar scraping para o ativo {Ticker}", ticker);
            return null;
        }
    }
}