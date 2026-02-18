// Importamos las funciones necesarias de la versión que tienes (SDK v9+)
import { getDatabase, ref, push, onChildAdded, onChildRemoved, remove } 
    from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

const db = getDatabase();
const grid = document.getElementById('grid-comentarios');
const form = document.getElementById('form-comentario');

// --- CONTROL DE ADMINISTRADOR ---
let modoAdmin = sessionStorage.getItem('isAdminTusAsesores') === 'true';
const MI_CLAVE = "tusasesores2026";
let dKeyPressCount = 0;

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'd') {
        dKeyPressCount++;
        if (dKeyPressCount === 3) {
            const pass = prompt("Acceso Administrador:");
            if (pass === MI_CLAVE) { 
                modoAdmin = !modoAdmin;
                sessionStorage.setItem('isAdminTusAsesores', modoAdmin);
                alert(modoAdmin ? "MODO EDICIÓN ACTIVADO" : "MODO EDICIÓN DESACTIVADO");
                location.reload(); 
            }
            dKeyPressCount = 0;
        }
    } else { dKeyPressCount = 0; }
});

// --- RENDERIZAR COMENTARIOS ---
function renderizarCard(data, id) {
    const estrellasHtml = Array.from({ length: 5 }, (_, i) => 
        `<i class="fa${i < data.rating ? 's' : 'r'} fa-star"></i>`
    ).join('');

    const botonEliminar = modoAdmin ? 
        `<button class="btn-delete" data-id="${id}" style="background:#ff3333; color:white; border:none; padding:10px; border-radius:8px; cursor:pointer; width:100%; margin-top:15px; font-weight:bold;">
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

    // Asignar evento al botón si existe
    if (modoAdmin) {
        const btn = document.querySelector(`[data-id="${id}"]`);
        btn.onclick = () => eliminarManual(id);
    }
}

// --- CONEXIÓN FIREBASE (LECTURA) ---
const testimoniosRef = ref(db, 'testimonios');

onChildAdded(testimoniosRef, (snapshot) => {
    renderizarCard(snapshot.val(), snapshot.key);
});

onChildRemoved(testimoniosRef, (snapshot) => {
    const el = document.getElementById(`card-${snapshot.key}`);
    if (el) el.remove();
});

// --- ACCIÓN DE ELIMINAR ---
async function eliminarManual(id) {
    if (confirm("¿Segura que quieres borrar este comentario?")) {
        try {
            await remove(ref(db, `testimonios/${id}`));
            alert("Eliminado con éxito.");
        } catch (err) { alert("Error al eliminar."); }
    }
}

// --- ENVIAR NUEVO ---
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const ratingSeleccionado = document.querySelector('input[name="rating"]:checked')?.value || 5;

    const nuevo = {
        nombre: document.getElementById('nombre').value,
        cargo: document.getElementById('cargo').value,
        mensaje: document.getElementById('mensaje').value,
        rating: parseInt(ratingSeleccionado)
    };

    try {
        await push(testimoniosRef, nuevo);
        form.reset();
        alert("¡Publicado correctamente!");
    } catch (err) {
        alert("Error: Revisa que las REGLAS de Firebase estén en TRUE.");
    }
});