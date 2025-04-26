document.addEventListener('DOMContentLoaded', function() {
    // Datos de ejemplo de productos (REEMPLAZA CON TUS DATOS REALES)
    const productos = [
        { id: 1, nombre: 'Chaqueta Casual', precio: 29.99, imagen: './assets/img/chaqueta.png' },
        { id: 2, nombre: 'Camiseta femenina', precio: 79.99, imagen: './assets/img/camiseta.png' },
        { id: 3, nombre: 'Ropa deportiva', precio: 49.99, imagen: './assets/img/deportivos.png' },
        { id: 4, nombre: 'Camiseta Estampada', precio: 25.50, imagen: './assets/img/estampada.png' },
        { id: 5, nombre: 'Falda Mini', precio: 65.00, imagen: './assets/img/minifalda.png' },
        { id: 6, nombre: 'Vestido Lino Fresco', precio: 89.95, imagen: './assets/img/vestido.png' },
        { id: 7, nombre: 'Camiseta Casual', precio: 35.00, imagen: './assets/img/camiseta1.jpg' },
        { id: 8, nombre: 'Pantalón Jean', precio: 55.00, imagen: './assets/img/pantalon1.jpg' },
        { id: 9, nombre: 'Zapatos Deportivos', precio: 75.00, imagen: './assets/img/zapatillas1.jpg' }
        // Agrega aquí más productos...
    ];

    const listaProductosInicio = document.getElementById('lista-productos'); // Para la página de inicio
    const listaProductosPagina = document.querySelector('.row#lista-productos'); // Para la página de productos
    const listaCarrito = document.getElementById('lista-carrito');
    const precioTotalElement = document.getElementById('precio-total');
    let carrito = [];

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
                            <button class="btn btn-dark btn-agregar-carrito" data-id="${producto.id}">Agregar al carrito</button>
                        </div>
                    </div>
                `;
                listaProductosInicio.appendChild(divProducto);
            });
        }
    }

    function mostrarProductosEnPagina() {
        if (listaProductosPagina) {
            listaProductosPagina.querySelectorAll('.producto').forEach((productoDiv, index) => {
                const productoData = productos[index];
                if (productoData) {
                    const botonComprar = productoDiv.querySelector('.btn-dark');
                    if (botonComprar) {
                        botonComprar.classList.add('btn-agregar-carrito');
                        botonComprar.dataset.id = productoData.id;
                    }
                }
            });
        }
    }

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
        }
    }

    function eliminarDelCarrito(id) {
        carrito = carrito.filter(producto => producto.id !== parseInt(id));
        actualizarCarrito();
    }

    function actualizarCarrito() {
        listaCarrito.innerHTML = '';
        let total = 0;
        carrito.forEach(item => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            listItem.innerHTML = `
                <div>
                    ${item.nombre} x ${item.cantidad}
                </div>
                <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
                <button class="btn btn-sm btn-danger btn-eliminar-item" data-id="${item.id}"><i class="bi bi-trash"></i></button>
            `;
            listaCarrito.appendChild(listItem);
            total += item.precio * item.cantidad;
        });
        precioTotalElement.textContent = total.toFixed(2);
        guardarCarritoEnLocalStorage();
    }

    // Event listeners para agregar productos
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-agregar-carrito')) {
            const idProducto = e.target.dataset.id;
            agregarAlCarrito(idProducto);
        }
    });

    // Event listener para eliminar productos del carrito
    listaCarrito.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-eliminar-item')) {
            const idProducto = e.target.dataset.id;
            eliminarDelCarrito(idProducto);
        }
    });

    function cargarCarritoDesdeLocalStorage() {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
            actualizarCarrito();
        }
    }

    function guardarCarritoEnLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    mostrarProductosEnInicio();
    mostrarProductosEnPagina();
    cargarCarritoDesdeLocalStorage();
});
