document.addEventListener('DOMContentLoaded', function() {
  // Datos de ejemplo de productos (reemplaza esto con tu lógica real para obtener productos)
  const productos = [
    { id: 1, nombre: 'Camiseta Casual', precio: 29.99, imagen: './assets/img/camiseta1.jpg' },
    { id: 2, nombre: 'Chaqueta Invierno', precio: 79.99, imagen: './assets/img/chaqueta1.jpg' },
    { id: 3, nombre: 'Pantalón Deportivo', precio: 49.99, imagen: './assets/img/pantalon1.jpg' },
    { id: 4, nombre: 'Vestido Floral', precio: 59.99, imagen: './assets/img/vestido1.jpg' },
    { id: 5, nombre: 'Zapatillas Urbanas', precio: 69.99, imagen: './assets/img/zapatillas1.jpg' }
  ];

  const listaProductos = document.getElementById('lista-productos'); // Asegúrate de tener un elemento con este ID en tu HTML para mostrar los productos
  const listaCarrito = document.getElementById('lista-carrito');
  const precioTotalElement = document.getElementById('precio-total');
  let carrito = [];

  // Función para mostrar los productos en la página de inicio
  function mostrarProductos() {
    if (listaProductos) {
      productos.forEach(producto => {
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
        listaProductos.appendChild(divProducto);
      });
    }
  }

  // Función para agregar un producto al carrito
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

  // Función para eliminar un producto del carrito
  function eliminarDelCarrito(id) {
    carrito = carrito.filter(producto => producto.id !== parseInt(id));
    actualizarCarrito();
  }

  // Función para actualizar la visualización del carrito
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
    guardarCarritoEnLocalStorage(); // Opcional: guardar el carrito en el almacenamiento local
  }

  // Event listener para agregar productos al carrito
  if (listaProductos) {
    listaProductos.addEventListener('click', function(e) {
      if (e.target.classList.contains('btn-agregar-carrito')) {
        const idProducto = e.target.getAttribute('data-id');
        agregarAlCarrito(idProducto);
      }
    });
  }

  // Event listener para eliminar productos del carrito
  listaCarrito.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-eliminar-item')) {
      const idProducto = e.target.getAttribute('data-id');
      eliminarDelCarrito(idProducto);
    }
  });

  // Opcional: cargar el carrito desde el almacenamiento local al cargar la página
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

  // Llamadas iniciales
  mostrarProductos();
  cargarCarritoDesdeLocalStorage(); // Si implementas el almacenamiento local
});