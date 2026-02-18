// Cargar jsPDF si no está disponible
if (!window.jspdf) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    document.head.appendChild(script);
    
    const script2 = document.createElement('script');
    script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    document.head.appendChild(script2);
}

let configuracion = {
    tiposEvento: ['Bodas', 'Cumpleaños', 'Corporativo', 'Baby Shower', 'Graduaciones', 'Aniversarios', 'Flores'],
    tematicasEvento: ['Clásica', 'Moderno', 'Vintage', 'Rústica', 'Minimalista', 'Bohemia', 'Elegante', 'Divertida'],
    paquetes: [
        { id: 1, nombre: "Globo Azul", precio: 1200, costo: 400, emoji: '💙', cantidad: 0, tipo: 'decoracion', unidad: 'paquete' },
        { id: 2, nombre: "Globo Dorado", precio: 1500, costo: 500, emoji: '✨', cantidad: 0, tipo: 'decoracion', unidad: 'paquete' },
        { id: 3, nombre: "Globo Blanco", precio: 1000, costo: 300, emoji: '☁️', cantidad: 0, tipo: 'decoracion', unidad: 'paquete' },
        { id: 4, nombre: "Globo Rosa", precio: 1300, costo: 450, emoji: '💖', cantidad: 0, tipo: 'decoracion', unidad: 'paquete' }
    ],
    accesorios: [
        { id: 1, nombre: "Mampara Circular", precio: 800, costo: 300, emoji: '🖼️', cantidad: 0, tipo: 'decoracion', unidad: 'unidad' },
        { id: 2, nombre: "Cilindro Decorativo", precio: 400, costo: 150, emoji: '🏺', cantidad: 0, tipo: 'decoracion', unidad: 'unidad' },
        { id: 3, nombre: "Mesa Principal", precio: 300, costo: 100, emoji: '🪑', cantidad: 0, tipo: 'decoracion', unidad: 'unidad' },
        { id: 4, nombre: "Sillas Tiffany (x10)", precio: 1500, costo: 600, emoji: '🪑', cantidad: 0, tipo: 'decoracion', unidad: 'juego' },
        { id: 5, nombre: "Alfombra Roja", precio: 600, costo: 200, emoji: '🟥', cantidad: 0, tipo: 'decoracion', unidad: 'unidad' }
    ],
    flores: [
        { id: 100, nombre: "Rosas Rojas", precio: 250, costo: 80, emoji: '🌹', cantidad: 0, tipo: 'flores', color: 'Rojo', unidad: 'flor' },
        { id: 101, nombre: "Rosas Blancas", precio: 250, costo: 80, emoji: '🌹', cantidad: 0, tipo: 'flores', color: 'Blanco', unidad: 'flor' },
        { id: 102, nombre: "Rosas Rosadas", precio: 250, costo: 80, emoji: '🌹', cantidad: 0, tipo: 'flores', color: 'Rosa', unidad: 'flor' },
        { id: 103, nombre: "Girasoles", precio: 300, costo: 100, emoji: '🌻', cantidad: 0, tipo: 'flores', color: 'Amarillo', unidad: 'flor' },
        { id: 104, nombre: "Lirios Blancos", precio: 350, costo: 120, emoji: '⚜️', cantidad: 0, tipo: 'flores', color: 'Blanco', unidad: 'flor' },
        { id: 105, nombre: "Orquídeas", precio: 500, costo: 200, emoji: '💮', cantidad: 0, tipo: 'flores', color: 'Morado', unidad: 'flor' },
        { id: 106, nombre: "Tulipanes", precio: 400, costo: 150, emoji: '🌷', cantidad: 0, tipo: 'flores', color: 'Multicolor', unidad: 'flor' },
        { id: 107, nombre: "Flores Silvestres", precio: 200, costo: 60, emoji: '🌸', cantidad: 0, tipo: 'flores', color: 'Mixto', unidad: 'flor' }
    ],
    arreglosFlorales: [
        { id: 200, nombre: "Ramo Pequeño (12 flores)", precio: 3000, costo: 1200, emoji: '💐', cantidad: 0, tipo: 'flores', unidad: 'ramo' },
        { id: 201, nombre: "Ramo Mediano (24 flores)", precio: 5500, costo: 2200, emoji: '💐', cantidad: 0, tipo: 'flores', unidad: 'ramo' },
        { id: 202, nombre: "Ramo Grande (36 flores)", precio: 8000, costo: 3200, emoji: '💐', cantidad: 0, tipo: 'flores', unidad: 'ramo' },
        { id: 203, nombre: "Centro de Mesa", precio: 4500, costo: 1800, emoji: '🏺', cantidad: 0, tipo: 'flores', unidad: 'centro' },
        { id: 204, nombre: "Arco Floral", precio: 12000, costo: 5000, emoji: '🎀', cantidad: 0, tipo: 'flores', unidad: 'arco' },
        { id: 205, nombre: "Guirnalda Floral", precio: 7500, costo: 3000, emoji: '🌿', cantidad: 0, tipo: 'flores', unidad: 'guirnalda' }
    ],
    manoObraPorcentaje: 30
};

let configPDF = {
    mostrarManoObra: true,
    mostrarTransporte: true,
    mostrarDetalleMateriales: true,
    mostrarCostoMateriales: true,
    mostrarPresupuestoSimple: false
};

let cotizacion = {
    currentStep: 1,
    tipoServicio: '',
    tipoManoObra: 'porcentaje',
    montoManoObraManual: 0,
    cliente: {
        nombre: '', telefono: '', email: '', fechaEvento: '', lugarEvento: '', notas: ''
    },
    tipoEvento: '',
    tematicaEvento: '',
    articulos: {
        paquetes: [],
        accesorios: [],
        flores: [],
        arreglosFlorales: [],
        manuales: []
    },
    costos: {
        materiales: 0,
        costoRealMateriales: 0,
        transporte: 0,
        manoObra: 0,
        manoObraPorcentaje: configuracion.manoObraPorcentaje,
        total: 0
    }
};

let manualItemIdCounter = 1;
let configIdCounter = 1000;

// ----------------------------------------------------
// FUNCIONES DE SCROLL AUTOMÁTICO
// ----------------------------------------------------

// ----------------------------------------------------
// FUNCIONES DE SCROLL MEJORADAS PARA MÓVIL
// ----------------------------------------------------

function scrollToStepTop() {
    // Solo hacer scroll si el usuario está más abajo del header
    if (window.scrollY > 150) {
        setTimeout(() => {
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
        }, 150);
    }
}

function scrollToTabs() {
    // Solo en móvil y si los tabs están fuera de vista
    if (window.innerWidth <= 768) {
        const tabsContainer = document.getElementById('tabs-container');
        const tabsPosition = tabsContainer?.getBoundingClientRect().top || 0;
        
        // Si los tabs están fuera de la vista superior
        if (tabsContainer && tabsPosition < 0) {
            setTimeout(() => {
                tabsContainer.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 150);
        }
    }
}

function scrollToErrorField(fieldId) {
    const fieldElement = document.getElementById(fieldId);
    if (fieldElement) {
        // Calcular si el campo está visible
        const rect = fieldElement.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
        
        // Solo hacer scroll si no está visible
        if (!isVisible) {
            setTimeout(() => {
                fieldElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                fieldElement.focus();
            }, 300);
        } else {
            // Si ya está visible, solo enfocar
            fieldElement.focus();
        }
    }
}
// ----------------------------------------------------
// FUNCIONES DE MEJORA UX
// ----------------------------------------------------

function crearElementosFlotantes() {
    const floatingBtn = document.createElement('button');
    floatingBtn.id = 'floating-pdf-btn';
    floatingBtn.className = 'floating-button';
    floatingBtn.style.display = 'none';
    floatingBtn.innerHTML = `<span class="floating-icon">📄</span><span class="floating-text">Generar PDF</span>`;
    floatingBtn.title = 'Generar PDF - Haga clic para descargar la cotización';
    floatingBtn.onclick = () => generarCotizacionPDF();
    document.body.appendChild(floatingBtn);
    
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'back-to-top-btn';
    backToTopBtn.className = 'floating-button back-to-top';
    backToTopBtn.style.display = 'none';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.title = 'Volver al inicio de la página';
    backToTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.appendChild(backToTopBtn);
    
    const indicator = document.createElement('div');
    indicator.id = 'current-step-indicator';
    indicator.className = 'step-indicator-badge';
    indicator.style.display = 'none';
    document.body.appendChild(indicator);
}

function actualizarVisibilidadBotonesFlotantes() {
    const floatingPdfBtn = document.getElementById('floating-pdf-btn');
    const backToTopBtn = document.getElementById('back-to-top-btn');
    
    if (!floatingPdfBtn || !backToTopBtn) return;
    
    // ✅ VERSIÓN SIMPLIFICADA PARA MÓVIL
    if (cotizacion.currentStep === 3) {
        // Mostrar el botón flotante en el paso 3 (tanto en móvil como desktop)
        floatingPdfBtn.style.display = 'flex';
        floatingPdfBtn.classList.add('visible');
        
        const total = cotizacion.costos.total || 0;
        const totalArticulos = parseInt(document.getElementById('total-articulos')?.textContent) || 0;
        
        if (total > 0 && totalArticulos > 0) {
            floatingPdfBtn.disabled = false;
            floatingPdfBtn.style.cursor = 'pointer';
            floatingPdfBtn.style.opacity = '1';
            floatingPdfBtn.title = `Generar PDF\nTotal: ${formatoMonedaRD(total)}\nArtículos: ${totalArticulos}`;
        } else {
            floatingPdfBtn.disabled = true;
            floatingPdfBtn.style.cursor = 'not-allowed';
            floatingPdfBtn.style.opacity = '0.6';
            floatingPdfBtn.title = 'No hay artículos seleccionados para generar PDF';
        }
    } else {
        // Ocultar en otros pasos
        floatingPdfBtn.classList.remove('visible');
        floatingPdfBtn.style.display = 'none';
    }
    
    // Botón para volver arriba (sin cambios)
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
        backToTopBtn.style.display = 'flex';
    } else {
        backToTopBtn.classList.remove('visible');
        backToTopBtn.style.display = 'none';
    }
}
function actualizarIndicadorPasoActual() {
    const indicator = document.getElementById('current-step-indicator');
    if (!indicator) return;
    
    const stepNames = ['Información del Cliente', 'Selección de Artículos', 'Resumen y PDF'];
    const currentStepName = stepNames[cotizacion.currentStep - 1] || '';
    
    indicator.innerHTML = `<span class="step-number">${cotizacion.currentStep}</span><span class="step-name">${currentStepName}</span>`;
    indicator.setAttribute('data-step', cotizacion.currentStep);
}

function mejorarVisualizacionTotal() {
    let totalDisplay = document.getElementById('total-display');
    if (!totalDisplay) {
        totalDisplay = document.createElement('div');
        totalDisplay.id = 'total-display';
        totalDisplay.className = 'total-display';
        const progressContainer = document.querySelector('.progress-container');
        if (progressContainer) progressContainer.appendChild(totalDisplay);
    }
    
    const total = cotizacion.costos.total;
    const totalArticulos = parseInt(document.getElementById('total-articulos')?.textContent) || 0;
    
    if (total > 0) {
        totalDisplay.innerHTML = `
            <div class="total-amount">${formatoMonedaRD(total)}</div>
            <div class="total-items">${totalArticulos} artículo${totalArticulos !== 1 ? 's' : ''}</div>
        `;
        totalDisplay.classList.add('visible');
    } else {
        totalDisplay.classList.remove('visible');
    }
}

// ----------------------------------------------------
// FUNCIÓN PARA FORMATEAR MONEDA DOMINICANA
// ----------------------------------------------------

