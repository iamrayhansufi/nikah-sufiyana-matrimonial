import { NextResponse } from 'next/server';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';

export async function POST(req: Request) {
  try {
    console.log('Starting bio data processing...');
    
    // Check content type
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      console.error('Invalid content type:', contentType);
      return NextResponse.json({ 
        success: false,
        error: 'Invalid request. Expected multipart/form-data' 
      }, { 
        status: 400
      });
    }

    let formData;
    try {
      formData = await req.formData();
    } catch (formError) {
      console.error('Failed to parse form data:', formError);
      return NextResponse.json({ 
        success: false,
        error: 'Failed to parse form data' 
      }, { 
        status: 400
      });
    }

    const file = formData.get('file') as File;
    
    if (!file) {
      console.error('No file uploaded');
      return NextResponse.json({ 
        success: false,
        error: 'No file uploaded' 
      }, { 
        status: 400
      });
    }

    console.log('File received:', file.name, 'Type:', file.type, 'Size:', file.size);

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      console.error('Invalid file type:', file.type);
      return NextResponse.json({ 
        success: false,
        error: `Invalid file type. Allowed types: PDF, DOCX. Received: ${file.type}` 
      }, { 
        status: 400
      });
    }

    // Convert file to buffer
    let arrayBuffer;
    try {
      arrayBuffer = await file.arrayBuffer();
    } catch (bufferError) {
      console.error('Failed to read file:', bufferError);
      return NextResponse.json({ 
        success: false,
        error: 'Failed to read file' 
      }, { 
        status: 500
      });
    }

    const buffer = Buffer.from(arrayBuffer);
    console.log('File converted to buffer, size:', buffer.length);
    let textContent = '';

    // Extract text based on file type
    try {
      if (file.type === 'application/pdf') {
        console.log('Processing PDF file...');
        try {
          const data = await pdf(buffer, {
            max: 0, // No page limit
            version: 'v2.0.550',
            pagerender: function(pageData: any) {
              return pageData.getTextContent()
                .then(function(textContent: any) {
                  let lastY, text = '';
                  for (let item of textContent.items) {
                    if (lastY == item.transform[5] || !lastY) {
                      text += item.str;
                    } else {
                      text += '\n' + item.str;
                    }
                    lastY = item.transform[5];
                  }
                  return text;
                });
            }
          });
          
          textContent = data.text;
          console.log('PDF text content length:', textContent.length);
          console.log('First 200 chars:', textContent.substring(0, 200));
          
          if (!textContent || textContent.trim().length === 0) {
            return NextResponse.json({ 
              success: false,
              error: 'PDF appears to be empty or contains no extractable text'
            }, { 
              status: 422
            });
          }
          
        } catch (pdfError) {
          console.error('PDF processing error:', pdfError);
          return NextResponse.json({ 
            success: false,
            error: pdfError instanceof Error ? 
              `Failed to process PDF: ${pdfError.message}` : 
              'Failed to process PDF file. Please ensure the file is not corrupted or password protected.'
          }, { 
            status: 500
          });
        }
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        console.log('Processing DOCX file...');
        try {
          const result = await mammoth.extractRawText({ buffer });
          textContent = result.value;
          
          if (!textContent || textContent.trim().length === 0) {
            return NextResponse.json({ 
              success: false,
              error: 'DOCX appears to be empty or contains no text'
            }, { 
              status: 422
            });
          }
          
        } catch (docxError) {
          console.error('DOCX processing error:', docxError);
          return NextResponse.json({ 
            success: false,
            error: docxError instanceof Error ? 
              `Failed to process DOCX: ${docxError.message}` : 
              'Failed to process DOCX file. Please ensure the file is not corrupted.'
          }, { 
            status: 500
          });
        }
      }

      console.log('Text extracted successfully');
      console.log('Total text length:', textContent.length);
      console.log('Sample text:', textContent.substring(0, 200) + '...');

    } catch (extractError) {
      console.error('Error extracting text from file:', extractError);
      return NextResponse.json({ 
        success: false,
        error: extractError instanceof Error ? extractError.message : 'Failed to extract text from file',
        details: extractError instanceof Error ? extractError.stack : 'Unknown error'
      }, { 
        status: 500
      });
    }

    // Process the extracted text to identify relevant information
    const extractedData = {
      fullName: extractFullName(textContent),
      age: extractAge(textContent),
      education: extractEducation(textContent),
      profession: extractProfession(textContent),
      country: extractCountry(textContent),
      city: extractCity(textContent),
      height: extractHeight(textContent),
      maritalStatus: extractMaritalStatus(textContent),
      sect: extractSect(textContent),
    };

    console.log('Extracted data:', extractedData);

    // Validate extracted data
    const hasData = Object.values(extractedData).some(value => value !== '');
    if (!hasData) {
      console.warn('No relevant information found in the document');
      return NextResponse.json({ 
        success: false,
        error: 'Could not find relevant information in the document. Please ensure your bio data contains the required details.',
        text: textContent.substring(0, 1000) // Send first 1000 chars for debugging
      }, { 
        status: 422
      });
    }

    return NextResponse.json({
      success: true,
      data: extractedData,
      text: textContent.substring(0, 1000) // Limit text content size in response
    }, { 
      status: 200
    });

  } catch (error) {
    console.error('Error processing bio data:', error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process bio data. Please try again.',
      details: error instanceof Error ? error.stack : 'Unknown error'
    }, { 
      status: 500
    });
  }
}

