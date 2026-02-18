// Importamos las funciones modernas de la versión que instalaste
import { getDatabase, ref, push, onChildAdded, onChildRemoved, remove } 
    from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

const db = getDatabase();
const grid = document.getElementById('grid-comentarios');
const form = document.getElementById('form-comentario');

// --- MODO ADMINISTRADOR ---
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
        `<button class="btn-delete" onclick="eliminarComentario('${id}')" style="background:#ff3333; color:white; border:none; padding:10px; border-radius:8px; cursor:pointer; width:100%; margin-top:15px; font-weight:bold;">
            ELIMINAR COMENTARIO
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

// --- ESCUCHAR LA BASE DE DATOS ---
const testimoniosRef = ref(db, 'testimonios');

onChildAdded(testimoniosRef, (snapshot) => {
    renderizarCard(snapshot.val(), snapshot.key);
});

onChildRemoved(testimoniosRef, (snapshot) => {
    const el = document.getElementById(`card-${snapshot.key}`);
    if (el) el.remove();
});

// --- ENVIAR COMENTARIO NUEVO ---
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const rating = document.querySelector('input[name="rating"]:checked')?.value || 5;

    const nuevo = {
        nombre: document.getElementById('nombre').value,
        cargo: document.getElementById('cargo').value,
        mensaje: document.getElementById('mensaje').value,
        rating: parseInt(rating)
    };

    try {
        await push(testimoniosRef, nuevo);
        form.reset();
        alert("¡Comentario enviado con éxito!");
    } catch (err) {
        alert("Error: Revisa que las REGLAS de Firebase estén en TRUE.");
    }
});

// --- FUNCIÓN PARA BORRAR ---
window.eliminarComentario = async (id) => {
    if (confirm("¿Borrar este comentario?")) {
        await remove(ref(db, `testimonios/${id}`));
    }
};