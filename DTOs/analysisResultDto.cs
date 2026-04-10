namespace HireMatrix.DTOs;

public class AnalysisResultDto
{
   public string CompanyName { get; set; }
   public int MatchScore { get; set; }
   public List<string> MatchingSkills { get; set; }
   public List<string> MissingSkills { get; set; }
   public string Summary { get; set; }
}
