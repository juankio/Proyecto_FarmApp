const slider = document.getElementById("slider");
const slides = document.querySelectorAll(".slide");
let slideIndex = 0; // Índice actual
let slidesVisible = 3; // Imágenes visibles por defecto

function updateSlidesVisible() {
    if (window.innerWidth <= 480) {
        slidesVisible = 1; // 1 imagen visible en móviles
    } else if (window.innerWidth <= 768) {
        slidesVisible = 2; // 2 imágenes visibles en tablets
    } else {
        slidesVisible = 3; // 3 imágenes visibles en escritorio
    }

    const slideWidth = 100 / slidesVisible; // Ajustar ancho según cantidad visible
    slides.forEach((slide) => {
        slide.style.width = `${slideWidth}%`;
    });

    // Corregir índice si sobrepasa el límite válido
    if (slideIndex > slides.length - slidesVisible) {
        slideIndex = Math.max(0, slides.length - slidesVisible);
    }
    updateSliderPosition();
}

function updateSliderPosition() {
    const maxSlideIndex = slides.length - slidesVisible; // Última posición válida
    slideIndex = Math.min(Math.max(slideIndex, 0), maxSlideIndex); // Asegurar que esté dentro del rango
    slider.style.transform = `translateX(-${slideIndex * (100 / slidesVisible)}%)`;
}

function slideLeft() {
    if (slideIndex > 0) {
        slideIndex--;
    } else {
        slideIndex = slides.length - slidesVisible; // Ir al último grupo de imágenes
    }
    updateSliderPosition();
}

function slideRight() {
    if (slideIndex < slides.length - slidesVisible) {
        slideIndex++;
    } else {
        slideIndex = 0; // Regresar al inicio
    }
    updateSliderPosition();
}

// Escuchar redimensionamiento
window.addEventListener("resize", updateSlidesVisible);

// Inicializar
updateSlidesVisible();
