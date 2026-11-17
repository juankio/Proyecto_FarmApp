import { ApiError, apiPost, setToken, showMessage } from './api-client.js';

function serialize(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function onError(container, error) {
  showMessage(container, error instanceof ApiError ? error.message : 'Ocurrió un error inesperado', 'error');
}

function wireLogin() {
  const form = document.getElementById('login-form');
  if (!form) return;
  const msg = document.getElementById('form-messages');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showMessage(msg, 'Iniciando sesión...', 'info');
    try {
      const data = await apiPost('/auth/login', serialize(form));
      setToken(data.token);
      showMessage(msg, `¡Bienvenido, ${data.usuario.nombres}!`, 'ok');
      setTimeout(() => { window.location.href = '../index.html'; }, 900);
    } catch (error) {
      onError(msg, error);
    }
  });
}

function wireRegister() {
  const form = document.getElementById('register-form');
  if (!form) return;
  const msg = document.getElementById('form-messages');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showMessage(msg, 'Registrando usuario...', 'info');
    try {
      await apiPost('/auth/register', serialize(form));
      showMessage(msg, 'Registro exitoso. Ya puedes iniciar sesión.', 'ok');
      form.reset();
    } catch (error) {
      onError(msg, error);
    }
  });
}

function wireContacto() {
  const form = document.getElementById('contacto-form');
  if (!form) return;
  const msg = document.getElementById('form-messages');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showMessage(msg, 'Enviando mensaje...', 'info');
    try {
      await apiPost('/contactos', serialize(form));
      showMessage(msg, 'Mensaje enviado. Gracias por escribirnos.', 'ok');
      form.reset();
    } catch (error) {
      onError(msg, error);
    }
  });
}

function wireEncuesta() {
  const form = document.getElementById('encuesta-form');
  if (!form) return;
  const msg = document.getElementById('form-messages');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const datos = serialize(form);
    const payload = {
      ...datos,
      calificacion: Number(datos.calificacion),
      recomendaria: form.elements.recomendaria.checked,
    };
    showMessage(msg, 'Registrando tu opinión...', 'info');
    try {
      await apiPost('/encuestas', payload);
      showMessage(msg, '¡Gracias por participar en la encuesta!', 'ok');
      form.reset();
    } catch (error) {
      onError(msg, error);
    }
  });
}

export function wireForms() {
  wireLogin();
  wireRegister();
  wireContacto();
  wireEncuesta();
}
