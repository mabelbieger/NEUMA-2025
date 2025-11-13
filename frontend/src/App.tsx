import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Home from './components/Home';
import HomeAluno from './components/HomeAluno'; 
import HomeProfessor from './components/HomeProfessor';
import MinhasTurmas from './components/MinhasTurmas'; 
import Teste from './components/teste';
import Resultado from './components/resultado';
import Personalizada from './components/Personalizada';
import PerfilProfessor from './components/PerfilProfessor';
import PerfilAluno from './components/PerfilAluno';
import AtividadesPublicas from './components/AtividadesPublicas';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/home" element={<Home />} />
      <Route path="/home-aluno" element={<HomeAluno />} />
      <Route path="/home-professor" element={<HomeProfessor />} />
      <Route path="/MinhasTurmas" element={<MinhasTurmas />} /> 
      <Route path="/teste" element={<Teste />} />
      <Route path="/resultado" element={<Resultado />} />
      <Route path="/personalizada" element={<Personalizada />} />
      <Route path="/perfil-professor" element={<PerfilProfessor />} />
      <Route path="/perfil-aluno" element={<PerfilAluno />} />
      <Route path="/atividades-publicas" element={<AtividadesPublicas />} />
    </Routes>
  );
}