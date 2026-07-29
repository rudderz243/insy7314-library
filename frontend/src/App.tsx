import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { BookPage } from "./pages/BookPage";
import { HealthCheckPage } from "./pages/HealthCheckPage";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <main className='app-container'>
        <Routes>
          <Route path='/' element={<BookPage />} />
          <Route path='/health' element={<HealthCheckPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};
export default App;