function cleanValue(value: string): string {
  return value
    .replace(/^[\s:]+/, '') // Remove leading spaces and colons
    .replace(/[\s:]+$/, '') // Remove trailing spaces and colons
    .replace(/\s+/g, ' ')   // Replace multiple spaces with single space
    .trim();
}

function extractFullName(text: string): string {
  const patterns = [
    /name\s*[:]\s*([^\n]+)/i,
    /full name\s*[:]\s*([^\n]+)/i,
    /candidate(?:'s)? name\s*[:]\s*([^\n]+)/i,
    /^([A-Z][a-z]+(?: [A-Z][a-z]+)+)$/m, // Matches properly capitalized full names
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return cleanValue(match[match.length - 1]);
    }
  }
  return '';
}

function extractAge(text: string): string {
  const patterns = [
    /age\s*[:]\s*(\d+(?:\s*years?)?)/i,
    /dob\s*[:]\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i,
    /date of birth\s*[:]\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i,
    /born on\s*[:]\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return cleanValue(match[1]);
    }
  }
  return '';
}

function extractEducation(text: string): string {
  const patterns = [
    /education\s*[:]\s*([^\n]+)/i,
    /qualification\s*[:]\s*([^\n]+)/i,
    /academic\s*[:]\s*([^\n]+)/i,
    /degree\s*[:]\s*([^\n]+)/i,
    /graduated (?:from|with)\s*[:]\s*([^\n]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return cleanValue(match[1]);
    }
  }
  return '';
}

function extractProfession(text: string): string {
  const patterns = [
    /profession\s*[:]\s*([^\n]+)/i,
    /occupation\s*[:]\s*([^\n]+)/i,
    /job\s*[:]\s*([^\n]+)/i,
    /working as\s*[:]\s*([^\n]+)/i,
    /employed as\s*[:]\s*([^\n]+)/i,
    /designation\s*[:]\s*([^\n]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return cleanValue(match[1]);
    }
  }
  return '';
}

function extractCountry(text: string): string {
  const patterns = [
    /country\s*[:]\s*([^\n]+)/i,
    /nationality\s*[:]\s*([^\n]+)/i,
    /residing in\s*[:]\s*([^\n]+)/i,
    /citizen of\s*[:]\s*([^\n]+)/i,
    /lives? in\s*[:]\s*([^\n]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return cleanValue(match[1]);
    }
  }
  return '';
}

function extractCity(text: string): string {
  const patterns = [
    /city\s*[:]\s*([^\n]+)/i,
    /location\s*[:]\s*([^\n]+)/i,
    /residing at\s*[:]\s*([^\n]+)/i,
    /based in\s*[:]\s*([^\n]+)/i,
    /lives? in\s*[:]\s*([^\n]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return cleanValue(match[1]);
    }
  }
  return '';
}

function extractHeight(text: string): string {
  const patterns = [
    /height\s*[:]\s*([^\n]+)/i,
    /height\s*[:]\s*(\d+'?\s*\d*"?)/i,
    /height\s*[:]\s*(\d+(?:\.\d+)?\s*(?:cm|feet|ft))/i,
    /(\d+'?\s*\d*"?)\s*(?:tall|height)/i,
    /(\d+(?:\.\d+)?\s*(?:cm|feet|ft))\s*(?:tall|height)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return cleanValue(match[1]);
    }
  }
  return '';
}

function extractMaritalStatus(text: string): string {
  const patterns = [
    /marital status\s*[:]\s*([^\n]+)/i,
    /matrimonial status\s*[:]\s*([^\n]+)/i,
    /status\s*[:]\s*(single|married|divorced|widowed)/i,
    /(single|married|divorced|widowed)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return cleanValue(match[1]);
    }
  }
  return '';
}

function extractSect(text: string): string {
  const patterns = [
    /sect\s*[:]\s*([^\n]+)/i,
    /maslak\s*[:]\s*([^\n]+)/i,
    /religious sect\s*[:]\s*([^\n]+)/i,
    /belongs to\s*[:]\s*(sunni|shia|other)/i,
    /religion\s*[:]\s*([^\n]+)/i,
    /(sunni|shia|ahle[-\s]sunnat)/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return cleanValue(match[1]);
    }
  }
  return '';
} 