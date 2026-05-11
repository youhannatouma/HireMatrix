using HireMatrix.Interface;
using System.Text;

namespace HireMatrix.Services.Parsers
{
    public class TxtParser : IParser
    {
        public string Parse(Stream fileStream)
        {
            using var reader = new StreamReader(fileStream, Encoding.UTF8);
            return reader.ReadToEnd();
        }
    }
}