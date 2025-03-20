import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const rowsPerFile = parseInt(formData.get('rowsPerFile') || '10000', 10);

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert the file to an array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Read the Excel file
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // Convert the worksheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    
    // Get the first two rows (headers)
    const headerRows = jsonData.slice(0, 2);
    
    // Get the data rows
    const dataRows = jsonData.slice(2);
    
    // Create a zip file to store all the split files
    const zip = new JSZip();
    
    // Split the data into chunks
    for (let i = 0; i < dataRows.length; i += rowsPerFile) {
      const chunk = dataRows.slice(i, i + rowsPerFile);
      
      // Create a new workbook for each chunk
      const newWorkbook = XLSX.utils.book_new();
      
      // Combine header rows with the current chunk
      const newData = [...headerRows, ...chunk];
      
      // Create a new worksheet with the combined data
      const newWorksheet = XLSX.utils.aoa_to_sheet(newData);
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Sheet1');
      
      // Convert the workbook to a buffer
      const buffer = XLSX.write(newWorkbook, { type: 'array', bookType: 'xlsx' });
      
      // Add the buffer to the zip file
      const fileName = `part_${Math.floor(i / rowsPerFile) + 1}.xlsx`;
      zip.file(fileName, buffer);
    }
    
    // Generate the zip file
    const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' });
    
    // Return the zip file
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="split_files.zip"`,
      },
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
