import { useState, useEffect } from "react";
import API from "../servicios/api";

function PedidoList({ refreshKey }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const response = await API.get("/pedidos");
        setPedidos(response.data);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, [refreshKey]);

  return (
    <div className="bg-white shadow-2xl rounded-2xl w-full p-8 h-full flex flex-col">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        📋 Lista de Pedidos
      </h2>

      {loading ? (
        <div className="flex justify-center items-center flex-grow text-gray-500">
          Cargando pedidos...
        </div>
      ) : pedidos.length === 0 ? (
        <div className="flex justify-center items-center flex-grow text-gray-500 text-lg">
          No hay pedidos registrados aún.
        </div>
      ) : (
        <div className="overflow-y-auto flex-grow max-h-[600px] pr-2 space-y-4">
          {pedidos.map((pedido) => (
            <div
              key={pedido._id}
              className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition bg-gray-50"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-indigo-700">
                  {pedido.nombre}
                </h3>
                <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                  ${pedido.total}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-800">Teléfono:</span> {pedido.telefono}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Dirección:</span> {pedido.direccion}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Pedido el:</span>{" "}
                  {new Date(pedido.fecha_solicitud).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium text-gray-800">Envío el:</span>{" "}
                  {new Date(pedido.fecha_envio).toLocaleDateString()}
                </p>
              </div>

              {pedido.pagado && pedido.pagado.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-800 mt-1">Pago:</span>
                  {pedido.pagado.map((metodo, idx) => (
                    <span
                      key={idx}
                      className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md"
                    >
                      {metodo}
                    </span>
                  ))}
                </div>
              )}

              {pedido.comentario && (
                <div className="mt-3 text-sm italic text-gray-500 border-t pt-2 border-gray-200">
                  &quot;{pedido.comentario}&quot;
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PedidoList;
