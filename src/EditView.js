import React from "react";

const EditView = ({
  data,
  generated,
  showGenerated,
  title,
  updateLine,
  newLine,
  deleteLine,
  newParagraph,
  deleteParagraph,
  newSubheading,
  generateCode,
  reset,
  setTitle,
}) => {
  const handleDownload = () => {
    const blob = new Blob([generated], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "generated_data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          onClick={generateCode}
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
      {data?.map((p, pindex) => {
        return (
          <div key={pindex}>
            <div className="w3-panel w3-pale-green">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {pindex + 1} -{" "}
                {p[0].type === "paragraph" ? "Paragraph" : "Subheading"}
                <button
                  className="w3-button w3-red w3-ripple w3-tiny"
                  onClick={() => {
                    deleteParagraph(pindex);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="w3-container w3-sand">
              {p.map((s, sindex) => {
                return (
                  <div key={sindex}>
                    <div style={{ display: "flex" }}>
                      <input
                        className="w3-input"
                        type="text"
                        placeholder={`Enter ${
                          s.type === "paragraph" || "line" ? "Line" : "Title"
                        } ${sindex + 1}`}
                        value={s.lines[0]}
                        onChange={(e) => {
                          updateLine(pindex, sindex, e.target.value);
                        }}
                      />
                      {sindex > 0 ? (
                        <button
                          className="w3-button w3-red w3-tiny"
                          onClick={() => {
                            deleteLine(pindex, sindex);
                          }}
                        >
                          D
                        </button>
                      ) : null}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row-reverse",
                        marginTop: 5,
                        marginBottom: 5,
                      }}
                    >
                      <>
                        <button
                          className="w3-button w3-lime w3-tiny"
                          onClick={() => {
                            newSubheading(pindex);
                          }}
                        >
                          New Subheading
                        </button>
                        <button
                          className="w3-button w3-indigo w3-tiny"
                          onClick={() => {
                            newParagraph(pindex);
                          }}
                          style={{ marginRight: 10 }}
                        >
                          New Paragraph
                        </button>
                        {(s.type === "paragraph" || s.type === "line") && (
                          <button
                            className="w3-button w3-khaki w3-tiny"
                            onClick={() => newLine(pindex)}
                            style={{ marginRight: 10 }}
                          >
                            New Line
                          </button>
                        )}
                      </>
                    </div>
                  </div>
                );
              })}
            </div>
            <hr />
          </div>
        );
      })}
    </>
  );
};

export default EditView;