function formatoMonedaRD(monto) {
    if (isNaN(monto) || monto === null) monto = 0;
    const numero = parseFloat(monto);
    return `RD$${numero.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ----------------------------------------------------
// INICIALIZACIÓN Y EVENT LISTENERS
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    crearElementosFlotantes();
    cargarConfiguracion();
    inicializarEventListeners();
    inicializarFechaEvento();
    actualizarTiposEvento();
    actualizarTematicasEvento();
    updateStepUI();
    renderizarArticulos('paquetes');
    renderizarConfiguracion();
    actualizarResumen();
    actualizarConfigPDF();
    cargarPreferenciasUsuario();
    
    aplicarTema();
    actualizarVistaPreviaPDF();
    mejorarVisualizacionTotal();
    
    setTimeout(actualizarVisibilidadBotonesFlotantes, 200);
    window.addEventListener('scroll', actualizarVisibilidadBotonesFlotantes);
    
    // Prevenir zoom en iOS
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    });
    
    // Mejorar rendimiento en móvil
    document.addEventListener('touchstart', function() {}, { passive: true });
});

// ----------------------------------------------------
// SINCRONIZACIÓN EVENTO-SERVICIO
// ----------------------------------------------------

function sincronizarEventoServicio() {
    const tipoEvento = document.getElementById('tipo-evento').value;
    const tipoServicioSelect = document.getElementById('tipo-servicio');
    const tipoServicioTexto = document.getElementById('tipo-servicio-texto');
    
    let nuevoServicio = '';
    
    if (tipoEvento === 'Flores') {
        nuevoServicio = 'flores';
    } else if (tipoEvento !== '') {
        nuevoServicio = 'decoracion';
    }
    
    if (nuevoServicio) {
        // 1. Actualizar el objeto cotizacion PRIMERO
        cotizacion.tipoServicio = nuevoServicio;
        // 2. Actualizar el select oculto
        if (tipoServicioSelect) tipoServicioSelect.value = nuevoServicio;
        // 3. Actualizar el texto visible
        if (tipoServicioTexto) {
            if (nuevoServicio === 'flores') {
                tipoServicioTexto.textContent = '🌸 Flores Externas';
                tipoServicioTexto.style.color = '#e91e63';
                tipoServicioTexto.style.fontWeight = '600';
            } else {
                tipoServicioTexto.textContent = '🎨 Decoración';
                tipoServicioTexto.style.color = '#8a2be2';
                tipoServicioTexto.style.fontWeight = '600';
            }
        }
        limpiarError('tipo-servicio');
        // 4. Actualizar UI sin volver a leer el DOM
        if (cotizacion.currentStep === 2) actualizarUIporTipoServicio();
        actualizarResumen();
    }
    
    // 5. Guardar — ahora cotizacion.tipoServicio ya tiene el valor correcto
    guardarDatosPaso1();
}

function validarConsistenciaEventoServicio() {
    const tipoEvento = document.getElementById('tipo-evento').value;
    const tipoServicio = document.getElementById('tipo-servicio').value;
    
    if (tipoEvento === 'Flores' && tipoServicio !== 'flores') {
        mostrarError('tipo-servicio', 'Para eventos de tipo "Flores", el servicio debe ser "Flores Externas".');
        return false;
    }
    
    limpiarError('tipo-servicio');
    return true;
}

function inicializarFechaEvento() {
    const fechaInput = document.getElementById('fecha-evento');
    if (!fechaInput) return;
    
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');
    const fechaHoy = `${year}-${month}-${day}`;
    
    fechaInput.min = fechaHoy;
    fechaInput.value = fechaHoy;
    cotizacion.cliente.fechaEvento = fechaHoy;
    
    setTimeout(() => {
        validarCampo('fecha-evento', fechaHoy);
        guardarDatosPaso1();
        actualizarResumen();
    }, 200);
}

function cambiarTematicaEvento() {
    const select = document.getElementById('tematica-evento');
    const otraTematicaContainer = document.getElementById('otra-tematica-container');
    
    if (select.value === 'otra') {
        otraTematicaContainer.style.display = 'block';
    } else {
        otraTematicaContainer.style.display = 'none';
        if (document.getElementById('otra-tematica')) {
            document.getElementById('otra-tematica').value = '';
        }
    }
    guardarDatosPaso1();
}

// ----------------------------------------------------
// FUNCIONES PARA CALCULAR COSTOS AUTOMÁTICAMENTE
// ----------------------------------------------------

function calcularTotalesAutomaticos() {
    let precioVentaTotal = 0;
    let costoRealTotal = 0;

    if (cotizacion.tipoServicio === 'decoracion') {
        const articulosDecoracion = [
            ...cotizacion.articulos.paquetes,
            ...cotizacion.articulos.accesorios
        ];
        articulosDecoracion.forEach(item => {
            precioVentaTotal += item.precio * item.cantidad;
            costoRealTotal += (item.costo || 0) * item.cantidad;
        });
    } else if (cotizacion.tipoServicio === 'flores') {
        const articulosFlores = [
            ...cotizacion.articulos.flores,
            ...cotizacion.articulos.arreglosFlorales
        ];
        articulosFlores.forEach(item => {
            precioVentaTotal += item.precio * item.cantidad;
            costoRealTotal += (item.costo || 0) * item.cantidad;
        });
    }

    cotizacion.articulos.manuales.forEach(item => {
        precioVentaTotal += (item.precioUnitario * item.cantidad);
        const costoManual = item.costoReal || (item.precioUnitario * 0.7);
        costoRealTotal += costoManual * item.cantidad;
    });

    cotizacion.costos.materiales = precioVentaTotal;
    cotizacion.costos.costoRealMateriales = costoRealTotal;
    
    const inputCostoMateriales = document.getElementById('costo-materiales');
    if (inputCostoMateriales) {
        inputCostoMateriales.value = Math.round(costoRealTotal);
    }
    
    return { 
        precioVentaTotal, 
        costoRealTotal,
        diferenciaMateriales: precioVentaTotal - costoRealTotal 
    };
}

function calcularTotalCotizacion() {
    const { precioVentaTotal, costoRealTotal, diferenciaMateriales } = calcularTotalesAutomaticos();
    
    const inputCostoMateriales = document.getElementById('costo-materiales');
    let costoRealMateriales = inputCostoMateriales ? parseFloat(inputCostoMateriales.value) || 0 : 0;
    
    if (costoRealMateriales === 0 && costoRealTotal > 0) {
        costoRealMateriales = costoRealTotal;
        if (inputCostoMateriales) inputCostoMateriales.value = Math.round(costoRealTotal);
    }
    
    const inputPorcentajeManoObra = document.getElementById('porcentaje-mano-obra');
    const porcentajeManoObra = inputPorcentajeManoObra ? parseFloat(inputPorcentajeManoObra.value) || 30 : 30;
    
    let manoObra = 0;
    if (cotizacion.tipoServicio === 'decoracion') {
        if (cotizacion.tipoManoObra === 'porcentaje') {
            manoObra = costoRealMateriales * (porcentajeManoObra / 100);
        } else if (cotizacion.tipoManoObra === 'manual') {
            manoObra = cotizacion.montoManoObraManual;
        }
    }
    cotizacion.costos.manoObra = manoObra;
    
    const transporte = cotizacion.costos.transporte || 0;
    let totalFinal = precioVentaTotal + manoObra + transporte;
    cotizacion.costos.total = totalFinal;
    
    let gananciaTotal = 0;
    if (cotizacion.tipoServicio === 'decoracion') {
        gananciaTotal = diferenciaMateriales + manoObra + transporte;
    } else if (cotizacion.tipoServicio === 'flores') {
        gananciaTotal = diferenciaMateriales + transporte;
    }
    
    const porcentajeGananciaTotal = costoRealMateriales > 0 ? (gananciaTotal / costoRealMateriales * 100) : 0;
    
    actualizarDisplayResumen(
        costoRealMateriales, 
        precioVentaTotal, 
        manoObra, 
        diferenciaMateriales, 
        transporte, 
        totalFinal, 
        gananciaTotal, 
        porcentajeGananciaTotal
    );
}

function actualizarDisplayResumen(costoReal, precioVenta, manoObra, diferenciaMateriales, 
                                 transporte, totalFinal, gananciaTotal, porcentajeGanancia) {
    
    const displayCostoReal = document.getElementById('display-costo-real');
    const displayPrecioVenta = document.getElementById('display-precio-venta');
    const displayGanancia = document.getElementById('display-ganancia');
    const displayPorcentajeGanancia = document.getElementById('display-porcentaje-ganancia');
    const displayManoObra = document.getElementById('display-mano-obra');
    const displayPorcentajeManoObra = document.getElementById('display-porcentaje-mano-obra');
    const displayTransporte = document.getElementById('display-transporte');
    const displayTotalFinal = document.getElementById('display-total-final');
    
    if (displayCostoReal) displayCostoReal.textContent = formatoMonedaRD(costoReal);
    if (displayPrecioVenta) displayPrecioVenta.textContent = formatoMonedaRD(precioVenta);
    if (displayGanancia) displayGanancia.textContent = formatoMonedaRD(gananciaTotal);
    if (displayPorcentajeGanancia) {
        displayPorcentajeGanancia.textContent = `${Math.round(porcentajeGanancia)}%`;
        if (porcentajeGanancia >= 100) {
            displayPorcentajeGanancia.style.color = '#4caf50';
        } else if (porcentajeGanancia >= 50) {
            displayPorcentajeGanancia.style.color = '#ff9800';
        } else {
            displayPorcentajeGanancia.style.color = '#f44336';
        }
    }
    
    if (displayManoObra) displayManoObra.textContent = formatoMonedaRD(manoObra);
    if (displayPorcentajeManoObra) {
        const porcentajeManoObra = document.getElementById('porcentaje-mano-obra').value || 30;
        displayPorcentajeManoObra.textContent = porcentajeManoObra;
    }
    if (displayTransporte) displayTransporte.textContent = formatoMonedaRD(transporte);
    if (displayTotalFinal) displayTotalFinal.textContent = formatoMonedaRD(totalFinal);
    
    const inputPorcentajeGanancia = document.getElementById('porcentaje-ganancia');
    if (inputPorcentajeGanancia) inputPorcentajeGanancia.value = Math.round(porcentajeGanancia);
    
    // Solo mostrar desglose en paso 3
    if (cotizacion.currentStep === 3) {
        mostrarDesgloseGanancia(costoReal, precioVenta, manoObra, diferenciaMateriales, 
                               transporte, totalFinal, gananciaTotal, porcentajeGanancia);
    }
}

// Función para mostrar desglose de ganancia SOLO en paso 3
function mostrarDesgloseGanancia(costoReal, precioVenta, manoObra, diferenciaMateriales, 
                                transporte, totalFinal, gananciaTotal, porcentajeGanancia) {
    
    // Buscar el contenedor correcto en el paso 3
    const paso3 = document.getElementById('step-3');
    if (!paso3) return;
    
    // Remover desglose existente
    const existingDesglose = paso3.querySelector('#desglose-ganancia-paso3');
    if (existingDesglose) existingDesglose.remove();
    
    if (costoReal <= 0) return;
    
    const esDecoracion = cotizacion.tipoServicio === 'decoracion';
    const porcentajeManoObra = document.getElementById('porcentaje-mano-obra')?.value || 30;
    
    let desgloseHTML = `
        <div id="desglose-ganancia-paso3" style="margin-top: 20px; padding: 15px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 10px; border-left: 4px solid var(--success);">
            <div style="font-weight: 700; color: var(--success); margin-bottom: 10px; font-size: 1.1em; display: flex; align-items: center; gap: 8px;">💰 DESGLOSE DE GANANCIA (${esDecoracion ? 'DECORACIÓN' : 'FLORES EXTERNAS'})</div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
                <div style="font-size: 0.9em; color: #666;">Costo Real Materiales:</div>
                <div style="text-align: right; font-weight: 600;">${formatoMonedaRD(costoReal)}</div>
                
                <div style="font-size: 0.9em; color: #666;">Precio Venta Materiales:</div>
                <div style="text-align: right; font-weight: 600; color: var(--primary);">${formatoMonedaRD(precioVenta)}</div>
                
                <div style="font-size: 0.9em; color: #666; border-top: 1px dashed #ddd; padding-top: 5px;"><span style="color: var(--success);">+</span> Diferencia Materiales:</div>
                <div style="text-align: right; font-weight: 600; color: var(--success); border-top: 1px dashed #ddd; padding-top: 5px;">${formatoMonedaRD(diferenciaMateriales)}</div>`;
    
    if (esDecoracion && manoObra > 0) {
        desgloseHTML += `
                <div style="font-size: 0.9em; color: #666;"><span style="color: #ff9800;">+</span> Mano de Obra (${porcentajeManoObra}%):</div>
                <div style="text-align: right; font-weight: 600; color: #ff9800;">${formatoMonedaRD(manoObra)}</div>`;
    }
    
    if (transporte > 0) {
        desgloseHTML += `
                <div style="font-size: 0.9em; color: #666;"><span style="color: #2196f3;">+</span> Transporte:</div>
                <div style="text-align: right; font-weight: 600; color: #2196f3;">${formatoMonedaRD(transporte)}</div>`;
    }
    
    let gananciaCalculada = diferenciaMateriales;
    let formulaTexto = "Ganancia = Diferencia en Materiales";
    
    if (esDecoracion) {
        gananciaCalculada += manoObra;
        formulaTexto = "Ganancia = Diferencia en Materiales + Mano de Obra";
    }
    
    if (transporte > 0) {
        gananciaCalculada += transporte;
        formulaTexto += " + Transporte";
    }
    
    desgloseHTML += `
                <div style="font-size: 0.9em; color: #666; border-top: 2px solid var(--primary-dark); padding-top: 8px; font-weight: 700;">GANANCIA TOTAL${esDecoracion ? ' (DECORACIÓN)' : ' (FLORES)'}:</div>
                <div style="text-align: right; font-weight: 900; color: var(--primary-dark); border-top: 2px solid var(--primary-dark); padding-top: 8px;">${formatoMonedaRD(gananciaCalculada)}</div>
                
                <div style="font-size: 0.85em; color: #666; grid-column: 1 / -1; text-align: center; margin-top: 5px; padding: 5px; background: rgba(0, 184, 148, 0.1); border-radius: 5px;">
                    <span style="font-weight: 700; color: var(--success);">${Math.round(porcentajeGanancia)}%</span> de ganancia sobre costo real
                </div>
                
                <div style="font-size: 1em; color: #fff; background: var(--primary); padding: 10px; border-radius: 8px; grid-column: 1 / -1; margin-top: 10px; text-align: center; font-weight: 700; box-shadow: 0 4px 12px rgba(138, 43, 226, 0.3);">
                    💵 PRECIO FINAL AL CLIENTE: ${formatoMonedaRD(totalFinal)}
                </div>
            </div>
            
            <div style="font-size: 0.8em; color: #666; font-style: italic; margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd;">💡 <strong>${formulaTexto}</strong></div>
        </div>
    `;
    
    // Insertar antes del panel de configuración del PDF
    const configPDFSection = paso3.querySelector('.form-section[style*="border-left: 4px solid #4ecdc4"]');
    if (configPDFSection) {
        configPDFSection.insertAdjacentHTML('beforebegin', desgloseHTML);
    } else {
        // Si no encuentra el panel de config, insertar al final del formulario
        const formSections = paso3.querySelectorAll('.form-section');
        if (formSections.length > 0) {
            formSections[formSections.length - 1].insertAdjacentHTML('afterend', desgloseHTML);
        }
    }
}

function inicializarEventListeners() {
    const inputsPaso1 = ['cliente-nombre', 'fecha-evento', 'cliente-notas', 'lugar-evento', 'cliente-telefono', 'cliente-email', 'tipo-servicio', 'otro-evento', 'otra-tematica'];
    
    inputsPaso1.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', function() {
                guardarDatosPaso1();
                limpiarError(this.id);
            });
            element.addEventListener('blur', function() {
                validarCampo(this.id, this.value);
            });
        }
    });
    
    const tipoEventoSelect = document.getElementById('tipo-evento');
    if (tipoEventoSelect) {
        tipoEventoSelect.addEventListener('change', function() {
            const otroEventoContainer = document.getElementById('otro-evento-container');
            const otroEventoInput = document.getElementById('otro-evento');
            
            if (this.value === 'otro') {
                otroEventoContainer.style.display = 'block';
                setTimeout(() => {
                    if (otroEventoInput) {
                        otroEventoInput.focus();
                        scrollToErrorField('otro-evento');
                    }
                }, 100);
            } else {
                otroEventoContainer.style.display = 'none';
                if (otroEventoInput) {
                    otroEventoInput.value = '';
                    limpiarError('otro-evento');
                }
            }
            
            aplicarTema();
            limpiarError('tipo-evento');
            validarCampo('tipo-evento', this.value);
            sincronizarEventoServicio();
            
           
            
        });
    }
    
    const otroEventoInput = document.getElementById('otro-evento');
    if (otroEventoInput) {
        otroEventoInput.addEventListener('blur', function() {
            validarCampo('otro-evento', this.value);
        });
    }
    
    const tematicaEventoSelect = document.getElementById('tematica-evento');
    if (tematicaEventoSelect) {
        tematicaEventoSelect.addEventListener('change', cambiarTematicaEvento);
    }
    
    const tipoServicioSelect = document.getElementById('tipo-servicio');
    if (tipoServicioSelect) {
        tipoServicioSelect.addEventListener('change', function() {
            if (validarConsistenciaEventoServicio()) cambiarTipoServicio();
        });
    }
    
    const costoTransporteInput = document.getElementById('costo-transporte');
    if (costoTransporteInput) {
        costoTransporteInput.addEventListener('input', (e) => {
            cotizacion.costos.transporte = parseFloat(e.target.value) || 0;
            calcularTotalCotizacion();
        });
    }
    
    const porcentajeManoObraInput = document.getElementById('porcentaje-mano-obra');
    if (porcentajeManoObraInput) {
        porcentajeManoObraInput.addEventListener('input', (e) => {
            cotizacion.costos.manoObraPorcentaje = Math.min(100, Math.max(0, parseFloat(e.target.value) || 30));
            calcularTotalCotizacion();
        });
    }
    
    const montoManoObraManualInput = document.getElementById('monto-mano-obra-manual');
    if (montoManoObraManualInput) {
        montoManoObraManualInput.addEventListener('input', (e) => {
            cotizacion.montoManoObraManual = Math.max(0, parseFloat(e.target.value) || 0);
            calcularTotalCotizacion();
        });
    }
    
    const costoMaterialesInput = document.getElementById('costo-materiales');
    if (costoMaterialesInput) {
        costoMaterialesInput.addEventListener('input', calcularTotalCotizacion);
    }
    
    const porcentajeGananciaInput = document.getElementById('porcentaje-ganancia');
    if (porcentajeGananciaInput) {
        porcentajeGananciaInput.addEventListener('input', calcularTotalCotizacion);
    }
    
    document.querySelectorAll('.pdf-config-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            actualizarConfigPDF();
            actualizarVistaPreviaPDF();
        });
    });
    
    const generarCotizacionBtn = document.getElementById('generar-cotizacion');
    if (generarCotizacionBtn) {
        generarCotizacionBtn.addEventListener('mouseover', actualizarTooltipPDF);
    }
    
    document.addEventListener('input', function() {
        setTimeout(actualizarBotonFlotantePDF, 100);
    });
}

function cargarPreferenciasUsuario() {
    const preferencias = localStorage.getItem('arteEventsPDFConfig');
    if (preferencias) {
        try {
            const config = JSON.parse(preferencias);
            document.getElementById('mostrar-mano-obra').checked = config.mostrarManoObra !== undefined ? config.mostrarManoObra : true;
            document.getElementById('mostrar-transporte').checked = config.mostrarTransporte !== undefined ? config.mostrarTransporte : true;
            document.getElementById('mostrar-detalle-materiales').checked = config.mostrarDetalleMateriales !== undefined ? config.mostrarDetalleMateriales : true;
            document.getElementById('mostrar-costo-materiales').checked = config.mostrarCostoMateriales !== undefined ? config.mostrarCostoMateriales : true;
            document.getElementById('mostrar-presupuesto-simple').checked = config.mostrarPresupuestoSimple !== undefined ? config.mostrarPresupuestoSimple : false;
            
            actualizarConfigPDF();
        } catch (e) {
            console.log('Error al cargar preferencias:', e);
        }
    }
}

function guardarPreferenciasUsuario() {
    const preferencias = {
        mostrarManoObra: configPDF.mostrarManoObra,
        mostrarTransporte: configPDF.mostrarTransporte,
        mostrarDetalleMateriales: configPDF.mostrarDetalleMateriales,
        mostrarCostoMateriales: configPDF.mostrarCostoMateriales,
        mostrarPresupuestoSimple: configPDF.mostrarPresupuestoSimple
    };
    localStorage.setItem('arteEventsPDFConfig', JSON.stringify(preferencias));
}

function actualizarConfigPDF() {
    const modoSimple = document.getElementById('mostrar-presupuesto-simple');
    const otrosCheckboxes = ['mostrar-mano-obra', 'mostrar-transporte', 'mostrar-detalle-materiales', 'mostrar-costo-materiales'];
    
    if (modoSimple.checked) {
        otrosCheckboxes.forEach(id => {
            const checkbox = document.getElementById(id);
            checkbox.checked = false;
            checkbox.disabled = true;
        });
        
        configPDF.mostrarManoObra = false;
        configPDF.mostrarTransporte = false;
        configPDF.mostrarCostoMateriales = false;
        configPDF.mostrarDetalleMateriales = true;
        configPDF.mostrarPresupuestoSimple = true;
        mostrarNotificacion('✅ Modo Presupuesto Simple activado. Solo se mostrarán artículos y total.', 'success');
    } else {
        otrosCheckboxes.forEach(id => {
            document.getElementById(id).disabled = false;
        });
        
        configPDF.mostrarManoObra = document.getElementById('mostrar-mano-obra').checked;
        configPDF.mostrarTransporte = document.getElementById('mostrar-transporte').checked;
        configPDF.mostrarDetalleMateriales = document.getElementById('mostrar-detalle-materiales').checked;
        configPDF.mostrarCostoMateriales = document.getElementById('mostrar-costo-materiales').checked;
        configPDF.mostrarPresupuestoSimple = false;
        mostrarNotificacion('✅ Modo Detallado activado. Puedes configurar opciones individuales.', 'success');
    }
    
    guardarPreferenciasUsuario();
    actualizarResumen();
    actualizarBotonFlotantePDF();
}

// ----------------------------------------------------
// VALIDACIÓN Y MANEJO DE ERRORES
// ----------------------------------------------------

function limpiarError(campoId) {
    const errorElement = document.getElementById(`error-${campoId}`);
    if (errorElement) errorElement.textContent = '';
    const inputElement = document.getElementById(campoId);
    if (inputElement) inputElement.classList.remove('error');
}

function mostrarError(campoId, mensaje) {
    const errorElement = document.getElementById(`error-${campoId}`);
    if (errorElement) errorElement.textContent = mensaje;
    const inputElement = document.getElementById(campoId);
    if (inputElement) inputElement.classList.add('error');
}

function validarCampo(campoId, valor) {
    switch(campoId) {
        case 'cliente-nombre':
            if (!valor.trim()) {
                mostrarError(campoId, 'El nombre del cliente es obligatorio');
                return false;
            }
            limpiarError(campoId);
            return true;
            
        case 'fecha-evento':
            if (!valor) {
                mostrarError(campoId, 'La fecha del evento es obligatoria');
                return false;
            }
            
            const fechaEvento = new Date(valor + 'T00:00:00');
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            
            if (fechaEvento < hoy) {
                mostrarError(campoId, 'La fecha del evento no puede ser en el pasado');
                return false;
            }
            
            limpiarError(campoId);
            return true;
            
        case 'tipo-evento':
            if (!valor) {
                mostrarError(campoId, 'El tipo de evento es obligatorio');
                return false;
            }
            
            if (valor === 'otro') {
                limpiarError(campoId);
                return true;
            }
            
            limpiarError(campoId);
            return true;
            
        case 'otro-evento':
            const tipoEvento = document.getElementById('tipo-evento').value;
            if (tipoEvento === 'otro' && !valor.trim()) {
                mostrarError(campoId, 'Debe especificar el tipo de evento');
                return false;
            }
            limpiarError(campoId);
            return true;
            
        case 'cliente-email':
            if (valor && !validarEmail(valor)) {
                mostrarError(campoId, 'El formato del email no es válido');
                return false;
            }
            limpiarError(campoId);
            return true;
            
        case 'tipo-servicio':
            if (!valor) {
                mostrarError(campoId, 'El tipo de servicio es obligatorio');
                return false;
            }
            
            if (!validarConsistenciaEventoServicio()) return false;
            
            limpiarError(campoId);
            return true;
            
        default:
            return true;
    }
}

function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ----------------------------------------------------
// CONTROL DE PASOS MEJORADO
// ----------------------------------------------------

function nextStep() {
    console.log('✅ nextStep - Paso actual:', cotizacion.currentStep);
    
    if (cotizacion.currentStep === 1) {
        if (!validarPaso1()) {
            console.warn('⚠️ Validación falló en paso 1');
            mostrarNotificacion('⚠️ Por favor complete todos los campos obligatorios', 'warning');
            
            const primerCampoError = document.querySelector('input.error, select.error');
            if (primerCampoError) {
                primerCampoError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => primerCampoError.focus(), 500);
            }
            return;
        }
        guardarDatosPaso1();
        console.log('✅ Paso 1 validado correctamente');
    }
    
    if (cotizacion.currentStep < 3) {
        cotizacion.currentStep++;
        console.log('➡️ Avanzando a paso:', cotizacion.currentStep);
        updateStepUI();
        scrollToStepTop();
    }
}

function prevStep() {
    console.log('⬅️ prevStep - Paso actual:', cotizacion.currentStep);
    
    if (cotizacion.currentStep > 1) {
        cotizacion.currentStep--;
        console.log('⬅️ Retrocediendo a paso:', cotizacion.currentStep);
        updateStepUI();
        scrollToStepTop();
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
    
    console.log('🔄 updateStepUI - Actualizando interfaz para paso:', cotizacion.currentStep);
    
    const stepIndicators = document.querySelectorAll('.step-indicator');
    stepIndicators.forEach(indicator => {
        const stepNum = parseInt(indicator.dataset.step);
        indicator.classList.remove('active', 'completed');
        if (stepNum < cotizacion.currentStep) indicator.classList.add('completed');
        else if (stepNum === cotizacion.currentStep) indicator.classList.add('active');
    });

    steps.forEach((step, index) => {
        if (step) {
            const shouldShow = (index + 1 === cotizacion.currentStep);
            step.style.display = shouldShow ? 'block' : 'none';
            console.log(`  Step ${index + 1} display: ${step.style.display}`);
        }
    });
    
    if (prevBtn) prevBtn.style.display = cotizacion.currentStep > 1 ? 'inline-flex' : 'none';
    
    if (nextBtn) {
        if (cotizacion.currentStep === 3) {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'inline-flex';
            nextBtn.textContent = 'Siguiente →';
        }
    }
    
    if (generarBtn) {
        generarBtn.disabled = cotizacion.currentStep !== 3 || cotizacion.costos.total === 0;
    }

    if (progress) {
        const progressPercent = (cotizacion.currentStep / 3) * 100;
        progress.style.width = `${progressPercent}%`;
    }

    if (cotizacion.currentStep === 2) {
        console.log('📦 Configurando paso 2 - Tipo de servicio:', cotizacion.tipoServicio);
        actualizarUIporTipoServicio();
        
        setTimeout(() => {
            const activeTabButton = document.querySelector('.tab-button.active');
            let activeTab = 'paquetes';
            
            if (activeTabButton && activeTabButton.dataset.tab) {
                activeTab = activeTabButton.dataset.tab;
            } else if (cotizacion.tipoServicio === 'flores') {
                activeTab = 'flores';
            }
            
            console.log('  🎯 Tab activo:', activeTab);
            if (activeTab === 'manual') {
                renderizarArticulosManuales();
            } else {
                renderizarArticulos(activeTab);
            }
        }, 100);
        
    } else if (cotizacion.currentStep === 3) {
        document.getElementById('costo-transporte').value = cotizacion.costos.transporte;
        document.getElementById('porcentaje-mano-obra').value = cotizacion.costos.manoObraPorcentaje;
        document.getElementById('monto-mano-obra-manual').value = cotizacion.montoManoObraManual;
        document.getElementById('tipo-mano-obra').value = cotizacion.tipoManoObra;
        cambiarTipoManoObra();
        actualizarVistaPreviaPDF();
        actualizarTooltipPDF();
        
        // Forzar recálculo y mostrar desglose
        calcularTotalCotizacion();
    }
    
    actualizarResumen();
    actualizarIndicadorPasoActual();
    actualizarBotonFlotantePDF();
    mejorarVisualizacionTotal();
    setTimeout(actualizarVisibilidadBotonesFlotantes, 100);
}

// ----------------------------------------------------
// PASO 1: INFORMACIÓN DEL CLIENTE
// ----------------------------------------------------

function validarPaso1() {
    let valido = true;
    
    const nombre = document.getElementById('cliente-nombre').value.trim();
    if (!nombre) {
        mostrarError('cliente-nombre', 'El nombre del cliente es obligatorio');
        valido = false;
    } else limpiarError('cliente-nombre');
    
    const fecha = document.getElementById('fecha-evento').value.trim();
    if (!fecha) {
        mostrarError('fecha-evento', 'La fecha del evento es obligatoria');
        valido = false;
    } else {
        const fechaEvento = new Date(fecha + 'T00:00:00');
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        if (fechaEvento < hoy) {
            mostrarError('fecha-evento', 'La fecha del evento no puede ser en el pasado');
            valido = false;
        } else limpiarError('fecha-evento');
    }
    
    const tipo = document.getElementById('tipo-evento').value;
    if (!tipo) {
        mostrarError('tipo-evento', 'El tipo de evento es obligatorio');
        valido = false;
    } else if (tipo === 'otro') {
        const otroEvento = document.getElementById('otro-evento').value.trim();
        if (!otroEvento) {
            mostrarError('otro-evento', 'Debe especificar el tipo de evento');
            valido = false;
        } else {
            limpiarError('tipo-evento');
            limpiarError('otro-evento');
        }
    } else {
        limpiarError('tipo-evento');
        limpiarError('otro-evento');
    }
    
    const servicio = document.getElementById('tipo-servicio').value;
    if (!servicio) {
        mostrarError('tipo-servicio', 'El tipo de servicio es obligatorio');
        valido = false;
    } else if (!validarConsistenciaEventoServicio()) {
        valido = false;
    } else limpiarError('tipo-servicio');
    
    const email = document.getElementById('cliente-email').value.trim();
    if (email && !validarEmail(email)) {
        mostrarError('cliente-email', 'El formato del email no es válido');
        valido = false;
    } else limpiarError('cliente-email');

    return valido;
}

function guardarDatosPaso1() {
    cotizacion.cliente.nombre = document.getElementById('cliente-nombre').value.trim();
    cotizacion.cliente.telefono = document.getElementById('cliente-telefono').value.trim();
    cotizacion.cliente.email = document.getElementById('cliente-email').value.trim();
    cotizacion.cliente.fechaEvento = document.getElementById('fecha-evento').value.trim();
    cotizacion.cliente.lugarEvento = document.getElementById('lugar-evento').value.trim();
    cotizacion.cliente.notas = document.getElementById('cliente-notas').value.trim();
    
    const tipoEvento = document.getElementById('tipo-evento').value;
    if (tipoEvento === 'otro') {
        cotizacion.tipoEvento = document.getElementById('otro-evento').value.trim();
    } else cotizacion.tipoEvento = tipoEvento;
    
    const tematicaEvento = document.getElementById('tematica-evento').value;
    if (tematicaEvento === 'otra') {
        cotizacion.tematicaEvento = document.getElementById('otra-tematica').value.trim();
    } else cotizacion.tematicaEvento = tematicaEvento;
    
    // tipoServicio se maneja por sincronizarEventoServicio(), no leer del DOM aqui
    if (!cotizacion.tipoServicio && document.getElementById('tipo-servicio').value) {
        cotizacion.tipoServicio = document.getElementById('tipo-servicio').value;
    }
    aplicarTema();
    actualizarResumen();
}

// ============================================
// PARTE 2: FUNCIONES DE TEMA Y CONFIGURACIÓN
// ============================================

function aplicarTema() {
    const tipoEventoSelect = document.getElementById('tipo-evento');
    const tipoSeleccionado = tipoEventoSelect ? tipoEventoSelect.value : '';
    const otroEventoContainer = document.getElementById('otro-evento-container');
    
    let nombreEvento = '';
    if (tipoSeleccionado === 'otro') {
        nombreEvento = document.getElementById('otro-evento').value.trim().toLowerCase();
        if (otroEventoContainer) otroEventoContainer.style.display = 'block';
    } else {
        nombreEvento = tipoSeleccionado.toLowerCase();
        if (otroEventoContainer) otroEventoContainer.style.display = 'none';
    }
    
    const body = document.body;
    const clasesTema = Array.from(body.classList).filter(className => className.startsWith('theme-'));
    clasesTema.forEach(className => body.classList.remove(className));
    
    document.querySelectorAll('style[data-tema]').forEach(style => style.remove());
    
    if (nombreEvento) {
        const temasPredefinidos = ['bodas', 'cumpleaños', 'corporativo', 'baby shower', 'graduaciones', 'aniversarios', 'flores'];
        const temaNormalizado = nombreEvento.toLowerCase().replace(/[^a-z0-9áéíóúüñ]+/g, ' ');
        
        if (temasPredefinidos.includes(temaNormalizado.trim())) {
            const temaClase = 'theme-' + temaNormalizado.trim().replace(/\s+/g, '-');
            body.classList.add(temaClase);
        } else {
            body.classList.add('theme-otro');
            const temaClase = 'theme-personalizado-' + Date.now();
            
            const colorPrimario = generarColorDesdeTexto(nombreEvento);
            const colorOscuro = oscurecerColor(colorPrimario, 20);
            const colorAcento = aclararColor(colorPrimario, 20);
            
            if (esColorHSLValido(colorPrimario)) {
                const estilo = document.createElement('style');
                estilo.setAttribute('data-tema', temaClase);
                estilo.textContent = `.theme-otro { --primary: ${colorPrimario}; --primary-dark: ${colorOscuro}; --accent: ${colorAcento}; }`;
                document.head.appendChild(estilo);
            }
        }
    }
}

function esColorHSLValido(color) {
    return color && color.startsWith('hsl(') && color.includes('%)');
}

function generarColorDesdeTexto(texto) {
    if (!texto) return 'hsl(200, 70%, 50%)';
    
    let hash = 0;
    for (let i = 0; i < texto.length; i++) {
        hash = texto.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    const saturation = 60 + (Math.abs(hash) % 30);
    const lightness = 40 + (Math.abs(hash >> 8) % 30);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function oscurecerColor(color, porcentaje) {
    if (color.startsWith('hsl')) {
        const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (match) {
            const lightness = Math.max(10, parseInt(match[3]) - porcentaje);
            return `hsl(${match[1]}, ${match[2]}%, ${lightness}%)`;
        }
    }
    return color;
}

function aclararColor(color, porcentaje) {
    if (color.startsWith('hsl')) {
        const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (match) {
            const lightness = Math.min(90, parseInt(match[3]) + porcentaje);
            return `hsl(${match[1]}, ${match[2]}%, ${lightness}%)`;
        }
    }
    return color;
}

function actualizarTiposEvento() {
    const select = document.getElementById('tipo-evento');
    if (!select) return;
    const valorActual = select.value;
    select.innerHTML = '<option value="">Seleccione un tipo</option>';
    
    const tiposAMostrar = configuracion.tiposEvento && configuracion.tiposEvento.length > 0 
        ? configuracion.tiposEvento 
        : ['Bodas', 'Cumpleaños', 'Corporativo', 'Baby Shower', 'Graduaciones', 'Aniversarios', 'Flores'];
    
    tiposAMostrar.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        select.appendChild(option);
    });
    
    const otroOption = document.createElement('option');
    otroOption.value = 'otro';
    otroOption.textContent = 'Otro (Personalizado)';
    select.appendChild(otroOption);
    
    if (valorActual) select.value = valorActual;
}

function actualizarTematicasEvento() {
    const select = document.getElementById('tematica-evento');
    if (!select) return;
    const valorActual = select.value;
    select.innerHTML = '<option value="">Seleccione una temática</option>';
    configuracion.tematicasEvento.forEach(tematica => {
        const option = document.createElement('option');
        option.value = tematica;
        option.textContent = tematica;
        select.appendChild(option);
    });
    const otraOption = document.createElement('option');
    otraOption.value = 'otra';
    otraOption.textContent = 'Otra (Personalizada)';
    select.appendChild(otraOption);
    if (valorActual) select.value = valorActual;
}

function cambiarTipoServicio() {
    const tipoServicio = document.getElementById('tipo-servicio').value;
    cotizacion.tipoServicio = tipoServicio;
    actualizarResumen();
    if (cotizacion.currentStep === 2) actualizarUIporTipoServicio();
}

function actualizarUIporTipoServicio() {
    const paso2Title = document.getElementById('titulo-paso-2');
    const tabsContainer = document.getElementById('tabs-container');
    
    if (!tabsContainer) {
        console.error('❌ tabs-container no encontrado');
        return;
    }
    
    console.log('🔄 Actualizando UI para tipo:', cotizacion.tipoServicio);
    
    // Ocultar todos los contenidos de pestañas posibles
    document.getElementById('tab-paquetes').style.display = 'none';
    document.getElementById('tab-accesorios').style.display = 'none';
    document.getElementById('tab-flores').style.display = 'none';
    document.getElementById('tab-arreglos').style.display = 'none';
    document.getElementById('tab-manual').style.display = 'none';
    
    if (cotizacion.tipoServicio === 'flores') {
        paso2Title.textContent = "2. Selección de Flores y Arreglos";
        
        tabsContainer.innerHTML = `
            <button class="tab-button active" data-tab="flores" onclick="switchTab('flores')">🌹 Flores por Unidad</button>
            <button class="tab-button" data-tab="arreglos" onclick="switchTab('arreglos')">💐 Arreglos Florales</button>
            <button class="tab-button" data-tab="manual" onclick="switchTab('manual')">✍️ Artículo Manual</button>
        `;
        
        document.getElementById('tab-flores').style.display = 'block';
        
        setTimeout(() => {
            renderizarArticulos('flores');
            switchTab('flores');
        }, 50);
        
    } else if (cotizacion.tipoServicio === 'decoracion') {
        paso2Title.textContent = "2. Selección de Artículos";
        
        tabsContainer.innerHTML = `
            <button class="tab-button active" data-tab="paquetes" onclick="switchTab('paquetes')">🎈 Globos y Paquetes</button>
            <button class="tab-button" data-tab="accesorios" onclick="switchTab('accesorios')">🛋️ Accesorios</button>
            <button class="tab-button" data-tab="manual" onclick="switchTab('manual')">✍️ Artículo Manual</button>
        `;
        
        document.getElementById('tab-paquetes').style.display = 'block';
        
        setTimeout(() => {
            renderizarArticulos('paquetes');
            switchTab('paquetes');
        }, 50);
    }
    
    actualizarResumen();
}

function switchTab(tabName) {
    console.log('🎯 switchTab llamado:', tabName);
    
    const targetTab = document.getElementById(`tab-${tabName}`);
    if (!targetTab) {
        console.warn(`⚠️ Tab ${tabName} no existe, usando default`);
        tabName = cotizacion.tipoServicio === 'flores' ? 'flores' : 'paquetes';
    }
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    const activeContent = document.getElementById(`tab-${tabName}`);
    const activeBtn = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
    
    if (activeContent) {
        activeContent.style.display = 'block';
        console.log('✅ Mostrando tab:', tabName);
    } else {
        console.error('❌ No se encontró tab-' + tabName);
    }
    
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    if (tabName === 'paquetes' || tabName === 'accesorios' || tabName === 'flores' || tabName === 'arreglos') {
        renderizarArticulos(tabName);
    } else if (tabName === 'manual') {
        renderizarArticulosManuales();
    }
    
    if (window.innerWidth <= 768) {
        setTimeout(() => {
            const tabsContainer = document.getElementById('tabs-container');
            if (tabsContainer) {
                tabsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }
}

function renderizarArticulos(tipo) {
    let containerId = '';
    let listaArticulos = [];
    
    switch(tipo) {
        case 'paquetes': containerId = 'paquetes-container'; listaArticulos = cotizacion.articulos.paquetes; break;
        case 'accesorios': containerId = 'accesorios-container'; listaArticulos = cotizacion.articulos.accesorios; break;
        case 'flores': containerId = 'flores-container'; listaArticulos = cotizacion.articulos.flores; break;
        case 'arreglos': containerId = 'arreglos-container'; listaArticulos = cotizacion.articulos.arreglosFlorales; break;
    }
    
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`⚠️ Container ${containerId} no encontrado`);
        return;
    }
    
    container.innerHTML = '';
    
    listaArticulos.forEach(articulo => {
        const isSelected = articulo.cantidad > 0;
        const infoExtra = articulo.color ? `<p>Color: ${articulo.color}</p>` : '';
        const card = document.createElement('div');
        card.className = `item-card ${isSelected ? 'selected' : ''}`;
        card.id = `${tipo}-${articulo.id}`;
        card.innerHTML = `
            <div class="item-details" onclick="toggleArticulo('${tipo}', ${articulo.id})">
                <h4>${articulo.emoji || '📦'} ${articulo.nombre}</h4>
                <p>Precio por ${articulo.unidad || 'unidad'}: ${formatoMonedaRD(articulo.precio)}</p>
                ${infoExtra}
            </div>
            <div class="item-footer">
                <span class="price">${formatoMonedaRD(articulo.precio * articulo.cantidad)}</span>
                <div class="quantity-control">
                    <button onclick="updateCantidad('${tipo}', ${articulo.id}, -1)">-</button>
                    <input type="number" value="${articulo.cantidad}" min="0" oninput="updateCantidadInput('${tipo}', ${articulo.id}, this.value)">
                    <button onclick="updateCantidad('${tipo}', ${articulo.id}, 1)">+</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function filtrarFloresPorColor() {
    const colorSeleccionado = document.getElementById('filtro-color-flores').value;
    const container = document.getElementById('flores-container');
    if (!container) return;
    container.innerHTML = '';
    
    let floresFiltradas = cotizacion.articulos.flores;
    if (colorSeleccionado !== 'todos') {
        floresFiltradas = cotizacion.articulos.flores.filter(flor => 
            flor.color && flor.color.toLowerCase() === colorSeleccionado.toLowerCase()
        );
    }
    
    floresFiltradas.forEach(articulo => {
        const isSelected = articulo.cantidad > 0;
        const card = document.createElement('div');
        card.className = `item-card ${isSelected ? 'selected' : ''}`;
        card.id = `flores-${articulo.id}`;
        card.innerHTML = `
            <div class="item-details" onclick="toggleArticulo('flores', ${articulo.id})">
                <h4>${articulo.emoji || '🌹'} ${articulo.nombre}</h4>
                <p>Precio por ${articulo.unidad || 'unidad'}: ${formatoMonedaRD(articulo.precio)}</p>
                <p>Color: ${articulo.color}</p>
            </div>
            <div class="item-footer">
                <span class="price">${formatoMonedaRD(articulo.precio * articulo.cantidad)}</span>
                <div class="quantity-control">
                    <button onclick="updateCantidad('flores', ${articulo.id}, -1)">-</button>
                    <input type="number" value="${articulo.cantidad}" min="0" oninput="updateCantidadInput('flores', ${articulo.id}, this.value)">
                    <button onclick="updateCantidad('flores', ${articulo.id}, 1)">+</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function toggleArticulo(tipo, id) {
    let articulo;
    switch(tipo) {
        case 'paquetes': articulo = cotizacion.articulos.paquetes.find(a => a.id === id); break;
        case 'accesorios': articulo = cotizacion.articulos.accesorios.find(a => a.id === id); break;
        case 'flores': articulo = cotizacion.articulos.flores.find(a => a.id === id); break;
        case 'arreglos': articulo = cotizacion.articulos.arreglosFlorales.find(a => a.id === id); break;
    }
    if (articulo) {
        articulo.cantidad = articulo.cantidad > 0 ? 0 : 1;
        renderizarArticulos(tipo);
        actualizarResumen();
    }
}

function updateCantidad(tipo, id, cambio) {
    let articulo;
    switch(tipo) {
        case 'paquetes': articulo = cotizacion.articulos.paquetes.find(a => a.id === id); break;
        case 'accesorios': articulo = cotizacion.articulos.accesorios.find(a => a.id === id); break;
        case 'flores': articulo = cotizacion.articulos.flores.find(a => a.id === id); break;
        case 'arreglos': articulo = cotizacion.articulos.arreglosFlorales.find(a => a.id === id); break;
    }
    if (articulo) {
        articulo.cantidad = Math.max(0, articulo.cantidad + cambio);
        renderizarArticulos(tipo);
        actualizarResumen();
    }
}

function updateCantidadInput(tipo, id, valor) {
    let articulo;
    switch(tipo) {
        case 'paquetes': articulo = cotizacion.articulos.paquetes.find(a => a.id === id); break;
        case 'accesorios': articulo = cotizacion.articulos.accesorios.find(a => a.id === id); break;
        case 'flores': articulo = cotizacion.articulos.flores.find(a => a.id === id); break;
        case 'arreglos': articulo = cotizacion.articulos.arreglosFlorales.find(a => a.id === id); break;
    }
    if (articulo) {
        const parsedValor = parseInt(valor);
        articulo.cantidad = isNaN(parsedValor) ? 0 : Math.max(0, parsedValor);
        renderizarArticulos(tipo);
        actualizarResumen();
    }
}

function agregarArticuloManual() {
    const newId = manualItemIdCounter++;
    cotizacion.articulos.manuales.push({ 
        id: newId, 
        nombre: `Artículo Personalizado ${newId}`, 
        precioUnitario: 0, 
        cantidad: 1, 
        tipo: 'manual',
        costoReal: 0
    });
    renderizarArticulosManuales();
    actualizarResumen();
}

function renderizarArticulosManuales() {
    const container = document.getElementById('manual-items-container');
    if (!container) return;
    container.innerHTML = '';
    
    const tituloManual = document.getElementById('titulo-manual');
    if (tituloManual) {
        tituloManual.textContent = cotizacion.tipoServicio === 'flores' 
            ? '✍️ Artículos Florales Personalizados' 
            : '✍️ Artículos de Decoración Personalizados';
    }
    
    cotizacion.articulos.manuales.forEach(item => {
        const div = document.createElement('div');
        div.className = 'manual-item';
        div.innerHTML = `
            <input type="text" placeholder="Nombre del Artículo" value="${item.nombre}" oninput="actualizarArticuloManual(${item.id}, 'nombre', this.value)">
            <input type="number" placeholder="Precio Unitario" value="${item.precioUnitario}" min="0" oninput="actualizarArticuloManual(${item.id}, 'precioUnitario', this.value)">
            <input type="number" placeholder="Cantidad" value="${item.cantidad}" min="1" oninput="actualizarArticuloManual(${item.id}, 'cantidad', this.value)">
            <button class="btn-remove" onclick="eliminarArticuloManual(${item.id})">×</button>
        `;
        container.appendChild(div);
    });
}

function actualizarArticuloManual(id, campo, valor) {
    const item = cotizacion.articulos.manuales.find(a => a.id === id);
    if (item) {
        if (campo === 'nombre') item.nombre = valor;
        else if (campo === 'cantidad') item[campo] = Math.max(1, parseInt(valor) || 1);
        else item[campo] = parseFloat(valor) || 0;
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

function cambiarTipoManoObra() {
    const tipo = document.getElementById('tipo-mano-obra').value;
    const porcentajeContainer = document.getElementById('mano-obra-porcentaje-container');
    const manualContainer = document.getElementById('mano-obra-manual-container');
    
    cotizacion.tipoManoObra = tipo;
    
    if (tipo === 'porcentaje') {
        porcentajeContainer.style.display = 'flex';
        manualContainer.style.display = 'none';
    } else {
        porcentajeContainer.style.display = 'none';
        manualContainer.style.display = 'flex';
    }
    actualizarResumen();
}

function actualizarResumen() {
    calcularTotalCotizacion();

    document.getElementById('resumen-cliente').textContent = cotizacion.cliente.nombre || '-';
    document.getElementById('resumen-evento').textContent = cotizacion.tipoEvento || '-';
    
    const servicioText = cotizacion.tipoServicio === 'flores' ? 'Flores Externas' : 
                        cotizacion.tipoServicio === 'decoracion' ? 'Decoración' : '-';
    document.getElementById('resumen-servicio').textContent = servicioText;
    
    document.getElementById('resumen-fecha').textContent = cotizacion.cliente.fechaEvento || '-';

    let totalItems1 = 0, totalItems2 = 0, titulo1 = 'Globos:', titulo2 = 'Accesorios:';
    
    if (cotizacion.tipoServicio === 'decoracion') {
        totalItems1 = cotizacion.articulos.paquetes.filter(a => a.cantidad > 0).length;
        totalItems2 = cotizacion.articulos.accesorios.filter(a => a.cantidad > 0).length;
    } else if (cotizacion.tipoServicio === 'flores') {
        totalItems1 = cotizacion.articulos.flores.filter(a => a.cantidad > 0).length;
        totalItems2 = cotizacion.articulos.arreglosFlorales.filter(a => a.cantidad > 0).length;
        titulo1 = 'Flores:';
        titulo2 = 'Arreglos:';
    }
    
    const totalManuales = cotizacion.articulos.manuales.filter(a => a.cantidad > 0).length;
    const manualText = totalManuales > 0 ? ` + ${totalManuales} manual(es)` : '';
    
    document.getElementById('resumen-titulo1').textContent = titulo1;
    document.getElementById('resumen-titulo2').textContent = titulo2;
    document.getElementById('resumen-paquetes').textContent = `${totalItems1} item(s)${manualText}`;
    document.getElementById('resumen-accesorios').textContent = `${totalItems2} item(s)`;

    let totalArticulos = 0;
    if (cotizacion.tipoServicio === 'decoracion') {
        totalArticulos = cotizacion.articulos.paquetes.reduce((sum, item) => sum + item.cantidad, 0) +
                        cotizacion.articulos.accesorios.reduce((sum, item) => sum + item.cantidad, 0);
    } else if (cotizacion.tipoServicio === 'flores') {
        totalArticulos = cotizacion.articulos.flores.reduce((sum, item) => sum + item.cantidad, 0) +
                        cotizacion.articulos.arreglosFlorales.reduce((sum, item) => sum + item.cantidad, 0);
    }
    totalArticulos += cotizacion.articulos.manuales.reduce((sum, item) => sum + item.cantidad, 0);
    
    document.getElementById('total-articulos').textContent = totalArticulos;
    document.getElementById('resumen-materiales').textContent = formatoMonedaRD(cotizacion.costos.materiales);
    
    const manoObraElement = document.getElementById('resumen-mano-obra');
    const transporteElement = document.getElementById('resumen-transporte');
    
    if (cotizacion.tipoServicio === 'decoracion') {
        if (configPDF.mostrarCostoMateriales) {
            document.getElementById('resumen-materiales').textContent = formatoMonedaRD(cotizacion.costos.materiales);
            document.getElementById('resumen-materiales').parentElement.style.display = 'flex';
        } else document.getElementById('resumen-materiales').parentElement.style.display = 'none';
        
        if (configPDF.mostrarManoObra && cotizacion.costos.manoObra > 0) {
            manoObraElement.textContent = formatoMonedaRD(cotizacion.costos.manoObra);
            manoObraElement.parentElement.style.display = 'flex';
        } else manoObraElement.parentElement.style.display = 'none';
        
        if (configPDF.mostrarTransporte && cotizacion.costos.transporte > 0) {
            transporteElement.textContent = formatoMonedaRD(cotizacion.costos.transporte);
            transporteElement.parentElement.style.display = 'flex';
        } else transporteElement.parentElement.style.display = 'none';
    } else if (cotizacion.tipoServicio === 'flores') {
        document.getElementById('resumen-materiales').parentElement.style.display = 'none';
        manoObraElement.parentElement.style.display = 'none';
        transporteElement.parentElement.style.display = 'none';
    }
    
    document.getElementById('total-cotizacion').textContent = formatoMonedaRD(cotizacion.costos.total);
    
    const generarBtn = document.getElementById('generar-cotizacion');
    if (generarBtn) generarBtn.disabled = cotizacion.currentStep !== 3 || cotizacion.costos.total === 0;
    
    if (cotizacion.currentStep === 3) actualizarVistaPreviaPDF();
    
    actualizarBotonFlotantePDF();
    mejorarVisualizacionTotal();
}

function actualizarVistaPreviaPDF() {
    const preview = document.getElementById('preview-content');
    if (!preview) return;
    const modo = configPDF.mostrarPresupuestoSimple ? 'Modo Presupuesto Simple' : 'Modo Detallado';
    
    let previewHTML = `<div style="margin-bottom: 10px;"><strong>${modo}</strong></div>`;
    
    if (configPDF.mostrarPresupuestoSimple) {
        previewHTML += `
            <div style="color: #4ecdc4;">✓ Lista de artículos (sin precios)</div>
            <div style="color: #4ecdc4;">✓ Solo total final</div>
            <div style="color: #ff6b6b;">✗ Sin desgloses de costos</div>
            <div style="color: #ff6b6b;">✗ Sin precios individuales</div>
        `;
    } else {
        previewHTML += `
            <div style="color: ${configPDF.mostrarDetalleMateriales ? '#4ecdc4' : '#ff6b6b'}">${configPDF.mostrarDetalleMateriales ? '✓' : '✗'} Detalle de materiales</div>
            <div style="color: ${configPDF.mostrarCostoMateriales ? '#4ecdc4' : '#ff6b6b'}">${configPDF.mostrarCostoMateriales ? '✓' : '✗'} Costo de materiales</div>
            <div style="color: ${configPDF.mostrarManoObra ? '#4ecdc4' : '#ff6b6b'}">${configPDF.mostrarManoObra ? '✓' : '✗'} Mano de obra</div>
            <div style="color: ${configPDF.mostrarTransporte ? '#4ecdc4' : '#ff6b6b'}">${configPDF.mostrarTransporte ? '✓' : '✗'} Transporte</div>
        `;
    }
    
    preview.innerHTML = previewHTML;
}

function actualizarTooltipPDF() {
    const btn = document.getElementById('generar-cotizacion');
    const modo = configPDF.mostrarPresupuestoSimple ? 'Modo Presupuesto Simple' : 'Modo Detallado';
    const totalArticulos = parseInt(document.getElementById('total-articulos')?.textContent) || 0;
    const total = document.getElementById('total-cotizacion').textContent;
    btn.title = `Generar PDF en ${modo}\n📊 Artículos: ${totalArticulos}\n💰 Total: ${total}`;
    
    const indicator = document.getElementById('pdf-mode-indicator');
    if (indicator) {
        indicator.textContent = `(${modo})`;
        indicator.style.color = configPDF.mostrarPresupuestoSimple ? '#4ecdc4' : '#8a2be2';
    }
}

// ============================================
// PARTE 3: CONFIGURACIÓN
// ============================================

function createConfigItemHTML(tipo, item, index) {
    if (tipo === 'tipo-evento' || tipo === 'tematica-evento') {
        const itemValue = typeof item === 'string' ? item : (item.nombre || item);
        return `
            <div class="config-item" data-index="${index}" data-tipo="${tipo}">
                <div class="config-input-group">
                    <div class="config-label">Nombre</div>
                    <input type="text" 
                           placeholder="${tipo === 'tematica-evento' ? 'Nombre de la temática' : 'Nombre del tipo de evento'}" 
                           value="${itemValue}" 
                           oninput="actualizarConfigItem('${tipo}', ${index}, 'nombre', this.value)">
                </div>
                <button class="btn-remove" onclick="eliminarConfigItem('${tipo}', ${index})">×</button>
            </div>
        `;
    }
    
    if (tipo === 'paquete' || tipo === 'accesorio') {
        return `
            <div class="config-item" data-id="${item.id}" data-tipo="${tipo}">
                <div class="config-input-group">
                    <div class="config-label">Nombre</div>
                    <input type="text" placeholder="Ej: Globo Azul" value="${item.nombre || ''}" 
                            oninput="actualizarConfigItemPorId('${tipo}', ${item.id}, 'nombre', this.value)">
                </div>
                
                <div class="config-input-group">
                    <div class="config-label">Precio Venta</div>
                    <input type="number" placeholder="RD$" value="${item.precio || 0}" min="0" step="10"
                            oninput="actualizarConfigItemPorId('${tipo}', ${item.id}, 'precio', this.value)">
                </div>
                
                <div class="config-input-group">
                    <div class="config-label">Costo Real</div>
                    <input type="number" placeholder="RD$" value="${item.costo || 0}" min="0" step="10"
                            oninput="actualizarConfigItemPorId('${tipo}', ${item.id}, 'costo', this.value)">
                </div>
                
                <button class="btn-remove" onclick="eliminarConfigItemPorId('${tipo}', ${item.id})">×</button>
            </div>
        `;
    }
    
    if (tipo === 'flor' || tipo === 'flores') {
        return `
            <div class="config-item" data-id="${item.id}" data-tipo="${tipo}">
                <div class="config-input-group">
                    <div class="config-label">Nombre</div>
                    <input type="text" placeholder="Ej: Rosas Rojas" value="${item.nombre || ''}" 
                            oninput="actualizarConfigItemPorId('${tipo}', ${item.id}, 'nombre', this.value)">
                </div>
                
                <div class="config-input-group">
                    <div class="config-label">Precio Venta</div>
                    <input type="number" placeholder="RD$" value="${item.precio || 0}" min="0" step="10"
                            oninput="actualizarConfigItemPorId('${tipo}', ${item.id}, 'precio', this.value)">
                </div>
                
                <div class="config-input-group">
                    <div class="config-label">Costo Real</div>
                    <input type="number" placeholder="RD$" value="${item.costo || 0}" min="0" step="10"
                            oninput="actualizarConfigItemPorId('${tipo}', ${item.id}, 'costo', this.value)">
                </div>
                
                <div class="config-input-group">
                    <div class="config-label">Color</div>
                    <input type="text" placeholder="Ej: Rojo" value="${item.color || 'Mixto'}" 
                            oninput="actualizarConfigItemPorId('${tipo}', ${item.id}, 'color', this.value)">
                </div>
                
                <button class="btn-remove" onclick="eliminarConfigItemPorId('${tipo}', ${item.id})">×</button>
            </div>
        `;
    }
    
    if (tipo === 'arreglo') {
        return `
            <div class="config-item" data-id="${item.id}" data-tipo="${tipo}">
                <div class="config-input-group">
                    <div class="config-label">Nombre</div>
                    <input type="text" placeholder="Ej: Ramo Pequeño" value="${item.nombre || ''}" 
                            oninput="actualizarConfigItemPorId('${tipo}', ${item.id}, 'nombre', this.value)">
                </div>
                
                <div class="config-input-group">
                    <div class="config-label">Precio Venta</div>
                    <input type="number" placeholder="RD$" value="${item.precio || 0}" min="0" step="10"
                            oninput="actualizarConfigItemPorId('${tipo}', ${item.id}, 'precio', this.value)">
                </div>
                
                <div class="config-input-group">
                    <div class="config-label">Costo Real</div>
                    <input type="number" placeholder="RD$" value="${item.costo || 0}" min="0" step="10"
                            oninput="actualizarConfigItemPorId('${tipo}', ${item.id}, 'costo', this.value)">
                </div>
                
                <button class="btn-remove" onclick="eliminarConfigItemPorId('${tipo}', ${item.id})">×</button>
            </div>
        `;
    }
    
    return '';
}

function renderizarConfiguracion() {
    const configTiposEventoContainer = document.getElementById('config-tipos-evento');
    const configTematicasContainer = document.getElementById('config-tematicas-evento');
    const configPaquetesContainer = document.getElementById('config-paquetes');
    const configAccesoriosContainer = document.getElementById('config-accesorios');
    const configFloresContainer = document.getElementById('config-flores');
    const configArreglosContainer = document.getElementById('config-arreglos');
    
    if (configTiposEventoContainer) configTiposEventoContainer.innerHTML = '';
    if (configTematicasContainer) configTematicasContainer.innerHTML = '';
    if (configPaquetesContainer) configPaquetesContainer.innerHTML = '';
    if (configAccesoriosContainer) configAccesoriosContainer.innerHTML = '';
    if (configFloresContainer) configFloresContainer.innerHTML = '';
    if (configArreglosContainer) configArreglosContainer.innerHTML = '';
    
    configuracion.tiposEvento.forEach((tipo, index) => {
        if (configTiposEventoContainer) {
            configTiposEventoContainer.innerHTML += createConfigItemHTML('tipo-evento', tipo, index);
        }
    });
    
    configuracion.tematicasEvento.forEach((tematica, index) => {
        if (configTematicasContainer) {
            configTematicasContainer.innerHTML += createConfigItemHTML('tematica-evento', tematica, index);
        }
    });
    
    configuracion.paquetes.forEach(item => {
        if (configPaquetesContainer) configPaquetesContainer.innerHTML += createConfigItemHTML('paquete', item);
    });

    configuracion.accesorios.forEach(item => {
        if (configAccesoriosContainer) configAccesoriosContainer.innerHTML += createConfigItemHTML('accesorio', item);
    });
    
    configuracion.flores.forEach(item => {
        if (configFloresContainer) configFloresContainer.innerHTML += createConfigItemHTML('flor', item);
    });
    
    configuracion.arreglosFlorales.forEach(item => {
        if (configArreglosContainer) configArreglosContainer.innerHTML += createConfigItemHTML('arreglo', item);
    });
}

function actualizarConfigItem(tipo, index, campo, valor) {
    if (tipo === 'tipo-evento') {
        if (configuracion.tiposEvento[index] !== undefined) {
            configuracion.tiposEvento[index] = valor;
            actualizarTiposEvento();
        }
    } else if (tipo === 'tematica-evento') {
        if (configuracion.tematicasEvento[index] !== undefined) {
            configuracion.tematicasEvento[index] = valor;
            actualizarTematicasEvento();
        }
    }
}

function actualizarConfigItemPorId(tipo, id, campo, valor) {
    let lista;
    
    switch(tipo) {
        case 'paquete': lista = configuracion.paquetes; break;
        case 'accesorio': lista = configuracion.accesorios; break;
        case 'flor': 
        case 'flores': lista = configuracion.flores; break;
        case 'arreglo': lista = configuracion.arreglosFlorales; break;
        default: return;
    }
    
    const item = lista.find(a => a.id === parseInt(id));
    if (item) {
        if (campo === 'nombre') item.nombre = valor;
        else if (campo === 'color') item.color = valor;
        else if (campo === 'precio') item.precio = parseFloat(valor) || 0;
        else if (campo === 'costo') item.costo = parseFloat(valor) || 0;
        else if (campo === 'emoji') item.emoji = valor;
    }
}

function eliminarConfigItem(tipo, index) {
    if (tipo === 'tipo-evento') {
        configuracion.tiposEvento.splice(index, 1);
        renderizarConfiguracion();
        actualizarTiposEvento();
        mostrarNotificacion('✅ Tipo de evento eliminado');
    } else if (tipo === 'tematica-evento') {
        configuracion.tematicasEvento.splice(index, 1);
        renderizarConfiguracion();
        actualizarTematicasEvento();
        mostrarNotificacion('✅ Temática eliminada');
    }
}

function eliminarConfigItemPorId(tipo, id) {
    const idNum = parseInt(id);
    
    switch(tipo) {
        case 'paquete': 
            configuracion.paquetes = configuracion.paquetes.filter(a => a.id !== idNum); 
            mostrarNotificacion('✅ Globo eliminado');
            break;
        case 'accesorio': 
            configuracion.accesorios = configuracion.accesorios.filter(a => a.id !== idNum); 
            mostrarNotificacion('✅ Accesorio eliminado');
            break;
        case 'flor':
        case 'flores': 
            configuracion.flores = configuracion.flores.filter(a => a.id !== idNum); 
            mostrarNotificacion('✅ Flor eliminada');
            break;
        case 'arreglo': 
            configuracion.arreglosFlorales = configuracion.arreglosFlorales.filter(a => a.id !== idNum); 
            mostrarNotificacion('✅ Arreglo eliminado');
            break;
    }
    
    renderizarConfiguracion();
}

function agregarTipoEvento() {
    configuracion.tiposEvento.push("Nuevo Tipo de Evento");
    renderizarConfiguracion();
    actualizarTiposEvento();
    mostrarNotificacion('✅ Nuevo tipo de evento agregado');
    
    setTimeout(() => {
        const configItems = document.querySelectorAll('#config-tipos-evento .config-item');
        if (configItems.length > 0) {
            const lastItem = configItems[configItems.length - 1];
            const input = lastItem.querySelector('input[type="text"]');
            if (input) {
                input.focus();
                input.select();
            }
        }
    }, 100);
}

function agregarTematicaEvento() {
    configuracion.tematicasEvento.push("Nueva Temática");
    renderizarConfiguracion();
    actualizarTematicasEvento();
    mostrarNotificacion('✅ Nueva temática agregada');
    
    setTimeout(() => {
        const configItems = document.querySelectorAll('#config-tematicas-evento .config-item');
        if (configItems.length > 0) {
            const lastItem = configItems[configItems.length - 1];
            const input = lastItem.querySelector('input[type="text"]');
            if (input) {
                input.focus();
                input.select();
            }
        }
    }, 100);
}

function agregarPaquete() {
    const newId = configIdCounter++;
    configuracion.paquetes.push({ 
        id: newId, 
        nombre: `Nuevo Globo ${newId}`, 
        precio: 0, 
        costo: 0, 
        emoji: '🎈', 
        cantidad: 0, 
        tipo: 'decoracion' 
    });
    renderizarConfiguracion();
    mostrarNotificacion('✅ Nuevo globo agregado');
}

function agregarAccesorio() {
    const newId = configIdCounter++;
    configuracion.accesorios.push({ 
        id: newId, 
        nombre: `Nuevo Accesorio ${newId}`, 
        precio: 0, 
        costo: 0, 
        emoji: '✨', 
        cantidad: 0, 
        tipo: 'decoracion' 
    });
    renderizarConfiguracion();
    mostrarNotificacion('✅ Nuevo accesorio agregado');
}

function agregarFlor() {
    const newId = configIdCounter++;
    configuracion.flores.push({ 
        id: newId, 
        nombre: `Nueva Flor ${newId}`, 
        precio: 0, 
        costo: 0, 
        emoji: '🌹', 
        cantidad: 0, 
        tipo: 'flores', 
        color: 'Mixto' 
    });
    renderizarConfiguracion();
    mostrarNotificacion('✅ Nueva flor agregada');
}

function agregarArreglo() {
    const newId = configIdCounter++;
    configuracion.arreglosFlorales.push({ 
        id: newId, 
        nombre: `Nuevo Arreglo ${newId}`, 
        precio: 0, 
        costo: 0, 
        emoji: '💐', 
        cantidad: 0, 
        tipo: 'flores' 
    });
    renderizarConfiguracion();
    mostrarNotificacion('✅ Nuevo arreglo agregado');
}

// ============================================
// FUNCIÓN CARGAR CONFIGURACIÓN CORREGIDA
// ============================================
function cargarConfiguracion() {
    const configGuardada = localStorage.getItem('arteyevents_config');
    if (configGuardada) {
        try {
            const configCargada = JSON.parse(configGuardada);
            
            configuracion.tiposEvento = configCargada.tiposEvento || ['Bodas', 'Cumpleaños', 'Corporativo', 'Baby Shower', 'Graduaciones', 'Aniversarios', 'Flores'];
            configuracion.tematicasEvento = configCargada.tematicasEvento || ['Clásica', 'Moderno', 'Vintage', 'Rústica', 'Minimalista', 'Bohemia', 'Elegante', 'Divertida'];
            
            // Preservar las unidades al cargar configuración guardada
            configuracion.paquetes = (configCargada.paquetes || configuracion.paquetes).map(p => ({
                ...p,
                costo: p.costo !== undefined ? p.costo : p.precio * 0.3,
                cantidad: 0,
                unidad: p.unidad || 'paquete' // Asegurar que tenga unidad
            }));
            
            configuracion.accesorios = (configCargada.accesorios || configuracion.accesorios).map(a => ({
                ...a,
                costo: a.costo !== undefined ? a.costo : a.precio * 0.3,
                cantidad: 0,
                unidad: a.unidad || 'unidad'
            }));
            
            configuracion.flores = (configCargada.flores || configuracion.flores).map(f => ({
                ...f,
                costo: f.costo !== undefined ? f.costo : f.precio * 0.3,
                cantidad: 0,
                unidad: f.unidad || 'flor'
            }));
            
            configuracion.arreglosFlorales = (configCargada.arreglosFlorales || configuracion.arreglosFlorales).map(af => ({
                ...af,
                costo: af.costo !== undefined ? af.costo : af.precio * 0.3,
                cantidad: 0,
                unidad: af.unidad || (af.nombre.includes('Ramo') ? 'ramo' : 
                                   af.nombre.includes('Centro') ? 'centro' :
                                   af.nombre.includes('Arco') ? 'arco' : 'unidad')
            }));
            
            configuracion.manoObraPorcentaje = configCargada.manoObraPorcentaje || 30;
            
        } catch (e) {
            console.error('Error al cargar configuración:', e);
            mostrarNotificacion('❌ Error al cargar configuración guardada', 'error');
        }
    }
    
    // ===== SIEMPRE CARGAR LOS ARTÍCULOS DESDE LA CONFIGURACIÓN =====
    cotizacion.articulos.paquetes = configuracion.paquetes.map(p => ({...p, cantidad: 0}));
    cotizacion.articulos.accesorios = configuracion.accesorios.map(a => ({...a, cantidad: 0}));
    cotizacion.articulos.flores = configuracion.flores.map(f => ({...f, cantidad: 0}));
    cotizacion.articulos.arreglosFlorales = configuracion.arreglosFlorales.map(af => ({...af, cantidad: 0}));
    cotizacion.costos.manoObraPorcentaje = configuracion.manoObraPorcentaje;
    
    actualizarTiposEvento();
    actualizarTematicasEvento();
    actualizarResumen();
}

// ============================================
// FUNCIÓN GUARDAR CONFIGURACIÓN MODIFICADA
// ============================================
function guardarConfiguracion() {
    configuracion.manoObraPorcentaje = parseFloat(document.getElementById('porcentaje-mano-obra').value) || 0;
    
    const configToSave = {
        tiposEvento: configuracion.tiposEvento,
        tematicasEvento: configuracion.tematicasEvento,
        paquetes: configuracion.paquetes.map(({ id, nombre, precio, costo, emoji, unidad }) => ({ id, nombre, precio, costo, emoji: emoji || '🎈', unidad })),
        accesorios: configuracion.accesorios.map(({ id, nombre, precio, costo, emoji, unidad }) => ({ id, nombre, precio, costo, emoji: emoji || '✨', unidad })),
        flores: configuracion.flores.map(({ id, nombre, precio, costo, emoji, color, unidad }) => ({ id, nombre, precio, costo, emoji: emoji || '🌹', color: color || 'Mixto', unidad })),
        arreglosFlorales: configuracion.arreglosFlorales.map(({ id, nombre, precio, costo, emoji, unidad }) => ({ id, nombre, precio, costo, emoji: emoji || '💐', unidad })),
        manoObraPorcentaje: configuracion.manoObraPorcentaje
    };
    
    localStorage.setItem('arteyevents_config', JSON.stringify(configToSave));
    mostrarNotificacion('✅ Configuración guardada con éxito. Los costos reales se han guardado.');
    toggleConfig();
    
    // Recargar la configuración para actualizar la cotización
    cargarConfiguracion();
    renderizarArticulos('paquetes');
    actualizarResumen();
}

// ============================================
// FUNCIONES PARA GUARDAR POR CATEGORÍA
// ============================================

function guardarTiposEvento() {
    guardarCategoria('tiposEvento', configuracion.tiposEvento);
    mostrarNotificacion('✅ Tipos de evento guardados', 'success');
}

function guardarTematicasEvento() {
    guardarCategoria('tematicasEvento', configuracion.tematicasEvento);
    mostrarNotificacion('✅ Temáticas guardadas', 'success');
}

function guardarPaquetes() {
    guardarCategoria('paquetes', configuracion.paquetes);
    mostrarNotificacion('✅ Globos guardados', 'success');
}

function guardarAccesorios() {
    guardarCategoria('accesorios', configuracion.accesorios);
    mostrarNotificacion('✅ Accesorios guardados', 'success');
}

function guardarFlores() {
    guardarCategoria('flores', configuracion.flores);
    mostrarNotificacion('✅ Flores guardadas', 'success');
}

function guardarArreglos() {
    guardarCategoria('arreglosFlorales', configuracion.arreglosFlorales);
    mostrarNotificacion('✅ Arreglos guardados', 'success');
}

// Función auxiliar para guardar una categoría específica
function guardarCategoria(categoria, datos) {
    // Obtener la configuración actual guardada
    let configGuardada = {};
    try {
        configGuardada = JSON.parse(localStorage.getItem('arteyevents_config')) || {};
    } catch (e) {
        configGuardada = {};
    }
    
    // Actualizar solo la categoría específica
    configGuardada[categoria] = datos;
    
    // Guardar en localStorage
    localStorage.setItem('arteyevents_config', JSON.stringify(configGuardada));
    
    // Actualizar la configuración actual
    if (categoria === 'tiposEvento') {
        configuracion.tiposEvento = datos;
        actualizarTiposEvento();
    } else if (categoria === 'tematicasEvento') {
        configuracion.tematicasEvento = datos;
        actualizarTematicasEvento();
    } else if (categoria === 'paquetes') {
        configuracion.paquetes = datos;
        renderizarArticulos('paquetes');
    } else if (categoria === 'accesorios') {
        configuracion.accesorios = datos;
        renderizarArticulos('accesorios');
    } else if (categoria === 'flores') {
        configuracion.flores = datos;
        renderizarArticulos('flores');
    } else if (categoria === 'arreglosFlorales') {
        configuracion.arreglosFlorales = datos;
        renderizarArticulos('arreglos');
    }
    
    // Sincronizar cotización
    sincronizarCotizacionConConfiguracion();
    actualizarResumen();
}

function sincronizarCotizacionConConfiguracion() {
    cotizacion.articulos.paquetes = configuracion.paquetes.map(p => ({...p, cantidad: 0}));
    cotizacion.articulos.accesorios = configuracion.accesorios.map(a => ({...a, cantidad: 0}));
    cotizacion.articulos.flores = configuracion.flores.map(f => ({...f, cantidad: 0}));
    cotizacion.articulos.arreglosFlorales = configuracion.arreglosFlorales.map(af => ({...af, cantidad: 0}));
    cotizacion.costos.manoObraPorcentaje = configuracion.manoObraPorcentaje;
    document.getElementById('porcentaje-mano-obra').value = configuracion.manoObraPorcentaje;
}

// ============================================
// PARTE 4: GENERACIÓN DE PDF
// ============================================

async function generarCotizacionPDF() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        mostrarNotificacion('❌ Error: La librería jsPDF no se ha cargado correctamente. Recargue la página.', 'error');
        mostrarEstadoCargaPDF(false);
        return;
    }

    const total = cotizacion.costos.total || 0;
    if (total === 0) {
        mostrarNotificacion('❌ Error: No hay artículos seleccionados para generar el PDF.', 'error');
        mostrarEstadoCargaPDF(false);
        return;
    }

    let totalArticulos = 0;
    if (cotizacion.tipoServicio === 'decoracion') {
        totalArticulos = cotizacion.articulos.paquetes.filter(p => p.cantidad > 0).length +
                        cotizacion.articulos.accesorios.filter(a => a.cantidad > 0).length +
                        cotizacion.articulos.manuales.filter(m => m.cantidad > 0).length;
    } else if (cotizacion.tipoServicio === 'flores') {
        totalArticulos = cotizacion.articulos.flores.filter(p => p.cantidad > 0).length +
                        cotizacion.articulos.arreglosFlorales.filter(a => a.cantidad > 0).length +
                        cotizacion.articulos.manuales.filter(m => m.cantidad > 0).length;
    }
    
    if (totalArticulos === 0) {
        mostrarNotificacion('❌ Error: No hay artículos seleccionados para generar el PDF.', 'error');
        mostrarEstadoCargaPDF(false);
        return;
    }

    mostrarEstadoCargaPDF(true);
    
    try {
        const doc = new window.jspdf.jsPDF();
        
        if (!doc || typeof doc.addPage !== 'function') {
            throw new Error('Error al crear documento PDF');
        }
        
        let itemsSeleccionados = [];
        if (cotizacion.tipoServicio === 'decoracion') {
            itemsSeleccionados = [
                ...cotizacion.articulos.paquetes.filter(p => p.cantidad > 0),
                ...cotizacion.articulos.accesorios.filter(a => a.cantidad > 0),
                ...cotizacion.articulos.manuales.filter(m => m.cantidad > 0)
            ];
        } else if (cotizacion.tipoServicio === 'flores') {
            itemsSeleccionados = [
                ...cotizacion.articulos.flores.filter(p => p.cantidad > 0),
                ...cotizacion.articulos.arreglosFlorales.filter(a => a.cantidad > 0),
                ...cotizacion.articulos.manuales.filter(m => m.cantidad > 0)
            ];
        }

        if (itemsSeleccionados.length === 0) {
            throw new Error('No hay artículos seleccionados');
        }

        if (configPDF.mostrarPresupuestoSimple) {
            await generarPDFModoPresupuestoSimple(doc, itemsSeleccionados, total);
        } else {
            await generarPDFModoNormal(doc, itemsSeleccionados, total);
        }

        const nombreArchivo = `cotizacion-${cotizacion.cliente.nombre.replace(/[^a-z0-9]/gi, '_') || 'arte-events'}-${new Date().getTime()}.pdf`;
        doc.save(nombreArchivo);

        mostrarNotificacion('✅ ¡Cotización generada con éxito!');
        mostrarEstadoCargaPDF(false);
        
    } catch (error) {
        console.error('Error al generar PDF:', error);
        mostrarNotificacion(`❌ Error al generar el PDF: ${error.message}`, 'error');
        mostrarEstadoCargaPDF(false);
    }
}

function mostrarEstadoCargaPDF(mostrar) {
    const pdfIcon = document.getElementById('pdf-icon');
    const pdfText = document.getElementById('pdf-text');
    const pdfLoading = document.getElementById('pdf-loading');
    const generarBtn = document.getElementById('generar-cotizacion');
    const floatingPdfBtn = document.getElementById('floating-pdf-btn');
    
    if (mostrar) {
        pdfIcon.style.display = 'none';
        pdfText.style.display = 'none';
        pdfLoading.style.display = 'flex';
        generarBtn.disabled = true;
        if (floatingPdfBtn) floatingPdfBtn.disabled = true;
    } else {
        pdfIcon.style.display = 'inline';
        pdfText.style.display = 'inline';
        pdfLoading.style.display = 'none';
        generarBtn.disabled = cotizacion.currentStep !== 3 || cotizacion.costos.total === 0;
        if (floatingPdfBtn) floatingPdfBtn.disabled = cotizacion.currentStep !== 3 || cotizacion.costos.total === 0;
    }
}

async function generarEncabezadoPDF(doc) {
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    
    doc.setFillColor(138, 43, 226);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setFillColor(157, 78, 221);
    doc.setGState(new doc.GState({opacity: 0.3}));
    doc.rect(0, 0, pageWidth, 20, 'F');
    doc.setGState(new doc.GState({opacity: 1}));
    
    doc.setFillColor(255, 255, 255);
    doc.setGState(new doc.GState({opacity: 0.05}));
    doc.circle(20, 20, 25, 'F');
    doc.circle(pageWidth - 20, 20, 25, 'F');
    doc.setGState(new doc.GState({opacity: 1}));
    
    doc.setFillColor(255, 255, 255);
    doc.circle(32.5, 17.5, 13, 'F');
    
    try {
        const logoUrl = 'https://raw.githubusercontent.com/francisdominguez/cotizador-arte-events/main/logo%20arte%20y%20eventos.png';
        const img = await new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = 'Anonymous';
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error('Error al cargar el logo'));
            image.src = logoUrl + '?t=' + new Date().getTime();
        });
        
        doc.addImage(img, 'PNG', 20, 5, 25, 25);
        
    } catch (logoError) {
        console.log('Logo no cargado, usando alternativa:', logoError.message);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(138, 43, 226);
        doc.text('AE', 32, 21);
    }
    
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('Arte  &  Eventos', 55, 14);
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'italic');
    doc.text('Donde los sueños toman forma', 55, 21);
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('@arteeventop  |  Creando magia para tus momentos especiales', 55, 27);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('COTIZACIÓN', pageWidth - margin, 15, {align: 'right'});
    
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-DO')}`, pageWidth - margin, 20, {align: 'right'});
    
    doc.setDrawColor(255, 215, 0);
    doc.setLineWidth(2);
    doc.line(margin, 42, pageWidth - margin, 42);
    
    doc.setDrawColor(255, 255, 255);
    doc.setGState(new doc.GState({opacity: 0.3}));
    doc.setLineWidth(0.5);
    doc.line(margin, 44, pageWidth - margin, 44);
    doc.setGState(new doc.GState({opacity: 1}));
}

function generarInformacionClientePDF(doc, yPos) {
    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;
    const xRight = pageWidth - margin;
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(138, 43, 226);
    
    const servicioTitulo = cotizacion.tipoServicio === 'flores' ? 'Flores Externas' : 'Decoración';
    doc.text(`Información del Cliente y Evento (${servicioTitulo})`, margin, yPos);
    yPos += 7;
    
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    
    doc.text(`Cliente: ${cotizacion.cliente.nombre || 'N/A'}`, margin, yPos);
    doc.text(`Fecha del Evento: ${formatearFecha(cotizacion.cliente.fechaEvento) || 'N/A'}`, margin, yPos + 5);
    doc.text(`Contacto: ${cotizacion.cliente.telefono || ''} / ${cotizacion.cliente.email || ''}`, margin, yPos + 10);
    
    doc.text(`Evento: ${cotizacion.tipoEvento || 'N/A'}`, xRight, yPos, { align: "right" });
    doc.text(`Lugar: ${cotizacion.cliente.lugarEvento || 'N/A'}`, xRight, yPos + 5, { align: "right" });
    
    if (cotizacion.tematicaEvento) {
        doc.text(`Temática: ${cotizacion.tematicaEvento}`, xRight, yPos + 10, { align: "right" });
        yPos += 15;
    } else {
        yPos += 15;
    }
    
    return yPos + 10;
}

async function generarPDFModoPresupuestoSimple(doc, itemsSeleccionados, total) {
    const margin = 15;
    let yPos = margin + 5;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const maxY = pageHeight - margin - 10;
    
    function checkPageBreak(neededSpace) {
        if (yPos + neededSpace > maxY) {
            doc.addPage();
            yPos = margin;
        }
    }

    await generarEncabezadoPDF(doc);
    yPos = 55;

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Fecha de Creación: ${new Date().toLocaleDateString('es-DO')}`, pageWidth - margin, yPos + 10, { align: "right" });
    yPos += 10;

    yPos = generarInformacionClientePDF(doc, yPos);

    if (itemsSeleccionados.length > 0) {
        checkPageBreak(50);

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(138, 43, 226);
        doc.text("Detalle de Artículos y Servicios", margin, yPos);
        yPos += 7;

        doc.setFont("helvetica", "normal");
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(9);

        itemsSeleccionados.forEach(item => {
            checkPageBreak(6);
            const nombre = item.nombre;
            const cantidad = item.cantidad || 1;
            const esManual = item.tipo === 'manual';
            
            // Usar la unidad del artículo o determinar por nombre
            let unidad = item.unidad || 'unidad';
            if (item.nombre.includes('Globo')) unidad = 'paquete';
            else if (item.tipo === 'flores' && !item.nombre.includes('Ramo') && !item.nombre.includes('Arreglo')) unidad = 'flor';
            else if (item.nombre.includes('Ramo')) unidad = 'ramo';
            else if (item.nombre.includes('Sillas')) unidad = 'juego';
            else if (item.nombre.includes('Arco')) unidad = 'arco';
            else if (item.nombre.includes('Centro')) unidad = 'centro';
            else if (item.nombre.includes('Guirnalda')) unidad = 'guirnalda';
            
            let textoItem = `• ${nombre} - ${cantidad} ${unidad}${cantidad !== 1 ? 's' : ''}`;
            if (esManual) textoItem += ' [Artículo manual]';
            // En modo simple NO se muestra ningún precio
            doc.text(textoItem, margin + 2, yPos + 4);
            yPos += 6;
        });

        yPos += 10;
    }

    checkPageBreak(50);
    
    doc.setDrawColor(138, 43, 226);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
    
    const xCostos = pageWidth - margin - 5;
    
    yPos += 8;
    
    doc.setDrawColor(138, 43, 226);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2, yPos, pageWidth - margin, yPos);
    yPos += 1;
    doc.line(pageWidth / 2, yPos, pageWidth - margin, yPos);
    yPos += 8;

    doc.setFillColor(245, 245, 245);
    doc.rect(pageWidth / 2 - 10, yPos - 5, pageWidth / 2 - margin + 10, 12, 'F');
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(138, 43, 226);
    doc.text("TOTAL COTIZADO:", pageWidth / 2, yPos, { align: "left" });
    doc.text(formatoMonedaRD(total), xCostos, yPos, { align: "right" });
    yPos += 15;
    
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
    
    checkPageBreak(20);
    doc.setFillColor(245, 245, 245);
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150);
    
    doc.text("Arte y Events - Decoración Profesional", pageWidth / 2, pageHeight - 10, { align: "center" });
}

function formatearFecha(fechaISO) {
    if (!fechaISO) return '';
    const fecha = new Date(fechaISO + 'T00:00:00');
    return fecha.toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' });
}

async function generarPDFModoNormal(doc, itemsSeleccionados, total) {
    const margin = 15;
    let yPos = margin + 5;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const maxY = pageHeight - margin - 10;
    
    function checkPageBreak(neededSpace) {
        if (yPos + neededSpace > maxY) {
            doc.addPage();
            yPos = margin;
        }
    }

    await generarEncabezadoPDF(doc);
    yPos = 55;

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Fecha de Creación: ${new Date().toLocaleDateString('es-DO')}`, pageWidth - margin, yPos + 10, { align: "right" });
    yPos += 10;

    yPos = generarInformacionClientePDF(doc, yPos);

    // Detalle de artículos
    if (itemsSeleccionados.length > 0) {
        checkPageBreak(50);

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(138, 43, 226);
        doc.text("Detalle de Artículos y Servicios", margin, yPos);
        yPos += 7;

        doc.setFont("helvetica", "normal");
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(9);

        itemsSeleccionados.forEach(item => {
            checkPageBreak(6);
            const nombre = item.nombre;
            const cantidad = item.cantidad || 1;
            const esManual = item.tipo === 'manual';
            
            // Usar la unidad del artículo o determinar por nombre
            let unidad = item.unidad || 'unidad';
            if (item.nombre.includes('Globo')) unidad = 'paquete';
            else if (item.tipo === 'flores' && !item.nombre.includes('Ramo') && !item.nombre.includes('Arreglo')) unidad = 'flor';
            else if (item.nombre.includes('Ramo')) unidad = 'ramo';
            else if (item.nombre.includes('Sillas')) unidad = 'juego';
            else if (item.nombre.includes('Arco')) unidad = 'arco';
            else if (item.nombre.includes('Centro')) unidad = 'centro';
            else if (item.nombre.includes('Guirnalda')) unidad = 'guirnalda';
            
            let textoItem = `• ${nombre} - ${cantidad} ${unidad}${cantidad !== 1 ? 's' : ''}`;
            if (esManual) textoItem += ' [Artículo manual]';
            
            // SOLO mostrar precio si está activado mostrarDetalleMateriales
            if (configPDF.mostrarDetalleMateriales) {
                let precioUnitario;
                if (esManual) precioUnitario = item.precioUnitario;
                else precioUnitario = item.precio;
                const precioTotalItem = precioUnitario * cantidad;
                textoItem += ` (${formatoMonedaRD(precioTotalItem)})`;
            }
            
            doc.text(textoItem, margin + 2, yPos + 4);
            yPos += 6;
        });

        yPos += 10;
    }

    checkPageBreak(50);
    
    doc.setDrawColor(138, 43, 226);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
    
    const xCostos = pageWidth - margin - 5;
    
    doc.setFontSize(10);
    
    // SOLO para decoración
    if (cotizacion.tipoServicio === 'decoracion') {
        // Costo de materiales - SOLO si está activado
        if (configPDF.mostrarCostoMateriales) {
            doc.text("Costo de Materiales:", pageWidth / 2, yPos, { align: "left" });
            doc.text(formatoMonedaRD(cotizacion.costos.materiales), xCostos, yPos, { align: "right" });
            yPos += 5;
        }

        // Mano de obra - SOLO si está activado y hay monto
        if (configPDF.mostrarManoObra && cotizacion.costos.manoObra > 0) {
            doc.text("Mano de Obra:", pageWidth / 2, yPos, { align: "left" });
            doc.text(formatoMonedaRD(cotizacion.costos.manoObra), xCostos, yPos, { align: "right" });
            yPos += 5;
        }
        
        // Transporte - SOLO si está activado y hay monto
        if (configPDF.mostrarTransporte && cotizacion.costos.transporte > 0) {
            doc.text("Transporte:", pageWidth / 2, yPos, { align: "left" });
            doc.text(formatoMonedaRD(cotizacion.costos.transporte), xCostos, yPos, { align: "right" });
            yPos += 5;
        }
    }
    
    yPos += 8;
    
    doc.setDrawColor(138, 43, 226);
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2, yPos, pageWidth - margin, yPos);
    yPos += 1;
    doc.line(pageWidth / 2, yPos, pageWidth - margin, yPos);
    yPos += 8;

    doc.setFillColor(245, 245, 245);
    doc.rect(pageWidth / 2 - 10, yPos - 5, pageWidth / 2 - margin + 10, 12, 'F');
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(138, 43, 226);
    doc.text("TOTAL COTIZADO:", pageWidth / 2, yPos, { align: "left" });
    doc.text(formatoMonedaRD(total), xCostos, yPos, { align: "right" });
    yPos += 15;
    
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
    
    checkPageBreak(20);
    doc.setFillColor(245, 245, 245);
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150);
    
    doc.text("Arte y Events - Decoración Profesional", pageWidth / 2, pageHeight - 10, { align: "center" });
}

