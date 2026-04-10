using HireMatrix.Services.Parsers;
using HireMatrix.Interface;
using System.IO;
using System.Diagnostics.CodeAnalysis;

namespace HireMatrix.Services
{
    public class CvParserFactory
    {
        //null returns will be changed soon
        public static IParser GetParser(IFormFile inputFile)
        {
            string extension = Path.GetExtension(inputFile.FileName);
            switch(extension)
            {
                case ".pdf":
                    return new PdfParser();
                case ".docx":
                    break;
                case ".html":
                    break;
                case ".txt":
                    break;
                default:
                    return null;
            }

            return null;
        }
    }
}
