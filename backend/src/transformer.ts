import { LegacyInput, DashboardOutput, PedidoFormateado, LegacyPedido } from './types';

const BADGE_MAP: Record<string, string> = {
  'PENDIENTE': 'warning',
  'ENVIADO': 'info',
  'ENTREGADO': 'success',
  'CANCELADO': 'danger'
};

const PAGO_MAP: Record<string, string> = {
  'TARJETA_CREDITO': 'Tarjeta de Crédito',
  'TARJETA_DEBITO': 'Tarjeta de Débito',
  'TRANSFERENCIA': 'Transferencia'
};

const formatearFecha = (isoString: string): string => {
  const date = new Date(isoString);
  const dia = date.getUTCDate().toString().padStart(2, '0');
  const mes = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const anio = date.getUTCFullYear();
  return `${dia}/${mes}/${anio}`;
};

const capitalizar = (texto: string): string => {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

export const transformarDatos = (input: LegacyInput): DashboardOutput => {
  const pedidosOut: PedidoFormateado[] = [];
  const ciudadesSet = new Set<string>();
  const clientesSet = new Set<string>();
  
  let totalItems = 0;
  let montoBruto = 0;
  let montoDescuentos = 0;
  let montoNeto = 0;
  const conteoEstados: Record<string, number> = {
    'PENDIENTE': 0, 'ENVIADO': 0, 'ENTREGADO': 0
  };

  input.pedidos.forEach((p: LegacyPedido) => {
    let pSubtotal = 0;
    let pDescuento = 0;
    
    
    const pCantidadItems = p.items.length; 

    p.items.forEach(item => {
      const precioTotalItem = item.precio_unitario * item.cantidad;
      
     
      // Esto elimina los decimales .5 antes de sumar al total
      const descuentoItem = Math.round(precioTotalItem * (item.descuento_porcentaje / 100));
      
      pSubtotal += precioTotalItem;
      pDescuento += descuentoItem;
    });

    const pTotal = pSubtotal - pDescuento;

    totalItems += pCantidadItems;
    montoBruto += pSubtotal;
    montoDescuentos += pDescuento;
    montoNeto += pTotal;
    
    if (conteoEstados[p.estado] !== undefined) {
      conteoEstados[p.estado]++;
    } else {
      conteoEstados[p.estado] = 1;
    }

    ciudadesSet.add(p.cliente.direccion.ciudad);
    clientesSet.add(p.cliente.email);

    pedidosOut.push({
      id: p.pedido_id,
      fecha: formatearFecha(p.fecha_creacion),
      cliente_nombre: p.cliente.nombre_completo,
      cliente_email: p.cliente.email,
      ciudad: p.cliente.direccion.ciudad,
      estado: capitalizar(p.estado),
      estado_badge: (BADGE_MAP[p.estado] || 'secondary') as any,
      metodo_pago: PAGO_MAP[p.metodo_pago] || p.metodo_pago,
      cantidad_items: pCantidadItems,
      subtotal: Math.round(pSubtotal),
      descuento: Math.round(pDescuento),
      total: Math.round(pTotal),
      tiene_notas: p.notas !== null && p.notas !== ""
    });
  });

  return {
    resumen: {
      total_pedidos: input.pedidos.length,
      total_items: totalItems,
      monto_total_bruto: Math.round(montoBruto),
      monto_total_descuentos: Math.round(montoDescuentos),
      monto_total_neto: Math.round(montoNeto),
      pedidos_por_estado: conteoEstados
    },
    pedidos_formateados: pedidosOut,
    clientes_unicos: clientesSet.size,
    ciudades: Array.from(ciudadesSet).sort()
  };
};