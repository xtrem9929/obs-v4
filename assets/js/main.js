document.addEventListener("DOMContentLoaded", () => {
  
  /* =========================
     MENÚ HAMBURGUESA (CORREGIDO)
     ========================= */
  const botonMenu = document.querySelector('.boton-menu');
  const menu = document.getElementById('menu-principal'); 

  if (botonMenu && menu) {
    botonMenu.addEventListener('click', () => {
      menu.classList.toggle('activo');
      const abierto = menu.classList.contains('activo');
      botonMenu.setAttribute('aria-expanded', abierto);
      botonMenu.textContent = abierto ? '✕' : '☰';
      console.log("Menú interactuado. Estado abierto:", abierto);
    });
  }

  /* =========================
     FAQ – ACORDEÓN
     ========================= */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const pregunta = item.querySelector('.faq-pregunta');
    if (pregunta) {
      pregunta.addEventListener('click', () => {
        faqItems.forEach(i => { if (i !== item) i.classList.remove('activo'); });
        item.classList.toggle('activo');
      });
    }
  });

  /* =========================
     REVEAL AL SCROLL
     ========================= */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });
  revealElements.forEach(el => revealObserver.observe(el));

  /* =========================
     HEADER COMPACTO
     ========================= */
  const header = document.querySelector('.header-sitio');
  function actualizarHeader() {
    if (header) {
      if (window.scrollY > 60) header.classList.add('compacto');
      else header.classList.remove('compacto');
    }
  }
  window.addEventListener('scroll', actualizarHeader);
  actualizarHeader(); // Ejecutar al cargar

  /* ==============================
     CARRUSEL (CON PREVENCIÓN DE ERROR)
     ============================== */
  const carrusel = document.querySelector(".galeria-infraestructura");
  const slides = document.querySelectorAll(".item-galeria");
  const btnPrev = document.querySelector(".carrusel-btn.prev");
  const btnNext = document.querySelector(".carrusel-btn.next");

  if (carrusel && btnNext && btnPrev) {
    let index = 0;
    const actualizarCarrusel = () => {
      carrusel.style.transform = `translateX(${-index * 100}%)`;
    };
    btnNext.addEventListener("click", () => {
      index = (index + 1) % slides.length;
      actualizarCarrusel();
    });
    btnPrev.addEventListener("click", () => {
      index = (index - 1 + slides.length) % slides.length;
      actualizarCarrusel();
    });
  }
});

/* =========================
     INDICADOR DE PÁGINA ACTUAL
     ========================= */
  const enlacesMenu = document.querySelectorAll('.menu a');
  const rutaActual = window.location.pathname;

  enlacesMenu.forEach(enlace => {
    // Obtenemos solo el nombre del archivo (ej: index.html o contacto.html)
    const hrefEnlace = enlace.getAttribute('href');

    // Comparamos si la ruta actual contiene el href del enlace
    if (rutaActual.includes(hrefEnlace) || (rutaActual === '/' && hrefEnlace === 'index.html')) {
      enlace.classList.add('actual');
    }
  });

  // ================================
// CARRERA – FAQ ACORDEÓN
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".carrera-faq-item");

  faqItems.forEach(item => {
    const pregunta = item.querySelector(".carrera-faq-pregunta");

    pregunta.addEventListener("click", () => {
      const abierto = item.classList.contains("activo");

      // Cierra todos
      faqItems.forEach(i => i.classList.remove("activo"));

      // Abre el actual si estaba cerrado
      if (!abierto) {
        item.classList.add("activo");
      }
    });
  });
});
// =============================
// SLIDER INFRAESTRUCTURA (1 imagen a la vez)
// =============================

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".galeria-infraestructura");
  const slides = document.querySelectorAll(".galeria-infraestructura .item-galeria");
  const btnPrev = document.querySelector(".carrusel-btn.prev");
  const btnNext = document.querySelector(".carrusel-btn.next");

  if (!slider || slides.length === 0 || !btnPrev || !btnNext) return;

  let index = 0;
  const total = slides.length;

  function updateSlider() {
    slider.style.transform = `translateX(-${index * 100}%)`;
  }

  btnNext.addEventListener("click", () => {
    index++;
    if (index >= total) index = 0;
    updateSlider();
  });

  btnPrev.addEventListener("click", () => {
    index--;
    if (index < 0) index = total - 1;
    updateSlider();
  });
});

//CHAT BOT

let chatHistory = JSON.parse(localStorage.getItem('chat_history')) || [];

function toggleChat() {
    const container = document.getElementById('chat-container');
    if (container) {
        container.classList.toggle('chat-hidden');
        // Guardamos si el chat quedó abierto o cerrado
        const isOpen = !container.classList.contains('chat-hidden');
        localStorage.setItem('chat_is_open', isOpen);
    }
}

function typeWriter(id, text) {
    const el = document.getElementById(id);
    if (!el) return;
    let i = 0;
    el.innerText = "";
    function type() {
        if (i < text.length) {
            el.innerText += text.charAt(i);
            i++;
            const container = document.getElementById('chat-messages');
            container.scrollTop = container.scrollHeight;
            setTimeout(type, 10);
        }
    }
    type();
}

async function sendMessage() {
    const input = document.getElementById('user-input');
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, 'user');
    input.value = '';

    chatHistory.push({ role: "user", content: msg });
    if (chatHistory.length > 8) chatHistory.shift();
    
    // Guardar en el navegador
    localStorage.setItem('chat_history', JSON.stringify(chatHistory));

    const botId = addMessage('...', 'bot');

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history: chatHistory }) 
        });
        const data = await res.json();
        
        chatHistory.push({ role: "assistant", content: data.reply });
        localStorage.setItem('chat_history', JSON.stringify(chatHistory));
        
        typeWriter(botId, data.reply);
    } catch {
        document.getElementById(botId).innerText = "Error de conexión.";
    }
}

function addMessage(text, sender) {
    const box = document.getElementById('chat-messages');
    const div = document.createElement('div');
    const id = "m-" + Math.random().toString(36).slice(2, 7);
    div.id = id;
    div.className = `message ${sender}`;
    div.innerText = text;
    box.appendChild(div);
    box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
    return id;
}

function handleKeyPress(e) { if (e.key === 'Enter') sendMessage(); }

// AL CARGAR CUALQUIER PÁGINA
window.onload = () => {
    const box = document.getElementById('chat-messages');
    
    // 1. Reconstruir historial guardado
    if (chatHistory.length > 0) {
        chatHistory.forEach(msg => {
            const div = document.createElement('div');
            div.className = `message ${msg.role === 'user' ? 'user' : 'bot'}`;
            div.innerText = msg.content;
            box.appendChild(div);
        });
        box.scrollTop = box.scrollHeight;
    } else {
        // Si no hay historial, soltar bienvenida
        setTimeout(() => {
            const bid = addMessage("...", "bot");
            typeWriter(bid, "Hola de nuevo. ¿En qué puedo ayudarte?");
        }, 1000);
    }

    // 2. Mantenerlo abierto si estaba abierto antes de cambiar de página
    const wasOpen = localStorage.getItem('chat_is_open') === 'true';
    if (wasOpen) {
        document.getElementById('chat-container').classList.remove('chat-hidden');
    }
};