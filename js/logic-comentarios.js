// IMPORTANTE: Estas líneas solo funcionan si el script en el HTML tiene type="module"
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, onChildRemoved, remove } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

// Tu configuración sacada de la captura
const firebaseConfig = {
    apiKey: "AIzaSyD2PoWyxufgEMZnBEsoIkRho__z6vr-LJc",
    authDomain: "tus-asesores.firebaseapp.com",
    databaseURL: "https://tus-asesores-default-rtdb.firebaseio.com",
    projectId: "tus-asesores",
    storageBucket: "tus-asesores.firebasestorage.app",
    messagingSenderId: "411492054160",
    appId: "1:411492054160:web:d713919e83f2a8930c144e" // Usa tu ID completo
};

// Inicializar
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const testimoniosRef = ref(db, 'testimonios');

const grid = document.getElementById('grid-comentarios');
const form = document.getElementById('form-comentario');

// --- RENDERIZAR COMENTARIOS ---
function renderizarCard(data, id) {
    const estrellasHtml = '★'.repeat(data.rating).padEnd(5, '☆');

    const cardHTML = `
        <div class="oliver-card" id="card-${id}">
            <div class="card-top">
                <h4>${data.nombre}</h4>
                <span>${data.cargo}</span>
            </div>
            <div class="stars" style="color: #f3ce37;">${estrellasHtml}</div>
            <p class="comment-body">${data.mensaje}</p>
        </div>
    `;
    grid.insertAdjacentHTML('afterbegin', cardHTML);
}

// --- ESCUCHAR FIREBASE ---
onChildAdded(testimoniosRef, (snapshot) => {
    renderizarCard(snapshot.val(), snapshot.key);
});

// --- ENVIAR ---
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nuevo = {
        nombre: document.getElementById('nombre').value,
        cargo: document.getElementById('cargo').value,
        mensaje: document.getElementById('mensaje').value,
        rating: 5 // Por defecto
    };

    try {
        await push(testimoniosRef, nuevo);
        form.reset();
        alert("¡Enviado! Revisa ahora tu panel de Firebase.");
    } catch (err) {
        alert("Error de conexión. Revisa las reglas de Firebase.");
    }
});