// ============================================
// PARTE 5: LIMPIEZA Y UTILIDADES
// ============================================

function confirmarLimpiarCotizacion() {
    document.getElementById('confirmModal').style.display = 'flex';
}

function cerrarConfirmacion() {
    document.getElementById('confirmModal').style.display = 'none';
}

function limpiarCamposCotizacion() {
    cerrarConfirmacion();
    
    document.getElementById('cliente-nombre').value = '';
    document.getElementById('cliente-telefono').value = '';
    document.getElementById('cliente-email').value = '';
    document.getElementById('lugar-evento').value = '';
    document.getElementById('cliente-notas').value = '';
    document.getElementById('tipo-evento').value = '';
    document.getElementById('otro-evento').value = '';
    document.getElementById('otro-evento-container').style.display = 'none';
    document.getElementById('tematica-evento').value = '';
    document.getElementById('otra-tematica').value = '';
    document.getElementById('otra-tematica-container').style.display = 'none';
    document.getElementById('tipo-servicio').value = '';
    
    document.querySelectorAll('.validation-error').forEach(el => el.textContent = '');
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    
    inicializarFechaEvento();
    manualItemIdCounter = 1;
    
    cotizacion = {
        currentStep: 1,
        tipoServicio: '',
        tipoManoObra: 'porcentaje',
        montoManoObraManual: 0,
        cliente: {
            nombre: '', telefono: '', email: '', fechaEvento: '', lugarEvento: '', notas: ''
        },
        tipoEvento: '',
        tematicaEvento: '',
        articulos: {
            paquetes: configuracion.paquetes.map(p => ({...p, cantidad: 0})),
            accesorios: configuracion.accesorios.map(a => ({...a, cantidad: 0})),
            flores: configuracion.flores.map(f => ({...f, cantidad: 0})),
            arreglosFlorales: configuracion.arreglosFlorales.map(af => ({...af, cantidad: 0})),
            manuales: []
        },
        costos: {
            materiales: 0,
            costoRealMateriales: 0,
            transporte: 0,
            manoObra: 0,
            manoObraPorcentaje: 30,
            total: 0
        }
    };
    
    document.getElementById('costo-transporte').value = 0;
    document.getElementById('porcentaje-mano-obra').value = 30;
    document.getElementById('tipo-mano-obra').value = 'porcentaje';
    document.getElementById('monto-mano-obra-manual').value = 0;
    document.getElementById('costo-materiales').value = 0;
    document.getElementById('porcentaje-ganancia').value = 30;
    
    document.getElementById('mostrar-mano-obra').checked = true;
    document.getElementById('mostrar-transporte').checked = true;
    document.getElementById('mostrar-detalle-materiales').checked = true;
    document.getElementById('mostrar-costo-materiales').checked = true;
    document.getElementById('mostrar-presupuesto-simple').checked = false;
    
    document.getElementById('mostrar-mano-obra').disabled = false;
    document.getElementById('mostrar-transporte').disabled = false;
    document.getElementById('mostrar-detalle-materiales').disabled = false;
    document.getElementById('mostrar-costo-materiales').disabled = false;
    
    actualizarConfigPDF();
    renderizarArticulos('paquetes');
    renderizarArticulos('accesorios');
    renderizarArticulos('flores');
    renderizarArticulos('arreglos');
    renderizarArticulosManuales();
    
    const paso3 = document.getElementById('step-3');
    if (paso3) {
        const existingDesglose = paso3.querySelector('#desglose-ganancia-paso3');
        if (existingDesglose) existingDesglose.remove();
    }
    
    cotizacion.currentStep = 1;
    updateStepUI();
    
    const body = document.body;
    const clasesTema = Array.from(body.classList).filter(className => className.startsWith('theme-'));
    clasesTema.forEach(className => body.classList.remove(className));
    
    actualizarResumen();
    actualizarBotonFlotantePDF();
    actualizarIndicadorPasoActual();
    mejorarVisualizacionTotal();
    actualizarVisibilidadBotonesFlotantes();
    
    const displays = [
        'display-costo-real',
        'display-precio-venta', 
        'display-ganancia',
        'display-porcentaje-ganancia',
        'display-mano-obra',
        'display-transporte',
        'display-total-final'
    ];
    
    displays.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (id === 'display-porcentaje-ganancia') {
                element.textContent = '0%';
                element.style.color = '#e91e63';
            } else {
                element.textContent = 'RD$0.00';
            }
        }
    });
    
    mostrarNotificacion('✅ Cotización limpiada correctamente. Puede comenzar una nueva.', 'success');
    
    setTimeout(() => {
        actualizarResumen();
        aplicarTema();
    }, 100);
}

