import { useState } from 'react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [isRecoveryLoading, setIsRecoveryLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
   
    try {
      console.log('=== DEBUG LOGIN ===');
      console.log('Email:', formData.email);
      console.log('Senha:', formData.senha);
     
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
     
      console.log('Status da resposta:', response.status);
      const result = await response.json();
      console.log('Resposta completa do servidor:', result);
     
      if (result.success) {
        if (result.user) {
          localStorage.setItem('loggedUser', JSON.stringify(result.user));
          console.log('Usuário salvo no localStorage:', result.user);
        }
       
        alert('Login realizado com sucesso!');
        
        // Redirecionar baseado no tipo de usuário
        if (result.user && result.user.tipo_usuario === 'Professor') {
          window.location.href = '/home-professor';
        } else {
          window.location.href = '/home';
        }
      } else {
        console.error('Erro de login:', result.message);
        alert(`Erro: ${result.message}`);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro ao conectar com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecoveryLoading(true);
   
    try {
      const response = await fetch('http://localhost:3001/api/recuperar-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: recoveryEmail })
      });
     
      const result = await response.json();
     
      if (result.success) {
        alert('Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.');
        setShowRecoveryModal(false);
        setRecoveryEmail('');
      } else {
        alert(`Erro: ${result.message}`);
      }
    } catch (error) {
      console.error('Erro ao recuperar senha:', error);
      alert('Erro ao conectar com o servidor');
    } finally {
      setIsRecoveryLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{
      backgroundColor: '#1B1464',
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
        maxWidth: '800px',
        height: '500px',
        borderRadius: '20px',
        display: 'flex',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          flex: '1 1 50%',
          background: 'linear-gradient(135deg, #C8B8FF 0%, #E0D4FF 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          padding: '40px 20px',
          minWidth: '300px'
        }}>
          <h1 style={{
            fontSize: 'clamp(20px, 4vw, 28px)',
            fontWeight: '600',
            color: '#2d2d2d',
            marginBottom: '40px',
            textAlign: 'center',
            lineHeight: '1.2'
          }}>
            Bem-vindo(a) novamente!
          </h1>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <img
              src="/imagens/logo.png"
              alt="Logo Neuma"
              style={{
                width: 'clamp(100px, 15vw, 140px)',
                height: 'auto',
                zIndex: 2
              }}
            />
          </div>
        </div>

        <div style={{
          flex: '1 1 50%',
          padding: 'clamp(30px, 5vw, 60px) clamp(20px, 4vw, 50px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: 'white',
          minWidth: '300px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '40px'
          }}>
            <h2 style={{
              fontSize: 'clamp(24px, 5vw, 32px)',
              fontWeight: 'bold',
              color: '#2d2d2d',
              margin: 0
            }}>
              Login
            </h2>
            <img
              src="/imagens/mascote.png"
              alt="Mascote"
              style={{
                height: 'clamp(30px, 5vw, 40px)',
                width: 'auto'
              }}
            />
          </div>

          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div>
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
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  width: '100%',
                  boxSizing: 'border-box',
                  color: '#000' // Adicionado para garantir que o texto seja visível
                }}
                onFocus={(e) => e.target.style.borderColor = '#9B7EFF'}
                onBlur={(e) => e.target.style.borderColor = '#CED0FF'}
              />
            </div>
           
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="senha"
                placeholder="Senha"
                value={formData.senha}
                onChange={handleInputChange}
                required
                style={{
                  padding: '12px 45px 12px 16px',
                  border: '2px solid #CED0FF',
                  borderRadius: '8px',
                  fontSize: '16px',
                  backgroundColor: 'white',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  width: '100%',
                  boxSizing: 'border-box',
                  color: '#000' // Adicionado para garantir que o texto seja visível
                }}
                onFocus={(e) => e.target.style.borderColor = '#9B7EFF'}
                onBlur={(e) => e.target.style.borderColor = '#CED0FF'}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                  fontSize: '18px',
                  padding: '4px',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <div style={{
              textAlign: 'right',
              marginTop: '-10px'
            }}>
              <span
                onClick={() => setShowRecoveryModal(true)}
                style={{
                  color: '#1B1464',
                  textDecoration: 'none',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Esqueceu sua senha?
              </span>
            </div>
           
            <button
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: isLoading ? '#cccccc' : '#CED0FF',
                color: '#1B1464',
                padding: '14px 20px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginTop: '15px',
                transition: 'all 0.2s',
                opacity: isLoading ? 0.7 : 1,
                width: '100%'
              }}
            >
              {isLoading ? 'Fazendo login...' : 'Fazer login'}
            </button>
           
            <p style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#666',
              marginTop: '15px',
              lineHeight: '1.4'
            }}>
              Não possui uma conta?
              <span
                onClick={() => window.location.href = '/cadastro'}
                style={{
                  color: '#1B1464',
                  textDecoration: 'none',
                  fontWeight: '500',
                  marginLeft: '5px',
                  cursor: 'pointer'
                }}
              >
                Cadastre-se
              </span>
            </p>
          </form>
        </div>
      </div>

      {/* Modal de Recuperação de Senha */}
      {showRecoveryModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{
              marginBottom: '20px',
              color: '#1B1464',
              textAlign: 'center'
            }}>
              Recuperar Senha
            </h3>
            <form onSubmit={handlePasswordRecovery}>
              <input
                type="email"
                placeholder="Digite seu e-mail"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                required
                style={{
                  padding: '12px 16px',
                  border: '2px solid #CED0FF',
                  borderRadius: '8px',
                  fontSize: '16px',
                  width: '100%',
                  boxSizing: 'border-box',
                  marginBottom: '20px',
                  color: '#000'
                }}
              />
              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowRecoveryModal(false);
                    setRecoveryEmail('');
                  }}
                  style={{
                    padding: '10px 20px',
                    border: '2px solid #CED0FF',
                    borderRadius: '8px',
                    backgroundColor: 'transparent',
                    color: '#1B1464',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isRecoveryLoading}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: '#CED0FF',
                    color: '#1B1464',
                    cursor: isRecoveryLoading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  {isRecoveryLoading ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>
        {`
          /* Garantir que os placeholders sejam visíveis */
          input::placeholder {
            color: #666 !important;
            opacity: 1 !important;
          }
          
          /* Garantir que o texto digitado seja visível */
          input {
            color: #000 !important;
          }

          @media (max-width: 768px) {
            div[style*="display: flex"] > div[style*="flex: 1 1 50%"] {
              flex: 1 1 100% !important;
              min-width: unset !important;
            }
            div[style*="maxWidth: '800px'"] {
              flex-direction: column !important;
              height: auto !important;
              max-width: 400px !important;
            }
          }
          @media (max-width: 480px) {
            div[style*="padding: '20px'"] {
              padding: 10px !important;
            }
          }
        `}
      </style>
    </div>
  );
}