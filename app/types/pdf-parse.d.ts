declare module 'pdf-parse/lib/pdf-parse.js' {
  interface PDFData {
    text: string;
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    version: string;
  }

  interface PDFOptions {
    max?: number;
    version?: string;
    pagerender?: (pageData: any) => Promise<string>;
  }

  function pdf(dataBuffer: Buffer, options?: PDFOptions): Promise<PDFData>;
  export = pdf;
} 