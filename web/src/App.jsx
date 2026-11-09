import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import SPLayout from "./layouts/SPLayout";
import TOPSLayout from "./layouts/TOPSLayout";
import FranchiseRecords from "./pages/sp/FranchiseRecords";
import Home from "./pages/tops/Home";

function ComingSoon({ title }) {
  return <h1>{title} (coming soon)</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route path="/sp" element={<SPLayout />}>
          <Route index element={<Navigate to="/sp/franchises" replace />} />
          <Route path="dashboard" element={<ComingSoon title="Dashboard" />} />
          <Route path="franchises" element={<FranchiseRecords />} />
          <Route
            path="evaluations"
            element={<ComingSoon title="Violation Evaluation" />}
          />
          <Route path="reports" element={<ComingSoon title="Reports" />} />
        </Route>

        <Route path="/tops" element={<TOPSLayout />}>
          <Route index element={<Navigate to="/tops/home" replace />} />
          <Route path="home" element={<Home />} />
          <Route
            path="verify"
            element={<ComingSoon title="Verify Franchise" />}
          />
          <Route
            path="report"
            element={<ComingSoon title="Report Violation" />}
          />
          <Route path="history" element={<ComingSoon title="History" />} />
          <Route path="account" element={<ComingSoon title="Account" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
