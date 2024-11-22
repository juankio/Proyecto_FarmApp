document.addEventListener("DOMContentLoaded", () => {
  // Seleccionar todas las pestañas y el contenido
  const tabs = document.querySelectorAll(".tabs h3");
  const tabContents = document.querySelectorAll(".tab-content div");

  // Agregar evento de clic a cada pestaña
  tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
          // Eliminar clase 'active' de todas las pestañas y contenido
          tabs.forEach((tab) => tab.classList.remove("active"));
          tabContents.forEach((content) => content.classList.remove("active"));

          // Agregar clase 'active' a la pestaña y contenido seleccionados
          tab.classList.add("active");
          tabContents[index].classList.add("active");
      });
  });

  // Hacer que la primera pestaña esté activa por defecto
  if (tabs.length > 0) {
      tabs[0].classList.add("active");
      if (tabContents.length > 0) {
          tabContents[0].classList.add("active");
      }
  }
});
