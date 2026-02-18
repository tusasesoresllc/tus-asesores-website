import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD2PoWyxufgEMZnBEsoIkRho__z6vr-LJc",
    authDomain: "tus-asesores.firebaseapp.com",
    databaseURL: "https://tus-asesores-default-rtdb.firebaseio.com",
    projectId: "tus-asesores",
    storageBucket: "tus-asesores.firebasestorage.app",
    messagingSenderId: "411492054160",
    appId: "1:411492054160:web:d713919e83f2a8930c144e"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const testimoniosRef = ref(db, 'testimonios');

// Verificar si los elementos existen en el HTML
const grid = document.getElementById('grid-comentarios');
const form = document.getElementById('form-comentario');

if (!grid || !form) {
    alert("ERROR: No encontré el ID 'grid-comentarios' o 'form-comentario' en tu HTML.");
}

// Cargar comentarios existentes
onChildAdded(testimoniosRef, (snapshot) => {
    const data = snapshot.val();
    const cardHTML = `<div class="oliver-card"><h4>${data.nombre}</h4><p>${data.mensaje}</p></div>`;
    grid.insertAdjacentHTML('afterbegin', cardHTML);
});

// Enviar comentario
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await push(testimoniosRef, {
            nombre: document.getElementById('nombre').value,
            cargo: document.getElementById('cargo').value,
            mensaje: document.getElementById('mensaje').value,
            rating: 5
        });
        alert("¡CONECTADO! El comentario se envió.");
        form.reset();
    } catch (error) {
        alert("ERROR DE FIREBASE: " + error.message);
    }
});