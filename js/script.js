document.addEventListener('DOMContentLoaded', () => {

    const metodologiaTitleWrappers = document.querySelectorAll('.metodologia-title-wrapper');
    metodologiaTitleWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const arrow = wrapper.querySelector('.expand-arrow');
            const description = wrapper.closest('.metodologia-item').querySelector('.metodologia-description');
            arrow.classList.toggle('expanded');
            description.classList.toggle('expanded');
        });
    });

    const expandArrowsEquipo = document.querySelectorAll('.equipo-miembro .expand-arrow');
    expandArrowsEquipo.forEach(arrow => {
        arrow.addEventListener('click', () => {
            const miembro = arrow.closest('.equipo-miembro');
            const description = miembro.querySelector('.member-description');
            arrow.classList.toggle('expanded');
            description.classList.toggle('expanded');
        });
    });

    const servicioCards = document.querySelectorAll('.servicio-card');

    servicioCards.forEach(card => {
        card.addEventListener('click', () => {
            const isActive = card.classList.contains('active');

            servicioCards.forEach(c => c.classList.remove('active'));

            if (!isActive) {
                card.classList.add('active');
            }
        });
    });

    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

});