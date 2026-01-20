import { transformarDatos } from './transformer';
import { LegacyInput } from './types';

// Mock de datos de prueba pequeños
const mockInput: LegacyInput = {
  pedidos: [
    {
      pedido_id: "TEST-001",
      fecha_creacion: "2024-01-01T10:00:00Z",
      cliente: {
        id: "U1",
        nombre_completo: "Juan Test",
        email: "juan@test.com",
        direccion: { calle: "A", ciudad: "Santiago", codigo_postal: "1", pais: "Chile" }
      },
      items: [
        { sku: "A", nombre_producto: "Prod A", cantidad: 1, precio_unitario: 1000, descuento_porcentaje: 0 },
        { sku: "B", nombre_producto: "Prod B", cantidad: 2, precio_unitario: 500, descuento_porcentaje: 10 }
      ],
      estado: "PENDIENTE",
      metodo_pago: "TARJETA_CREDITO",
      notas: "Nota test"
    }
  ],
  metadata: {}
};

describe('Pruebas de Transformación de Datos', () => {
  
  test('Debe calcular correctamente los totales del pedido', () => {
    const resultado = transformarDatos(mockInput);
    const pedido = resultado.pedidos_formateados[0];

    // Cálculo manual esperado:
    // Item 1: 1 * 1000 = 1000 (0 descuento)
    // Item 2: 2 * 500 = 1000 (10% descuento = 100) -> 900
    // Total esperado: 1900
    
    expect(pedido.subtotal).toBe(2000); // 1000 + 1000
    expect(pedido.descuento).toBe(100); // 0 + 100
    expect(pedido.total).toBe(1900);
  });

  test('Debe formatear el estado y asignar badge correcto', () => {
    const resultado = transformarDatos(mockInput);
    const pedido = resultado.pedidos_formateados[0];

    expect(pedido.estado).toBe('Pendiente'); // Capitalizado
    expect(pedido.estado_badge).toBe('warning'); // PENDIENTE = warning
  });

  test('Debe generar el resumen del dashboard correctamente', () => {
    const resultado = transformarDatos(mockInput);
    
    expect(resultado.resumen.total_pedidos).toBe(1);
    expect(resultado.resumen.monto_total_neto).toBe(1900);
    expect(resultado.clientes_unicos).toBe(1);
  });
});