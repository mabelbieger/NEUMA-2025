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
  const [recoveryStep, setRecoveryStep] = useState(1);
  const [recoveryToken, setRecoveryToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const enviarEmailToken = async (email: string, nome: string, token: string): Promise<boolean> => {
    try {
      const emailData = {
        service_id: 'service_hxppnxb',
        template_id: 'template_r3n6x8s', 
        user_id: 'xf9Ljhxu447oam886',
        accessToken: 'a6c8d8f4b2e1c9a3e7f5d2b8c4a9e6f3',
        template_params: {
          to_email: email,
          to_name: nome,
          token: token,
          reply_to: email,
          subject: 'Token de Recuperação de Senha - Neuma'
        }
      };

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (response.ok) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const redirectUser = async (user: any) => {
    const tipoUsuario = user.tipo_usuario || user.tipo || '';
    
    if (tipoUsuario === 'Professor') {
      window.location.href = '/home-professor';
    } else {
      try {
        const alunoResponse = await fetch(`http://localhost:3001/api/aluno/${user.id}`);
        const alunoData = await alunoResponse.json();
        
        if (alunoData.success && alunoData.aluno && alunoData.aluno.teste_realizado) {
          window.location.href = '/home-aluno';
        } else {
          window.location.href = '/home';
        }
      } catch (error) {
        window.location.href = '/home';
      }
    }
  };

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
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
     
      const result = await response.json();
     
      if (result.success) {
        if (result.user) {
          localStorage.setItem('loggedUser', JSON.stringify(result.user));
        }
       
        showNotification('Login realizado com sucesso!', 'success');
        await redirectUser(result.user);
      } else {
        showNotification(`Erro: ${result.message}`, 'error');
      }
    } catch (error) {
      showNotification('Erro ao conectar com o servidor', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (recoveryStep === 1) {
      const emailToUse = formData.email;
      
      if (!emailToUse) {
        showNotification('Por favor, digite seu email no campo de login primeiro', 'error');
        return;
      }

      setIsRecoveryLoading(true);
      
      try {
        const response = await fetch('http://localhost:3001/api/solicitar-troca-senha', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: emailToUse })
        });
       
        const result = await response.json();
       
        if (result.success) {
          const emailEnviado = await enviarEmailToken(
            result.email, 
            result.nome, 
            result.token
          );
          
          if (emailEnviado) {
            showNotification('Token enviado para seu email! Verifique sua caixa de entrada.', 'success');
            setRecoveryEmail(result.email);
            setRecoveryStep(2);
          } else {
            showNotification('Erro ao enviar email. O serviço de email pode estar temporariamente indisponível.', 'error');
          }
        } else {
          showNotification(`Erro: ${result.message}`, 'error');
        }
      } catch (error) {
        showNotification('Erro ao conectar com o servidor', 'error');
      } finally {
        setIsRecoveryLoading(false);
      }
    } else if (recoveryStep === 2) {
      if (!recoveryToken) {
        showNotification('Por favor, digite o token', 'error');
        return;
      }

      setIsRecoveryLoading(true);
      
      try {
        const response = await fetch('http://localhost:3001/api/verificar-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: recoveryEmail, 
            token: recoveryToken 
          })
        });
       
        const result = await response.json();
       
        if (result.success) {
          showNotification('Token verificado com sucesso!', 'success');
          setUserId(result.id_usuario);
          setRecoveryStep(3);
        } else {
          showNotification(`Erro: ${result.message}`, 'error');
        }
      } catch (error) {
        showNotification('Erro ao conectar com o servidor', 'error');
      } finally {
        setIsRecoveryLoading(false);
      }
    } else if (recoveryStep === 3) {
      if (!newPassword || !confirmPassword) {
        showNotification('Por favor, preencha ambos os campos de senha', 'error');
        return;
      }

      if (newPassword !== confirmPassword) {
        showNotification('As senhas não coincidem!', 'error');
        return;
      }
      
      if (newPassword.length < 6) {
        showNotification('A senha deve ter pelo menos 6 caracteres', 'error');
        return;
      }
      
      setIsRecoveryLoading(true);
      
      try {
        const response = await fetch('http://localhost:3001/api/trocar-senha', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            id_usuario: userId,
            nova_senha: newPassword
          })
        });
       
        const result = await response.json();
       
        if (result.success) {
          showNotification('Senha alterada com sucesso!', 'success');
          resetRecoveryProcess();
        } else {
          showNotification(`Erro: ${result.message}`, 'error');
        }
      } catch (error) {
        showNotification('Erro ao conectar com o servidor', 'error');
      } finally {
        setIsRecoveryLoading(false);
      }
    }
  };

  const resetRecoveryProcess = () => {
    setShowRecoveryModal(false);
    setRecoveryStep(1);
    setRecoveryEmail('');
    setRecoveryToken('');
    setNewPassword('');
    setConfirmPassword('');
    setUserId(null);
    setIsRecoveryLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const renderRecoveryStep = () => {
    switch (recoveryStep) {
      case 1:
        return (
          <>
            <h3 style={{
              marginBottom: '20px',
              color: '#1B1464',
              textAlign: 'center'
            }}>
              Recuperar Senha
            </h3>
            <p style={{ marginBottom: '20px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
              Enviaremos um token para: <br />
              <strong>{formData.email}</strong>
            </p>
            <p style={{ marginBottom: '20px', textAlign: 'center', color: '#999', fontSize: '12px' }}>
              O token expira em 2 minutos
            </p>
            
            <div style={{
              backgroundColor: '#f0f8ff',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #c8e6ff'
            }}>
              <p style={{ margin: 0, textAlign: 'center', color: '#1B1464', fontSize: '13px' }}>
                Verifique sua caixa de entrada e pasta de spam
              </p>
            </div>
          </>
        );
      
      case 2:
        return (
          <>
            <h3 style={{
              marginBottom: '20px',
              color: '#1B1464',
              textAlign: 'center'
            }}>
              Verificar Token
            </h3>
            <p style={{ marginBottom: '20px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
              Digite o token de 6 dígitos enviado para: <br />
              <strong>{recoveryEmail}</strong>
            </p>
            <input
              type="text"
              placeholder="Digite o token"
              value={recoveryToken}
              onChange={(e) => setRecoveryToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              maxLength={6}
              style={{
                padding: '12px 16px',
                border: '2px solid #CED0FF',
                borderRadius: '8px',
                fontSize: '16px',
                width: '100%',
                boxSizing: 'border-box',
                marginBottom: '20px',
                color: '#000',
                textAlign: 'center',
                letterSpacing: '8px',
                fontSize: '18px',
                fontWeight: 'bold'
              }}
            />
          </>
        );
      
      case 3:
        return (
          <>
            <h3 style={{
              marginBottom: '20px',
              color: '#1B1464',
              textAlign: 'center'
            }}>
              Nova Senha
            </h3>
            <p style={{ marginBottom: '20px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
              Digite sua nova senha
            </p>
            
            <div style={{ position: 'relative', marginBottom: '15px' }}>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Nova senha (mínimo 6 caracteres)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{
                  padding: '12px 45px 12px 16px',
                  border: '2px solid #CED0FF',
                  borderRadius: '8px',
                  fontSize: '16px',
                  width: '100%',
                  boxSizing: 'border-box',
                  color: '#000'
                }}
              />
              <button
                type="button"
                onClick={toggleNewPasswordVisibility}
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
                {showNewPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  padding: '12px 45px 12px 16px',
                  border: '2px solid #CED0FF',
                  borderRadius: '8px',
                  fontSize: '16px',
                  width: '100%',
                  boxSizing: 'border-box',
                  color: '#000'
                }}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
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
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  const renderRecoveryButtons = () => {
    return (
      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end'
      }}>
        {recoveryStep > 1 && (
          <button
            type="button"
            onClick={() => setRecoveryStep(recoveryStep - 1)}
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
            Voltar
          </button>
        )}
        
        <button
          type="button"
          onClick={resetRecoveryProcess}
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
            fontWeight: '600',
            opacity: isRecoveryLoading ? 0.6 : 1
          }}
        >
          {isRecoveryLoading ? 'Processando...' : 
           recoveryStep === 1 ? 'Enviar Token' :
           recoveryStep === 2 ? 'Verificar Token' : 'Trocar Senha'}
        </button>
      </div>
    );
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

      {notification && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: notification.type === 'success' ? '#4CAF50' : '#f44336',
          color: 'white',
          padding: '20px 30px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 2000,
          textAlign: 'center',
          maxWidth: '90%',
          fontSize: '16px',
          fontWeight: '500'
        }}>
          {notification.message}
        </div>
      )}

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
                  color: '#000'
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
                  color: '#000'
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
                onClick={() => {
                  if (formData.email) {
                    setRecoveryEmail(formData.email);
                  }
                  setShowRecoveryModal(true);
                }}
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
            <form onSubmit={handlePasswordRecovery}>
              {renderRecoveryStep()}
              {renderRecoveryButtons()}
            </form>
          </div>
        </div>
      )}

      <style>
        {`
          input::placeholder {
            color: #666 !important;
            opacity: 1 !important;
          }
          
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