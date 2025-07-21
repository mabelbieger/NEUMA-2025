import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Home.css";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="header">
        <img
          src="/logo neuma 2025 transparente.png"
          alt="Logo Neuma"
          className="logo"
        />
      </div>

      <section className="intro">
        <h1>Site para estímulo do VARK na disciplina de Matemática</h1>
        <p>
          Saber como você aprende melhor pode tornar as aulas de Matemática mais
          fáceis, interessantes e produtivas.
          <br />
          Ao conhecer seu estilo de aprendizagem, fica mais fácil entender os
          conceitos e melhorar seu desempenho.
          <br /> <strong>Clique no botão abaixo e descubra seu jeito de aprender!</strong>
        </p>

        <button className="btn" onClick={() => navigate("/teste")}>
          Realizar o Teste VARK
        </button>
      </section>

      <div className="center-symbol">+ − × ÷ = π</div>

      <section className="secao-vark">
        <div className="vark-container">
          <div className="vark-grid">
            <div className="vark-card">
              <h3>O que é o VARK?</h3>
              <p>
                O VARK - Visual (Visual), Auditiva (Auditory), Leitura/Escrita
                (Read/write), Cinestésica (Kinesthetic) - é uma abordagem que
                identifica os estilos de aprendizagem predominantes em cada
                pessoa, ajudando cada indivíduo a descobrir como assimila melhor
                as informações.
              </p>
            </div>
            <div className="vark-card">
              <h3>Por que usá-lo no ensino da Matemática?</h3>
              <p>
                Conhecer o perfil de aprendizagem dos estudantes ajuda a adaptar
                o ensino da matemática, tornando as aulas mais claras,
                envolventes e eficazes para cada tipo de aprendiz.
              </p>
            </div>
            <div className="vark-card">
              <h3>Dificuldades na aprendizagem da Matemática</h3>
              <p>
                Entender o estilo de aprendizagem por meio do VARK pode ajudar a
                superar desafios comuns no aprendizado da matemática, tornando o
                processo mais acessível e personalizado.
              </p>
            </div>
            <div className="vark-card">
              <h3>Aplicação do VARK no ensino </h3>
              <p>
                O VARK é uma ferramenta valiosa para professores e educadores,
                permitindo a personalização de métodos de ensino e
                potencializando o desempenho dos alunos em matemática.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="center-symbol">+ − × ÷ = π</div>

      <section className="sistemas">
        <h2>Estilos de aprendizagem</h2>
        <p className="descricao">O VARK reconhece quatro estilos:</p>

        <div className="sistema-card">
          <div className="letra-sensorial">V</div>
          <div className="conteudo-sensorial">
            <h3 style={{ marginBottom: "15px" }}>Visual</h3>
            <ul>
              <li>Preferem imagens, gráficos, diagramas e esquemas.</li>
              <li>Memorizam com facilidade o que veem representado visualmente.</li>
              <li>Gostam de mapas mentais e apresentações com cores e formas.</li>
            </ul>
          </div>
        </div>

        <div className="sistema-card">
          <div className="letra-sensorial">A</div>
          <div className="conteudo-sensorial">
            <h3 style={{ marginBottom: "15px" }}>Auditivo</h3>
            <ul>
              <li>Preferem ouvir explicações e conversas em vez de ler.</li>
              <li>Lembram de detalhes de sons ou palavras ouvidas com clareza.</li>
              <li>Tendem a gostar de músicas ou gravações relacionadas ao conteúdo.</li>
            </ul>
          </div>
        </div>

        <div className="sistema-card">
          <div className="letra-sensorial">R</div>
          <div className="conteudo-sensorial">
            <h3 style={{ marginBottom: "15px" }}>Leitura/Escrita</h3>
            <ul>
              <li>Aprendem melhor lendo e escrevendo sobre o conteúdo.</li>
              <li>Gostam de anotar, resumir e ler textos explicativos.</li>
              <li>Preferem textos, listas e manuais como fonte principal.</li>
            </ul>
          </div>
        </div>

        <div className="sistema-card">
          <div className="letra-sensorial">K</div>
          <div className="conteudo-sensorial">
            <h3 style={{ marginBottom: "15px" }}>Cinestésico</h3>
            <ul>
              <li>Aprendem melhor com atividades práticas e movimento.</li>
              <li>Preferem experiências, experimentos e manipulação de objetos.</li>
              <li>Gostam de aprender fazendo, praticando e tocando.</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div>
          <strong>2024</strong> &copy; Site desenvolvido por equipe Neuma
        </div>
        <div>
          <a
            href="https://neuma.com.br"
            target="_blank"
            rel="noreferrer"
            className="link-contato"
          >
            https://neuma.com.br
          </a>
        </div>
        <div>
          <a href="mailto:contato@neuma.com.br" className="link-contato">
            contato@neuma.com.br
          </a>
        </div>
        <div>
          <a href="tel:+5511999999999" className="link-contato">
            +55 11 99999-9999
          </a>
        </div>
      </footer>
    </>
  );
};

export default Home;
