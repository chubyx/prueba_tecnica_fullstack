import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { transformarDatos } from './transformer';

const app = express();
app.use(cors());

// __dirname fix: Usamos path.resolve para asegurar que encuentre el archivo
// independientemente de desde dónde se ejecute el script
const dataPath = path.resolve(__dirname, 'data.json');

// Agregamos los tipos Request y Response explícitamente
app.get('/api/pedidos', (req: Request, res: Response) => {
  try {
    // Verificamos si existe el archivo antes de leerlo
    if (!fs.existsSync(dataPath)) {
        res.status(500).json({ error: 'El archivo data.json no existe en: ' + dataPath });
        return;
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const jsonInput = JSON.parse(rawData);
    
    const dashboardData = transformarDatos(jsonInput);
    
    res.json(dashboardData);
  } catch (error) {
    console.error('Error procesando datos:', error);
    res.status(500).json({ error: 'Error interno del servidor transformando datos' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});