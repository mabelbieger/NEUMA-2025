const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'seuemail@gmail.com',
    pass: 'suasenhaapp'
  }
});

const enviarEmailToken = async (email, nome, token) => {
  try {
    const mailOptions = {
      from: 'seuemail@gmail.com',
      to: email,
      subject: '🔐 Token de Recuperação de Senha - Neuma',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1B1464;">Recuperação de Senha - Neuma</h2>
          <p>Olá ${nome},</p>
          <p>Use o token abaixo para redefinir sua senha:</p>
          <div style="background: #f0f8ff; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="margin: 0; color: #1B1464; letter-spacing: 5px; font-size: 32px;">${token}</h1>
          </div>
          <p><strong>Este token expira em 2 minutos.</strong></p>
          <p>Atenciosamente,<br><strong>Equipe Neuma</strong></p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
};

module.exports = { enviarEmailToken };