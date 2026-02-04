// Asegurar que las librerías se carguen
const { jsPDF } = window.jspdf;

// ----------------------------------------------------
// DATOS INICIALES Y ESTRUCTURA DE LA APLICACIÓN
// ----------------------------------------------------

let configuracion = {
    tiposEvento: ['Bodas', 'Cumpleaños', 'Corporativo', 'Baby Shower', 'Graduaciones', 'Aniversarios', 'Flores'],
    tematicasEvento: ['Clásica', 'Moderno', 'Vintage', 'Rústico', 'Minimalista', 'Bohemio', 'Elegante', 'Divertido'],
    paquetes: [
        { id: 1, nombre: "Globo Azul", precio: 1200, emoji: '💙', cantidad: 0, tipo: 'decoracion' },
        { id: 2, nombre: "Globo Dorado", precio: 1500, emoji: '✨', cantidad: 0, tipo: 'decoracion' },
        { id: 3, nombre: "Globo Blanco", precio: 1000, emoji: '☁️', cantidad: 0, tipo: 'decoracion' },
        { id: 4, nombre: "Globo Rosa", precio: 1300, emoji: '💖', cantidad: 0, tipo: 'decoracion' }
    ],
    accesorios: [
        { id: 1, nombre: "Mampara Circular", precio: 800, emoji: '🖼️', cantidad: 0, tipo: 'decoracion' },
        { id: 2, nombre: "Cilindro Decorativo", precio: 400, emoji: '🏺', cantidad: 0, tipo: 'decoracion' },
        { id: 3, nombre: "Mesa Principal", precio: 300, emoji: '🪑', cantidad: 0, tipo: 'decoracion' },
        { id: 4, nombre: "Sillas Tiffany (x10)", precio: 1500, emoji: '🪑', cantidad: 0, tipo: 'decoracion' },
        { id: 5, nombre: "Alfombra Roja", precio: 600, emoji: '🟥', cantidad: 0, tipo: 'decoracion' }
    ],
    flores: [
        { id: 100, nombre: "Rosas Rojas", precio: 250, emoji: '🌹', cantidad: 0, tipo: 'flores', color: 'Rojo' },
        { id: 101, nombre: "Rosas Blancas", precio: 250, emoji: '🌹', cantidad: 0, tipo: 'flores', color: 'Blanco' },
        { id: 102, nombre: "Rosas Rosadas", precio: 250, emoji: '🌹', cantidad: 0, tipo: 'flores', color: 'Rosa' },
        { id: 103, nombre: "Girasoles", precio: 300, emoji: '🌻', cantidad: 0, tipo: 'flores', color: 'Amarillo' },
        { id: 104, nombre: "Lirios Blancos", precio: 350, emoji: '⚜️', cantidad: 0, tipo: 'flores', color: 'Blanco' },
        { id: 105, nombre: "Orquídeas", precio: 500, emoji: '💮', cantidad: 0, tipo: 'flores', color: 'Morado' },
        { id: 106, nombre: "Tulipanes", precio: 400, emoji: '🌷', cantidad: 0, tipo: 'flores', color: 'Multicolor' },
        { id: 107, nombre: "Flores Silvestres", precio: 200, emoji: '🌸', cantidad: 0, tipo: 'flores', color: 'Mixto' }
    ],
    arreglosFlorales: [
        { id: 200, nombre: "Ramo Pequeño (12 flores)", precio: 3000, emoji: '💐', cantidad: 0, tipo: 'flores' },
        { id: 201, nombre: "Ramo Mediano (24 flores)", precio: 5500, emoji: '💐', cantidad: 0, tipo: 'flores' },
        { id: 202, nombre: "Ramo Grande (36 flores)", precio: 8000, emoji: '💐', cantidad: 0, tipo: 'flores' },
        { id: 203, nombre: "Centro de Mesa", precio: 4500, emoji: '🏺', cantidad: 0, tipo: 'flores' },
        { id: 204, nombre: "Arco Floral", precio: 12000, emoji: '🎀', cantidad: 0, tipo: 'flores' },
        { id: 205, nombre: "Guirnalda Floral", precio: 7500, emoji: '🌿', cantidad: 0, tipo: 'flores' }
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
        paquetes: JSON.parse(JSON.stringify(configuracion.paquetes)),
        accesorios: JSON.parse(JSON.stringify(configuracion.accesorios)),
        flores: JSON.parse(JSON.stringify(configuracion.flores)),
        arreglosFlorales: JSON.parse(JSON.stringify(configuracion.arreglosFlorales)),
        manuales: []
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
let configIdCounter = 1000;

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
    actualizarTiposEvento();
    actualizarTematicasEvento();
    updateStepUI();
    renderizarArticulos('paquetes');
    renderizarConfiguracion();
    actualizarResumen();
    actualizarConfigPDF();
    cargarPreferenciasUsuario();
    document.getElementById('tab-flores').style.display = 'none';
    document.getElementById('tab-arreglos').style.display = 'none';
    
    // Aplicar tema inicial
    aplicarTema();
    
    // Inicializar vista previa
    actualizarVistaPreviaPDF();
});

function cargarFechaActual() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-evento').value = today;
    cotizacion.cliente.fechaEvento = today;
    guardarDatosPaso1();
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

