// ImportView.js
import React from "react";

const ImportView = ({
  importType,
  setImportType,
  jsonUrl,
  setJsonUrl,
  localJson,
  setLocalJson,
  importError,
  handleImport,
  loading,
}) => {
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
            importType === "url" ? "w3-blue" : ""
          }`}
          onClick={() => setImportType("url")}
          style={{ marginRight: "10px" }}
        >
          URL
        </button>
        <button
          className={`w3-button w3-round-xlarge ${
            importType === "json" ? "w3-blue" : ""
          }`}
          onClick={() => setImportType("json")}
        >
          JSON
        </button>
      </div>
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
