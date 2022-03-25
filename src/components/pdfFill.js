import { PDFDocument, StandardFonts, rgb }from 'pdf-lib';

async funciton createPDF() {
  const pdfDoc = await PDFDocument.create()
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

  const page = pdfDoc.