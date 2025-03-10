import { createContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { helperPeticionesHttp } from "../helpers/helper-peticiones-http";

/* CREANDO CONTEXTO */

/* 1er -> Creación del contexto */
const CarritoContext = createContext();
/* 2do -> El armado del provider */
const CarritoProvider = ({ children }) => {
  const url = import.meta.env.VITE_BACKEND_CARRITOS;

  const [agregarAlCarrito, eliminarDelCarrito, limpiarCarrito, carrito] =
    useLocalStorage("carrito", []);

  function elProductoEstaEnCarrito(producto) {
    console.log("Analizo si el producto esta en el carrito");
    const nuevoArray = carrito.filter((prod) => prod.id === producto.id);
    return nuevoArray.length;
  }

  function obtenerProductodeCarrito(producto) {
    return carrito.find((prod) => prod.id === producto.id);
  }

  const agregarProductoAlCarritoContext = (producto) => {
    console.log(producto);

    if (!elProductoEstaEnCarrito(producto)) {
      producto.cantidad = 1;
      agregarAlCarrito(producto);
    } else {
      const productoDeCarrito = obtenerProductodeCarrito(producto);
      console.log(productoDeCarrito);
      productoDeCarrito.cantidad++;
      window.localStorage.setItem("carrito", JSON.stringify(carrito));
    }
  };

  const eliminarProductoDelCarritoContext = (id) => {
    console.log(id);
    eliminarDelCarrito(id);
  };

  const limpiarCarritoContext = () => {
    limpiarCarrito();
  };

  const guardarCarritoContext = async (carrito) => {
    console.log(carrito);
    console.log(JSON.stringify(carrito));

    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carrito),
      };
      const losProductosEnElCarrito = await helperPeticionesHttp(url, options);
      console.log(losProductosEnElCarrito);
    } catch (error) {
      console.log("[guardarCarritoContext]", error);
    }
  };

  const data = {
    carrito,
    agregarProductoAlCarritoContext,
    eliminarProductoDelCarritoContext,
    guardarCarritoContext,
    limpiarCarritoContext,
  };

  return (
    <CarritoContext.Provider value={data}>{children}</CarritoContext.Provider>
  );
};
/* 3ero -> Exportaciones */
export { CarritoProvider };
export default CarritoContext;
