import { useState, useEffect } from "react";
import API from "../servicios/api";


function PedidoForm({ onOrderAdded }) {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    direccion: "",
    fecha_solicitud: "",
    fecha_envio: "",
    total: "",
    pagado: [],
    comentario: ""
  });

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };


  // ✅ Manejo especial para checkboxes múltiples
  const handlePagadoChange = (e) => {
    const { value, checked } = e.target;


    if (checked) {
      setForm({
        ...form,
        pagado: [...form.pagado, value]
      });
    } else {
      setForm({
        ...form,
        pagado: form.pagado.filter((metodo) => metodo !== value)
      });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Decodificar JWT para obtener el ID de usuario
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No estás autenticado, por favor inicia sesión de nuevo.");
        return;
      }
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payloadObj = JSON.parse(jsonPayload);
      const userId = payloadObj.sub;

      // Inyectamos el cliente (userId decodificado) en el objeto a enviar
      const pedidoAEnviar = {
        ...form,
        cliente: userId
      };

      await API.post("/pedidos", pedidoAEnviar);
      setShowModal(true); // Mostrar modal en lugar de alert
      setForm({
        nombre: "",
        telefono: "",
        direccion: "",
        fecha_solicitud: "",
        fecha_envio: "",
        total: "",
        pagado: [],
        comentario: ""
      });
      // ✅ Si se pasó la función, la llamamos para actualizar la lista
      if (onOrderAdded) {
        onOrderAdded();
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Error al guardar");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full h-full relative">
      <div className="bg-white shadow-2xl rounded-2xl w-full p-8">
        
        {/* Modal de Éxito */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-auto transform transition-all text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Pedido Registrado!</h3>
              <p className="text-gray-500 mb-6">
                Tu pedido ha sido guardado exitosamente en el sistema.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-colors duration-200"
              >
                Aceptar y Continuar
              </button>
            </div>
          </div>
        )}

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          📦 Registro de Pedido
        </h2>


        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Nombre */}
          <div>
            <label className="block font-medium mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>


          {/* Teléfono */}
          <div>
            <label className="block font-medium mb-1">Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              maxLength="10"
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          {/* Dirección */}
          <div>
            <label className="block font-medium mb-1">Dirección</label>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>


          {/* Métodos de Pago */}
          <div>
            <label className="block font-medium mb-2">
              Métodos de Pago
            </label>


            <div className="grid grid-cols-2 gap-3">


              {["Efectivo", "Transferencia", "Tarjeta", "Depósito"].map((metodo) => (
                <label
                  key={metodo}
                  className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg cursor-pointer hover:bg-indigo-100 transition"
                >
                  <input
                    type="checkbox"
                    value={metodo}
                    checked={form.pagado.includes(metodo)}
                    onChange={handlePagadoChange}
                    className="accent-indigo-600"
                  />
                  <span>{metodo}</span>
                </label>
              ))}


            </div>
          </div>


 {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Fecha Solicitud
              </label>
              <input
                type="date"
                name="fecha_solicitud"
                value={form.fecha_solicitud}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>


            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Fecha Envío
              </label>
              <input
                type="date"
                name="fecha_envio"
                value={form.fecha_envio}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>
          </div>


          {/* Total */}
          <div>
            <label className="block font-medium mb-1">Total ($)</label>
            <input
              type="number"
              name="total"
              value={form.total}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>


          {/* Comentario */}
          <div>
            <label className="block font-medium mb-1">Comentario</label>
            <textarea
              name="comentario"
              value={form.comentario}
              onChange={handleChange}
              rows="3"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-300"
          >
            {loading ? "Guardando..." : "Guardar Pedido"}
          </button>


        </form>
      </div>
    </div>
  );
}


export default PedidoForm;
