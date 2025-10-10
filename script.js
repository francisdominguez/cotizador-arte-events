// Datos iniciales - CONFIGURACIÓN COMPLETA
let configuracion = {
    paquetes: [
        { id: 1, nombre: "Globo Azul", precio: 1200 },
        { id: 2, nombre: "Globo Dorado", precio: 1500 },
        { id: 3, nombre: "Globo Blanco", precio: 1000 },
        { id: 4, nombre: "Globo Rosa", precio: 1300 }
    ],
    accesorios: [
        { id: 1, nombre: "Mampara", precio: 800 },
        { id: 2, nombre: "Cilindro", precio: 400 },
        { id: 3, nombre: "Mesa", precio: 300 },
        { id: 4, nombre: "Silla", precio: 150 },
        { id: 5, nombre: "Alfombra", precio: 600 },
        { id: 6, nombre: "Transporte", precio: 500 }
    ]
};

// Información completa de la cotización
let cotizacion = {
    // Información del cliente
    cliente: {
        nombre: '',
        telefono: '',
        email: '',
        fechaEvento: '',
        lugarEvento: '',
        notas: ''
    },
    // Detalles del evento
    tipoEvento: '',
    paquetes: [],
    accesorios: [],
    // Costos calculados
    costos: {
        materiales: 0,
        manoObra: 0,
        total: 0
    }
};

