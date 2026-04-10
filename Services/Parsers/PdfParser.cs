using HireMatrix.Interface;
using System.Text;
using UglyToad.PdfPig;
using UglyToad.PdfPig.DocumentLayoutAnalysis.PageSegmenter;
using UglyToad.PdfPig.DocumentLayoutAnalysis.ReadingOrderDetector;
using UglyToad.PdfPig.DocumentLayoutAnalysis.WordExtractor;

namespace HireMatrix.Services.Parsers
{
    public class PdfParser : IParser
    {
        public string Parse(Stream fileStream)
        {
            StringBuilder gptPromptBuilder = new StringBuilder();

            using (var document = PdfDocument.Open(fileStream))
            {
                for(int i = 1; i <= document.NumberOfPages; i++)
                {
                    var page = document.GetPage(i);
                    var letters = page.Letters; 

                    var wordExtractor = NearestNeighbourWordExtractor.Instance;
                    var words = wordExtractor.GetWords(letters);

                    var pageSegmenter = DocstrumBoundingBoxes.Instance;
                    var textBlocks = pageSegmenter.GetBlocks(words);

                    var readingOrder = UnsupervisedReadingOrderDetector.Instance;
                    var orderedTextBlocks = readingOrder.Get(textBlocks);

                    foreach(var block in orderedTextBlocks)
                    {
                        gptPromptBuilder.AppendLine(block.Text.Trim());
                        //extra call for double spacing
                        gptPromptBuilder.AppendLine();
                    }
                }
            }
            string parsedPrompt = gptPromptBuilder.ToString();
            return parsedPrompt;
        }
    }
}
