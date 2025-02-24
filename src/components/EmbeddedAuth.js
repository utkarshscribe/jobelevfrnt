import React from "react";

const EmbeddedAuth = () => {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <iframe
        src="https://sb-auth.skillsbuild.org/"
        title="Embedded Auth"
        style={{ width: "100%", height: "100%", border: "none" }}
      ></iframe>
    </div>
  );
};

export default EmbeddedAuth;
