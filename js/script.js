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

    console.log("Script cargado. Buscando elementos del carrusel...");
    
    const wrapper = document.querySelector('.card-wrapper');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const expandButtons = document.querySelectorAll('.expand-button');
    const credentialCards = document.querySelectorAll('.credential-card');
    
    if (wrapper && prevButton && nextButton && credentialCards.length > 0) {
        console.log("Elementos encontrados. Configurando el carrusel.");

        const cardWidth = 320;
        let currentIndex = 0;
        const totalCards = credentialCards.length;
        
        const visibleCards = 3;
        for (let i = 0; i < visibleCards; i++) {
            if (credentialCards[i]) {
                const clonedCard = credentialCards[i].cloneNode(true);
                wrapper.appendChild(clonedCard);
            }
        }
        
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

        prevButton.addEventListener('click', () => {
            if (currentIndex === 0) {
                wrapper.style.transition = 'none';
                currentIndex = totalCards;
                wrapper.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
                wrapper.offsetWidth;
            }

            currentIndex--;
            wrapper.style.transition = 'transform 0.5s ease-in-out';
            wrapper.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        });

        expandButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const card = event.target.closest('.credential-card');
                
                document.querySelectorAll('.credential-card.expanded').forEach(expandedCard => {
                    if (expandedCard !== card) {
                        expandedCard.classList.remove('expanded');
                    }
                });
                
                card.classList.toggle('expanded');
            });
        });
    }

    // Nueva lógica para expandir/contraer los artículos (ahora con un bucle)
    const articulos = document.querySelectorAll('.articulo-guia');

    articulos.forEach(articulo => {
        const toggleButton = articulo.querySelector('.btn-expandir');
        const contenidoCompleto = articulo.querySelector('.articulo-contenido-completo');
        const btnText = articulo.querySelector('.btn-expandir-text');

        if (toggleButton && contenidoCompleto && btnText) {
            toggleButton.addEventListener('click', () => {
                const isExpanded = contenidoCompleto.style.display === 'block';
                
                if (isExpanded) {
                    contenidoCompleto.style.display = 'none';
                    btnText.textContent = 'Leer más';
                } else {
                    contenidoCompleto.style.display = 'block';
                    btnText.textContent = 'Leer menos';
                }
                
                articulo.classList.toggle('articulo-expandido');
            });
        }
    });
});