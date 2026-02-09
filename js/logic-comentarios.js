const grid = document.getElementById('grid-comentarios');
const form = document.getElementById('form-comentario');

// --- CONTROL DE ADMINISTRADOR ---
let modoAdmin = false;
let dKeyPressCount = 0;
const MI_CLAVE = "tusasesores2026"; // <--- CLAVE ACTUALIZADA

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'd') {
        dKeyPressCount++;
        if (dKeyPressCount === 3) {
            const pass = prompt("Acceso Administrador - Ingresa Clave:");
            if (pass === MI_CLAVE) { 
                modoAdmin = !modoAdmin;
                alert(modoAdmin ? "MODO SELECCIÓN ACTIVADO: Ahora verás los botones rojos." : "MODO SELECCIÓN DESACTIVADO");
                sessionStorage.setItem('isAdminTusAsesores', modoAdmin);
                location.reload(); 
            } else {
                alert("Clave incorrecta");
            }
            dKeyPressCount = 0;
        }
    } else {
        dKeyPressCount = 0;
    }
});

if (sessionStorage.getItem('isAdminTusAsesores') === 'true') modoAdmin = true;

// --- RENDERIZAR COMENTARIOS ---
function renderizarCard(data, id) {
    const estrellasHtml = Array.from({ length: 5 }, (_, i) => 
        `<i class="fa${i < data.rating ? 's' : 'r'} fa-star"></i>`
    ).join('');

    // BOTÓN DE BORRADO (Solo aparece si activaste el modoAdmin con la D)
    const botonEliminar = modoAdmin ? 
        `<button onclick="eliminarManual('${id}')" style="background:#ff3333; color:white; border:none; padding:10px; border-radius:8px; cursor:pointer; width:100%; margin-top:15px; font-weight:bold; font-family:sans-serif;">
            ELIMINAR ESTE COMENTARIO
        </button>` : '';

    const cardHTML = `
        <div class="oliver-card" id="card-${id}">
            <div class="card-top">
                <div><h4>${data.nombre}</h4><span>${data.cargo}</span></div>
                <div class="quote-icon"><i class="fas fa-quote-right"></i></div>
            </div>
            <div class="stars">${estrellasHtml}</div>
            <p class="comment-body">${data.mensaje}</p>
            ${botonEliminar}
        </div>
    `;
    grid.insertAdjacentHTML('afterbegin', cardHTML);
}

// --- CONEXIÓN FIREBASE ---
database.ref('testimonios').on('child_added', (snapshot) => {
    renderizarCard(snapshot.val(), snapshot.key);
});

database.ref('testimonios').on('child_removed', (snapshot) => {
    const el = document.getElementById(`card-${snapshot.key}`);
    if (el) el.remove();
});

// --- ACCIÓN DE ELIMINAR ---
window.eliminarManual = (id) => {
    if (confirm("¿Segura que quieres borrar este comentario?")) {
        database.ref('testimonios/' + id).remove()
            .then(() => alert("Eliminado con éxito."));
    }
};

// --- ENVIAR NUEVO ---
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ratingSeleccionado = document.querySelector('input[name="rating"]:checked')?.value || 5;

    const nuevo = {
        nombre: document.getElementById('nombre').value,
        cargo: document.getElementById('cargo').value,
        mensaje: document.getElementById('mensaje').value,
        rating: parseInt(ratingSeleccionado)
    };

    database.ref('testimonios').push(nuevo)
        .then(() => {
            form.reset();
            alert("¡Publicado correctamente!");
        })
        .catch(err => alert("Error de permisos: Revisa las Reglas en Firebase."));
});