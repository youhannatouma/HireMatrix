using System.Text;
using System.Text.Json;
using HireMatrix.DTOs;
using HireMatrix.Interface;

namespace HireMatrix.Services;

public class AiService : IAiService
{
    private readonly HttpClient _http;
    private readonly string _apiKey;

    public AiService(HttpClient http, IConfiguration config)
    {
        _http = http;
        _apiKey = config["Groq:ApiKey"] ?? throw new InvalidOperationException("Groq:ApiKey is not configured in appsettings.json");
    }

    public async Task<ExtractedCvDataDto> ExtractSkillsAsync(string cvText)
    {
        var prompt = $$"""
            Analyze the following CV/resume text and extract structured information.
            Return ONLY a valid JSON object with exactly this structure, no markdown, no extra text:
            {
              "name": "candidate full name or empty string if not found",
              "skills": ["skill1", "skill2", "skill3"],
              "experienceSummary": "brief summary of work experience including years and roles",
              "education": "highest degree and field of study"
            }

            Make the skills list comprehensive - include programming languages, frameworks, tools, soft skills, and domain knowledge found in the CV.

            CV Text:
            {{cvText}}
            """;

        var requestBody = new
        {
            model = "llama-3.1-8b-instant",
            max_tokens = 1024,
            messages = new[]
            {
                new { role = "user", content = prompt }
            }
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.groq.com/openai/v1/chat/completions");
        request.Headers.Add("Authorization", $"Bearer {_apiKey}");
        request.Content = new StringContent(
            JsonSerializer.Serialize(requestBody),
            Encoding.UTF8,
            "application/json"
        );

        var response = await _http.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Groq API error {(int)response.StatusCode}: {errorBody}");
        }

        var responseBody = await response.Content.ReadAsStringAsync();
        var apiResponse = JsonSerializer.Deserialize<JsonElement>(responseBody);
        var content = apiResponse
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString() ?? "{}";

        content = content.Trim();
        if (content.StartsWith("```"))
        {
            var start = content.IndexOf('{');
            var end = content.LastIndexOf('}');
            if (start >= 0 && end >= 0)
                content = content[start..(end + 1)];
        }

        var extracted = JsonSerializer.Deserialize<JsonElement>(content);

        return new ExtractedCvDataDto
        {
            Name = extracted.TryGetProperty("name", out var name) ? name.GetString() ?? "" : "",
            Skills = extracted.TryGetProperty("skills", out var skills)
                ? skills.EnumerateArray()
                    .Select(s => s.GetString() ?? "")
                    .Where(s => !string.IsNullOrWhiteSpace(s))
                    .ToList()
                : new List<string>(),
            ExperienceSummary = extracted.TryGetProperty("experienceSummary", out var exp) ? exp.GetString() ?? "" : "",
            Education = extracted.TryGetProperty("education", out var edu) ? edu.GetString() ?? "" : ""
        };
    }
}
