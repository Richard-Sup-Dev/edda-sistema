// backend/src/utils/email.js
import nodemailer from 'nodemailer';
import logger from '../config/logger.js';

logger.info('CARREGANDO E-MAIL REAL — VAI CHEGAR NO GMAIL DE VERDADE!');

// GMAIL REAL — FUNCIONANDO PERFEITO EM 2025
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'natsunokill188@gmail.com',           // ← seu Gmail
    pass: 'fdxxdockofacqmgo'                     // ← senha de app que você gerou (tudo junto!)
  },
  tls: { rejectUnauthorized: false }
});

// Verifica conexão com o Gmail
transporter.verify((error, success) => {
  if (error) {
    logger.error('ERRO AO CONECTAR NO GMAIL:', error.message);
  } else {
    logger.info('GMAIL CONECTADO COM SUCESSO! PRONTO PRA ENVIAR E-MAILS REAIS!');
  }
});

const sendResetPasswordEmail = async (email, token) => {
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetLink = `${FRONTEND_URL}/redefinir-senha/${token}`;

  try {
    const info = await transporter.sendMail({
      from: '"EDDA Energia" <natsunokill188@gmail.com>',
      to: email,
      subject: 'EDDA - Redefinição de Senha',
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>EDDA - Redefinição de Senha</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { background: #000; font-family: Arial, Helvetica, sans-serif; }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: #000;
              color: #fff;
              padding: 50px 20px;
              text-align: center;
            }
            h1 {
              color: #e67e22;
              font-size: 70px;
              font-weight: 900;
              margin-bottom: 20px;
            }
            h2 {
              font-size: 28px;
              margin: 30px 0;
            }
            p {
              font-size: 18px;
              color: #ccc;
              line-height: 1.6;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              background: linear-gradient(90deg, #e67e22, #c0392b);
              color: white !important;
              font-weight: bold;
              font-size: 24px;
              padding: 20px 80px;
              margin: 40px auto;
              text-decoration: none;
              border-radius: 16px;
              box-shadow: 0 15px 40px rgba(230, 126, 34, 0.5);
              min-width: 280px;
            }
            .footer {
              margin-top: 50px;
              color: #888;
              font-size: 14px;
            }
            @media (max-width: 480px) {
              h1 { font-size: 50px !important; }
              .button {
                font-size: 20px !important;
                padding: 18px 50px !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>EDDA</h1>
            <h2>Redefinição de Senha</h2>
            <p>Clique no botão abaixo para criar uma nova senha segura:</p>
            <a href="${resetLink}" class="button">REDEFINIR SENHA</a>
            <div class="footer">
              <p>Válido por <strong>15 minutos</strong></p>
              <p style="margin-top: 20px;">Se você não solicitou esta alteração, ignore este e-mail.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    logger.info('E-MAIL REAL ENVIADO COM SUCESSO PARA:', email);
    logger.info('ID da mensagem:', info.messageId);

    return info;
  } catch (error) {
    logger.error('ERRO AO ENVIAR E-MAIL:', error.message);
    throw error;
  }
};

export { sendResetPasswordEmail };