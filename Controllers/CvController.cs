using HireMatrix.DTOs;
using HireMatrix.Interface;
using HireMatrix.Services;
using Microsoft.AspNetCore.Mvc;

namespace HireMatrix.Controllers;

[ApiController]
[Route("api/cv")]
public class CvController : ControllerBase
{
    private readonly IAiService _aiService;
    private readonly JobMatchingService _matchingService;

    public CvController(IAiService aiService, JobMatchingService matchingService)
    {
        _aiService = aiService;
        _matchingService = matchingService;
    }

    [HttpPost("analyze")]
    public async Task<IActionResult> AnalyzeCv([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { error = "No file uploaded." });

        var allowedExtensions = new[] { ".pdf", ".txt" };
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(ext))
            return BadRequest(new { error = "Only PDF and TXT files are accepted." });

        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(new { error = "File size must not exceed 5MB." });

        string cvText;
        try
        {
            var parser = CvParserFactory.GetParser(file);
            if (parser == null)
                return BadRequest(new { error = $"Unsupported file type: {ext}" });

            using var stream = file.OpenReadStream();
            cvText = parser.Parse(stream);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to parse the CV file.", detail = ex.Message });
        }

        if (string.IsNullOrWhiteSpace(cvText))
            return BadRequest(new { error = "Could not extract text from the file. Try a PDF with selectable text." });

        try
        {
            var extracted = await _aiService.ExtractSkillsAsync(cvText);
            return Ok(extracted);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "AI skill extraction failed.", detail = ex.Message });
        }
    }

    [HttpPost("match-jobs")]
    public IActionResult MatchJobs([FromBody] MatchJobsRequestDto request)
    {
        if (request?.CvData == null)
            return BadRequest(new { error = "CV data is required." });

        var jobs = (request.Jobs != null && request.Jobs.Count > 0)
            ? request.Jobs
            : GetMockJobs();

        var results = _matchingService.MatchJobs(request.CvData, jobs);
        return Ok(results);
    }

    [HttpPost("skill-gap")]
    public IActionResult GetSkillGapReport([FromBody] List<JobMatchResultDto> matchResults)
    {
        if (matchResults == null || matchResults.Count == 0)
            return BadRequest(new { error = "Match results are required." });

        var report = _matchingService.GenerateSkillGapReport(matchResults);
        return Ok(report);
    }

    // placeholder jobs until job fetching is integrated
    private static List<JobDto> GetMockJobs() => new()
    {
        new JobDto
        {
            Title = "Backend Developer",
            Company = "TechCorp Lebanon",
            Url = "https://example.com/jobs/1",
            Location = "Beirut, Lebanon",
            RequiredSkills = new() { "C#", ".NET", "SQL", "REST API", "Git", "Docker", "Azure" }
        },
        new JobDto
        {
            Title = "Full Stack Developer",
            Company = "StartupLB",
            Url = "https://example.com/jobs/2",
            Location = "Remote",
            RequiredSkills = new() { "React", "Node.js", "TypeScript", "SQL", "Git", "AWS", "MongoDB" }
        },
        new JobDto
        {
            Title = "Software Engineer",
            Company = "Murex",
            Url = "https://example.com/jobs/3",
            Location = "Beirut, Lebanon",
            RequiredSkills = new() { "Java", "Spring Boot", "SQL", "Microservices", "Docker", "Kubernetes", "Git" }
        },
        new JobDto
        {
            Title = "Frontend Developer",
            Company = "Agence Plus",
            Url = "https://example.com/jobs/4",
            Location = "Beirut, Lebanon",
            RequiredSkills = new() { "React", "JavaScript", "CSS", "HTML", "TypeScript", "Git", "Figma" }
        },
        new JobDto
        {
            Title = "DevOps Engineer",
            Company = "CloudLB",
            Url = "https://example.com/jobs/5",
            Location = "Remote",
            RequiredSkills = new() { "Docker", "Kubernetes", "CI/CD", "AWS", "Linux", "Python", "Terraform" }
        },
        new JobDto
        {
            Title = "Data Engineer",
            Company = "Analytics Co",
            Url = "https://example.com/jobs/6",
            Location = "Beirut, Lebanon",
            RequiredSkills = new() { "Python", "SQL", "Apache Spark", "ETL", "AWS", "Data Warehousing", "Git" }
        },
        new JobDto
        {
            Title = "Mobile Developer",
            Company = "AppStudio",
            Url = "https://example.com/jobs/7",
            Location = "Remote",
            RequiredSkills = new() { "React Native", "JavaScript", "TypeScript", "REST API", "Git", "Firebase" }
        },
        new JobDto
        {
            Title = "Software Architect",
            Company = "Enterprise Solutions",
            Url = "https://example.com/jobs/8",
            Location = "Beirut, Lebanon",
            RequiredSkills = new() { "System Design", "Microservices", "Docker", "SQL", "REST API", "C#", "Cloud" }
        }
    };
}
