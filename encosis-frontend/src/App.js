// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import DashboardPage from './pages/DashboardPage';

import AlunosPage from './pages/AlunosPage';
import AlunoFormPage from './pages/AlunoFormPage';

import MinicursosPage from './pages/MinicursosPage';
import MinicursoFormPage from './pages/MinicursoFormPage';

import OficinasPage from './pages/OficinasPage';
import OficinaFormPage from './pages/OficinaFormPage';

import ProfessoresPage from './pages/ProfessoresPage';
import ProfessorFormPage from './pages/ProfessorFormPage';

// Optional: Material UI Theme Provider
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// const theme = createTheme({ /* your theme customizations */ });

function App() {
  return (
    // <ThemeProvider theme={theme}>
    <Router>
      <Navbar />
      <div style={{ paddingTop: '80px', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '24px' }}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/alunos" element={<AlunosPage />} />
          <Route path="/alunos/novo" element={<AlunoFormPage />} />
          <Route path="/alunos/editar/:id" element={<AlunoFormPage />} />

          <Route path="/minicursos" element={<MinicursosPage />} />
          <Route path="/minicursos/novo" element={<MinicursoFormPage />} />
          <Route path="/minicursos/editar/:id" element={<MinicursoFormPage />} />

          <Route path="/oficinas" element={<OficinasPage />} />
          <Route path="/oficinas/novo" element={<OficinaFormPage />} /> {/* Changed from /nova for consistency */}
          <Route path="/oficinas/editar/:id" element={<OficinaFormPage />} />

          <Route path="/professores" element={<ProfessoresPage />} />
          <Route path="/professores/novo" element={<ProfessorFormPage />} />
          <Route path="/professores/editar/:id" element={<ProfessorFormPage />} />
        </Routes>
      </div>
    </Router>
    // </ThemeProvider>
  );
}

export default App;