function inicializarEventListeners() {
    // Event listeners para inputs del paso 1
    const inputsPaso1 = ['cliente-nombre', 'fecha-evento', 'tipo-evento', 'cliente-notas', 'lugar-evento', 'cliente-telefono', 'cliente-email', 'tipo-servicio', 'otro-evento', 'otra-tematica'];
    
    inputsPaso1.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.addEventListener('input', guardarDatosPaso1);
    });
    
    // Event listeners específicos
    document.getElementById('tipo-evento').addEventListener('change', function() {
        const otroEventoContainer = document.getElementById('otro-evento-container');
        if (this.value === 'otro') {
            otroEventoContainer.style.display = 'block';
        } else {
            otroEventoContainer.style.display = 'none';
            document.getElementById('otro-evento').value = '';
        }
        aplicarTema();
        guardarDatosPaso1();
    });
    
    document.getElementById('tematica-evento').addEventListener('change', function() {
        cambiarTematicaEvento();
    });
    
    // Event listeners para costos
    document.getElementById('costo-transporte').addEventListener('input', (e) => actualizarCostoManual('transporte', e.target.value));
    document.getElementById('porcentaje-mano-obra').addEventListener('input', (e) => actualizarCostoManual('manoObraPorcentaje', e.target.value));
    document.getElementById('monto-mano-obra-manual').addEventListener('input', (e) => actualizarCostoManual('manoObraMontoManual', e.target.value));
    
    // Event listener para vista previa cuando cambia cualquier checkbox
    document.querySelectorAll('.pdf-config-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            actualizarConfigPDF();
            actualizarVistaPreviaPDF();
        });
    });
    
    // Tooltip para botón de generar PDF
    document.getElementById('generar-cotizacion').addEventListener('mouseover', function() {
        actualizarTooltipPDF();
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
    // Obtener el estado del checkbox de Modo Presupuesto Simple
    const modoSimple = document.getElementById('mostrar-presupuesto-simple');
    
    // Lista de los otros checkboxes que deben ser controlados
    const otrosCheckboxes = [
        'mostrar-mano-obra',
        'mostrar-transporte',
        'mostrar-detalle-materiales',
        'mostrar-costo-materiales'
    ];
    
    if (modoSimple.checked) {
        // Si Modo Presupuesto Simple está ACTIVADO
        // Desmarcar y deshabilitar todos los otros checkboxes
        otrosCheckboxes.forEach(id => {
            const checkbox = document.getElementById(id);
            checkbox.checked = false;
            checkbox.disabled = true;
        });
        
        // Forzar configuración para Modo Simple:
        // - Mostrar Detalle de Materiales: SIEMPRE true (para ver los artículos)
        // - Los demás: SIEMPRE false (solo queremos artículos + total)
        configPDF.mostrarManoObra = false;
        configPDF.mostrarTransporte = false;
        configPDF.mostrarCostoMateriales = false;
        configPDF.mostrarDetalleMateriales = true;
        configPDF.mostrarPresupuestoSimple = true;
        
        // Mostrar notificación
        mostrarNotificación('✅ Modo Presupuesto Simple activado. Solo se mostrarán artículos y total.', 'success');
        
    } else {
        // Si Modo Presupuesto Simple está DESACTIVADO
        // Habilitar todos los otros checkboxes
        otrosCheckboxes.forEach(id => {
            document.getElementById(id).disabled = false;
        });
        
        // Leer los valores actuales de los checkboxes
        configPDF.mostrarManoObra = document.getElementById('mostrar-mano-obra').checked;
        configPDF.mostrarTransporte = document.getElementById('mostrar-transporte').checked;
        configPDF.mostrarDetalleMateriales = document.getElementById('mostrar-detalle-materiales').checked;
        configPDF.mostrarCostoMateriales = document.getElementById('mostrar-costo-materiales').checked;
        configPDF.mostrarPresupuestoSimple = false;
        
        // Mostrar notificación
        mostrarNotificación('✅ Modo Detallado activado. Puedes configurar opciones individuales.', 'success');
    }
    
    // Guardar preferencias del usuario
    guardarPreferenciasUsuario();
    
    actualizarResumen();
}

// ----------------------------------------------------
// CONTROL DE PASOS Y VALIDACIÓN
// ----------------------------------------------------

function nextStep() {
    if (cotizacion.currentStep === 1) {
        if (!validarPaso1()) return;
        guardarDatosPaso1();
    } else if (cotizacion.currentStep === 2) {
        // Validación opcional para paso 2
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
    } else {
        nextBtn.style.display = 'inline-flex';
        nextBtn.textContent = 'Siguiente →';
    }
    
    generarBtn.disabled = cotizacion.currentStep !== 3 || cotizacion.costos.total === 0;

    const progressPercent = (cotizacion.currentStep / 3) * 100;
    progress.style.width = `${progressPercent}%`;

    if (cotizacion.currentStep === 2) {
        actualizarUIporTipoServicio();
        const activeTabButton = document.querySelector('.tabs .tab-button.active');
        const activeTab = activeTabButton ? activeTabButton.dataset.tab : 'paquetes';
        switchTab(activeTab);
        renderizarArticulosManuales();
    } else if (cotizacion.currentStep === 3) {
        document.getElementById('costo-transporte').value = cotizacion.costos.transporte;
        document.getElementById('porcentaje-mano-obra').value = cotizacion.costos.manoObraPorcentaje;
        document.getElementById('monto-mano-obra-manual').value = cotizacion.montoManoObraManual;
        document.getElementById('tipo-mano-obra').value = cotizacion.tipoManoObra;
        cambiarTipoManoObra();
        actualizarVistaPreviaPDF();
        actualizarTooltipPDF();
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
    const servicio = document.getElementById('tipo-servicio').value;
    
    if (tipo === 'otro') {
        const otroEvento = document.getElementById('otro-evento').value.trim();
        if (!otroEvento) {
            mostrarNotificación('⚠️ Por favor especifique el tipo de evento.', 'warning');
            return false;
        }
    }

    if (!nombre || !fecha || !tipo || !servicio) {
        mostrarNotificación('⚠️ Faltan campos obligatorios: Nombre, Fecha, Tipo de Evento y Tipo de Servicio.', 'warning');
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
    
    const tipoEvento = document.getElementById('tipo-evento').value;
    
    if (tipoEvento === 'otro') {
        cotizacion.tipoEvento = document.getElementById('otro-evento').value.trim();
    } else {
        cotizacion.tipoEvento = tipoEvento;
    }
    
    const tematicaEvento = document.getElementById('tematica-evento').value;
    
    if (tematicaEvento === 'otra') {
        cotizacion.tematicaEvento = document.getElementById('otra-tematica').value.trim();
    } else {
        cotizacion.tematicaEvento = tematicaEvento;
    }
    
    cotizacion.tipoServicio = document.getElementById('tipo-servicio').value;
    
    aplicarTema();
    actualizarResumen();
}

function aplicarTema() {
    const tipoEventoSelect = document.getElementById('tipo-evento');
    const tipoSeleccionado = tipoEventoSelect ? tipoEventoSelect.value : '';
    const otroEventoContainer = document.getElementById('otro-evento-container');
    
    const body = document.body;
    // Limpiar clases de tema anteriores
    const clasesTema = body.className.split(' ').filter(className => className.startsWith('theme-'));
    clasesTema.forEach(className => body.classList.remove(className));
    
    if (tipoSeleccionado === 'otro') {
        if (otroEventoContainer) otroEventoContainer.style.display = 'block';
        body.classList.add('theme-otro');
    } else if (tipoSeleccionado) {
        const temaClase = 'theme-' + tipoSeleccionado
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/-$/, '')
            .replace(/^-/, '');
        
        if (temaClase !== 'theme-') {
            body.classList.add(temaClase);
        }
        if (otroEventoContainer) otroEventoContainer.style.display = 'none';
    }
}

function actualizarTiposEvento() {
    const select = document.getElementById('tipo-evento');
    if (!select) return;
    
    const valorActual = select.value;
    
    select.innerHTML = '<option value="">Seleccione un tipo</option>';
    
    configuracion.tiposEvento.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        select.appendChild(option);
    });
    
    const otroOption = document.createElement('option');
    otroOption.value = 'otro';
    otroOption.textContent = 'Otro (Personalizado)';
    select.appendChild(otroOption);
    
    if (valorActual) {
        select.value = valorActual;
    }
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
    
    if (valorActual) {
        select.value = valorActual;
    }
}

