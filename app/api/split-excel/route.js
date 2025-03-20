import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';

// Function to create a streaming response with step-by-step processing
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const rowsPerFile = parseInt(formData.get('rowsPerFile') || '10000', 10);
    const headerRows = parseInt(formData.get('headerRows') || '2', 10);
    const fileType = formData.get('fileType') || 'template'; // 'source', 'template', or 'custom'

    // Log the received parameters for debugging
    console.log('Received parameters:', { rowsPerFile, headerRows, fileType });

    // Normalize file type to handle typos
    const normalizedFileType = fileType.toLowerCase().startsWith('temp') ? 'template' :
      fileType.toLowerCase().startsWith('sour') ? 'source' :
        fileType.toLowerCase().startsWith('cust') ? 'custom' : 'template';

    // Determine the actual header rows based on file type
    const effectiveHeaderRows = headerRows || (normalizedFileType === 'source' ? 1 : normalizedFileType === 'template' ? 2 : 2);

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (rowsPerFile <= 0) {
      return NextResponse.json({ error: 'Rows per file must be greater than 0' }, { status: 400 });
    }

    if (effectiveHeaderRows <= 0 || effectiveHeaderRows > 10) {
      return NextResponse.json({ error: 'Header rows must be between 1 and 10' }, { status: 400 });
    }

    // Create a ReadableStream to send progress updates
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Helper function to encode and send updates
          const encoder = new TextEncoder();
          const sendUpdate = (data) => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          };

          // Send initial status update
          sendUpdate({
            type: 'status',
            step: 'start',
            message: 'Starting file processing'
          });

          // Step 1: Upload and initial parsing
          sendUpdate({
            type: 'status',
            step: 'upload',
            message: 'Reading file'
          });

          // Convert the file to an array buffer
          const arrayBuffer = await file.arrayBuffer();

          sendUpdate({
            type: 'status',
            step: 'parse',
            message: 'Parsing file'
          });

          // Determine if the file is a CSV or Excel file
          const isCSV = file.name.toLowerCase().endsWith('.csv');

          let data = [];

          try {
            // Log file details for debugging
            console.log('File details:', {
              name: file.name,
              size: file.size,
              type: file.type,
              arrayBufferLength: arrayBuffer.byteLength
            });
            
            // Check if the array buffer is valid
            if (!arrayBuffer || arrayBuffer.byteLength === 0) {
              throw new Error('File buffer is empty or invalid');
            }
            
            // Use different parsing approach based on file type
            if (isCSV) {
              console.log('Parsing as CSV file');
              // For CSV files, use specific options
              const workbook = XLSX.read(arrayBuffer, { 
                type: 'array',
                raw: true,
                cellDates: true,
                cellNF: false,
                cellText: false
              });
              
              console.log('CSV workbook parsed:', {
                sheetNames: workbook.SheetNames,
                hasSheets: workbook.SheetNames && workbook.SheetNames.length > 0
              });
              
              if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
                throw new Error('CSV parsing failed: No sheets found');
              }
              
              const worksheet = workbook.Sheets[workbook.SheetNames[0]];
              console.log('CSV worksheet ref:', worksheet['!ref']);
              
              // If !ref is missing, create a default one based on the data
              if (!worksheet['!ref']) {
                console.log('No ref found in CSV worksheet, creating default');
                // Create a minimal reference that covers at least one cell
                worksheet['!ref'] = 'A1:A1';
              }
              
              data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', raw: false });
            } else {
              console.log('Parsing as Excel file');
              // For Excel files
              const workbook = XLSX.read(arrayBuffer, { 
                type: 'array',
                cellDates: true,
                cellNF: false,
                cellText: false
              });
              
              console.log('Excel workbook parsed:', {
                sheetNames: workbook.SheetNames,
                hasSheets: workbook.SheetNames && workbook.SheetNames.length > 0
              });
              
              if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
                throw new Error('Excel parsing failed: No sheets found');
              }
              
              const worksheet = workbook.Sheets[workbook.SheetNames[0]];
              console.log('Excel worksheet ref:', worksheet['!ref']);
              
              // If !ref is missing, create a default one based on the data
              if (!worksheet['!ref']) {
                console.log('No ref found in Excel worksheet, creating default');
                // Create a minimal reference that covers at least one cell
                worksheet['!ref'] = 'A1:A1';
              }
              
              data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', raw: false });
            }
            
            console.log('Parsed data length:', data.length);
            console.log('First few rows:', data.slice(0, 3));

            if (!data || data.length === 0) {
              throw new Error('File appears to be empty after parsing');
            }
          } catch (err) {
            console.error('Error parsing file:', err);
            sendUpdate({
              type: 'error',
              message: `Error parsing file: ${err.message}`
            });
            controller.close();
            return;
          }

          // Make sure we have enough data
          if (data.length <= effectiveHeaderRows) {
            sendUpdate({
              type: 'error',
              message: `File has only ${data.length} row(s), but needs at least ${effectiveHeaderRows + 1} rows (${effectiveHeaderRows} header row(s) + data rows)`
            });
            controller.close();
            return;
          }

          // Extract header rows and data rows
          const headerRowsData = data.slice(0, effectiveHeaderRows);
          const dataRows = data.slice(effectiveHeaderRows);

          // Send metadata about the file
          sendUpdate({
            type: 'metadata',
            totalRows: data.length,
            headerRows: effectiveHeaderRows,
            dataRows: dataRows.length,
            estimatedFiles: Math.ceil(dataRows.length / rowsPerFile)
          });

          // Create a zip file to store all the split files
          const zip = new JSZip();

          // Calculate total number of files that will be created
          const totalFiles = Math.ceil(dataRows.length / rowsPerFile);

          sendUpdate({
            type: 'status',
            step: 'process',
            message: 'Processing data in chunks',
            totalFiles: totalFiles
          });

          // Process data in chunks to avoid memory issues
          for (let fileIndex = 0; fileIndex < totalFiles; fileIndex++) {
            // Calculate row range for this chunk
            const startRow = fileIndex * rowsPerFile;
            const endRow = Math.min(startRow + rowsPerFile - 1, dataRows.length - 1);

            sendUpdate({
              type: 'progress',
              currentFile: fileIndex + 1,
              totalFiles: totalFiles,
              startRow: startRow + effectiveHeaderRows,
              endRow: endRow + effectiveHeaderRows,
              percentage: Math.round(((fileIndex + 1) / totalFiles) * 100)
            });

            // Extract the chunk data
            const chunkData = [
              ...headerRowsData,
              ...dataRows.slice(startRow, endRow + 1)
            ];

            // Determine output format based on input file
            if (isCSV) {
              // For CSV output, convert the data to CSV format
              let csvContent = '';

              // Process each row
              for (let i = 0; i < chunkData.length; i++) {
                const row = chunkData[i];
                const processedRow = [];

                // Process each cell in the row
                for (let j = 0; j < row.length; j++) {
                  const cell = row[j];
                  const cellStr = String(cell || '');

                  // If cell contains commas, quotes, or newlines, wrap in quotes and escape internal quotes
                  if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                    processedRow.push(`"${cellStr.replace(/"/g, '""')}"`);
                  } else {
                    processedRow.push(cellStr);
                  }
                }

                // Add the processed row to the CSV content
                csvContent += processedRow.join(',');

                // Add a newline unless it's the last row
                if (i < chunkData.length - 1) {
                  csvContent += '\n';
                }
              }

              // Add to zip with CSV extension
              const fileName = `part_${fileIndex + 1}.csv`;
              zip.file(fileName, csvContent);
            } else {
              // For Excel output, use XLSX library
              const newWorkbook = XLSX.utils.book_new();
              const newWorksheet = XLSX.utils.aoa_to_sheet(chunkData);

              // Add the worksheet to the workbook
              XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Sheet1');

              // Convert the workbook to a buffer
              const buffer = XLSX.write(newWorkbook, { type: 'array', bookType: 'xlsx' });

              // Add the buffer to the zip file
              const fileName = `part_${fileIndex + 1}.xlsx`;
              zip.file(fileName, buffer);
            }

            // Small delay to allow the client to process the update
            await new Promise(resolve => setTimeout(resolve, 50));
          }

          sendUpdate({
            type: 'status',
            step: 'finalize',
            message: 'Creating ZIP archive'
          });

          // Generate the zip file
          const zipBuffer = await zip.generateAsync({
            type: 'arraybuffer',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
          }, (metadata) => {
            // Report zip generation progress
            if (metadata.percent) {
              sendUpdate({
                type: 'zip_progress',
                percentage: Math.round(metadata.percent)
              });
            }
          });

          // Send completion message with the zip file data
          sendUpdate({
            type: 'complete',
            message: 'Processing complete',
            zipData: Array.from(new Uint8Array(zipBuffer))
          });

          controller.close();
        } catch (error) {
          console.error('Error in processing:', error);
          // Send error message
          const encoder = new TextEncoder();
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'error',
            message: error.message || 'An error occurred during processing'
          })}\n\n`));

          controller.close();
        }
      }
    });

    // Return the stream as a response
    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
  }
}
