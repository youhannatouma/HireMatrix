namespace HireMatrix.DTOs;

public class JobMatchResultDto
{
    public string JobTitle { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string JobUrl { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public int MatchScore { get; set; }
    public List<string> MatchingSkills { get; set; } = new();
    public List<string> MissingSkills { get; set; } = new();
}
