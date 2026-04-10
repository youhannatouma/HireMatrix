namespace HireMatrix.DTOs;

//should be moved to a more general namesapce
public enum PromptType 
{
}
//-------------------------------------------

public class GptRequestDto
{
    public string CvText { get; set; }
    public string JobDescriptions { get; set; }
    public PromptType analysisMode { get; set; } 
}
