const API_URL = process.env.API_URL || "http://localhost:8000";

export const sendSplitRequest = async (file, rowsPerFile, headerRows) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("rows_per_file", rowsPerFile.toString());
  formData.append("header_rows", headerRows.toString());

  const response = await fetch(`${API_URL}/rip`, {
    method: "POST",
    body: formData,
  });

  return response;
};
