// located at: src/App.js

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HumanResult from "./components/HumanResult";
import Suspected1Result from "./components/Suspected1Result";
import Suspected2Result from "./components/Suspected2Result";
import Bot3Result from "./components/Bot3Result";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/result/human" element={<HumanResult />} />
        <Route path="/result/suspected1" element={<Suspected1Result />} />
        <Route path="/result/suspected2" element={<Suspected2Result />} />
        <Route path="/result/bot3" element={<Bot3Result />} />
        {/* simple 404 */}
        <Route path="*" element={<HumanResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
