import React, { useState } from "react";

const EditView = ({ data, setData }) => {
  const [generated, setGenerated] = useState([]);
  const [showGenerated, setShowGenerated] = useState(false);

  const reset = () => {
    setGenerated(null);
    setShowGenerated(false);
    setData(null);
  };

  const generateCode = (jsonData) => {
    setGenerated(JSON.stringify(jsonData, null, 2));
    setShowGenerated(true);
  };

  const handleDownload = () => {
    const blob = new Blob([generated], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "generated_data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const storeToLocalStorage = (data) => {
    localStorage.setItem("stothramData", JSON.stringify(data));
    const currentTime = new Date().toLocaleString();
    localStorage.setItem("stothramDataSaved", currentTime);
    return true;
  };

  const updateTitle = (title) => {
    setData((prevData) => {
      const newData = {
        ...prevData,
        title: title,
      };
      storeToLocalStorage(newData);
      return newData;
    });
    setShowGenerated(false);
  };

  const newParagraph = (index) => {
    setData((prevData) => {
      const newData = { ...prevData };
      newData?.content?.splice(index + 1, 0, {
        type: "paragraph",
        lines: [""],
      });
      storeToLocalStorage(newData);
      return newData;
    });
    setShowGenerated(false);
  };

  const newSubheading = (index) => {
    setData((prevData) => {
      const newData = { ...prevData };
      newData?.content?.splice(index + 1, 0, {
        type: "subheading",
        title: "",
      });
      storeToLocalStorage(newData);
      return newData;
    });
    setShowGenerated(false);
  };

  const deleteItem = (index) => {
    setData((prevData) => {
      const newData = { ...prevData };
      if (newData?.content && index >= 0 && index < newData.content.length) {
        newData.content.splice(index, 1);
      }
      storeToLocalStorage(newData);
      return newData;
    });
    setShowGenerated(false);
  };

  const newLine = (paragraphIndex) => {
    setData((prevData) => {
      const newData = { ...prevData };
      const paragraph = newData?.content?.[paragraphIndex];
      if (paragraph && paragraph.type === "paragraph") {
        paragraph.lines.push("");
      }
      storeToLocalStorage(newData);
      return newData;
    });
    setShowGenerated(false);
  };

  const updateLine = (paragraphIndex, lineIndex, value) => {
    setData((prevData) => {
      const newData = { ...prevData };
      const paragraph = newData?.content?.[paragraphIndex];
      if (paragraph && paragraph.type === "paragraph") {
        if (lineIndex >= 0 && lineIndex < paragraph.lines.length) {
          paragraph.lines[lineIndex] = value;
        }
      }
      storeToLocalStorage(newData);
      return newData;
    });
    setShowGenerated(false);
  };

  const deleteLine = (paragraphIndex, lineIndex) => {
    setData((prevData) => {
      const newData = { ...prevData };
      const paragraph = newData?.content?.[paragraphIndex];
      if (paragraph && paragraph.type === "paragraph") {
        if (lineIndex >= 0 && lineIndex < paragraph.lines.length) {
          paragraph.lines.splice(lineIndex, 1);
        }
      }
      storeToLocalStorage(newData);
      return newData;
    });
    setShowGenerated(false);
  };

  const updateSubHeading = (subHeadingIndex, value) => {
    setData((prevData) => {
      const newData = { ...prevData };
      const subHeading = newData?.content?.[subHeadingIndex];
      if (subHeading && subHeading.type === "subheading") {
        subHeading.title = value;
      }
      storeToLocalStorage(newData);
      return newData;
    });
    setShowGenerated(false);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          marginTop: 5,
          marginBottom: 5,
        }}
      >
        <button
          className="w3-button w3-red w3-round-xlarge"
          onClick={reset}
          style={{ marginLeft: 10 }}
        >
          Reset
        </button>
        <button
          className="w3-button w3-green w3-round-xlarge"
          onClick={() => {
            generateCode(data);
          }}
        >
          Generate Code
        </button>
      </div>
      <div className="w3-panel">
        <div className={`w3-container ${showGenerated ? "" : "w3-hide"}`}>
          <button
            className="w3-button w3-blue w3-tiny"
            onClick={handleDownload}
            style={{ marginLeft: 10 }}
          >
            Download
          </button>
          <button
            className="w3-button w3-green w3-tiny"
            onClick={() => {
              navigator.clipboard
                .writeText(generated)
                .then(() => {
                  console.log("Copied Successfully");
                })
                .catch((error) => {
                  console.error("Copy failed:", error);
                  alert("Copy failed. See console for details.");
                });
            }}
          >
            Copy Code
          </button>
          <textarea className="w3-input" value={generated} />
        </div>
      </div>
      <div className="w3-panel" style={{ textAlign: "center" }}>
        <input
          className="w3-input"
          type="text"
          placeholder="Enter Title"
          value={data?.title ? data?.title : ""}
          onChange={(e) => updateTitle(e.target.value)}
          style={{ marginBottom: 10 }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <button
            className="w3-button w3-indigo w3-tiny"
            onClick={() => {
              newParagraph(0);
            }}
            style={{ margin: "0 5px" }}
          >
            Add Paragraph
          </button>
          <button
            className="w3-button w3-lime w3-tiny"
            onClick={() => {
              newSubheading(0);
            }}
            style={{ margin: "0 5px" }}
          >
            Add Subheading
          </button>
        </div>
      </div>
      <br />
      {data?.content?.map((item, index) => (
        <div key={index} className="w3-panel w3-pale-green">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {index + 1} -
            {item.type === "paragraph" ? "Paragraph" : "Subheading"}
            <button
              className="w3-button w3-red w3-ripple w3-tiny"
              onClick={() => deleteItem(index)}
            >
              Delete
            </button>
          </div>
          {item.type === "paragraph" ? (
            <>
              {item.lines.map((line, lineIndex) => (
                <div key={lineIndex} style={{ display: "flex" }}>
                  <input
                    type="text"
                    className="w3-input"
                    placeholder={`Enter Line ${lineIndex + 1}`}
                    value={line}
                    onChange={(e) =>
                      updateLine(index, lineIndex, e.target.value)
                    }
                  />
                  <button
                    className="w3-button w3-red w3-tiny"
                    onClick={() => {
                      deleteLine(index, lineIndex);
                    }}
                  >
                    D
                  </button>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  marginTop: 5,
                  marginBottom: 5,
                }}
              >
                <button
                  className="w3-button w3-khaki w3-tiny"
                  onClick={() => newLine(index)}
                  style={{ marginRight: 10 }}
                >
                  New Line
                </button>
              </div>
            </>
          ) : (
            <input
              className="w3-input"
              type="text"
              placeholder={"Enter Subtitle"}
              value={item.title}
              onChange={(e) => {
                updateSubHeading(index, e.target.value);
              }}
            />
          )}
          <>
            <button
              className="w3-button w3-lime w3-tiny"
              onClick={() => {
                newSubheading(index);
              }}
            >
              New Subheading
            </button>
            <button
              className="w3-button w3-indigo w3-tiny"
              onClick={() => {
                newParagraph(index);
              }}
              style={{ marginRight: 10 }}
            >
              New Paragraph
            </button>
          </>
        </div>
      ))}
    </>
  );
};

export default EditView;
