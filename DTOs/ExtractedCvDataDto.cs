namespace HireMatrix.DTOs;

public class ExtractedCvDataDto
{
    public string Name { get; set; } = string.Empty;
    public List<string> Skills { get; set; } = new();
    public string ExperienceSummary { get; set; } = string.Empty;
    public string Education { get; set; } = string.Empty;
}