function cambiarTipoServicio() {
    const tipoServicio = document.getElementById('tipo-servicio').value;
    cotizacion.tipoServicio = tipoServicio;
    
    actualizarResumen();
    
    if (cotizacion.currentStep === 2) {
        actualizarUIporTipoServicio();
    }
}

function actualizarUIporTipoServicio() {
    const paso2Title = document.getElementById('titulo-paso-2');
    const tabsContainer = document.getElementById('tabs-container');
    
    if (!tabsContainer) return;
    
    if (cotizacion.tipoServicio === 'flores') {
        paso2Title.textContent = "2. Selección de Flores y Arreglos";
        
        tabsContainer.innerHTML = `
            <button class="tab-button active" data-tab="flores" onclick="switchTab('flores')">
                🌹 Flores por Unidad
            </button>
            <button class="tab-button" data-tab="arreglos" onclick="switchTab('arreglos')">
                💐 Arreglos Florales
            </button>
            <button class="tab-button" data-tab="manual" onclick="switchTab('manual')">
                ✍️ Artículo Manual
            </button>
        `;
        
        document.getElementById('tab-paquetes').style.display = 'none';
        document.getElementById('tab-accesorios').style.display = 'none';
        
        document.getElementById('tab-flores').style.display = 'block';
        document.getElementById('tab-arreglos').style.display = 'none';
        document.getElementById('tab-manual').style.display = 'none';
        
        renderizarArticulos('flores');
        
    } else if (cotizacion.tipoServicio === 'decoracion') {
        paso2Title.textContent = "2. Selección de Artículos";
        
        tabsContainer.innerHTML = `
            <button class="tab-button active" data-tab="paquetes" onclick="switchTab('paquetes')">
                🎈 Globos y Paquetes
            </button>
            <button class="tab-button" data-tab="accesorios" onclick="switchTab('accesorios')">
                🛋️ Accesorios
            </button>
            <button class="tab-button" data-tab="manual" onclick="switchTab('manual')">
                ✍️ Artículo Manual
            </button>
        `;
        
        document.getElementById('tab-flores').style.display = 'none';
        document.getElementById('tab-arreglos').style.display = 'none';
        
        document.getElementById('tab-paquetes').style.display = 'block';
        document.getElementById('tab-accesorios').style.display = 'none';
        document.getElementById('tab-manual').style.display = 'none';
        
        renderizarArticulos('paquetes');
    }
    
    actualizarResumen();
}

// ----------------------------------------------------
// PASO 2: SELECCIÓN DE ARTÍCULOS
// ----------------------------------------------------

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    const activeContent = document.getElementById(`tab-${tabName}`);
    const activeBtn = document.querySelector(`.tab-button[data-tab="${tabName}"]`);
    
    if (activeContent) activeContent.style.display = 'block';
    if (activeBtn) activeBtn.classList.add('active');
    
    if (tabName === 'paquetes' || tabName === 'accesorios' || tabName === 'flores' || tabName === 'arreglos') {
        renderizarArticulos(tabName);
    } else if (tabName === 'manual') {
        renderizarArticulosManuales();
    }
}

