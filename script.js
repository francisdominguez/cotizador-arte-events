// Asegurar que las librerías se carguen
const { jsPDF } = window.jspdf;

// ----------------------------------------------------
// DATOS INICIALES Y ESTRUCTURA DE LA APLICACIÓN
// ----------------------------------------------------

// Datos iniciales - CONFIGURACIÓN COMPLETA
let configuracion = {
    paquetes: [
        { id: 1, nombre: "Globo Azul", precio: 1200, emoji: '💙', cantidad: 0 },
        { id: 2, nombre: "Globo Dorado", precio: 1500, emoji: '✨', cantidad: 0 },
        { id: 3, nombre: "Globo Blanco", precio: 1000, emoji: '☁️', cantidad: 0 },
        { id: 4, nombre: "Globo Rosa", precio: 1300, emoji: '💖', cantidad: 0 }
    ],
    accesorios: [
        { id: 1, nombre: "Mampara Circular", precio: 800, emoji: '🖼️', cantidad: 0 },
        { id: 2, nombre: "Cilindro Decorativo", precio: 400, emoji: '🏺', cantidad: 0 },
        { id: 3, nombre: "Mesa Principal", precio: 300, emoji: '🪑', cantidad: 0 },
        { id: 4, nombre: "Sillas Tiffany (x10)", precio: 1500, emoji: '🪑', cantidad: 0 },
        { id: 5, nombre: "Alfombra Roja", precio: 600, emoji: '🟥', cantidad: 0 }
    ],
    manoObraPorcentaje: 30
};

// Información completa de la cotización
let cotizacion = {
    currentStep: 1,
    cliente: {
        nombre: '', telefono: '', email: '', fechaEvento: '', lugarEvento: '', notas: ''
    },
    tipoEvento: '',
    // Inicializar artículos de cotización como copia de la configuración base
    articulos: {
        paquetes: JSON.parse(JSON.stringify(configuracion.paquetes)),
        accesorios: JSON.parse(JSON.stringify(configuracion.accesorios)),
        manuales: [] // { id, nombre, precioUnitario, cantidad }
    },
    costos: {
        materiales: 0,
        transporte: 0,
        manoObra: 0,
        manoObraPorcentaje: configuracion.manoObraPorcentaje,
        total: 0
    }
};

let manualItemIdCounter = 1;
let configIdCounter = 100;

