import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [generated, setGenerated] = useState([]);
  const [showGenerated, setShowGenerated] = useState(false);

  useEffect(() => {
    let tmp = [];
    tmp.push([]);
    let m = tmp[0];
    m.push("");
    setData(tmp);
  }, []);

  function updateLine(pindex, sindex, value) {
    let tmp = [...data];
    tmp[pindex][sindex] = value;
    setData(tmp);
  }

  const newLine = (pindex) => {
    let tmp = [...data];
    tmp[pindex].push("");
    setData(tmp);
  };

  const deleteLine = (pindex, sindex) => {
    let tmp = [...data];
    let tmp1 = tmp[pindex];
    tmp1.splice(sindex, 1);
    setData(tmp);
  };

  const insert = (arr, index, newItem) => [
    ...arr.slice(0, index),
    newItem,
    ...arr.slice(index),
  ];

  const newParagraph = (pindex) => {
    let tmp = insert(data, pindex + 1, [[""]]);
    setData(tmp);
  };

  const deleteParagraph = (pindex) => {
    let tmp = [...data];
    tmp.splice(pindex, 1);
    setData(tmp);
  };

  const generateCode = () => {
    let tmp = "";
    for (let i = 0; i < data.length; i++) {
      tmp = tmp + "<St \n";
      for (let j = 0; j < data[i].length; j++) {
        tmp = tmp + `line${j + 1} ={'${data[i][j]}'}\n`;
      }
      tmp = tmp + "/> \n";
    }
    setGenerated(tmp);
    setShowGenerated(true);
  };

  const reset = () => {
    setGenerated([]);
    setShowGenerated(false);
    let tmp = [];
    tmp.push([]);
    let m = tmp[0];
    m.push("");
    setData(tmp);
  };

  return (
    <div className="w3-container">
      <div className="w3-container w3-teal">
        <h1 style={{ textAlign: "center" }}>Generator</h1>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          marginTop: 5,
          marginBottom: 5,
        }}
      >
        <button
          className="w3-button w3-red w3-round-xxlarge"
          onClick={reset}
          style={{ marginLeft: 10 }}
        >
          Reset
        </button>
        <button
          className="w3-button w3-green w3-round-xxlarge"
          onClick={generateCode}
        >
          Genearte Code
        </button>
      </div>
      <div className="w3-panel">
        <div className={`w3-container ${showGenerated ? "" : "w3-hide"}`}>
          <button
            className="w3-button w3-green w3-tiny"
            onClick={() => {
              navigator.clipboard.writeText(generated);
              alert("Copied Successfully");
            }}
          >
            Copy Code
          </button>
          <textarea className="w3-input" value={generated} />
        </div>
      </div>

      <br />
      {data?.map((p, pindex) => {
        return (
          <>
            <div className="w3-panel w3-pale-green">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {pindex + 1}
                {pindex > 0 ? (
                  <button
                    className="w3-button w3-red w3-ripple w3-tiny"
                    onClick={() => {
                      deleteParagraph(pindex);
                    }}
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            </div>
            <div className="w3-container w3-sand">
              {data[pindex] &&
                data[pindex]?.map((s, sindex) => {
                  return (
                    <>
                      <div style={{ display: "flex" }}>
                        <input
                          className="w3-input"
                          type="text"
                          placeholder={`Enter Line ${sindex + 1}`}
                          value={data[pindex][sindex]}
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
                        {data[pindex].length - 1 === sindex ? (
                          <>
                            <button
                              className="w3-button w3-indigo w3-tiny"
                              onClick={() => {
                                newParagraph(pindex);
                              }}
                            >
                              New Paragraph
                            </button>
                            <button
                              className="w3-button w3-khaki w3-tiny"
                              onClick={() => {
                                newLine(pindex);
                              }}
                              style={{ marginRight: 10 }}
                            >
                              New Line
                            </button>
                          </>
                        ) : null}
                      </div>
                    </>
                  );
                })}
            </div>
            <hr />
          </>
        );
      })}
    </div>
  );
}

export default App;
