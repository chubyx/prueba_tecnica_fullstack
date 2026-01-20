export interface DashboardResumen {
  total_pedidos: number;
  total_items: number;
  monto_total_bruto: number;
  monto_total_descuentos: number;
  monto_total_neto: number;
  pedidos_por_estado: Record<string, number>;
}

export interface PedidoFormateado {
  id: string;
  fecha: string;
  cliente_nombre: string;
  cliente_email: string;
  ciudad: string;
  estado: string;
  estado_badge: 'warning' | 'info' | 'success' | 'danger' | 'secondary';
  metodo_pago: string;
  cantidad_items: number;
  subtotal: number;
  descuento: number;
  total: number;
  tiene_notas: boolean;
}

export interface DashboardOutput {
  resumen: DashboardResumen;
  pedidos_formateados: PedidoFormateado[];
  clientes_unicos: number;
  ciudades: string[];
}