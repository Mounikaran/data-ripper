import io
import json
import asyncio
import logging
import zipfile


from fastapi import APIRouter, Request, UploadFile, Form
from fastapi.responses import StreamingResponse, JSONResponse
import pandas as pd

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()


# Helper function to generate SSE events
def sse_event(data):
    return f"data: {json.dumps(data)}\n\n"


@router.post("/rip")
async def rip(
    request: Request,
    file: UploadFile = UploadFile,
    rows_per_file: int = Form(),
    header_rows: int = Form(),
):
    """
    Split a file into smaller files based on the number of rows per file and header rows.
    """
    # Validate inputs
    if rows_per_file <= 0:
        return JSONResponse(
            {"error": "Rows per file must be greater than 0"}, status_code=400
        )
    if header_rows <= 0 or header_rows > 10:
        return JSONResponse(
            {"error": "Header rows must be between 1 and 10"}, status_code=400
        )

    # Process the file completely first, then stream the results
    try:
        # Read file content
        file_content = await file.read()
        file_ext = file.filename.split(".")[-1].lower()

        # Process the file based on its type
        if file_ext in ["xlsx", "xls"]:
            df = pd.read_excel(
                io.BytesIO(file_content), header=list(range(header_rows))
            )
        elif file_ext == "csv":
            df = pd.read_csv(io.BytesIO(file_content), header=list(range(header_rows)))
        else:
            return JSONResponse({"error": "Unsupported file type"}, status_code=400)

        # Calculate total work
        total_rows = len(df)
        estimated_files = max((total_rows - header_rows) // rows_per_file + 1, 1)

        # Create a stream for sending events and data
        async def generate_stream():
            # Send initial events
            yield sse_event(
                {
                    "type": "status",
                    "step": "upload",
                    "message": "File loaded successfully",
                }
            )
            yield sse_event(
                {
                    "type": "metadata",
                    "estimated_files": estimated_files,
                    "total_rows": total_rows,
                }
            )

            # Process the file in chunks and create the zip
            # Use BytesIO to build the zip completely in memory
            zip_data = io.BytesIO()

            with zipfile.ZipFile(zip_data, "w", zipfile.ZIP_DEFLATED) as zip_file:
                for i, start in enumerate(range(0, total_rows, rows_per_file)):
                    # Extract chunk of data
                    end = min(start + rows_per_file, total_rows)
                    chunk = df.iloc[start:end]

                    # Create a buffer for this part
                    part_buffer = io.BytesIO()
                    part_filename = (
                        f"part_{i+1}.xlsx"
                        if file_ext in ["xlsx", "xls"]
                        else f"part_{i+1}.csv"
                    )

                    # Write to appropriate format
                    if file_ext in ["xlsx", "xls"]:
                        if isinstance(chunk.columns, pd.MultiIndex):
                            # Join the levels with underscore or another separator
                            chunk.columns = ['_'.join(map(str, col)).rstrip('_') for col in chunk.columns.values]
                        chunk.to_excel(part_buffer, index=False)
                    else:
                        chunk.to_csv(part_buffer, index=False)

                    # Add to zip
                    part_buffer.seek(0)
                    zip_file.writestr(part_filename, part_buffer.getvalue())
                    part_buffer.close()

                    # Send progress update
                    # Also add a small delay to ensure events are received
                    yield sse_event(
                        {
                            "type": "progress",
                            "currentFile": i + 1,
                            "totalFiles": estimated_files,
                            "percentage": int(((i + 1) / estimated_files) * 100),
                        }
                    )
                    await asyncio.sleep(
                        0.01
                    )  # Small delay to help with event processing

            # Complete the zip file and get its contents
            # This is crucial - we need to get the data before the BytesIO object is closed
            zip_data.seek(0)
            final_zip_data = list(zip_data.getvalue())
            zip_data.close()

            # Send completion event
            yield sse_event(
                {"type": "status", "step": "complete", "message": "Processing complete"}
            )
            yield sse_event({"type": "complete", "zipData": final_zip_data})

            # yield b"--zipfile-delimiter--"

            # yield final_zip_data

        return StreamingResponse(
            generate_stream(),
            media_type="text/event-stream",
            headers={
                "Content-Disposition": f"attachment; filename=split_{file.filename}.zip"
            },
        )

    except Exception as e:
        logger.error("Error processing file: %s", str(e))
        return JSONResponse({"error": str(e)}, status_code=500)
