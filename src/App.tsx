import { Route, Routes } from "react-router-dom";
import IndexPage from "@/pages/index";
import { Toaster } from "react-hot-toast";
import Chemadvisor from "./pages/Chemadvisor";
import DocumentDetails from "./pages/DocumentDetails";

function App() {
  return (
    <div>
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<Chemadvisor />} path="/chemadvisor" />
        <Route
          element={<DocumentDetails />}
          path="/chemadvisor/document/:documentId"
        />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default App;
