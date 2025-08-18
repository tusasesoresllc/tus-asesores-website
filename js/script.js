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

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Verificamos si los elementos existen para evitar errores
    console.log("Script cargado. Buscando elementos del carrusel...");
    
    const wrapper = document.querySelector('.card-wrapper');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const expandButtons = document.querySelectorAll('.expand-button');
    const credentialCards = document.querySelectorAll('.credential-card');
    
    if (!wrapper || !prevButton || !nextButton || credentialCards.length === 0) {
        console.error('Uno o más elementos del carrusel no fueron encontrados. Revisa tu HTML y las clases.');
        return;
    }
    
    console.log("Elementos encontrados. Configurando el carrusel.");

    // 1. Variables de control
    const cardWidth = 320; // Ancho de la tarjeta (300px) + el espacio entre tarjetas (20px)
    let currentIndex = 0;
    const totalCards = credentialCards.length;
    
    // 2. Clonamos las primeras tarjetas para el bucle infinito
    const visibleCards = 3;
    for (let i = 0; i < visibleCards; i++) {
        const clonedCard = credentialCards[i].cloneNode(true);
        wrapper.appendChild(clonedCard);
    }
    
    // 3. Lógica para el botón "Siguiente"
    nextButton.addEventListener('click', () => {
        currentIndex++;
        wrapper.style.transition = 'transform 0.5s ease-in-out';
        wrapper.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        if (currentIndex === totalCards) {
            setTimeout(() => {
                wrapper.style.transition = 'none';
                currentIndex = 0;
                wrapper.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            }, 500);
        }
    });

    // 4. Lógica para el botón "Anterior"
    prevButton.addEventListener('click', () => {
        if (currentIndex === 0) {
            wrapper.style.transition = 'none';
            currentIndex = totalCards;
            wrapper.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            wrapper.offsetWidth; // Forzamos el "repaint"
        }

        currentIndex--;
        wrapper.style.transition = 'transform 0.5s ease-in-out';
        wrapper.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    });

    // 5. Lógica para los botones de expansión
    expandButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.credential-card');
            
            // Cerramos cualquier otra tarjeta que esté expandida
            document.querySelectorAll('.credential-card.expanded').forEach(expandedCard => {
                if (expandedCard !== card) {
                    expandedCard.classList.remove('expanded');
                }
            });
            
            // Alternamos la clase en la tarjeta actual
            card.classList.toggle('expanded');
        });
    });
});