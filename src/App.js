import React, { useEffect, useState } from "react";
import EditView from "./EditView";
import ImportView from "./ImportView";

const VIEWS = {
  EDITOR: "editor",
  IMPORT: "import",
};
function App() {
  const [data, setData] = useState([]);
  const [generated, setGenerated] = useState([]);
  const [showGenerated, setShowGenerated] = useState(false);
  const [title, setTitle] = useState("");

  // Import view states
  const [importType, setImportType] = useState("url"); // "url" or "json"
  const [jsonUrl, setJsonUrl] = useState("");
  const [localJson, setLocalJson] = useState("");
  const [importError, setImportError] = useState("");
  const [view, setView] = useState(VIEWS.EDITOR);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let tmp = [];
    setData(tmp);
  }, []);

  function updateLine(pindex, sindex, value) {
    let tmp = [...data];
    tmp[pindex][sindex].lines[0] = value;
    setData(tmp);
    setShowGenerated(false);
  }

  const newLine = (pindex) => {
    let tmp = [...data];
    tmp[pindex].push({ type: "line", lines: [""] });
    setData(tmp);
    setShowGenerated(false);
  };

  const deleteLine = (pindex, sindex) => {
    let tmp = [...data];
    let tmp1 = tmp[pindex];
    tmp1.splice(sindex, 1);
    setData(tmp);
    setShowGenerated(false);
  };

  const insert = (arr, index, newItem) => {
    setShowGenerated(false);
    return [...arr.slice(0, index), newItem, ...arr.slice(index)];
  };

  const newParagraph = (pindex) => {
    let tmp = insert(data, pindex + 1, [{ type: "paragraph", lines: [""] }]);
    setData(tmp);
    setShowGenerated(false);
  };

  const deleteParagraph = (pindex) => {
    let tmp = [...data];
    tmp.splice(pindex, 1);
    setData(tmp);
    setShowGenerated(false);
  };
  const newSubheading = (pindex) => {
    let tmp = insert(data, pindex + 1, [{ type: "subheading", lines: [""] }]);
    setData(tmp);
    setShowGenerated(false);
  };

  const generateCode = () => {
    let jsonData = {
      title: title,
      content: [],
    };

    for (let i = 0; i < data.length; i++) {
      if (data[i][0].type === "subheading") {
        // Subheading
        jsonData.content.push({
          type: "SubHeader",
          title: data[i][0].lines[0],
        });
      } else if (data[i][0].type === "paragraph") {
        // Paragraph
        let paragraph = {
          type: "St",
          lines: [],
        };

        for (let j = 0; j < data[i].length; j++) {
          paragraph.lines.push(...data[i][j].lines);
        }

        jsonData.content.push(paragraph);
      }
    }

    setGenerated(JSON.stringify(jsonData, null, 2));
    setShowGenerated(true);
  };

  const reset = () => {
    setGenerated([]);
    setShowGenerated(false);
    setTitle("");
    let tmp = [];
    setData(tmp);
  };

  const convertToDataFormat = (jsonData) => {
    let tmp = [];
    for (let i = 0; i < jsonData.content.length; i++) {
      let tmp1 = [];
      if (jsonData.content[i].type === "SubHeader") {
        tmp1.push({
          type: "subheading",
          lines: [jsonData.content[i].title],
        });
      }
      if (jsonData.content[i].type === "St") {
        tmp1.push({
          type: "paragraph",
          lines: jsonData.content[i].lines,
        });
        for (let j = 0; j < jsonData.content[i].lines.length; j++) {
          tmp1.push({
            type: "line",
            lines: [jsonData.content[i].lines[j]],
          });
        }
      }

      tmp.push(tmp1);
    }
    return tmp;
  };

  const isValidJson = (jsonData) => {
    const VALIDTYPES = {
      St: true,
      SubHeader: true,
    };

    try {
      // Check if jsonData is an object
      if (typeof jsonData !== "object" || jsonData === null) {
        console.error("Invalid JSON: Not an object");
        return false;
      }

      // Check if 'content' is an array
      if (!Array.isArray(jsonData.content)) {
        console.error("Invalid JSON: 'content' should be an array");
        return false;
      }

      // Iterate through each child of 'content'
      for (let i = 0; i < jsonData.content.length; i++) {
        const child = jsonData.content[i];

        // Check if each child has a 'type' property
        if (!child.hasOwnProperty("type")) {
          console.error(`Invalid JSON: Child ${i} is missing 'type' property`);
          return false;
        }

        // Check if 'type' is a valid type
        if (!VALIDTYPES[child.type]) {
          console.error(
            `Invalid JSON: Child ${i} has an invalid 'type' property`
          );
          return false;
        }

        // Check if 'title' property, if exists, is of type string
        if (
          child.hasOwnProperty("title") &&
          (typeof child.title !== "string" || !child.title.trim())
        ) {
          console.error(
            `Invalid JSON: 'title' property in child ${i} should be a non-empty string`
          );
          return false;
        }

        // Check if 'lines' property, if exists, is an array
        if (
          child.hasOwnProperty("lines") &&
          (!Array.isArray(child.lines) || !child.lines.length)
        ) {
          console.error(
            `Invalid JSON: 'lines' property in child ${i} should be a non-empty array`
          );
          return false;
        }
      }

      // If all conditions pass, consider the JSON as valid
      return true;
    } catch (error) {
      console.error("Error while validating JSON:", error.message);
      return false;
    }
  };

  const handleImport = async () => {
    setLoading(true);
    let convertedJson, jsonData;
    try {
      if (importType === "url") {
        const response = await fetch(jsonUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch JSON data");
        }
        jsonData = await response.json();
      } else if (importType === "json") {
        jsonData = JSON.parse(localJson);
      }

      let valid = isValidJson(jsonData);
      if (valid) {
        setTitle(jsonData.title);
        convertedJson = convertToDataFormat(jsonData);
        setData(convertedJson);
        // Reset import view states
        setJsonUrl("");
        setLocalJson("");
        setImportError("");
        setGenerated("");
        setView(VIEWS.EDITOR);
        setLoading(false);
      } else {
        setImportError("Error parsing Json, Invalid format");
        setJsonUrl("");
        setLocalJson("");
        setGenerated("");
        setLoading(false);
      }
    } catch (error) {
      setImportError(error.message);
      setLoading(false);
    }
  };
  return (
    <div className="w3-container">
      <div className="w3-container w3-teal">
        <h1 style={{ textAlign: "center" }}>Stothram Parser</h1>
      </div>
      <hr />
      <button
        className="w3-button w3-green w3-round-xlarge"
        onClick={() => {
          setView(VIEWS.EDITOR);
        }}
        style={{ marginLeft: 10 }}
      >
        Edit View
      </button>
      <button
        className="w3-button w3-blue w3-round-xlarge"
        onClick={() => {
          setView(VIEWS.IMPORT);
        }}
        style={{ marginLeft: 10 }}
      >
        Import View
      </button>
      <hr />
      {view === VIEWS.EDITOR && (
        <EditView
          data={data}
          generated={generated}
          showGenerated={showGenerated}
          title={title}
          setTitle={setTitle}
          updateLine={updateLine}
          newLine={newLine}
          deleteLine={deleteLine}
          newParagraph={newParagraph}
          deleteParagraph={deleteParagraph}
          newSubheading={newSubheading}
          generateCode={generateCode}
          reset={reset}
        />
      )}
      {view === VIEWS.IMPORT && (
        <ImportView
          importType={importType}
          setImportType={setImportType}
          jsonUrl={jsonUrl}
          setJsonUrl={setJsonUrl}
          localJson={localJson}
          setLocalJson={setLocalJson}
          importError={importError}
          handleImport={handleImport}
          setData={setData}
          loading={loading}
        />
      )}
    </div>
  );
}

export default App;