// FUNCIÓN PARA FORMATEAR MONEDA DOMINICANA
function formatoMonedaRD(monto) {
    if (isNaN(monto) || monto === null) monto = 0;
    const numero = parseFloat(monto);
    return `RD$${numero.toLocaleString('es-DO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

// ----------------------------------------------------
// INICIALIZACIÓN Y EVENT LISTENERS
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    cargarConfiguracion();
    inicializarEventListeners();
    cargarFechaActual();
    updateStepUI();
    renderizarArticulos('paquetes');
    renderizarConfiguracion();
    actualizarResumen();
});

function cargarFechaActual() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-evento').value = today;
}

function inicializarEventListeners() {
    // Escuchar cambios en los inputs del Paso 1 para actualizar resumen
    ['cliente-nombre', 'fecha-evento', 'tipo-evento', 'cliente-notas', 'lugar-evento', 'cliente-telefono', 'cliente-email'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.addEventListener('input', guardarDatosPaso1);
    });
    // Escuchar cambios en los inputs del Paso 3
    document.getElementById('costo-transporte').addEventListener('input', (e) => actualizarCostoManual('transporte', e.target.value));
    document.getElementById('porcentaje-mano-obra').addEventListener('input', (e) => actualizarCostoManual('manoObraPorcentaje', e.target.value));
}

// ----------------------------------------------------
// CONTROL DE PASOS Y VALIDACIÓN
// ----------------------------------------------------

function nextStep() {
    if (cotizacion.currentStep === 1) {
        if (!validarPaso1()) return;
        guardarDatosPaso1();
    } else if (cotizacion.currentStep === 2) {
        // Se puede añadir lógica de validación para el paso 2 aquí si es necesario
    }
    
    if (cotizacion.currentStep < 3) {
        cotizacion.currentStep++;
        updateStepUI();
    }
}

function prevStep() {
    if (cotizacion.currentStep > 1) {
        cotizacion.currentStep--;
        updateStepUI();
    }
}

function updateStepUI() {
    const steps = [
        document.getElementById('step-1'),
        document.getElementById('step-2'),
        document.getElementById('step-3')
    ];
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progress = document.getElementById('progress');
    const generarBtn = document.getElementById('generar-cotizacion');

    steps.forEach((step, index) => {
        step.style.display = (index + 1 === cotizacion.currentStep) ? 'block' : 'none';
    });
    
    prevBtn.style.display = cotizacion.currentStep > 1 ? 'inline-flex' : 'none';
    
    if (cotizacion.currentStep === 3) {
        nextBtn.style.display = 'none';
        // El resumen se actualiza antes de entrar en el paso 3
    } else {
        nextBtn.style.display = 'inline-flex';
        nextBtn.textContent = 'Siguiente →';
    }
    
    // Habilitar/Deshabilitar el botón de PDF
    generarBtn.disabled = cotizacion.currentStep !== 3 || cotizacion.costos.total === 0;

    const progressPercent = (cotizacion.currentStep / 3) * 100;
    progress.style.width = `${progressPercent}%`;

    if (cotizacion.currentStep === 2) {
        const activeTabButton = document.querySelector('.tabs .tab-button.active');
        const activeTab = activeTabButton ? activeTabButton.dataset.tab : 'paquetes';
        switchTab(activeTab); // Asegurar que el contenido del tab activo se muestre y se renderice
        renderizarArticulosManuales();
    } else if (cotizacion.currentStep === 3) {
        // Asegurar que los inputs del paso 3 reflejen los datos actuales
        document.getElementById('costo-transporte').value = cotizacion.costos.transporte;
        document.getElementById('porcentaje-mano-obra').value = cotizacion.costos.manoObraPorcentaje;
    }
    actualizarResumen();
}

// ----------------------------------------------------
// PASO 1: INFORMACIÓN DEL CLIENTE
// ----------------------------------------------------

function validarPaso1() {
    const nombre = document.getElementById('cliente-nombre').value.trim();
    const fecha = document.getElementById('fecha-evento').value.trim();
    const tipo = document.getElementById('tipo-evento').value;

    if (!nombre || !fecha || !tipo) {
        mostrarNotificación('⚠️ Faltan campos obligatorios: Nombre del Cliente, Fecha del Evento y Tipo de Evento.', 'warning');
        return false;
    }
    return true;
}

function guardarDatosPaso1() {
    cotizacion.cliente.nombre = document.getElementById('cliente-nombre').value.trim();
    cotizacion.cliente.telefono = document.getElementById('cliente-telefono').value.trim();
    cotizacion.cliente.email = document.getElementById('cliente-email').value.trim();
    cotizacion.cliente.fechaEvento = document.getElementById('fecha-evento').value.trim();
    cotizacion.cliente.lugarEvento = document.getElementById('lugar-evento').value.trim();
    cotizacion.cliente.notas = document.getElementById('cliente-notas').value.trim();
    cotizacion.tipoEvento = document.getElementById('tipo-evento').value;
    
    aplicarTema(cotizacion.tipoEvento);
    actualizarResumen();
}

function aplicarTema(tipo) {
    const body = document.body;
    // Eliminar temas anteriores
    body.className = body.className.split(' ').filter(className => !className.startsWith('theme-')).join(' ');

    // Aplicar nuevo tema si existe
    if (tipo) {
        body.classList.add(`theme-${tipo.toLowerCase().replace(' ', '-')}`);
    }
}

// ----------------------------------------------------
// PASO 2: SELECCIÓN DE ARTÍCULOS
// ----------------------------------------------------

function switchTab(tabName) {
    // Ocultar todos los contenidos de tabs
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    // Desactivar todos los botones
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Mostrar el contenido activo y activar el botón
    const activeContent = document.getElementById(`tab-${tabName}`);
    const activeBtn = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
    
    if (activeContent) activeContent.style.display = 'block';
    if (activeBtn) activeBtn.classList.add('active');
    
    // Renderizar los artículos correspondientes
    if (tabName === 'paquetes' || tabName === 'accesorios') {
        renderizarArticulos(tabName);
    } else if (tabName === 'manual') {
        renderizarArticulosManuales();
    }
}

function renderizarArticulos(tipo) {
    const container = document.getElementById(`${tipo}-container`);
    if (!container) return;
    container.innerHTML = '';
    const listaArticulos = cotizacion.articulos[tipo];
    
    listaArticulos.forEach(articulo => {
        const isSelected = articulo.cantidad > 0;
        const card = document.createElement('div');
        card.className = `item-card ${isSelected ? 'selected' : ''}`;
        card.id = `${tipo}-${articulo.id}`;
        card.innerHTML = `
            <div class="item-details" onclick="toggleArticulo('${tipo}', ${articulo.id})">
                <h4>${articulo.emoji || '📦'} ${articulo.nombre}</h4>
                <p>Costo unitario: ${formatoMonedaRD(articulo.precio)}</p>
            </div>
            <div class="item-footer">
                <span class="price">${formatoMonedaRD(articulo.precio * articulo.cantidad)}</span>
                <div class="quantity-control">
                    <button onclick="updateCantidad('${tipo}', ${articulo.id}, -1)">-</button>
                    <input type="number" value="${articulo.cantidad}" min="0" 
                            oninput="updateCantidadInput('${tipo}', ${articulo.id}, this.value)">
                    <button onclick="updateCantidad('${tipo}', ${articulo.id}, 1)">+</button>
            </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function toggleArticulo(tipo, id) {
    const articulo = cotizacion.articulos[tipo].find(a => a.id === id);
    if (articulo) {
        if (articulo.cantidad > 0) {
            articulo.cantidad = 0; // Deseleccionar
        } else {
            articulo.cantidad = 1; // Seleccionar y establecer a 1
        }
        renderizarArticulos(tipo);
        actualizarResumen();
    }
}

function updateCantidad(tipo, id, cambio) {
    const articulo = cotizacion.articulos[tipo].find(a => a.id === id);
    if (articulo) {
        articulo.cantidad = Math.max(0, articulo.cantidad + cambio);
        renderizarArticulos(tipo);
        actualizarResumen();
    }
}

function updateCantidadInput(tipo, id, valor) {
    const articulo = cotizacion.articulos[tipo].find(a => a.id === id);
    if (articulo) {
        articulo.cantidad = Math.max(0, parseInt(valor) || 0);
        renderizarArticulos(tipo); // Re-render para aplicar clase 'selected'
        actualizarResumen();
    }
}

// Artículos Manuales
function agregarArticuloManual() {
    const newId = manualItemIdCounter++;
    cotizacion.articulos.manuales.push({
        id: newId,
        nombre: `Artículo Personalizado ${newId}`,
        precioUnitario: 0,
        cantidad: 1,
        tipo: 'manual'
    });
    renderizarArticulosManuales();
    actualizarResumen();
}

function renderizarArticulosManuales() {
    const container = document.getElementById('manual-items-container');
    if (!container) return;
    container.innerHTML = '';
    
    cotizacion.articulos.manuales.forEach(item => {
        const div = document.createElement('div');
        div.className = 'manual-item';
        div.innerHTML = `
            <input type="text" placeholder="Nombre del Artículo" value="${item.nombre}" 
                    oninput="actualizarArticuloManual(${item.id}, 'nombre', this.value)">
            <input type="number" placeholder="Precio Unitario" value="${item.precioUnitario}" min="0"
                    oninput="actualizarArticuloManual(${item.id}, 'precioUnitario', this.value)">
            <input type="number" placeholder="Cantidad" value="${item.cantidad}" min="1"
                    oninput="actualizarArticuloManual(${item.id}, 'cantidad', this.value)">
            <button class="btn-remove" onclick="eliminarArticuloManual(${item.id})">×</button>
        `;
        container.appendChild(div);
    });
}

function actualizarArticuloManual(id, campo, valor) {
    const item = cotizacion.articulos.manuales.find(a => a.id === id);
    if (item) {
        if (campo === 'nombre') {
            item.nombre = valor;
        } else {
            // Se usa parseFloat para precio y parseInt para cantidad
            item[campo] = campo === 'cantidad' ? Math.max(1, parseInt(valor) || 1) : parseFloat(valor) || 0;
        }
        actualizarResumen();
    }
}

function eliminarArticuloManual(id) {
    cotizacion.articulos.manuales = cotizacion.articulos.manuales.filter(a => a.id !== id);
    renderizarArticulosManuales();
    actualizarResumen();
}

// ----------------------------------------------------
// PASO 3: CÁLCULOS Y RESUMEN
// ----------------------------------------------------

function actualizarCostoManual(tipo, valor) {
    let numVal = parseFloat(valor) || 0;

    if (tipo === 'transporte') {
        cotizacion.costos.transporte = numVal;
    } else if (tipo === 'manoObraPorcentaje') {
        cotizacion.costos.manoObraPorcentaje = Math.min(100, Math.max(0, numVal));
    }
    // Asegurar que el input se mantenga actualizado con el valor limitado
    document.getElementById('porcentaje-mano-obra').value = cotizacion.costos.manoObraPorcentaje;
    actualizarResumen();
}

function calcularTotalCotizacion() {
    let subtotalMateriales = 0;

    // 1. Sumar Paquetes y Accesorios
    const articulosNormales = [
        ...cotizacion.articulos.paquetes,
        ...cotizacion.articulos.accesorios
    ];

    articulosNormales.forEach(item => {
        subtotalMateriales += item.precio * item.cantidad;
    });

    // 2. Sumar Artículos Manuales
    cotizacion.articulos.manuales.forEach(item => {
        subtotalMateriales += (item.precioUnitario * item.cantidad);
    });

    // 3. Calcular Mano de Obra
    cotizacion.costos.materiales = subtotalMateriales;
    const porcentajeManoObra = cotizacion.costos.manoObraPorcentaje / 100;
    const costoManoObra = subtotalMateriales * porcentajeManoObra;
    cotizacion.costos.manoObra = costoManoObra;

    // 4. Calcular Total
    cotizacion.costos.total = subtotalMateriales + costoManoObra + cotizacion.costos.transporte;
}

function actualizarResumen() {
    calcularTotalCotizacion();

    // Actualizar Resumen de Cliente
    document.getElementById('resumen-cliente').textContent = cotizacion.cliente.nombre || '-';
    document.getElementById('resumen-evento').textContent = cotizacion.tipoEvento || '-';
    document.getElementById('resumen-fecha').textContent = cotizacion.cliente.fechaEvento || '-';

    // Contar items seleccionados
    const totalPaquetes = cotizacion.articulos.paquetes.filter(a => a.cantidad > 0).length + 
                            cotizacion.articulos.manuales.filter(a => a.cantidad > 0).length;
    const totalAccesorios = cotizacion.articulos.accesorios.filter(a => a.cantidad > 0).length;

    document.getElementById('resumen-paquetes').textContent = `${totalPaquetes} item(s)`;
    document.getElementById('resumen-accesorios').textContent = `${totalAccesorios} item(s)`;

    // Actualizar Resumen de Costos
    document.getElementById('resumen-materiales').textContent = formatoMonedaRD(cotizacion.costos.materiales);
    document.getElementById('mano-obra-porcentaje').textContent = cotizacion.costos.manoObraPorcentaje;
    document.getElementById('resumen-mano-obra').textContent = formatoMonedaRD(cotizacion.costos.manoObra);
    document.getElementById('resumen-transporte').textContent = formatoMonedaRD(cotizacion.costos.transporte);
    document.getElementById('total-cotizacion').textContent = formatoMonedaRD(cotizacion.costos.total);
    
    // Habilitar/Deshabilitar el botón de PDF
    const generarBtn = document.getElementById('generar-cotizacion');
    if (generarBtn) {
        generarBtn.disabled = cotizacion.currentStep !== 3 || cotizacion.costos.total === 0;
    }
}

// ----------------------------------------------------
// PDF GENERATION (CONSTRUCCIÓN LIMPIA CON JSPDF)
// ----------------------------------------------------

function generarCotizacionPDF() {
    const { jsPDF } = window.jspdf;
    
    if (typeof jsPDF === 'undefined') {
        mostrarNotificación('❌ Error: La librería jsPDF no se ha cargado correctamente.', 'error');
        return;
    }

    const doc = new jsPDF();
    const total = cotizacion.costos.total;
    const itemsSeleccionados = [
        ...cotizacion.articulos.paquetes.filter(p => p.cantidad > 0),
        ...cotizacion.articulos.accesorios.filter(a => a.cantidad > 0),
        ...cotizacion.articulos.manuales.filter(m => m.cantidad > 0)
    ];

    // --- Configuración Inicial ---
    const margin = 15;
    let yPos = margin + 5;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const maxY = pageHeight - margin - 10;
    
    // Función para manejar el salto de página
    function checkPageBreak(neededSpace) {
        if (yPos + neededSpace > maxY) {
            doc.addPage();
            yPos = margin;
        }
    }

    // --- ENCABEZADO ELEGANTE ---
    doc.setFillColor(138, 43, 226); // Color principal: Púrpura
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("ARTE Y EVENTS", pageWidth / 2, 15, { align: "center" });
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("COTIZACIÓN PROFESIONAL", pageWidth / 2, 22, { align: "center" });
    
    yPos = 45;

    // --- INFORMACIÓN DE LA COTIZACIÓN ---
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Fecha de Creación: ${new Date().toLocaleDateString('es-DO')}`, pageWidth - margin, yPos + 10, { align: "right" });
    yPos += 10;

    // --- SECCIÓN: INFORMACIÓN DEL CLIENTE Y EVENTO ---
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(138, 43, 226);
    doc.text("Información del Cliente y Evento", margin, yPos);
    yPos += 7;
    
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    // Información del cliente en dos columnas
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    
    // Columna izquierda
    doc.text(`Cliente: ${cotizacion.cliente.nombre || 'N/A'}`, margin, yPos);
    doc.text(`Fecha del Evento: ${formatearFecha(cotizacion.cliente.fechaEvento) || 'N/A'}`, margin, yPos + 5);
    doc.text(`Contacto: ${cotizacion.cliente.telefono || ''} / ${cotizacion.cliente.email || ''}`, margin, yPos + 10);
  
    // Columna derecha - Evento y Lugar alineados a la derecha
    const xRight = pageWidth - margin;
    doc.text(`Evento: ${cotizacion.tipoEvento || 'N/A'}`, xRight, yPos, { align: "right" });
    doc.text(`Lugar: ${cotizacion.cliente.lugarEvento || 'N/A'}`, xRight, yPos + 5, { align: "right" });
    
    yPos += 20;

    // --- SECCIÓN: DETALLE DE ARTÍCULOS ---
    checkPageBreak(50);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(138, 43, 226);
    doc.text("Detalle de Artículos y Servicios", margin, yPos);
    yPos += 7;

    // Encabezados de la tabla con diseño elegante
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 7, 'F');
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text("Descripción", margin + 2, yPos + 5);
    doc.text("Cant.", pageWidth - margin - 35, yPos + 5);
    doc.text("Precio Total", pageWidth - margin - 5, yPos + 5, { align: "right" });
    
    yPos += 7;

    // Líneas de detalle de la tabla
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);

    itemsSeleccionados.forEach(item => {
        checkPageBreak(5);
        const nombre = item.nombre;
        const cantidad = item.cantidad || 1;
        
        let precioUnitario;
        if (item.tipo === 'manual') {
            precioUnitario = item.precioUnitario;
        } else {
            precioUnitario = item.precio;
        }

        const precioTotalItem = precioUnitario * cantidad;

        doc.text(nombre, margin + 2, yPos + 4);
        doc.text(cantidad.toString(), pageWidth - margin - 35, yPos + 4, { align: "right" });
        doc.text(formatoMonedaRD(precioTotalItem), pageWidth - margin - 5, yPos + 4, { align: "right" });
        yPos += 6;
    });

    yPos += 10;

    // --- SECCIÓN: RESUMEN DE COSTOS ---
    checkPageBreak(50);
    
    /// Línea decorativa COMPLETA
doc.setDrawColor(138, 43, 226);
doc.setLineWidth(0.3);
doc.line(margin, yPos, pageWidth - margin, yPos);
yPos += 8;
    const xCostos = pageWidth - margin - 5;
    
    doc.setFontSize(10);
    doc.text("Costo de Materiales:", pageWidth / 2, yPos, { align: "left" });
    doc.text(formatoMonedaRD(cotizacion.costos.materiales), xCostos, yPos, { align: "right" });
    yPos += 5;

    doc.text("Mano de Obra:", pageWidth / 2, yPos, { align: "left" });
    doc.text(formatoMonedaRD(cotizacion.costos.manoObra), xCostos, yPos, { align: "right" });
    yPos += 5;

    doc.text("Costo de Transporte:", pageWidth / 2, yPos, { align: "left" });
    doc.text(formatoMonedaRD(cotizacion.costos.transporte), xCostos, yPos, { align: "right" });
    yPos += 8;
    
    // Línea doble antes del total
    doc.setDrawColor(138, 43, 226);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2, yPos, pageWidth - margin, yPos);
    yPos += 1;
    doc.line(pageWidth / 2, yPos, pageWidth - margin, yPos);
    yPos += 8;

    // TOTAL FINAL con diseño destacado
    doc.setFillColor(245, 245, 245);
    doc.rect(pageWidth / 2 - 10, yPos - 5, pageWidth / 2 - margin + 10, 12, 'F');
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(138, 43, 226);
    doc.text("TOTAL COTIZADO:", pageWidth / 2, yPos, { align: "left" });
    doc.text(formatoMonedaRD(total), xCostos, yPos, { align: "right" });
    yPos += 15;
    
    // --- NOTAS (si existen) ---
    if (cotizacion.cliente.notas) {
        checkPageBreak(20);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text("Notas Adicionales:", margin, yPos);
        yPos += 4;
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(80, 80, 80);
        const textLines = doc.splitTextToSize(cotizacion.cliente.notas, pageWidth - 2 * margin);
        doc.text(textLines, margin, yPos);
        yPos += textLines.length * 4;
    }
    
    // --- PIE DE PÁGINA ELEGANTE ---
    checkPageBreak(20);
    doc.setFillColor(245, 245, 245);
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150);
    
    doc.text("Arte y Events - Decoración Profesional", pageWidth / 2, pageHeight - 10, { align: "center" });

    // Guardar el PDF
    const nombreArchivo = `cotizacion-${cotizacion.cliente.nombre.replace(/ /g, '_') || 'arte-events'}-${new Date().getTime()}.pdf`;
    doc.save(nombreArchivo);

    // Limpiar campos después de generar la cotización
    limpiarCamposCotizacion();

    // Mostrar notificación
    mostrarNotificación('✅ ¡Cotización generada con éxito!');
}

// Función auxiliar para formatear la fecha
function formatearFecha(fechaISO) {
    if (!fechaISO) return '';
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-DO');
}

// Función para limpiar campos después de generar la cotización
function limpiarCamposCotizacion() {
    // Limpiar información del cliente
    document.getElementById('cliente-nombre').value = '';
    document.getElementById('cliente-telefono').value = '';
    document.getElementById('cliente-email').value = '';
    document.getElementById('lugar-evento').value = '';
    document.getElementById('cliente-notas').value = '';
    document.getElementById('tipo-evento').value = '';
    
    // Restablecer fecha a la actual
    cargarFechaActual();
    
    // Limpiar selección de artículos
    cotizacion.articulos.paquetes.forEach(p => p.cantidad = 0);
    cotizacion.articulos.accesorios.forEach(a => a.cantidad = 0);
    cotizacion.articulos.manuales = [];
    
    // Restablecer costos
    document.getElementById('costo-transporte').value = 0;
    document.getElementById('porcentaje-mano-obra').value = 30;
    
    // Actualizar la UI
    renderizarArticulos('paquetes');
    renderizarArticulos('accesorios');
    renderizarArticulosManuales();
    actualizarResumen();
    
    // Volver al paso 1
    cotizacion.currentStep = 1;
    updateStepUI();
}

// ----------------------------------------------------
// UTILIDADES Y PANEL DE CONFIGURACIÓN
// ----------------------------------------------------

function mostrarNotificación(mensaje, tipo = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = mensaje;
    notification.className = `notification show ${tipo === 'warning' ? 'warning' : ''} ${tipo === 'error' ? 'error' : ''}`;
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function toggleConfig() {
    document.getElementById('configPanel').classList.toggle('active');
}

function cargarConfiguracion() {
    const configGuardada = localStorage.getItem('arteyevents_config');
    if (configGuardada) {
        configuracion = JSON.parse(configGuardada);
        // Recopiar la estructura limpia (solo ítems sin cantidad) a la cotización
        cotizacion.articulos.paquetes = configuracion.paquetes.map(p => ({...p, cantidad: 0}));
        cotizacion.articulos.accesorios = configuracion.accesorios.map(a => ({...a, cantidad: 0}));
        cotizacion.costos.manoObraPorcentaje = configuracion.manoObraPorcentaje;
    }
}

function guardarConfiguracion() {
    // 1. Actualizar el porcentaje de mano de obra antes de guardar
    configuracion.manoObraPorcentaje = parseFloat(document.getElementById('porcentaje-mano-obra').value) || 0;
    
    // 2. Limpiar las cantidades para guardar solo la plantilla base
    const configToSave = {
        paquetes: configuracion.paquetes.map(({ id, nombre, precio, emoji }) => ({ id, nombre, precio, emoji: emoji || '🎈' })),
        accesorios: configuracion.accesorios.map(({ id, nombre, precio, emoji }) => ({ id, nombre, precio, emoji: emoji || '✨' })),
        manoObraPorcentaje: configuracion.manoObraPorcentaje
    };
    
    localStorage.setItem('arteyevents_config', JSON.stringify(configToSave));
    mostrarNotificación('✅ Configuración guardada con éxito.');
    toggleConfig();
    
    // 3. Recargar la configuración en la aplicación para aplicar cambios
    cargarConfiguracion();
    renderizarArticulos('paquetes');
    actualizarResumen();
}

function renderizarConfiguracion() {
    const configPaquetesContainer = document.getElementById('config-paquetes');
    const configAccesoriosContainer = document.getElementById('config-accesorios');
    
    if (configPaquetesContainer) configPaquetesContainer.innerHTML = '';
    if (configAccesoriosContainer) configAccesoriosContainer.innerHTML = '';
    
    // Renderizar Paquetes
    configuracion.paquetes.forEach(item => {
        if (configPaquetesContainer) configPaquetesContainer.innerHTML += createConfigItemHTML('paquete', item);
    });

    // Renderizar Accesorios
    configuracion.accesorios.forEach(item => {
        if (configAccesoriosContainer) configAccesoriosContainer.innerHTML += createConfigItemHTML('accesorio', item);
    });
}

function createConfigItemHTML(tipo, item) {
    return `
        <div class="config-item" data-id="${item.id}" data-tipo="${tipo}">
            <input type="text" placeholder="Nombre" value="${item.nombre}" 
                    oninput="actualizarConfigItem('${tipo}', ${item.id}, 'nombre', this.value)">
            <input type="number" placeholder="Precio" value="${item.precio}" min="0" 
                    oninput="actualizarConfigItem('${tipo}', ${item.id}, 'precio', this.value)">
            <button class="btn-remove" onclick="eliminarConfigItem('${tipo}', ${item.id})">×</button>
        </div>
    `;
}

function agregarPaquete() {
    const newId = configIdCounter++;
    configuracion.paquetes.push({ id: newId, nombre: `Nuevo Globo ${newId}`, precio: 0, emoji: '🎈', cantidad: 0 });
    renderizarConfiguracion();
}

function agregarAccesorio() {
    const newId = configIdCounter++;
    configuracion.accesorios.push({ id: newId, nombre: `Nuevo Accesorio ${newId}`, precio: 0, emoji: '✨', cantidad: 0 });
    renderizarConfiguracion();
}

function actualizarConfigItem(tipo, id, campo, valor) {
    const lista = configuracion[`${tipo}s`];
    const item = lista.find(a => a.id === id);
    if (item) {
        if (campo === 'nombre') {
            item.nombre = valor;
        } else if (campo === 'precio') {
            item.precio = parseFloat(valor) || 0;
        }
    }
}

function eliminarConfigItem(tipo, id) {
    configuracion[`${tipo}s`] = configuracion[`${tipo}s`].filter(a => a.id !== id);
    renderizarConfiguracion();
}

// Lógica PWA (Se mantiene por si estaba en uso)
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // Mostrar botón de instalación si no se ha instalado
    // if (!localStorage.getItem('pwa_installed')) showInstallButton();
});

// Función de ejemplo para mostrar el botón de instalación (si es necesario)
function showInstallButton() {
  const installBtn = document.createElement('button');
  installBtn.id = 'install-btn';
  installBtn.textContent = 'Instalar App';
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
        localStorage.setItem('pwa_installed', 'true');
      }
      deferredPrompt = null;
    }
  };
  
  document.body.appendChild(installBtn);
}

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      // console.log('SW registered: ', registration);
    }).catch(registrationError => {
      // console.log('SW registration failed: ', registrationError);
    });
  });
} 
