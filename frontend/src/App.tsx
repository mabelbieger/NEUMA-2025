import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Home from './components/Home';
import HomeProfessor from './components/HomeProfessor';
import MinhasTurmas from './components/MinhasTurmas'; 
import Teste from './components/teste';
import Resultado from './components/resultado';
import Personalizada from './components/Personalizada';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/home" element={<Home />} />
      <Route path="/home-professor" element={<HomeProfessor />} />
      <Route path="/MinhasTurmas" element={<MinhasTurmas />} /> 
      <Route path="/teste" element={<Teste />} />
      <Route path="/resultado" element={<Resultado />} />
      <Route path="/personalizada" element={<Personalizada />} />
    </Routes>
  );
}
