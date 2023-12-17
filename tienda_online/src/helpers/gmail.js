import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { gmailTransporter } from "../config/gmail.config.js";

// Función para generar un token de correo electrónico
export const generateEmailToken = (email, expireTime) => {
  // Genera el token
  const token = jwt.sign({ email }, config.gmail.secretToken, { expiresIn: expireTime });
  return token;
};

// Función para enviar correo de restablecimiento de contraseña
export const recoveryEmail = async (req, userEmail, emailToken) => {
  try {
    const domain = `${req.protocol}://${req.get('host')}`;
    const link = `${domain}/reset-password?token=${emailToken}`;

    // Enviar el correo con el enlace
    await gmailTransporter.sendMail({
      from: "Zapas Online",
      to: userEmail,
      subject: "Restablece tu contraseña",
      html: `
        <p>Solicitaste restablecer tu contraseña</p>
        <p>Da clic en este enlace: <a href=${link}>Restablecer contraseña</a></p>
      `,
    });
  } catch (error) {
    console.log(`Hubo un error: ${error.message}`);
  }
};

// Función para enviar correo de eliminación por inactividad
export const sendInactiveAccountEmail = async (userEmail) => {
  try {
    // Enviar el correo de eliminación por inactividad
    await gmailTransporter.sendMail({
      from: "Zapas Online",
      to: userEmail,
      subject: "Eliminación de cuenta por inactividad",
      html: `
        <p>Tu cuenta en Zapas Online ha sido eliminada debido a inactividad.</p>
        <p>Si deseas seguir utilizando nuestros servicios, por favor regístrate nuevamente.</p>
        <p>Gracias por ser parte de Zapas Online.</p>
      `,
    });
  } catch (error) {
    console.log(`Hubo un error al enviar el correo: ${error.message}`);
  }
};

// Función para enviar correo de producto eliminado
export const sendProductDeletedEmail = async (userEmail, product) => {
  try {
    await gmailTransporter.sendMail({
      from: "Zapas Online",
      to: userEmail,
      subject: "Producto Eliminado",
      html: `
        <p>Tu producto ${product.title} ha sido eliminado.</p>
        <p>Si tienes alguna pregunta, por favor contáctanos.</p>
        <p>Gracias por ser parte de Zapas Online.</p>
      `,
    });
  } catch (error) {
    console.log(`Hubo un error al enviar el correo: ${error.message}`);
  }
};
