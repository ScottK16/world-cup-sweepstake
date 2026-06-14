import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";

import Home from "./sections/Home";
import Fixtures from "./sections/Fixtures";
import Teams from "./sections/Teams";
import Leaderboard from "./sections/Leaderboard";
import Dashboard from "./pages/Dashboard"; // 👈 ADD THIS

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* ADD THIS BACK */}
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/fixtures" element={<Fixtures />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Layout>
  );
}