namespace HireMatrix.DTOs;

public class SkillGapItemDto
{
    public string Skill { get; set; } = string.Empty;
    public int JobsRequiringIt { get; set; }
    public string LearningResourceUrl { get; set; } = string.Empty;
}

public class SkillGapReportDto
{
    public List<SkillGapItemDto> TopMissingSkills { get; set; } = new();
}
