import React from "react";

const EmbeddedAuth = () => {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <iframe
        src="https://advertrone.com"
        title="Embedded Content"
        style={{width: "100%",height:"100%",border:"none"}}
        sandbox="allow-scripts allow-same-origin">
      </iframe>
    </div>
  );
};

export default EmbeddedAuth;
