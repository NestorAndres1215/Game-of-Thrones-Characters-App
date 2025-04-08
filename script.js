let personajes = [];
let personajesFiltrados = [];
const personajesPorPagina = 10;
let paginaActual = 1;

async function cargarPersonajes() {
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = "<div class='loading'>Cargando personajes...</div>";
  
  try {
    const response = await fetch("https://thronesapi.com/api/v2/Characters");
    const data = await response.json();
    personajes = data;
    personajesFiltrados = [...personajes];
    mostrarPaginacion();
    mostrarPersonajes();
  } catch (error) {
    console.error("Error al cargar personajes:", error);
    resultado.innerHTML = "<div class='loading'>Error al conectar con la API.</div>";
  }
}

function mostrarPersonajes() {
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = "";
  
  // Calcular índices para la paginación
  const inicio = (paginaActual - 1) * personajesPorPagina;
  const fin = inicio + personajesPorPagina;
  const personajesPagina = personajesFiltrados.slice(inicio, fin);
  
  // Si no hay personajes que mostrar
  if (personajesPagina.length === 0) {
    resultado.innerHTML = "<div class='loading'>No se encontraron personajes</div>";
    return;
  }
  
  // Mostrar personajes con delay para animación
  personajesPagina.forEach((personaje, index) => {
    setTimeout(() => {
      const card = document.createElement("div");
      card.className = "card";
      
      // Casas y títulos adicionales si están disponibles
      const casa = personaje.family || "Casa desconocida";
      const titulo = personaje.title || "Sin título";
      
      card.innerHTML = `
        <img src="${personaje.imageUrl}" alt="${personaje.fullName}" onerror="this.src='/api/placeholder/200/250'">
        <h3>${personaje.fullName}</h3>
        <div class="character-info">
          <p><strong>Título:</strong> ${titulo}</p>
          <p><strong>Casa:</strong> ${casa}</p>
        </div>
      `;
      
      resultado.appendChild(card);
    }, index * 100); // Retraso para animar la aparición secuencial
  });
}

function filtrarPersonajes() {
  const texto = document.getElementById("searchInput").value.toLowerCase();
  
  // Añadir animación al buscar
  document.getElementById("searchInput").classList.add("search-animation");
  setTimeout(() => {
    document.getElementById("searchInput").classList.remove("search-animation");
  }, 500);
  
  personajesFiltrados = personajes.filter(p =>
    p.fullName.toLowerCase().includes(texto) ||
    (p.family && p.family.toLowerCase().includes(texto)) ||
    (p.title && p.title.toLowerCase().includes(texto))
  );
  
  paginaActual = 1; // Volver a la primera página al filtrar
  mostrarPaginacion();
  mostrarPersonajes();
}

function mostrarPaginacion() {
  const paginacion = document.getElementById("paginacion");
  paginacion.innerHTML = "";
  
  const totalPaginas = Math.ceil(personajesFiltrados.length / personajesPorPagina);
  
  // Si solo hay una página, no mostrar paginación
  if (totalPaginas <= 1) {
    return;
  }
  
  // Botón página anterior
  const btnAnterior = document.createElement("button");
  btnAnterior.innerText = "«";
  btnAnterior.disabled = paginaActual === 1;
  btnAnterior.addEventListener("click", () => {
    if (paginaActual > 1) {
      cambiarPagina(paginaActual - 1);
    }
  });
  paginacion.appendChild(btnAnterior);
  
  // Mostrar números de página (limitado a 5)
  const maxPagesToShow = 5;
  let startPage = Math.max(1, paginaActual - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPaginas, startPage + maxPagesToShow - 1);
  
  // Ajustar si estamos cerca del final
  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    if (i === paginaActual) {
      btn.classList.add("active");
    }
    btn.addEventListener("click", () => cambiarPagina(i));
    paginacion.appendChild(btn);
  }
  
  // Botón página siguiente
  const btnSiguiente = document.createElement("button");
  btnSiguiente.innerText = "»";
  btnSiguiente.disabled = paginaActual === totalPaginas;
  btnSiguiente.addEventListener("click", () => {
    if (paginaActual < totalPaginas) {
      cambiarPagina(paginaActual + 1);
    }
  });
  paginacion.appendChild(btnSiguiente);
}

function cambiarPagina(pagina) {
  paginaActual = pagina;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  mostrarPaginacion();
  mostrarPersonajes();
}

// Iniciar la aplicación
cargarPersonajes();