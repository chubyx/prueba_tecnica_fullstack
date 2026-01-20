import { useEffect, useState, useMemo } from 'react';
import './App.css';
import type { DashboardOutput, PedidoFormateado } from './types';

function App() {
  const [data, setData] = useState<DashboardOutput | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para los Bonus (+10 pts)
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [orden, setOrden] = useState<{ key: keyof PedidoFormateado; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/pedidos')
      .then(res => {
        if (!res.ok) throw new Error('Error de conexión');
        return res.json();
      })
      .then(setData)
      .catch(err => {
        console.error(err);
        setError('No se pudo cargar la información.');
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, []);

  // Lógica de Filtrado y Ordenamiento
  const pedidosProcesados = useMemo(() => {
    if (!data) return [];
    
    let resultado = [...data.pedidos_formateados];

    // 1. Filtro por Estado (+5 pts)
    if (filtroEstado) {
      resultado = resultado.filter(p => p.estado === filtroEstado);
    }

    // 2. Ordenamiento (+5 pts)
    if (orden) {
      resultado.sort((a, b) => {
        const valorA = a[orden.key];
        const valorB = b[orden.key];

        if (valorA < valorB) return orden.direction === 'asc' ? -1 : 1;
        if (valorA > valorB) return orden.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return resultado;
  }, [data, filtroEstado, orden]);

  const handleSort = (key: keyof PedidoFormateado) => {
    setOrden(prev => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Helper para mostrar flechita de orden
  const getSortIcon = (key: keyof PedidoFormateado) => {
    if (orden?.key !== key) return '↕';
    return orden.direction === 'asc' ? '↑' : '↓';
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="container"><div className="error">{error}</div></div>;
  if (!data) return null;

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Dashboard de Pedidos</h1>
        
        {/* BONUS: Selector de Filtro */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ fontWeight: 600, color: '#4b5563' }}>Filtrar por:</label>
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{ padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db' }}
          >
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Enviado">Enviado</option>
            <option value="Entregado">Entregado</option>
          </select>
        </div>
      </div>

      {/* BONUS: Tarjetas de Resumen (+5 pts) */}
      <div className="stats-grid">
        <div className="card">
          <h3>Total Ventas</h3>
          <p className="value moneda">${data.resumen.monto_total_neto.toLocaleString('es-CL')}</p>
        </div>
        <div className="card">
          <h3>Pedidos</h3>
          <p className="value">{data.resumen.total_pedidos}</p>
        </div>
        <div className="card">
          <h3>Items</h3>
          <p className="value">{data.resumen.total_items}</p>
        </div>
        <div className="card">
          <h3>Clientes</h3>
          <p className="value">{data.clientes_unicos}</p>
        </div>
      </div>

      {/* BONUS: Tabla con Ordenamiento (+5 pts) */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>ID {getSortIcon('id')}</th>
              <th onClick={() => handleSort('fecha')} style={{ cursor: 'pointer' }}>Fecha {getSortIcon('fecha')}</th>
              <th onClick={() => handleSort('cliente_nombre')} style={{ cursor: 'pointer' }}>Cliente {getSortIcon('cliente_nombre')}</th>
              <th>Ciudad</th>
              <th>Estado</th>
              <th>Pago</th>
              <th onClick={() => handleSort('total')} style={{ cursor: 'pointer' }}>Total {getSortIcon('total')}</th>
            </tr>
          </thead>
          <tbody>
            {pedidosProcesados.map((pedido) => (
              <tr key={pedido.id}>
                <td><b>{pedido.id}</b></td>
                <td>{pedido.fecha}</td>
                <td>
                  {pedido.cliente_nombre}
                  <br />
                  <small style={{ color: '#888' }}>{pedido.cliente_email}</small>
                </td>
                <td>{pedido.ciudad}</td>
                <td>
                  <span className={`badge ${pedido.estado_badge}`}>
                    {pedido.estado}
                  </span>
                </td>
                <td>{pedido.metodo_pago}</td>
                <td className="moneda">
                  ${pedido.total.toLocaleString('es-CL')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;