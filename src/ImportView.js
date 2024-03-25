import React, { useEffect, useState } from "react";

const ImportView = ({ isValidJson, importHandler }) => {
  const [importType, setImportType] = useState("json"); // "url" or "json"
  const [jsonUrl, setJsonUrl] = useState("");
  const [localJson, setLocalJson] = useState("");
  const [importError, setImportError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editedJson, setEditedJSON] = useState(null);
  const [lastEditedDateTime, setLastEditedDateTime] = useState("");

  const handleImport = async (json) => {
    setLoading(true);
    let jsonData;
    try {
      if (json) {
        jsonData = JSON.parse(json);
      } else {
        if (importType === "url") {
          const response = await fetch(jsonUrl);
          if (!response.ok) {
            throw new Error("Failed to fetch JSON data");
          }
          jsonData = await response.json();
        } else if (importType === "json") {
          jsonData = JSON.parse(localJson);
        }
      }

      let valid = isValidJson(jsonData);
      if (valid) {
        importHandler(jsonData);

        // Reset import view states
        setJsonUrl("");
        setLocalJson("");
        setImportError("");

        setLoading(false);
      } else {
        setImportError("Error parsing Json, Invalid format");
        setJsonUrl("");
        setLocalJson("");
        setLoading(false);
      }
    } catch (error) {
      setImportError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    let cd = localStorage.getItem("stothramData");
    if (cd) {
      setEditedJSON(cd);
      const lastEditedDateTime = localStorage.getItem("stothramDataSaved");
      setLastEditedDateTime(lastEditedDateTime);
    }
  }, []);
  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        maxWidth: "400px",
        margin: "auto",
        marginTop: "20px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <button
          className={`w3-button w3-round-xlarge ${
            importType === "json" ? "w3-blue" : ""
          }`}
          onClick={() => setImportType("json")}
        >
          JSON
        </button>
        <button
          className={`w3-button w3-round-xlarge ${
            importType === "url" ? "w3-blue" : ""
          }`}
          onClick={() => setImportType("url")}
          style={{ marginRight: "10px" }}
        >
          URL
        </button>
      </div>
      {editedJson && (
        <div
          onClick={() => handleImport(editedJson)}
          style={{
            cursor: "pointer",
            color: "#3498db",
            textAlign: "center",
            marginTop: 10,
            marginBottom: 10,
            fontSize: 14,
          }}
        >
          Load Last Edited Data (Last edited: {lastEditedDateTime})
        </div>
      )}
      {importType === "url" && (
        <div style={{ marginTop: "20px" }}>
          <label>
            JSON URL:
            <input
              className="w3-input"
              type="text"
              value={jsonUrl}
              onChange={(e) => setJsonUrl(e.target.value)}
            />
          </label>
        </div>
      )}
      {importType === "json" && (
        <div style={{ marginTop: "20px" }}>
          <label>
            Local JSON:
            <textarea
              className="w3-input"
              value={localJson}
              onChange={(e) => setLocalJson(e.target.value)}
            />
          </label>
        </div>
      )}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          className="w3-button w3-green w3-round-xlarge"
          onClick={handleImport}
        >
          {loading ? "Importing..." : "Import"}
        </button>
      </div>
      {importError && (
        <div style={{ color: "red", marginTop: "10px" }}>{importError}</div>
      )}
    </div>
  );
};

export default ImportView;
