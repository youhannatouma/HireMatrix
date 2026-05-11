using HireMatrix.DTOs;

namespace HireMatrix.Interface;

public interface IAiService
{
    Task<ExtractedCvDataDto> ExtractSkillsAsync(string cvText);
}
