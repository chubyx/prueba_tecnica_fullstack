// --- INTERFACES DE ENTRADA (Lo que viene del Legacy) ---
export interface LegacyItem {
    sku: string;
    nombre_producto: string;
    cantidad: number;
    precio_unitario: number;
    descuento_porcentaje: number;
  }
  
  export interface LegacyCliente {
    id: string;
    nombre_completo: string;
    email: string;
    direccion: {
      calle: string;
      ciudad: string;
      codigo_postal: string;
      pais: string;
    };
  }
  
  export interface LegacyPedido {
    pedido_id: string;
    fecha_creacion: string;
    cliente: LegacyCliente;
    items: LegacyItem[];
    estado: string;
    metodo_pago: string;
    notas: string | null;
  }
  
  export interface LegacyInput {
    pedidos: LegacyPedido[];
    metadata: any;
  }
  
  // --- INTERFACES DE SALIDA (Para tu Dashboard) ---
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