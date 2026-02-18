import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import "./App.css";

// Original components (if we want to keep them locally)
import Row from "./components/Row/Row";
import requests from "./api/tmdb";
import Banner from "./components/Banner/Banner";
import Navbar from "./components/Navbar/Navbar";

const LandingPage = () => (
  <div className="app">
    <Navbar />
    <Banner />
    <Row
      title="NETFLIX ORIGINALS"
      fetchUrl={requests.fetchNetflixOriginals}
      isLargeRow
    />
    <Row title="Trending Now" fetchUrl={requests.fetchTrending} />
    <Row title="Top Rated" fetchUrl={requests.fetchTopRated} />
    <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} />
    <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} />
    <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} />
    <Row title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} />
    <Row title="Documentaries" fetchUrl={requests.fetchDocumentaries} />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/" element={<Navigate to="/register" />} />
      </Routes>
    </Router>
  );
}

export default App;
