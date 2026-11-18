<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PageHero from '../components/layout/PageHero.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppInput from '../components/ui/AppInput.vue';
import AppButton from '../components/ui/AppButton.vue';
import { ApiError, apiPost } from '../composables/useApi';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const nombre = ref(auth.user ? `${auth.user.nombres} ${auth.user.apellidos}` : '');
const email = ref(auth.user?.email ?? '');
const asunto = ref(typeof route.query.asunto === 'string' ? route.query.asunto : '');
const mensaje = ref(typeof route.query.mensaje === 'string' ? route.query.mensaje : '');
const estado = ref('');
const tipo = ref<'info' | 'ok' | 'error'>('info');
const enviando = ref(false);

const canales = [
  { titulo: 'WhatsApp', texto: 'Respuesta rápida en horario laboral.', href: 'https://wa.link/a4pomp' },
  { titulo: 'Instagram', texto: '@farmapp01', href: 'https://www.instagram.com/farmapp01' },
  { titulo: 'Facebook', texto: 'FarmApp', href: 'https://www.facebook.com/farmapp01' },
];

async function enviar(): Promise<void> {
  enviando.value = true;
  estado.value = 'Enviando mensaje...';
  tipo.value = 'info';
  try {
    await apiPost('/contactos', {
      nombre: nombre.value,
      email: email.value,
      asunto: asunto.value,
      mensaje: mensaje.value,
    });
    estado.value = 'Mensaje enviado. Gracias por escribirnos, te responderemos pronto.';
    tipo.value = 'ok';
    nombre.value = '';
    email.value = '';
    asunto.value = '';
    mensaje.value = '';
    if (route.query.asunto || route.query.mensaje) router.replace('/contactos');
  } catch (error) {
    estado.value = error instanceof ApiError ? error.message : 'Ocurrió un error inesperado';
    tipo.value = 'error';
  } finally {
    enviando.value = false;
  }
}
</script>

<template>
  <PageHero
    eyebrow="Contacto"
    title="Escríbenos"
    lede="¿Tienes una pregunta o sugerencia? Te leemos. También puedes encontrarnos en nuestras redes sociales."
    compact
    centered
  />

  <section class="section reveal">
    <div class="contact-grid">
      <AppCard class="form-card">
        <form class="form-fields" @submit.prevent="enviar">
          <div class="field">
            <label for="contacto-nombre">Nombre</label>
            <AppInput id="contacto-nombre" v-model="nombre" placeholder="Tu nombre" required />
          </div>
          <div class="field">
            <label for="contacto-email">Email</label>
            <AppInput
              id="contacto-email"
              v-model="email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>
          <div class="field">
            <label for="contacto-asunto">Asunto</label>
            <AppInput id="contacto-asunto" v-model="asunto" placeholder="¿En qué te ayudamos?" required />
          </div>
          <div class="field">
            <label for="contacto-mensaje">Mensaje</label>
            <textarea
              id="contacto-mensaje"
              v-model="mensaje"
              class="app-textarea"
              placeholder="Escribe tu mensaje"
              minlength="10"
              required
            />
          </div>
          <AppButton type="submit" block size="lg" :disabled="enviando">
            {{ enviando ? 'Enviando...' : 'Enviar mensaje' }}
          </AppButton>
        </form>

        <div v-if="estado" class="form-message" :class="tipo">{{ estado }}</div>
      </AppCard>

      <div class="canales">
        <AppCard v-for="c in canales" :key="c.titulo">
          <h3>{{ c.titulo }}</h3>
          <p>{{ c.texto }}</p>
          <a :href="c.href" target="_blank" rel="noopener" class="canal-link">Abrir →</a>
        </AppCard>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-grid {
  display: grid;
  grid-template-columns: minmax(0, 520px) minmax(0, 1fr);
  gap: 22px;
  align-items: start;
  justify-content: center;
}

.form-card {
  width: 100%;
}

.canales {
  display: grid;
  gap: 14px;
}

.canales h3 {
  font-size: 1rem;
  margin-bottom: 6px;
}

.canales p {
  font-size: 0.88rem;
}

.canal-link {
  display: inline-block;
  margin-top: 10px;
  font-size: 0.84rem;
  font-weight: 650;
  color: var(--blue-deep);
}

@media (max-width: 860px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
