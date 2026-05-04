namespace HireMatrix.DTOs;

public class MatchJobsRequestDto
{
    public ExtractedCvDataDto CvData { get; set; } = new();
    public List<JobDto>? Jobs { get; set; }
}
