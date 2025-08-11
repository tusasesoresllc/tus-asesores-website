document.addEventListener('DOMContentLoaded', () => {
    // Código para la sección de Metodología (ejemplo anterior)
    const metodologiaTitleWrappers = document.querySelectorAll('.metodologia-title-wrapper');
    metodologiaTitleWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const arrow = wrapper.querySelector('.expand-arrow');
            const description = wrapper.nextElementSibling;
            arrow.classList.toggle('expanded');
            description.classList.toggle('expanded');
        });
    });

    // --- CÓDIGO CORREGIDO PARA LA SECCIÓN DE EQUIPO ---
    // Seleccionamos todas las flechas de expansión en la sección de equipo
    const expandArrowsEquipo = document.querySelectorAll('.equipo-miembro .expand-arrow');

    expandArrowsEquipo.forEach(arrow => {
        arrow.addEventListener('click', () => {
            // En la estructura del equipo, la descripción está después del h4, que es el hermano del arrow.
            // Para llegar a la descripción, debemos encontrar al padre (equipo-miembro) y luego la descripción.
            const miembro = arrow.closest('.equipo-miembro');
            const description = miembro.querySelector('.member-description');

            // Alternamos la clase 'expanded' en la flecha
            arrow.classList.toggle('expanded');
            
            // Alternamos la clase 'expanded' en la descripción
            description.classList.toggle('expanded');
        });
    });
});