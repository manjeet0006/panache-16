import { useState } from "react";

export default function CsvToJson() {
  const [jsonData, setJsonData] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target.result;
      const json = csvToJson(csvText);
      setJsonData(json);
    };

    reader.readAsText(file);
  };

  // 🔥 CSV → JSON (Cleans extra quotes)
  const csvToJson = (csv) => {
    const lines = csv
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const headers = lines[0]
      .split(",")
      .map((h) => h.replace(/"/g, "").trim());

    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      const obj = {};

      headers.forEach((header, index) => {
        obj[header] = (values[index] || "")
          .replace(/"/g, "")
          .trim();
      });

      result.push(obj);
    }

    return result;
  };

  const downloadJson = () => {
    const blob = new Blob(
      [JSON.stringify(jsonData, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          CSV to JSON Converter
        </h1>

        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full mb-4 text-sm text-gray-700
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />

        {jsonData && (
          <>
            <button
              onClick={downloadJson}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Download JSON
            </button>

            <pre className="bg-gray-900 text-green-300 p-4 rounded-lg overflow-auto max-h-[400px] text-sm">
              {JSON.stringify(jsonData, null, 2)}
            </pre>
          </>
        )}
      </div>
    </div>
  );
}
