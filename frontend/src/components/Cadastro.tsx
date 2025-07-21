import { useState, FormEvent } from 'react';

export default function Cadastro() {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    senha: '',
    tipo: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3001/api/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Cadastro realizado com sucesso!');
        // Limpar formulário após sucesso
        setFormData({
          nomeCompleto: '',
          email: '',
          senha: '',
          tipo: ''
        });
      } else {
        alert(`Erro: ${result.message}`);
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao conectar com o servidor');
    }
  };

  return (
    <div style={{
      backgroundColor: '#150B53',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#F9F9F9',
        width: '100%',
        maxWidth: '900px',
        borderRadius: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        {/* Lado esquerdo - Formulário */}
        <div style={{
          flex: '1 1 400px',
          padding: '40px 30px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#150B53',
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            Cadastro
            <img src="/imagens/mascote.png" alt="Mascote" style={{ height: '40px' }} />
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input
              type="text"
              name="nomeCompleto"
              placeholder="Nome completo"
              value={formData.nomeCompleto}
              onChange={handleInputChange}
              required
              style={{
                padding: '12px 16px',
                border: '2px solid #CED0FF',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: 'white',
                outline: 'none'
              }}
            />

            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{
                padding: '12px 16px',
                border: '2px solid #CED0FF',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: 'white',
                outline: 'none'
              }}
            />

            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={formData.senha}
              onChange={handleInputChange}
              required
              style={{
                padding: '12px 16px',
                border: '2px solid #CED0FF',
                borderRadius: '8px',
                fontSize: '16px',
                backgroundColor: 'white',
                outline: 'none'
              }}
            />

            <div style={{
              display: 'flex',
              gap: '20px',
              marginTop: '10px',
              fontSize: '14px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#333'
              }}>
                <input
                  type="radio"
                  name="tipo"
                  value="profissional"
                  checked={formData.tipo === 'profissional'}
                  onChange={handleInputChange}
                  required
                />
                Profissional
              </label>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#333'
              }}>
                <input
                  type="radio"
                  name="tipo"
                  value="estudante"
                  checked={formData.tipo === 'estudante'}
                  onChange={handleInputChange}
                  required
                />
                Estudante
              </label>
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: '#CED0FF',
                color: '#150B53',
                padding: '14px 20px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '20px',
                transition: 'all 0.2s'
              }}
            >
              Cadastrar-se
            </button>

            <p style={{
              textAlign: 'center',
              fontSize: '12px',
              color: '#666',
              marginTop: '15px'
            }}>
              Já possui uma conta? <a href="#" style={{ color: '#150B53', textDecoration: 'none' }}>Faça o login</a>
            </p>
          </form>
        </div>

        {/* Lado direito - Logo */}
        <div style={{
          flex: '1 1 300px',
          background: 'linear-gradient(135deg, #CED0FF 0%, #E8E9FF 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          padding: '40px'
        }}>
          <img src="/imagens/logo.png" alt="Logo Neuma" style={{ width: '60%', maxWidth: '200px', marginBottom: '20px' }} />

          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '15%',
            width: '60px',
            height: '60px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            opacity: 0.4
          }}></div>

          <div style={{
            position: 'absolute',
            top: '30%',
            left: '30%',
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(21,11,83,0.1)',
            borderRadius: '50%',
            opacity: 0.3
          }}></div>
        </div>
      </div>
    </div>
  );
}