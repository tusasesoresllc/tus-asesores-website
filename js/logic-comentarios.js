import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-database.js";

// Configuración basada en tus capturas
const firebaseConfig = {
    apiKey: "AIzaSyD2PoWyxufgEMZnBEsoIkRho__z6vr-LJc",
    authDomain: "tus-asesores.firebaseapp.com",
    databaseURL: "https://tus-asesores-default-rtdb.firebaseio.com",
    projectId: "tus-asesores",
    storageBucket: "tus-asesores.firebasestorage.app",
    messagingSenderId: "411492054160",
    appId: "1:411492054160:web:d713919e83f2a8930c144e" 
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const testimoniosRef = ref(db, 'testimonios');

// Elementos del HTML
const grid = document.getElementById('grid-comentarios');
const form = document.getElementById('form-comentario');

// Lógica para mostrar los comentarios
onChildAdded(testimoniosRef, (snapshot) => {
    const data = snapshot.val();
    const cardHTML = `
        <div class="oliver-card">
            <div class="card-top">
                <h4>${data.nombre}</h4>
                <span>${data.cargo}</span>
            </div>
            <p class="comment-body">${data.mensaje}</p>
        </div>
    `;
    grid.insertAdjacentHTML('afterbegin', cardHTML);
});

// Lógica para enviar el formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nuevoTestimonio = {
        nombre: document.getElementById('nombre').value,
        cargo: document.getElementById('cargo').value,
        mensaje: document.getElementById('mensaje').value,
        rating: 5
    };

    try {
        await push(testimoniosRef, nuevoTestimonio);
        form.reset();
        alert("¡Enviado con éxito! Revisa tu Firebase.");
    } catch (error) {
        console.error(error);
        alert("Error al enviar. ¿Publicaste las REGLAS en Firebase?");
    }
});