function mostrarNotificacion(mensaje, tipo = 'success') {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');
    
    if (!notification || !messageElement) return;
    
    messageElement.textContent = mensaje;
    
    let icon = '✅';
    if (tipo === 'warning') icon = '⚠️';
    if (tipo === 'error') icon = '❌';
    if (tipo === 'info') icon = '💡';
    
    notification.querySelector('span:first-child').textContent = icon;
    
    notification.className = 'notification show';
    if (tipo === 'warning') notification.classList.add('warning');
    if (tipo === 'error') notification.classList.add('error');
    if (tipo === 'info') notification.classList.add('info');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function toggleConfig() {
    document.getElementById('configPanel').classList.toggle('active');
}

function actualizarBotonFlotantePDF() {
    const floatingBtn = document.getElementById('floating-pdf-btn');
    if (!floatingBtn) return;
    
    const total = cotizacion.costos.total;
    const totalArticulos = parseInt(document.getElementById('total-articulos')?.textContent) || 0;
    const modo = configPDF.mostrarPresupuestoSimple ? 'Simple' : 'Detallado';
    
    const textSpan = floatingBtn.querySelector('.floating-text');
    if (textSpan) {
        if (total > 0) {
            textSpan.innerHTML = `PDF: ${formatoMonedaRD(total)}`;
        } else {
            textSpan.textContent = 'Generar PDF';
        }
    }
    
    floatingBtn.title = `Generar PDF (Modo ${modo})\nArtículos: ${totalArticulos}\nTotal: ${formatoMonedaRD(total)}`;
    actualizarVisibilidadBotonesFlotantes();
}

// PWA Support
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('ServiceWorker registrado con éxito:', registration.scope);
    }).catch(registrationError => {
      console.log('Error al registrar ServiceWorker:', registrationError);
    });
  });
}

// ============================================
// CONFIRMACIÓN DE CARGA FINAL
// ============================================
console.log('✅ Script COMPLETO cargado correctamente - Versión con unidades corregidas');
console.log('📱 Optimizado para móvil');
console.log('🔧 Correcciones aplicadas:');
console.log('   ✓ Unidades: paquete, flor, ramo, juego, etc.');
console.log('   ✓ Botones Guardar por categoría');
console.log('   ✓ Desglose movido al paso 3');