function renderizarArticulos(tipo) {
    let containerId = '';
    let listaArticulos = [];
    
    switch(tipo) {
        case 'paquetes':
            containerId = 'paquetes-container';
            listaArticulos = cotizacion.articulos.paquetes;
            break;
        case 'accesorios':
            containerId = 'accesorios-container';
            listaArticulos = cotizacion.articulos.accesorios;
            break;
        case 'flores':
            containerId = 'flores-container';
            listaArticulos = cotizacion.articulos.flores;
            break;
        case 'arreglos':
            containerId = 'arreglos-container';
            listaArticulos = cotizacion.articulos.arreglosFlorales;
            break;
    }
    
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    
    listaArticulos.forEach(articulo => {
        const isSelected = articulo.cantidad > 0;
        const card = document.createElement('div');
        card.className = `item-card ${isSelected ? 'selected' : ''}`;
        card.id = `${tipo}-${articulo.id}`;
        
        const infoExtra = articulo.color ? `<p>Color: ${articulo.color}</p>` : '';
        
        card.innerHTML = `
            <div class="item-details" onclick="toggleArticulo('${tipo}', ${articulo.id})">
                <h4>${articulo.emoji || '📦'} ${articulo.nombre}</h4>
                <p>Costo unitario: ${formatoMonedaRD(articulo.precio)}</p>
                ${infoExtra}
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

function filtrarFloresPorColor() {
    const colorSeleccionado = document.getElementById('filtro-color-flores').value;
    const container = document.getElementById('flores-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    let floresFiltradas = cotizacion.articulos.flores;
    if (colorSeleccionado !== 'todos') {
        floresFiltradas = cotizacion.articulos.flores.filter(flor => flor.color === colorSeleccionado);
    }
    
    floresFiltradas.forEach(articulo => {
        const isSelected = articulo.cantidad > 0;
        const card = document.createElement('div');
        card.className = `item-card ${isSelected ? 'selected' : ''}`;
        card.id = `flores-${articulo.id}`;
        
        card.innerHTML = `
            <div class="item-details" onclick="toggleArticulo('flores', ${articulo.id})">
                <h4>${articulo.emoji || '🌹'} ${articulo.nombre}</h4>
                <p>Costo unitario: ${formatoMonedaRD(articulo.precio)}</p>
                <p>Color: ${articulo.color}</p>
            </div>
            <div class="item-footer">
                <span class="price">${formatoMonedaRD(articulo.precio * articulo.cantidad)}</span>
                <div class="quantity-control">
                    <button onclick="updateCantidad('flores', ${articulo.id}, -1)">-</button>
                    <input type="number" value="${articulo.cantidad}" min="0" 
                            oninput="updateCantidadInput('flores', ${articulo.id}, this.value)">
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
        case 'paquetes':
            articulo = cotizacion.articulos.paquetes.find(a => a.id === id);
            break;
        case 'accesorios':
            articulo = cotizacion.articulos.accesorios.find(a => a.id === id);
            break;
        case 'flores':
            articulo = cotizacion.articulos.flores.find(a => a.id === id);
            break;
        case 'arreglos':
            articulo = cotizacion.articulos.arreglosFlorales.find(a => a.id === id);
            break;
    }
    
    if (articulo) {
        if (articulo.cantidad > 0) {
            articulo.cantidad = 0;
        } else {
            articulo.cantidad = 1;
        }
        renderizarArticulos(tipo);
        actualizarResumen();
    }
}

function updateCantidad(tipo, id, cambio) {
    let articulo;
    
    switch(tipo) {
        case 'paquetes':
            articulo = cotizacion.articulos.paquetes.find(a => a.id === id);
            break;
        case 'accesorios':
            articulo = cotizacion.articulos.accesorios.find(a => a.id === id);
            break;
        case 'flores':
            articulo = cotizacion.articulos.flores.find(a => a.id === id);
            break;
        case 'arreglos':
            articulo = cotizacion.articulos.arreglosFlorales.find(a => a.id === id);
            break;
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
        case 'paquetes':
            articulo = cotizacion.articulos.paquetes.find(a => a.id === id);
            break;
        case 'accesorios':
            articulo = cotizacion.articulos.accesorios.find(a => a.id === id);
            break;
        case 'flores':
            articulo = cotizacion.articulos.flores.find(a => a.id === id);
            break;
        case 'arreglos':
            articulo = cotizacion.articulos.arreglosFlorales.find(a => a.id === id);
            break;
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

function actualizarCostoManual(tipo, valor) {
    let numVal = parseFloat(valor) || 0;

    if (tipo === 'transporte') {
        cotizacion.costos.transporte = numVal;
    } else if (tipo === 'manoObraPorcentaje') {
        cotizacion.costos.manoObraPorcentaje = Math.min(100, Math.max(0, numVal));
    } else if (tipo === 'manoObraMontoManual') {
        cotizacion.montoManoObraManual = Math.max(0, numVal);
    }
    
    document.getElementById('porcentaje-mano-obra').value = cotizacion.costos.manoObraPorcentaje;
    document.getElementById('monto-mano-obra-manual').value = cotizacion.montoManoObraManual;
    actualizarResumen();
}

function calcularTotalCotizacion() {
    let subtotalMateriales = 0;

    if (cotizacion.tipoServicio === 'decoracion') {
        const articulosDecoracion = [
            ...cotizacion.articulos.paquetes,
            ...cotizacion.articulos.accesorios
        ];

        articulosDecoracion.forEach(item => {
            subtotalMateriales += item.precio * item.cantidad;
        });
        
    } else if (cotizacion.tipoServicio === 'flores') {
        const articulosFlores = [
            ...cotizacion.articulos.flores,
            ...cotizacion.articulos.arreglosFlorales
        ];

        articulosFlores.forEach(item => {
            subtotalMateriales += item.precio * item.cantidad;
        });
    }

    cotizacion.articulos.manuales.forEach(item => {
        subtotalMateriales += (item.precioUnitario * item.cantidad);
    });

    cotizacion.costos.materiales = subtotalMateriales;
    
    if (cotizacion.tipoServicio === 'decoracion') {
        if (cotizacion.tipoManoObra === 'porcentaje') {
            const porcentajeManoObra = cotizacion.costos.manoObraPorcentaje / 100;
            const costoManoObra = subtotalMateriales * porcentajeManoObra;
            cotizacion.costos.manoObra = costoManoObra;
        } else if (cotizacion.tipoManoObra === 'manual') {
            cotizacion.costos.manoObra = cotizacion.montoManoObraManual;
        }
    } else {
        cotizacion.costos.manoObra = 0;
    }

    let totalCalculado = subtotalMateriales;
    
    if (cotizacion.tipoServicio === 'decoracion') {
        totalCalculado += cotizacion.costos.manoObra;
        totalCalculado += cotizacion.costos.transporte;
    }
    
    cotizacion.costos.total = totalCalculado;
}

function actualizarResumen() {
    calcularTotalCotizacion();

    document.getElementById('resumen-cliente').textContent = cotizacion.cliente.nombre || '-';
    document.getElementById('resumen-evento').textContent = cotizacion.tipoEvento || '-';
    
    const servicioText = cotizacion.tipoServicio === 'flores' ? 'Flores Externas' : 
                        cotizacion.tipoServicio === 'decoracion' ? 'Decoración' : '-';
    document.getElementById('resumen-servicio').textContent = servicioText;
    
    document.getElementById('resumen-fecha').textContent = cotizacion.cliente.fechaEvento || '-';

    let totalItems1 = 0;
    let totalItems2 = 0;
    let titulo1 = 'Globos:';
    let titulo2 = 'Accesorios:';
    
    if (cotizacion.tipoServicio === 'decoracion') {
        totalItems1 = cotizacion.articulos.paquetes.filter(a => a.cantidad > 0).length;
        totalItems2 = cotizacion.articulos.accesorios.filter(a => a.cantidad > 0).length;
        titulo1 = 'Globos:';
        titulo2 = 'Accesorios:';
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

    // Calcular total de artículos
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
        manoObraElement.textContent = formatoMonedaRD(cotizacion.costos.manoObra);
        manoObraElement.parentElement.style.display = 'flex';
        
        transporteElement.textContent = formatoMonedaRD(cotizacion.costos.transporte);
        transporteElement.parentElement.style.display = 'flex';
    } else {
        manoObraElement.parentElement.style.display = 'none';
        transporteElement.parentElement.style.display = 'none';
    }
    
    document.getElementById('total-cotizacion').textContent = formatoMonedaRD(cotizacion.costos.total);
    
    const generarBtn = document.getElementById('generar-cotizacion');
    if (generarBtn) {
        generarBtn.disabled = cotizacion.currentStep !== 3 || cotizacion.costos.total === 0;
    }
    
    // Actualizar vista previa del PDF
    if (cotizacion.currentStep === 3) {
        actualizarVistaPreviaPDF();
    }
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
            <div style="color: ${configPDF.mostrarDetalleMateriales ? '#4ecdc4' : '#ff6b6b'}">
                ${configPDF.mostrarDetalleMateriales ? '✓' : '✗'} Detalle de materiales
            </div>
            <div style="color: ${configPDF.mostrarCostoMateriales ? '#4ecdc4' : '#ff6b6b'}">
                ${configPDF.mostrarCostoMateriales ? '✓' : '✗'} Costo de materiales
            </div>
            <div style="color: ${configPDF.mostrarManoObra ? '#4ecdc4' : '#ff6b6b'}">
                ${configPDF.mostrarManoObra ? '✓' : '✗'} Mano de obra
            </div>
            <div style="color: ${configPDF.mostrarTransporte ? '#4ecdc4' : '#ff6b6b'}">
                ${configPDF.mostrarTransporte ? '✓' : '✗'} Transporte
            </div>
        `;
    }
    
    preview.innerHTML = previewHTML;
}

function actualizarTooltipPDF() {
    const btn = document.getElementById('generar-cotizacion');
    const modo = configPDF.mostrarPresupuestoSimple ? 'Modo Presupuesto Simple' : 'Modo Detallado';
    const totalArticulos = parseInt(document.getElementById('total-articulos').textContent) || 0;
    const total = document.getElementById('total-cotizacion').textContent;
    
    btn.title = `Generar PDF en ${modo}\n📊 Artículos: ${totalArticulos}\n💰 Total: ${total}`;
    
    // Actualizar indicador de modo en el botón
    const indicator = document.getElementById('pdf-mode-indicator');
    if (indicator) {
        indicator.textContent = `(${modo})`;
        indicator.style.color = configPDF.mostrarPresupuestoSimple ? '#4ecdc4' : '#8a2be2';
    }
}

// ----------------------------------------------------
// PDF GENERATION - CON LOS DOS MODOS
// ----------------------------------------------------

function generarCotizacionPDF() {
    const { jsPDF } = window.jspdf;
    
    if (typeof jsPDF === 'undefined') {
        mostrarNotificación('❌ Error: La librería jsPDF no se ha cargado correctamente.', 'error');
        return;
    }

    const doc = new jsPDF();
    const total = cotizacion.costos.total;
    
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

    // DETECCIÓN DEL MODO
    if (configPDF.mostrarPresupuestoSimple) {
        generarPDFModoPresupuestoSimple(doc, itemsSeleccionados, total);
    } else {
        generarPDFModoNormal(doc, itemsSeleccionados, total);
    }

    const nombreArchivo = `cotizacion-${cotizacion.cliente.nombre.replace(/ /g, '_') || 'arte-events'}-${new Date().getTime()}.pdf`;
    doc.save(nombreArchivo);

    limpiarCamposCotizacion();
    mostrarNotificación('✅ ¡Cotización generada con éxito!');
}

// ====================================================
// FUNCIONES COMPARTIDAS PARA PDF
// ====================================================

function generarEncabezadoPDF(doc) {
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
        doc.addImage(logoUrl, 'PNG', 20, 5, 25, 25);
    } catch (e) {
        console.log('Logo no cargado, continuando sin logo');
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
    
    doc.setFillColor(0, 0, 0);
    doc.setGState(new doc.GState({opacity: 0.08}));
    doc.rect(0, 40, pageWidth, 5, 'F');
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

// ====================================================
// MODO PRESUPUESTO SIMPLE
// ====================================================

function generarPDFModoPresupuestoSimple(doc, itemsSeleccionados, total) {
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

    // ENCABEZADO
    generarEncabezadoPDF(doc);
    yPos = 55;

    // INFORMACIÓN DE LA COTIZACIÓN
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Fecha de Creación: ${new Date().toLocaleDateString('es-DO')}`, pageWidth - margin, yPos + 10, { align: "right" });
    yPos += 10;

    // INFORMACIÓN DEL CLIENTE
    yPos = generarInformacionClientePDF(doc, yPos);

    // SECCIÓN: DETALLE DE ARTÍCULOS (SOLO NOMBRES Y CANTIDADES)
    if (itemsSeleccionados.length > 0) {
        checkPageBreak(50);

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(138, 43, 226);
        doc.text("Detalle de Artículos y Servicios", margin, yPos);
        yPos += 7;

        doc.setFillColor(245, 245, 245);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 7, 'F');
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(80, 80, 80);
        doc.text("Descripción", margin + 2, yPos + 5);
        doc.text("Cantidad", pageWidth - margin - 5, yPos + 5, { align: "right" });
        
        yPos += 7;

        doc.setFont("helvetica", "normal");
        doc.setTextColor(50, 50, 50);

        itemsSeleccionados.forEach(item => {
            checkPageBreak(5);
            const nombre = item.nombre;
            const cantidad = item.cantidad || 1;
            
            doc.text(nombre, margin + 2, yPos + 4);
            doc.text(cantidad.toString(), pageWidth - margin - 5, yPos + 4, { align: "right" });
            yPos += 6;
        });

        yPos += 10;
    }

    // SECCIÓN: RESUMEN DE COSTOS (SOLO TOTAL)
    checkPageBreak(50);
    
    doc.setDrawColor(138, 43, 226);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
    
    const xCostos = pageWidth - margin - 5;
    
    // SOLO MOSTRAR EL TOTAL
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
    
    // NOTAS (si hay)
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
    
    // PIE DE PÁGINA
    checkPageBreak(20);
    doc.setFillColor(245, 245, 245);
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150);
    
    doc.text("Arte y Events - Decoración Profesional", pageWidth / 2, pageHeight - 10, { align: "center" });
}

