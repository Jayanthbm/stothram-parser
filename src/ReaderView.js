import React from "react";
import "./readerview.css";

const Paragraph = ({ data }) => {
  return (
    <div className="paragarph-container">
      {data?.lines?.map((line, index) => {
        return (
          <span key={index} className="line">
            {line}
          </span>
        );
      })}
    </div>
  );
};

const Subheading = ({ data }) => {
  return (
    <div className="subheading-container">
      <span className="subheading-text">{data.title}</span>
    </div>
  );
};

const ReaderView = ({ data }) => {
  return (
    <div className="reader-data">
      <div className="app-header">
        <span className="app-header-title">{data?.title}</span>
      </div>
      {data?.content?.map((item, index) => {
        if (item?.type === "paragraph") {
          return <Paragraph data={item} key={index} />;
        }
        if (item.type === "subheading") {
          return <Subheading data={item} key={index} />;
        }
        return null;
      })}
    </div>
  );
};

export default ReaderView;
