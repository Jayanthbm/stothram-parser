import React, { useState } from "react";
import EditView from "./EditView";
import ImportView from "./ImportView";
import ReaderView from "./ReaderView";

const VIEWS = {
  EDITOR: "editor",
  IMPORT: "import",
  READER: "reader",
};

const isValidJson = (jsonData) => {
  const VALIDTYPES = {
    paragraph: true,
    subheading: true,
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

function App() {
  const [view, setView] = useState(VIEWS.IMPORT);
  const [data, setData] = useState({
    title: "",
    content: [],
  });

  const importHandler = (jsonData) => {
    setData(jsonData);
    setView(VIEWS.EDITOR);
  };

  return (
    <>
      <div className="w3-container">
        <div className="w3-container w3-teal">
          <h1 style={{ textAlign: "center" }}>Stothram Parser</h1>
        </div>
        <hr />
        <button
          className="w3-button w3-blue w3-round-xlarge"
          onClick={() => {
            setView(VIEWS.IMPORT);
          }}
          style={{ marginLeft: 10 }}
        >
          Import View
        </button>
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
          className="w3-button w3-orange w3-round-xlarge"
          onClick={() => {
            setView(VIEWS.READER);
          }}
          style={{ marginLeft: 10 }}
        >
          Reader View
        </button>
        <hr />
        {view === VIEWS.EDITOR && <EditView data={data} setData={setData} />}
        {view === VIEWS.IMPORT && (
          <ImportView isValidJson={isValidJson} importHandler={importHandler} />
        )}
        {view === VIEWS.READER && <ReaderView data={data} />}
      </div>
    </>
  );
}

export default App;
