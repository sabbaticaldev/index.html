import { exportFile, readFile } from "./file";
// 2. Parse the CSV data
export const parseCSV = (csvData) => {
  const rows = csvData.split("\n");
  const headers = rows[0].split(",");

  return rows.slice(1).map((row) => {
    const values = row.split(",");
    return headers.reduce((object, header, index) => {
      object[header] = values[index];
      return object;
    }, {});
  });
};

// 3. Remove columns
export const removeColumns = (data, columnsToRemove) => {
  return data.map((row) => {
    columnsToRemove.forEach((column) => delete row[column]);
    return row;
  });
};
// Function to convert data to CSV
export const convertToCSV = (data) => {
  if (data.length === 0) return "";

  // Extract headers
  const headers = Object.keys(data[0]);

  // Convert each object to a CSV row
  const rows = data.map((obj) =>
    headers.map((header) => JSON.stringify(obj[header] ?? "")).join(","),
  );

  // Combine headers and rows
  return [headers.join(","), ...rows].join("\n");
};

// Updated exportCSV to use exportFile
export const exportCSV = (data) => {
  const csvString = convertToCSV(data);
  exportFile(csvString, "exported-data.csv", "text/csv");
};
