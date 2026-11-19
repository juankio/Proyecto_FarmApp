<script setup lang="ts">
import PageHero from '../components/layout/PageHero.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppInput from '../components/ui/AppInput.vue';
import AppButton from '../components/ui/AppButton.vue';
import { useContactoForm } from '../composables/useContactoForm';
import { canalesContacto as canales } from '../data/site';
const {
  nombre,
  email,
  asunto,
  mensaje,
  estado,
  tipo,
  enviando,
  enviar,
} = useContactoForm();
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
  font-weight: 600;
  color: var(--aqua);
}
[data-theme="light"] .canal-link {
  color: #0062cc;
}
@media (max-width: 860px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
