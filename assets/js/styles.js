document.addEventListener('DOMContentLoaded', function() {
    // Datos de ejemplo de productos
    const productos = [
        { id: 1, nombre: 'Chaqueta Casual', precio: 29.99, imagen: './assets/img/chaqueta.png', categoria: 'casual' },
        { id: 2, nombre: 'Camiseta femenina', precio: 79.99, imagen: './assets/img/camiseta.png', categoria: 'casual' },
        { id: 3, nombre: 'Ropa deportiva', precio: 49.99, imagen: './assets/img/deportivos.png', categoria: 'deportiva' },
        { id: 4, nombre: 'Camiseta Estampada', precio: 25.50, imagen: './assets/img/estampada.png', categoria: 'casual' },
        { id: 5, nombre: 'Falda Mini', precio: 65.00, imagen: './assets/img/minifalda.png', categoria: 'formal' },
        { id: 6, nombre: 'Vestido Lino Fresco', precio: 89.95, imagen: './assets/img/vestido.png', categoria: 'formal' },
    ];

    const listaProductosInicio = document.getElementById('lista-productos-inicio'); // Para la página de inicio
    const listaProductosPagina = document.getElementById('lista-productos'); // Para la página de productos
    const listaCarrito = document.getElementById('lista-carrito');
    const precioTotalElement = document.getElementById('precio-total');
    const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
    const btnVaciarCarrito = document.getElementById('btn-vaciar-carrito');
    const contadorCarrito = document.getElementById('contador-carrito');
    const filtrosCategorias = document.getElementById('filtros-categorias');
    
    let carrito = [];

    // Contador de visitas
    function inicializarContadorVisitas() {
        let visitas = localStorage.getItem('visitas');
        if (!visitas) {
            visitas = 0;
        } else {
            visitas = parseInt(visitas);
        }
        
        // Incrementar solo si es una nueva sesión
        if (!sessionStorage.getItem('sesionActiva')) {
            visitas++;
            sessionStorage.setItem('sesionActiva', 'true');
            localStorage.setItem('visitas', visitas.toString());
        }
        
        // Mostrar contador de visitas
        const contadorVisitas = document.getElementById('contador-visitas');
        if (contadorVisitas) {
            contadorVisitas.textContent = visitas;
        }
    }

    // Mostrar productos en la página de inicio
    function mostrarProductosEnInicio() {
        if (listaProductosInicio) {
            productos.slice(0, 3).forEach(producto => { // Mostrar solo los primeros 3 en inicio
                const divProducto = document.createElement('div');
                divProducto.classList.add('col-md-4', 'mb-4');
                divProducto.innerHTML = `
                    <div class="card">
                        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" style="height: 300px; object-fit: cover;">
                        <div class="card-body text-center">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">$${producto.precio.toFixed(2)}</p>
                            <p class="badge bg-secondary">${producto.categoria}</p>
                            <button class="btn btn-dark btn-agregar-carrito" data-id="${producto.id}">Agregar al carrito</button>
                        </div>
                    </div>
                `;
                listaProductosInicio.appendChild(divProducto);
            });
        }
    }

    // Mostrar todos los productos en la página de productos
    function mostrarTodosLosProductos() {
        if (listaProductosPagina) {
            listaProductosPagina.innerHTML = '';
            productos.forEach(producto => {
                const divProducto = document.createElement('div');
                divProducto.classList.add('col-md-4', 'producto');
                divProducto.dataset.categoria = producto.categoria;
                divProducto.innerHTML = `
                    <div class="card">
                        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">$${producto.precio.toFixed(2)}</p>
                            <p class="badge bg-secondary">${producto.categoria}</p>
                            <a href="#" class="btn btn-dark btn-agregar-carrito" data-id="${producto.id}">Comprar</a>
                        </div>
                    </div>
                `;
                listaProductosPagina.appendChild(divProducto);
            });
        }
    }

    // Inicializar filtros de categorías
    function inicializarFiltros() {
        if (filtrosCategorias) {
            // Obtener categorías únicas
            const categorias = [...new Set(productos.map(p => p.categoria))];
            
            // Crear los botones de filtro
            categorias.forEach(categoria => {
                const btn = document.createElement('button');
                btn.classList.add('btn', 'btn-outline-dark', 'mx-1', 'mb-3');
                btn.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);
                btn.dataset.categoria = categoria;
                btn.addEventListener('click', filtrarPorCategoria);
                filtrosCategorias.appendChild(btn);
            });
            
            // Botón para mostrar todos
            const btnTodos = document.createElement('button');
            btnTodos.classList.add('btn', 'btn-dark', 'mx-1', 'mb-3');
            btnTodos.textContent = 'Todos';
            btnTodos.dataset.categoria = 'todos';
            btnTodos.addEventListener('click', filtrarPorCategoria);
            filtrosCategorias.prepend(btnTodos);
        }
    }

    // Filtrar productos por categoría
    function filtrarPorCategoria(e) {
        const categoriaSeleccionada = e.target.dataset.categoria;
        
        // Actualizar clases de los botones
        const botones = filtrosCategorias.querySelectorAll('button');
        botones.forEach(btn => {
            btn.classList.remove('btn-dark');
            btn.classList.add('btn-outline-dark');
        });
        e.target.classList.remove('btn-outline-dark');
        e.target.classList.add('btn-dark');
        
        // Filtrar productos
        const productos = listaProductosPagina.querySelectorAll('.producto');
        productos.forEach(producto => {
            if (categoriaSeleccionada === 'todos' || producto.dataset.categoria === categoriaSeleccionada) {
                producto.style.display = 'block';
            } else {
                producto.style.display = 'none';
            }
        });
    }

    // Agregar producto al carrito
    function agregarAlCarrito(id) {
        const productoSeleccionado = productos.find(producto => producto.id === parseInt(id));
        if (productoSeleccionado) {
            const existe = carrito.some(item => item.id === productoSeleccionado.id);
            if (existe) {
                carrito = carrito.map(item => {
                    if (item.id === productoSeleccionado.id) {
                        item.cantidad++;
                    }
                    return item;
                });
            } else {
                productoSeleccionado.cantidad = 1;
                carrito = [...carrito, productoSeleccionado];
            }
            actualizarCarrito();

            // Notificar al usuario
            alert(`"${productoSeleccionado.nombre}" agregado al carrito`);
        }
    }

    // Eliminar producto del carrito
    function eliminarDelCarrito(id) {
        carrito = carrito.filter(producto => producto.id !== parseInt(id));
        actualizarCarrito();
    }

    // Vaciar completamente el carrito
    function vaciarCarrito() {
        carrito = [];
        actualizarCarrito();
        alert('El carrito ha sido vaciado');
    }

    // Actualizar la visualización del carrito
    function actualizarCarrito() {
        if (listaCarrito) {
            listaCarrito.innerHTML = '';
            let total = 0;
            let cantidadTotal = 0;
            
            if (carrito.length === 0) {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item', 'text-center');
                listItem.textContent = 'El carrito está vacío';
                listaCarrito.appendChild(listItem);
            } else {
                carrito.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
                    listItem.innerHTML = `
                        <div>
                            <img src="${item.imagen}" alt="${item.nombre}" style="width: 50px; height: 50px; object-fit: cover;" class="me-2">
                            ${item.nombre} x ${item.cantidad}
                        </div>
                        <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
                        <button class="btn btn-sm btn-danger btn-eliminar-item" data-id="${item.id}"><i class="bi bi-trash"></i></button>
                    `;
                    listaCarrito.appendChild(listItem);
                    total += item.precio * item.cantidad;
                    cantidadTotal += item.cantidad;
                });
            }
            
            if (precioTotalElement) {
                precioTotalElement.textContent = total.toFixed(2);
            }

            // Actualizar contador de productos
            if (contadorCarrito) {
                contadorCarrito.textContent = cantidadTotal;
                contadorCarrito.style.display = cantidadTotal > 0 ? 'inline-block' : 'none';
            }
            
            guardarCarritoEnLocalStorage();
        }
    }

    // Guardar carrito en localStorage
    function guardarCarritoEnLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // Cargar carrito desde localStorage
    function cargarCarritoDesdeLocalStorage() {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
            actualizarCarrito();
        }
    }

    // Event listeners para botones
    document.addEventListener('click', function(e) {
        // Para agregar productos al carrito
        if (e.target.classList.contains('btn-agregar-carrito')) {
            e.preventDefault();
            const idProducto = e.target.getAttribute('data-id');
            agregarAlCarrito(idProducto);
        }
        
        // Para eliminar productos del carrito
        if (e.target.classList.contains('btn-eliminar-item') || 
            (e.target.parentElement && e.target.parentElement.classList.contains('btn-eliminar-item'))) {
            const boton = e.target.classList.contains('btn-eliminar-item') ? e.target : e.target.parentElement;
            const idProducto = boton.getAttribute('data-id');
            eliminarDelCarrito(idProducto);
        }
    });

    // Finalizar compra
    if (btnFinalizarCompra) {
        btnFinalizarCompra.addEventListener('click', function() {
            if (carrito.length > 0) {
                alert('¡Gracias por tu compra! Tu pedido será procesado pronto.');
                carrito = [];
                actualizarCarrito();
            } else {
                alert('Tu carrito está vacío. Agrega algunos productos antes de finalizar la compra.');
            }
        });
    }

    // Vaciar carrito
    if (btnVaciarCarrito) {
        btnVaciarCarrito.addEventListener('click', vaciarCarrito);
    }

    // Inicializar la tienda
    inicializarContadorVisitas();
    mostrarProductosEnInicio();
    mostrarTodosLosProductos();
    inicializarFiltros();
    cargarCarritoDesdeLocalStorage();
});
