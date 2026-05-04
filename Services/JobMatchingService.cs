using HireMatrix.DTOs;

namespace HireMatrix.Services;

public class JobMatchingService
{
    //Calculate match score and identify missingor matched skills per job
    public List<JobMatchResultDto> MatchJobs(ExtractedCvDataDto cvData, List<JobDto> jobs)
    {
        var cvSkillsLower = cvData.Skills
            .Select(s => s.ToLowerInvariant())
            .ToHashSet();

        var results = jobs.Select(job =>
        {
            var matched = job.RequiredSkills
                .Where(s => cvSkillsLower.Contains(s.ToLowerInvariant()))
                .ToList();

            var missing = job.RequiredSkills
                .Where(s => !cvSkillsLower.Contains(s.ToLowerInvariant()))
                .Take(5)
                .ToList();

            int score = job.RequiredSkills.Count == 0
                ? 0
                : (int)Math.Round((double)matched.Count / job.RequiredSkills.Count * 100);

            return new JobMatchResultDto
            {
                JobTitle = job.Title,
                CompanyName = job.Company,
                JobUrl = job.Url,
                Location = job.Location,
                MatchScore = score,
                MatchingSkills = matched,
                MissingSkills = missing
            };
        })
        .OrderByDescending(r => r.MatchScore)
        .ToList();

        return results;
    }

    //Aggregate missing skills across top 10 jobs return top 5
    public SkillGapReportDto GenerateSkillGapReport(List<JobMatchResultDto> matchResults)
    {
        var top10 = matchResults
            .OrderByDescending(r => r.MatchScore)
            .Take(10)
            .ToList();

        var topMissingSkills = top10
            .SelectMany(r => r.MissingSkills)
            .GroupBy(s => s, StringComparer.OrdinalIgnoreCase)
            .Select(g => new SkillGapItemDto
            {
                Skill = g.Key,
                JobsRequiringIt = g.Count()
            })
            .OrderByDescending(s => s.JobsRequiringIt)
            .Take(5)
            .ToList();

        return new SkillGapReportDto { TopMissingSkills = topMissingSkills };
    }
}