// FUNCIÓN PARA FORMATEAR MONEDA DOMINICANA
function formatoMonedaRD(monto) {
    return `RD$${monto.toLocaleString('es-DO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    inicializarConfiguracion();
    actualizarCotizador();
    actualizarResumen();
    inicializarEventListeners();
    cargarFechaActual();
});

// CONFIGURACIÓN - PANEL OCULTO
function toggleConfig() {
    const panel = document.getElementById('configPanel');
    panel.classList.toggle('active');
}

function inicializarConfiguracion() {
    renderizarPaquetesConfig();
    renderizarAccesoriosConfig();
}

function renderizarPaquetesConfig() {
    const container = document.getElementById('config-paquetes');
    container.innerHTML = '';
    
    configuracion.paquetes.forEach(paquete => {
        const item = document.createElement('div');
        item.className = 'config-item';
        item.innerHTML = `
            <input type="text" value="${paquete.nombre}" 
                   onchange="actualizarPaquete(${paquete.id}, 'nombre', this.value)">
            <input type="number" value="${paquete.precio}" 
                   onchange="actualizarPaquete(${paquete.id}, 'precio', parseInt(this.value))">
            <button class="btn-remove" onclick="eliminarPaquete(${paquete.id})">×</button>
        `;
        container.appendChild(item);
    });
}

function renderizarAccesoriosConfig() {
    const container = document.getElementById('config-accesorios');
    container.innerHTML = '';
    
    configuracion.accesorios.forEach(accesorio => {
        const item = document.createElement('div');
        item.className = 'config-item';
        item.innerHTML = `
            <input type="text" value="${accesorio.nombre}" 
                   onchange="actualizarAccesorio(${accesorio.id}, 'nombre', this.value)">
            <input type="number" value="${accesorio.precio}" 
                   onchange="actualizarAccesorio(${accesorio.id}, 'precio', parseInt(this.value))">
            <button class="btn-remove" onclick="eliminarAccesorio(${accesorio.id})">×</button>
        `;
        container.appendChild(item);
    });
}

function agregarPaquete() {
    const nuevoId = Math.max(...configuracion.paquetes.map(p => p.id), 0) + 1;
    configuracion.paquetes.push({
        id: nuevoId,
        nombre: "Nuevo Globo",
        precio: 1000
    });
    renderizarPaquetesConfig();
    actualizarCotizador();
}

function agregarAccesorio() {
    const nuevoId = Math.max(...configuracion.accesorios.map(a => a.id), 0) + 1;
    configuracion.accesorios.push({
        id: nuevoId,
        nombre: "Nuevo Accesorio",
        precio: 500
    });
    renderizarAccesoriosConfig();
    actualizarCotizador();
}

function actualizarPaquete(id, campo, valor) {
    const paquete = configuracion.paquetes.find(p => p.id === id);
    if (paquete) {
        paquete[campo] = valor;
        actualizarCotizador();
    }
}

function actualizarAccesorio(id, campo, valor) {
    const accesorio = configuracion.accesorios.find(a => a.id === id);
    if (accesorio) {
        accesorio[campo] = valor;
        actualizarCotizador();
    }
}

function eliminarPaquete(id) {
    configuracion.paquetes = configuracion.paquetes.filter(p => p.id !== id);
    renderizarPaquetesConfig();
    actualizarCotizador();
}

function eliminarAccesorio(id) {
    configuracion.accesorios = configuracion.accesorios.filter(a => a.id !== id);
    renderizarAccesoriosConfig();
    actualizarCotizador();
}

// EVENT LISTENERS MEJORADOS
function inicializarEventListeners() {
    // Tipo de evento
    document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            cotizacion.tipoEvento = this.dataset.value;
            actualizarResumen();
            actualizarProgreso();
        });
    });

    // Información del cliente en tiempo real
    document.getElementById('cliente-nombre').addEventListener('input', function() {
        cotizacion.cliente.nombre = this.value;
        actualizarResumen();
    });

    document.getElementById('cliente-telefono').addEventListener('input', function() {
        cotizacion.cliente.telefono = this.value;
        actualizarResumen();
    });

    document.getElementById('cliente-email').addEventListener('input', function() {
        cotizacion.cliente.email = this.value;
        actualizarResumen();
    });

    document.getElementById('evento-fecha').addEventListener('change', function() {
        cotizacion.cliente.fechaEvento = this.value;
        actualizarResumen();
    });

    document.getElementById('evento-lugar').addEventListener('input', function() {
        cotizacion.cliente.lugarEvento = this.value;
        actualizarResumen();
    });

    document.getElementById('evento-notas').addEventListener('input', function() {
        cotizacion.cliente.notas = this.value;
    });
}

// FUNCIÓN PARA CARGAR FECHA ACTUAL
function cargarFechaActual() {
    const hoy = new Date();
    const fechaInput = document.getElementById('evento-fecha');
    fechaInput.value = hoy.toISOString().split('T')[0];
    cotizacion.cliente.fechaEvento = fechaInput.value;
    actualizarResumen();
}

// ACTUALIZAR COTIZADOR COMPLETO
function actualizarCotizador() {
    renderizarGlobosCliente();
    renderizarAccesoriosCliente();
}

// FUNCIÓN NUEVA: Renderizar globos con forma de globo
function renderizarGlobosCliente() {
    const container = document.getElementById('globos-cliente');
    container.innerHTML = '';
    
    configuracion.paquetes.forEach(paquete => {
        const color = paquete.nombre.toLowerCase().replace('globo ', '');
        const emoji = getGloboEmoji(color);
        const colorFondo = getGloboColor(color);
        
        const item = document.createElement('div');
        item.className = 'globo-item';
        item.innerHTML = `
            <div class="globo-color" style="background: ${colorFondo}">
                ${emoji}
            </div>
            <div class="globo-info">
                <div class="globo-name">${paquete.nombre}</div>
                <div class="globo-price">${formatoMonedaRD(paquete.precio)}</div>
                <div class="cantidad-globo">
                    <input type="number" min="0" value="0" 
                           onchange="actualizarCantidadPaquete(${paquete.id}, parseInt(this.value))"
                           placeholder="Cantidad">
                </div>
            </div>
        `;
        container.appendChild(item);
    });
}

// FUNCIÓN NUEVA: Renderizar accesorios
function renderizarAccesoriosCliente() {
    const container = document.getElementById('accesorios-cliente');
    container.innerHTML = '';
    
    configuracion.accesorios.forEach(accesorio => {
        const item = document.createElement('div');
        item.className = 'elemento-item';
        item.innerHTML = `
            <div class="item-info">
                <div class="item-name">${accesorio.nombre}</div>
                <div class="item-price">${formatoMonedaRD(accesorio.precio)}</div>
            </div>
            <div class="cantidad-selector">
                <input type="number" min="0" value="0" 
                       onchange="actualizarCantidadAccesorio(${accesorio.id}, parseInt(this.value))"
                       placeholder="Cantidad">
            </div>
        `;
        container.appendChild(item);
    });
}

// FUNCIONES AUXILIARES PARA GLOBOS
function getGloboEmoji(color) {
    const emojis = {
        'azul': '🔵',
        'dorado': '🟡',
        'blanco': '⚪',
        'rosa': '🩷',
        'rojo': '🔴',
        'verde': '🟢',
        'morado': '🟣',
        'negro': '⚫',
        'naranja': '🟠'
    };
    return emojis[color] || '🎈';
}

function getGloboColor(color) {
    const colores = {
        'azul': '#4169E1',
        'dorado': '#FFD700',
        'blanco': '#FFFFFF',
        'rosa': '#FF69B4',
        'rojo': '#FF0000',
        'verde': '#32CD32',
        'morado': '#9370DB',
        'negro': '#000000',
        'naranja': '#FFA500'
    };
    return colores[color] || '#8a2be2';
}

// ACTUALIZAR CANTIDADES
function actualizarCantidadPaquete(id, cantidad) {
    const existente = cotizacion.paquetes.find(p => p.id === id);
    
    if (cantidad > 0) {
        if (existente) {
            existente.cantidad = cantidad;
        } else {
            const paquete = configuracion.paquetes.find(p => p.id === id);
            cotizacion.paquetes.push({
                ...paquete,
                cantidad: cantidad
            });
        }
    } else {
        cotizacion.paquetes = cotizacion.paquetes.filter(p => p.id !== id);
    }
    
    actualizarResumen();
    actualizarProgreso();
}

function actualizarCantidadAccesorio(id, cantidad) {
    const existente = cotizacion.accesorios.find(a => a.id === id);
    
    if (cantidad > 0) {
        if (existente) {
            existente.cantidad = cantidad;
        } else {
            const accesorio = configuracion.accesorios.find(a => a.id === id);
            cotizacion.accesorios.push({
                ...accesorio,
                cantidad: cantidad
            });
        }
    } else {
        cotizacion.accesorios = cotizacion.accesorios.filter(a => a.id !== id);
    }
    
    actualizarResumen();
    actualizarProgreso();
}

// ACTUALIZAR RESUMEN COMPLETO
function actualizarResumen() {
    // Información del cliente
    document.getElementById('resumen-cliente').textContent = cotizacion.cliente.nombre || '-';
    document.getElementById('resumen-contacto').textContent = 
        (cotizacion.cliente.telefono || cotizacion.cliente.email) ? 
        `${cotizacion.cliente.telefono || ''} ${cotizacion.cliente.email || ''}` : '-';
    
    document.getElementById('resumen-evento').textContent = cotizacion.tipoEvento 
        ? cotizacion.tipoEvento.charAt(0).toUpperCase() + cotizacion.tipoEvento.slice(1)
        : '-';
    
    document.getElementById('resumen-fecha').textContent = cotizacion.cliente.fechaEvento 
        ? new Date(cotizacion.cliente.fechaEvento).toLocaleDateString('es-ES')
        : '-';

    document.getElementById('resumen-lugar').textContent = cotizacion.cliente.lugarEvento || '-';

    // Detalles de la cotización CON "PAQUETE DE" PARA GLOBOS
    const paquetesTexto = cotizacion.paquetes.length > 0 
        ? cotizacion.paquetes.map(p => {
            const cantidadTexto = p.cantidad > 0 ? `${p.cantidad} paquete${p.cantidad > 1 ? 's' : ''} de ` : '';
            return `${cantidadTexto}${p.nombre} ${formatoMonedaRD(p.precio)}`;
        }).join('<br>')
        : '-';

    document.getElementById('resumen-paquetes').innerHTML = paquetesTexto;

    const accesoriosTexto = cotizacion.accesorios.length > 0 
        ? cotizacion.accesorios.map(a => {
            const cantidad = a.cantidad || 1;
            const cantidadTexto = cantidad > 0 ? `${cantidad} ` : '';
            const precioTotal = a.precio * cantidad;
            return `${cantidadTexto}${a.nombre} ${formatoMonedaRD(precioTotal)}`;
        }).join('<br>')
        : '-';
    
    document.getElementById('resumen-accesorios').innerHTML = accesoriosTexto;

    // Calcular costos
    const costoMateriales = calcularCostoMateriales();
    const manoObra = costoMateriales * 0.3; // 30% de mano de obra
    const total = costoMateriales + manoObra;

    // Actualizar costos con formato RD$
    document.getElementById('resumen-materiales').textContent = formatoMonedaRD(costoMateriales);
    document.getElementById('resumen-mano-obra').textContent = formatoMonedaRD(manoObra);
    document.getElementById('total-cotizacion').textContent = formatoMonedaRD(total);

    // Guardar en objeto cotización
    cotizacion.costos.materiales = costoMateriales;
    cotizacion.costos.manoObra = manoObra;
    cotizacion.costos.total = total;
}

// CALCULAR COSTO DE MATERIALES
function calcularCostoMateriales() {
    let total = 0;
    
    // Sumar globos
    cotizacion.paquetes.forEach(p => {
        total += p.precio * p.cantidad;
    });
    
    // Sumar accesorios
    cotizacion.accesorios.forEach(a => {
        total += a.precio * (a.cantidad || 1);
    });
    
    return total;
}

function actualizarProgreso() {
    let progreso = 0;
    
    if (cotizacion.cliente.nombre) progreso += 25;
    if (cotizacion.tipoEvento) progreso += 25;
    if (cotizacion.paquetes.length > 0) progreso += 25;
    if (cotizacion.accesorios.length > 0) progreso += 25;
    
    document.getElementById('progress').style.width = `${progreso}%`;
}

// GUARDAR COTIZACIÓN
function guardarCotizacion() {
    const cotizacionData = {
        ...cotizacion,
        fechaCreacion: new Date().toISOString(),
        id: Date.now()
    };
    
    // Guardar en localStorage
    const cotizacionesGuardadas = JSON.parse(localStorage.getItem('cotizaciones')) || [];
    cotizacionesGuardadas.push(cotizacionData);
    localStorage.setItem('cotizaciones', JSON.stringify(cotizacionesGuardadas));
    
    // Mostrar notificación
    mostrarNotificación('✅ Cotización guardada como plantilla');
}

// LIMPIAR CAMPOS MEJORADO
function limpiarCampos() {
    // Limpiar información del cliente
    document.getElementById('cliente-nombre').value = '';
    document.getElementById('cliente-telefono').value = '';
    document.getElementById('cliente-email').value = '';
    document.getElementById('evento-lugar').value = '';
    document.getElementById('evento-notas').value = '';
    
    // Limpiar tipo de evento
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Limpiar selecciones
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '0';
    });
    
    // Resetear cotización
    cotizacion = {
        cliente: {
            nombre: '',
            telefono: '',
            email: '',
            fechaEvento: '',
            lugarEvento: '',
            notas: ''
        },
        tipoEvento: '',
        paquetes: [],
        accesorios: [],
        costos: {
            materiales: 0,
            manoObra: 0,
            total: 0
        }
    };
    
    // Cargar fecha actual
    cargarFechaActual();
    actualizarResumen();
    actualizarProgreso();
    
    mostrarNotificación('🔄 Nueva cotización lista');
}

// NOTIFICACIÓN MEJORADA
function mostrarNotificación(mensaje) {
    const notification = document.getElementById('notification');
    notification.innerHTML = `<span>${mensaje}</span>`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// GENERAR COTIZACIÓN PDF (UNA SOLA PÁGINA MEJORADA)
function generarCotizacionPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const total = cotizacion.costos.total;
    
    // Configuración para UNA SOLA PÁGINA
    const margin = 15;
    let yPos = margin + 5;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const maxY = pageHeight - margin - 20;

    // FUNCIÓN MEJORADA: Solo ajusta formato, nunca elimina contenido
    function checkAndAdjustSpace(neededLines) {
        const spaceNeeded = yPos + (neededLines * 5);
        if (spaceNeeded > maxY) {
            // REDUCIR progresivamente en lugar de eliminar
            if (doc.internal.getFontSize() > 7) {
                doc.setFontSize(doc.internal.getFontSize() - 0.5);
            }
            // Reducir espaciado ligeramente
            return 3; // espaciado reducido
        }
        return 5; // espaciado normal
    }

    // Logo y encabezado COMPACTOS
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(138, 43, 226);
    doc.text("ARTE Y EVENTOS", margin, yPos);
    
    yPos += 5;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Decoración Profesional de Eventos", margin, yPos);
    
    yPos += 8;
    
    // Línea separadora
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 6;

    // Título de cotización
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("COTIZACIÓN", margin, yPos);
    yPos += 10;

    // Información del cliente - NUNCA SE ELIMINA
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    
    if (cotizacion.cliente.nombre) {
        doc.text(`Cliente: ${cotizacion.cliente.nombre}`, margin, yPos);
        yPos += checkAndAdjustSpace(1);
    }
    
    if (cotizacion.cliente.telefono || cotizacion.cliente.email) {
        const contacto = `${cotizacion.cliente.telefono || ''} ${cotizacion.cliente.email || ''}`;
        doc.text(`Contacto: ${contacto}`, margin, yPos);
        yPos += checkAndAdjustSpace(1);
    }
    
    if (cotizacion.cliente.fechaEvento) {
        doc.text(`Fecha: ${new Date(cotizacion.cliente.fechaEvento).toLocaleDateString('es-ES')}`, margin, yPos);
        yPos += checkAndAdjustSpace(1);
    }
    
    if (cotizacion.cliente.lugarEvento) {
        doc.text(`Lugar: ${cotizacion.cliente.lugarEvento}`, margin, yPos);
        yPos += checkAndAdjustSpace(1);
    }
    
    if (cotizacion.tipoEvento) {
        doc.text(`Evento: ${cotizacion.tipoEvento.charAt(0).toUpperCase() + cotizacion.tipoEvento.slice(1)}`, margin, yPos);
        yPos += checkAndAdjustSpace(1);
    }

    yPos += 3;

    // GLOBOS Y DECORACIÓN - SECCIÓN SIEMPRE VISIBLE
    if (cotizacion.paquetes.length > 0) {
        const spacing = checkAndAdjustSpace(4);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(138, 43, 226);
        doc.text("GLOBOS Y DECORACIÓN", margin, yPos);
        yPos += spacing;
        
        // Línea separadora
        doc.setDrawColor(138, 43, 226);
        doc.line(margin, yPos, margin + 60, yPos);
        yPos += spacing;

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        
        // ITEMS DE GLOBOS - CON "PAQUETE DE"
        cotizacion.paquetes.forEach(globo => {
            const spacing = checkAndAdjustSpace(1);
            const cantidadTexto = globo.cantidad > 0 ? `${globo.cantidad} paquete${globo.cantidad > 1 ? 's' : ''} de ` : '';
            const nombre = `${cantidadTexto}${globo.nombre}`;
            const precio = formatoMonedaRD(globo.precio); // Precio unitario
            
            doc.text(nombre, margin, yPos);
            doc.text(precio, pageWidth - margin - 15, yPos, { align: "right" });
            yPos += spacing;
        });
        
        yPos += 3;
    }

    // ACCESORIOS Y MATERIALES - SECCIÓN SIEMPRE VISIBLE
    if (cotizacion.accesorios.length > 0) {
        const spacing = checkAndAdjustSpace(4);

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(138, 43, 226);
        doc.text("ACCESORIOS Y MATERIALES", margin, yPos);
        yPos += spacing;
        
        // Línea separadora
        doc.setDrawColor(138, 43, 226);
        doc.line(margin, yPos, margin + 75, yPos);
        yPos += spacing;

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        
        // ITEMS DE ACCESORIOS - CON CANTIDADES
        cotizacion.accesorios.forEach(accesorio => {
            const spacing = checkAndAdjustSpace(1);
            const cantidad = accesorio.cantidad || 1;
            const cantidadTexto = cantidad > 0 ? `${cantidad} ` : '';
            const nombre = `${cantidadTexto}${accesorio.nombre}`;
            const precio = formatoMonedaRD(accesorio.precio * cantidad); // Precio total
            
            doc.text(nombre, margin, yPos);
            doc.text(precio, pageWidth - margin - 15, yPos, { align: "right" });
            yPos += spacing;
        });
        
        yPos += 5;
    }

    // Línea separadora antes del total
    const spacing = checkAndAdjustSpace(6);
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += spacing;

    // Costos detallados - SIEMPRE VISIBLES
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    
    doc.text("Costo de Materiales:", margin, yPos);
    doc.text(formatoMonedaRD(cotizacion.costos.materiales), pageWidth - margin - 15, yPos, { align: "right" });
    yPos += checkAndAdjustSpace(1);

    doc.text("Mano de Obra:", margin, yPos);
    doc.text(formatoMonedaRD(cotizacion.costos.manoObra), pageWidth - margin - 15, yPos, { align: "right" });
    yPos += checkAndAdjustSpace(1);

    // Total - SIEMPRE VISIBLE
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("TOTAL:", margin, yPos);
    doc.text(formatoMonedaRD(total), pageWidth - margin - 15, yPos, { align: "right" });
    yPos += 10;

    // Mensaje final - SIEMPRE VISIBLE
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    doc.text("Gracias por confiar en Arte y Eventos", pageWidth / 2, yPos, { align: "center" });
    yPos += 4;
    doc.text("Transformamos tus espacios en experiencias inolvidables", pageWidth / 2, yPos, { align: "center" });

    // Guardar el PDF
    const nombreArchivo = `cotizacion-${cotizacion.cliente.nombre || 'cliente'}-${new Date().getTime()}.pdf`;
    doc.save(nombreArchivo);

    // Mostrar notificación
    mostrarNotificación('✅ Cotización PDF generada en una sola hoja');
    
    // Limpiar campos después de generar PDF
    setTimeout(() => {
        limpiarCampos();
    }, 2000);
}
// ==================== PWA - INSTALAR COMO APP MÓVIL ====================

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Mostrar botón de instalación después de 3 segundos
  setTimeout(() => {
    mostrarBotonInstalacion();
  }, 3000);
});

function mostrarBotonInstalacion() {
  if (document.querySelector('.install-btn')) return;
  
  const installBtn = document.createElement('button');
  installBtn.textContent = '📱 Instalar App';
  installBtn.className = 'install-btn';
  installBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #8a2be2;
    color: white;
    border: none;
    padding: 12px 18px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: bold;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(138, 43, 226, 0.4);
    cursor: pointer;
    transition: all 0.3s ease;
  `;
  
  installBtn.onmouseover = function() {
    this.style.transform = 'scale(1.05)';
    this.style.background = '#7a1be2';
  };
  
  installBtn.onmouseout = function() {
    this.style.transform = 'scale(1)';
    this.style.background = '#8a2be2';
  };
  
  installBtn.onclick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        installBtn.style.display = 'none';
        mostrarNotificación('✅ App instalada correctamente');
      }
      deferredPrompt = null;
    }
  };
  
  document.body.appendChild(installBtn);
}

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function(registration) {
        console.log('✅ ServiceWorker registrado correctamente');
      })
      .catch(function(error) {
        console.log('❌ ServiceWorker falló: ', error);
      });
  });
}

// Detectar si está en modo app instalada
window.addEventListener('appinstalled', () => {
  console.log('✅ App instalada correctamente en el dispositivo');
});