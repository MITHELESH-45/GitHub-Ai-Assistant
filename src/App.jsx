import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

function App() {
  const [currentRepo, setCurrentRepo] = useState(null);

  const handleAnalyze = (url) => {
    setCurrentRepo(url);
  };

  const clearRepo = () => {
    setCurrentRepo(null);
  };

  return (
    <>
      {currentRepo ? (
        <Dashboard repoUrl={currentRepo} onClear={clearRepo} />
      ) : (
        <Home onAnalyze={handleAnalyze} />
      )}
    </>
  );
}

export default App;