// ====================================================
// MODO NORMAL
// ====================================================

function generarPDFModoNormal(doc, itemsSeleccionados, total) {
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

    // ENCABEZADO
    generarEncabezadoPDF(doc);
    yPos = 55;

    // INFORMACIÓN DE LA COTIZACIÓN
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Fecha de Creación: ${new Date().toLocaleDateString('es-DO')}`, pageWidth - margin, yPos + 10, { align: "right" });
    yPos += 10;

    // INFORMACIÓN DEL CLIENTE
    yPos = generarInformacionClientePDF(doc, yPos);

    // SECCIÓN: DETALLE DE ARTÍCULOS (SOLO SI ESTÁ ACTIVADO)
    if (configPDF.mostrarDetalleMateriales && itemsSeleccionados.length > 0) {
        checkPageBreak(50);

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(138, 43, 226);
        doc.text("Detalle de Artículos y Servicios", margin, yPos);
        yPos += 7;

        doc.setFillColor(245, 245, 245);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 7, 'F');
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(80, 80, 80);
        doc.text("Descripción", margin + 2, yPos + 5);
        doc.text("Cant.", pageWidth - margin - 35, yPos + 5);
        doc.text("Precio Total", pageWidth - margin - 5, yPos + 5, { align: "right" });
        
        yPos += 7;

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
    }

    // SECCIÓN: RESUMEN DE COSTOS
    checkPageBreak(50);
    
    doc.setDrawColor(138, 43, 226);
    doc.setLineWidth(0.3);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;
    
    const xCostos = pageWidth - margin - 5;
    
    doc.setFontSize(10);
    
    if (cotizacion.tipoServicio === 'flores') {
        if (configPDF.mostrarCostoMateriales) {
            doc.text("Costo de Materiales:", pageWidth / 2, yPos, { align: "left" });
            doc.text(formatoMonedaRD(cotizacion.costos.materiales), xCostos, yPos, { align: "right" });
            yPos += 5;
        }
        
    } else if (cotizacion.tipoServicio === 'decoracion') {
        if (configPDF.mostrarCostoMateriales) {
            doc.text("Costo de Materiales:", pageWidth / 2, yPos, { align: "left" });
            doc.text(formatoMonedaRD(cotizacion.costos.materiales), xCostos, yPos, { align: "right" });
            yPos += 5;
        }

        if (cotizacion.costos.manoObra > 0 || cotizacion.costos.transporte > 0) {
            if (configPDF.mostrarManoObra && configPDF.mostrarTransporte) {
                if (cotizacion.costos.manoObra > 0) {
                    doc.text("Mano de Obra:", pageWidth / 2, yPos, { align: "left" });
                    doc.text(formatoMonedaRD(cotizacion.costos.manoObra), xCostos, yPos, { align: "right" });
                    yPos += 5;
                }
                
                if (cotizacion.costos.transporte > 0) {
                    doc.text("Transporte:", pageWidth / 2, yPos, { align: "left" });
                    doc.text(formatoMonedaRD(cotizacion.costos.transporte), xCostos, yPos, { align: "right" });
                    yPos += 5;
                }
            } else if (configPDF.mostrarManoObra || configPDF.mostrarTransporte) {
                if (configPDF.mostrarManoObra && cotizacion.costos.manoObra > 0) {
                    doc.text("Mano de Obra:", pageWidth / 2, yPos, { align: "left" });
                    doc.text(formatoMonedaRD(cotizacion.costos.manoObra), xCostos, yPos, { align: "right" });
                    yPos += 5;
                }
                if (configPDF.mostrarTransporte && cotizacion.costos.transporte > 0) {
                    doc.text("Transporte:", pageWidth / 2, yPos, { align: "left" });
                    doc.text(formatoMonedaRD(cotizacion.costos.transporte), xCostos, yPos, { align: "right" });
                    yPos += 5;
                }
            } else {
                const totalInstalacionLogistica = cotizacion.costos.manoObra + cotizacion.costos.transporte;
                if (totalInstalacionLogistica > 0) {
                    doc.text("Instalación y Logística:", pageWidth / 2, yPos, { align: "left" });
                    doc.text(formatoMonedaRD(totalInstalacionLogistica), xCostos, yPos, { align: "right" });
                    yPos += 5;
                }
            }
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
    
    // PIE DE PÁGINA
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
    return fecha.toLocaleDateString('es-DO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function limpiarCamposCotizacion() {
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
    
    cargarFechaActual();
    
    cotizacion.articulos.paquetes.forEach(p => p.cantidad = 0);
    cotizacion.articulos.accesorios.forEach(a => a.cantidad = 0);
    cotizacion.articulos.flores.forEach(f => f.cantidad = 0);
    cotizacion.articulos.arreglosFlorales.forEach(af => af.cantidad = 0);
    cotizacion.articulos.manuales = [];
    
    document.getElementById('costo-transporte').value = 0;
    document.getElementById('porcentaje-mano-obra').value = 30;
    document.getElementById('tipo-mano-obra').value = 'porcentaje';
    document.getElementById('monto-mano-obra-manual').value = 0;
    
    cotizacion.tipoManoObra = 'porcentaje';
    cotizacion.montoManoObraManual = 0;
    
    // Reset checkboxes (todos)
    document.getElementById('mostrar-mano-obra').checked = true;
    document.getElementById('mostrar-transporte').checked = true;
    document.getElementById('mostrar-detalle-materiales').checked = true;
    document.getElementById('mostrar-costo-materiales').checked = true;
    document.getElementById('mostrar-presupuesto-simple').checked = false;
    
    // HABILITAR TODOS los checkboxes al limpiar
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
    actualizarResumen();
    
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
        try {
            const configCargada = JSON.parse(configGuardada);
            
            configuracion.tiposEvento = configCargada.tiposEvento || ['Bodas', 'Cumpleaños', 'Corporativo', 'Baby Shower'];
            configuracion.tematicasEvento = configCargada.tematicasEvento || ['Clásica', 'Moderno', 'Vintage', 'Rústico'];
            configuracion.paquetes = configCargada.paquetes || configuracion.paquetes;
            configuracion.accesorios = configCargada.accesorios || configuracion.accesorios;
            configuracion.flores = configCargada.flores || configuracion.flores;
            configuracion.arreglosFlorales = configCargada.arreglosFlorales || configuracion.arreglosFlorales;
            configuracion.manoObraPorcentaje = configCargada.manoObraPorcentaje || 30;
            
            cotizacion.articulos.paquetes = configuracion.paquetes.map(p => ({...p, cantidad: 0}));
            cotizacion.articulos.accesorios = configuracion.accesorios.map(a => ({...a, cantidad: 0}));
            cotizacion.articulos.flores = configuracion.flores.map(f => ({...f, cantidad: 0}));
            cotizacion.articulos.arreglosFlorales = configuracion.arreglosFlorales.map(af => ({...af, cantidad: 0}));
            cotizacion.costos.manoObraPorcentaje = configuracion.manoObraPorcentaje;
            
        } catch (e) {
            console.error('Error al cargar configuración:', e);
            mostrarNotificación('❌ Error al cargar configuración guardada', 'error');
        }
    }
    
    actualizarTiposEvento();
    actualizarTematicasEvento();
    actualizarResumen();
}

function guardarConfiguracion() {
    configuracion.manoObraPorcentaje = parseFloat(document.getElementById('porcentaje-mano-obra').value) || 0;
    
    const configToSave = {
        tiposEvento: configuracion.tiposEvento,
        tematicasEvento: configuracion.tematicasEvento,
        paquetes: configuracion.paquetes.map(({ id, nombre, precio, emoji }) => ({ id, nombre, precio, emoji: emoji || '🎈' })),
        accesorios: configuracion.accesorios.map(({ id, nombre, precio, emoji }) => ({ id, nombre, precio, emoji: emoji || '✨' })),
        flores: configuracion.flores.map(({ id, nombre, precio, emoji, color }) => ({ id, nombre, precio, emoji: emoji || '🌹', color: color || 'Mixto' })),
        arreglosFlorales: configuracion.arreglosFlorales.map(({ id, nombre, precio, emoji }) => ({ id, nombre, precio, emoji: emoji || '💐' })),
        manoObraPorcentaje: configuracion.manoObraPorcentaje
    };
    
    localStorage.setItem('arteyevents_config', JSON.stringify(configToSave));
    mostrarNotificación('✅ Configuración guardada con éxito.');
    toggleConfig();
    
    cargarConfiguracion();
    actualizarTiposEvento();
    actualizarTematicasEvento();
    renderizarArticulos('paquetes');
    actualizarResumen();
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
    
    // Renderizar tipos de evento
    configuracion.tiposEvento.forEach((tipo, index) => {
        if (configTiposEventoContainer) {
            configTiposEventoContainer.innerHTML += `
                <div class="config-item" data-id="${index}" data-tipo="tipo-evento">
                    <input type="text" placeholder="Nombre del tipo de evento" value="${tipo}" 
                            oninput="actualizarConfigItem('tipo-evento', ${index}, 'nombre', this.value)">
                    <button class="btn-remove" onclick="eliminarConfigItem('tipo-evento', ${index})">×</button>
                </div>
            `;
        }
    });
    
    // Renderizar temáticas de evento
    configuracion.tematicasEvento.forEach((tematica, index) => {
        if (configTematicasContainer) {
            configTematicasContainer.innerHTML += `
                <div class="config-item" data-id="${index}" data-tipo="tematica-evento">
                    <input type="text" placeholder="Nombre de la temática" value="${tematica}" 
                            oninput="actualizarConfigItem('tematica-evento', ${index}, 'nombre', this.value)">
                    <button class="btn-remove" onclick="eliminarConfigItem('tematica-evento', ${index})">×</button>
                </div>
            `;
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

function createConfigItemHTML(tipo, item) {
    if (tipo === 'tipo-evento' || tipo === 'tematica-evento') {
        return `
            <div class="config-item" data-id="${item.id}" data-tipo="${tipo}">
                <input type="text" placeholder="${tipo === 'tematica-evento' ? 'Nombre de la temática' : 'Nombre del tipo de evento'}" value="${item.nombre || ''}" 
                        oninput="actualizarConfigItem('${tipo}', ${item.id}, 'nombre', this.value)">
                <button class="btn-remove" onclick="eliminarConfigItem('${tipo}', ${item.id})">×</button>
            </div>
        `;
    }
    
    if (tipo === 'flor' || tipo === 'flores') {
        return `
            <div class="config-item" data-id="${item.id}" data-tipo="${tipo}">
                <input type="text" placeholder="Nombre" value="${item.nombre || ''}" 
                        oninput="actualizarConfigItem('${tipo}', ${item.id}, 'nombre', this.value)">
                <input type="number" placeholder="Precio" value="${item.precio || 0}" min="0" step="10"
                        oninput="actualizarConfigItem('${tipo}', ${item.id}, 'precio', this.value)">
                <input type="text" placeholder="Color" value="${item.color || 'Mixto'}" 
                        oninput="actualizarConfigItem('${tipo}', ${item.id}, 'color', this.value)">
                <button class="btn-remove" onclick="eliminarConfigItem('${tipo}', ${item.id})">×</button>
            </div>
        `;
    }
    
    return `
        <div class="config-item" data-id="${item.id}" data-tipo="${tipo}">
            <input type="text" placeholder="Nombre" value="${item.nombre || ''}" 
                    oninput="actualizarConfigItem('${tipo}', ${item.id}, 'nombre', this.value)">
            <input type="number" placeholder="Precio" value="${item.precio || 0}" min="0" step="10"
                    oninput="actualizarConfigItem('${tipo}', ${item.id}, 'precio', this.value)">
            <button class="btn-remove" onclick="eliminarConfigItem('${tipo}', ${item.id})">×</button>
        </div>
    `;
}

function agregarTipoEvento() {
    configuracion.tiposEvento.push("");
    renderizarConfiguracion();
    actualizarTiposEvento();
    mostrarNotificación('✅ Nueva casilla para tipo de evento agregada');
    
    setTimeout(() => {
        const configItems = document.querySelectorAll('#config-tipos-evento .config-item');
        if (configItems.length > 0) {
            const lastItem = configItems[configItems.length - 1];
            const input = lastItem.querySelector('input[type="text"]');
            if (input) {
                input.focus();
                input.placeholder = "Escriba el nuevo tipo de evento";
            }
        }
    }, 100);
}

function agregarTematicaEvento() {
    configuracion.tematicasEvento.push("");
    renderizarConfiguracion();
    actualizarTematicasEvento();
    mostrarNotificación('✅ Nueva casilla para temática de evento agregada');
    
    setTimeout(() => {
        const configItems = document.querySelectorAll('#config-tematicas-evento .config-item');
        if (configItems.length > 0) {
            const lastItem = configItems[configItems.length - 1];
            const input = lastItem.querySelector('input[type="text"]');
            if (input) {
                input.focus();
                input.placeholder = "Escriba la nueva temática";
            }
        }
    }, 100);
}

function agregarPaquete() {
    const newId = configIdCounter++;
    configuracion.paquetes.push({ id: newId, nombre: `Nuevo Globo ${newId}`, precio: 0, emoji: '🎈', cantidad: 0, tipo: 'decoracion' });
    renderizarConfiguracion();
}

function agregarAccesorio() {
    const newId = configIdCounter++;
    configuracion.accesorios.push({ id: newId, nombre: `Nuevo Accesorio ${newId}`, precio: 0, emoji: '✨', cantidad: 0, tipo: 'decoracion' });
    renderizarConfiguracion();
}

function agregarFlor() {
    const newId = configIdCounter++;
    configuracion.flores.push({ 
        id: newId, 
        nombre: `Nueva Flor ${newId}`, 
        precio: 0, 
        emoji: '🌹', 
        cantidad: 0, 
        tipo: 'flores', 
        color: 'Mixto' 
    });
    renderizarConfiguracion();
}

function agregarArreglo() {
    const newId = configIdCounter++;
    configuracion.arreglosFlorales.push({ 
        id: newId, 
        nombre: `Nuevo Arreglo ${newId}`, 
        precio: 0, 
        emoji: '💐', 
        cantidad: 0, 
        tipo: 'flores' 
    });
    renderizarConfiguracion();
}

function actualizarConfigItem(tipo, id, campo, valor) {
    let lista;
    switch(tipo) {
        case 'tipo-evento': 
            lista = configuracion.tiposEvento; 
            if (lista[id] !== undefined) {
                lista[id] = valor;
            }
            actualizarTiposEvento();
            return;
        case 'tematica-evento': 
            lista = configuracion.tematicasEvento; 
            if (lista[id] !== undefined) {
                lista[id] = valor;
            }
            actualizarTematicasEvento();
            return;
        case 'paquete': lista = configuracion.paquetes; break;
        case 'accesorio': lista = configuracion.accesorios; break;
        case 'flor': 
        case 'flores': lista = configuracion.flores; break;
        case 'arreglo': lista = configuracion.arreglosFlorales; break;
    }
    
    const item = lista.find(a => a.id === id);
    if (item) {
        if (campo === 'nombre') {
            item.nombre = valor;
        } else if (campo === 'color') {
            item.color = valor;
        } else if (campo === 'precio') {
            item.precio = parseFloat(valor) || 0;
        } else if (campo === 'emoji') {
            item.emoji = valor;
        }
    }
}

function eliminarConfigItem(tipo, id) {
    switch(tipo) {
        case 'tipo-evento': 
            configuracion.tiposEvento.splice(id, 1);
            actualizarTiposEvento();
            break;
        case 'tematica-evento': 
            configuracion.tematicasEvento.splice(id, 1);
            actualizarTematicasEvento();
            break;
        case 'paquete': 
            configuracion.paquetes = configuracion.paquetes.filter(a => a.id !== id); 
            break;
        case 'accesorio': 
            configuracion.accesorios = configuracion.accesorios.filter(a => a.id !== id); 
            break;
        case 'flor':
        case 'flores': 
            configuracion.flores = configuracion.flores.filter(a => a.id !== id); 
            break;
        case 'arreglo': 
            configuracion.arreglosFlorales = configuracion.arreglosFlorales.filter(a => a.id !== id); 
            break;
    }
    renderizarConfiguracion();
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
