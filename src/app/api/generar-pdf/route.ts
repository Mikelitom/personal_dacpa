import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tipo = searchParams.get("tipo") || "estadoCuenta";
  const estudianteId = searchParams.get("estudianteId") || "todos";
  const fechaInicio = searchParams.get("fechaInicio");
  const fechaFin = searchParams.get("fechaFin");

  // Simulación de datos
  const estudiantes = {
    est1: "Ana Pérez González",
    est2: "Carlos Pérez González",
    todos: "Todos los estudiantes",
  };

  const nombreEstudiante = estudiantes[estudianteId as keyof typeof estudiantes] || "Estudiante no encontrado";
  const fechaActual = new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Intl.DateTimeFormat("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dateStr));
  };

  const reporteId = `REP-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  
  // Seleccionar la plantilla HTML según el tipo de reporte
  let html = '';
  
  if (tipo === "estadoCuenta") {
    html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Estado de Cuenta</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: #fff;
          color: #222;
          margin: 40px;
        }
        .encabezado {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 3px solid #f06292;
          padding-bottom: 10px;
          margin-bottom: 30px;
        }
        .logo {
          width: 90px;
        }
        .titulo {
          text-align: right;
        }
        .titulo h1 {
          margin: 0;
          font-size: 28px;
          color: #e91e63;
        }
        .titulo h2 {
          margin: 0;
          font-size: 18px;
          font-weight: normal;
          color: #555;
        }
        .badge {
          background-color: #f8bbd0;
          padding: 4px 10px;
          border-radius: 6px;
          display: inline-block;
          font-size: 13px;
          color: #222;
          margin-top: 6px;
        }
        .info-section {
          background-color: #fce4ec;
          border: 2px solid #f8bbd0;
          border-radius: 12px;
          padding: 15px;
          margin-bottom: 30px;
        }
        .info-section p {
          margin: 5px 0;
          font-size: 15px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #f8bbd0;
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #f06292;
          color: white;
        }
        tbody tr:nth-child(even) {
          background-color: #fdf2f7;
        }
        .totales {
          margin-top: 30px;
          background-color: #fce4ec;
          border: 2px solid #f8bbd0;
          border-radius: 12px;
          padding: 15px;
        }
        .totales p {
          font-size: 15px;
          margin: 6px 0;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 13px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="encabezado">
        <img src="https://i.imgur.com/SIWKQYb.png" alt="Logo Colegio DACPA" class="logo">
        <div class="titulo">
          <h1>Colegio DACPA</h1>
          <h2>Estado de Cuenta</h2>
          <div class="badge">Generado el: ${fechaActual}</div>
        </div>
      </div>
      <div class="info-section">
        <p><strong>Padre de Familia:</strong> Juan Pérez Ramírez</p>
        <p><strong>Alumno:</strong> ${nombreEstudiante}</p>
        <p><strong>ID del Reporte:</strong> ${reporteId}</p>
        <p><strong>Periodo:</strong> ${formatDate(fechaInicio)} - ${formatDate(fechaFin)}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Fecha de Pago</th>
            <th>Concepto</th>
            <th>Monto</th>
            <th>Folio</th>
            <th>Forma de Pago</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>05/02/2025</td>
            <td>Colegiatura Febrero</td>
            <td>$1,200.00</td>
            <td>F00120</td>
            <td>Transferencia</td>
            <td>Pagado</td>
          </tr>
          <tr>
            <td>05/03/2025</td>
            <td>Colegiatura Marzo</td>
            <td>$1,200.00</td>
            <td>F00230</td>
            <td>Mercado Pago</td>
            <td>Pagado</td>
          </tr>
          <tr>
            <td>10/04/2025</td>
            <td>Paquete de Libros</td>
            <td>$850.00</td>
            <td>F00300</td>
            <td>Tarjeta</td>
            <td>Pendiente</td>
          </tr>
        </tbody>
      </table>
      <div class="totales">
        <p><strong>Total Pagado:</strong> $2,400.00</p>
        <p><strong>Total Pendiente:</strong> $850.00</p>
        <p><strong>Último pago registrado:</strong> 05/03/2025</p>
      </div>
      <div class="footer">
        Colegio DACPA · Av. Conocimiento #123, Ciudad del Saber · contacto@dacpa.edu.mx
      </div>
    </body>
    </html>
    `;
  } else if (tipo === "comprasProductos") {
    html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Reporte de Compras - DACPA</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: #fff;
          color: #222;
          margin: 40px;
        }
        .encabezado {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 3px solid #f06292;
          padding-bottom: 10px;
          margin-bottom: 30px;
        }
        .logo {
          width: 90px;
        }
        .titulo {
          text-align: right;
        }
        .titulo h1 {
          margin: 0;
          font-size: 28px;
          color: #e91e63;
        }
        .titulo h2 {
          margin: 0;
          font-size: 18px;
          font-weight: normal;
          color: #555;
        }
        .badge {
          background-color: #f8bbd0;
          padding: 4px 10px;
          border-radius: 6px;
          display: inline-block;
          font-size: 13px;
          color: #222;
          margin-top: 6px;
        }
        .info-section {
          background-color: #fce4ec;
          border: 2px solid #f8bbd0;
          border-radius: 12px;
          padding: 15px;
          margin-bottom: 30px;
        }
        .info-section p {
          margin: 5px 0;
          font-size: 15px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #f8bbd0;
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #f06292;
          color: white;
        }
        tbody tr:nth-child(even) {
          background-color: #fdf2f7;
        }
        .totales {
          margin-top: 30px;
          background-color: #fce4ec;
          border: 2px solid #f8bbd0;
          border-radius: 12px;
          padding: 15px;
        }
        .totales p {
          font-size: 15px;
          margin: 6px 0;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 13px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="encabezado">
        <img src="https://i.imgur.com/SIWKQYb.png" alt="Logo Colegio DACPA" class="logo">
        <div class="titulo">
          <h1>Colegio DACPA</h1>
          <h2>Reporte de Compras</h2>
          <div class="badge">Generado el: ${fechaActual}</div>
        </div>
      </div>
      <div class="info-section">
        <p><strong>Padre de Familia:</strong> Juan Pérez Ramírez</p>
        <p><strong>Estudiante:</strong> ${nombreEstudiante}</p>
        <p><strong>ID del Reporte:</strong> ${reporteId}</p>
        <p><strong>Periodo:</strong> ${formatDate(fechaInicio)} - ${formatDate(fechaFin)}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>07/02/2025</td>
            <td>Paquete de Libros 2° Primaria</td>
            <td>Libros</td>
            <td>1</td>
            <td>$850.00</td>
            <td>Entregado</td>
          </tr>
          <tr>
            <td>10/03/2025</td>
            <td>Uniforme Deportivo</td>
            <td>Uniformes</td>
            <td>1</td>
            <td>$450.00</td>
            <td>Entregado</td>
          </tr>
          <tr>
            <td>15/04/2025</td>
            <td>Material Didáctico</td>
            <td>Útiles</td>
            <td>1</td>
            <td>$300.00</td>
            <td>Pendiente</td>
          </tr>
        </tbody>
      </table>
      <div class="totales">
        <p><strong>Total Gastado:</strong> $1,300.00</p>
        <p><strong>Total Pendiente:</strong> $300.00</p>
      </div>
      <div class="footer">
        Colegio DACPA · Av. Conocimiento #123, Ciudad del Saber · contacto@dacpa.edu.mx
      </div>
    </body>
    </html>
    `;
  } else if (tipo === "pagosColegiatura") {
    html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Reporte de Pagos de Colegiatura - DACPA</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: #fff;
          color: #222;
          margin: 40px;
        }
        .encabezado {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 3px solid #f06292;
          padding-bottom: 10px;
          margin-bottom: 30px;
        }
        .logo {
          width: 90px;
        }
        .titulo {
          text-align: right;
        }
        .titulo h1 {
          margin: 0;
          font-size: 28px;
          color: #e91e63;
        }
        .titulo h2 {
          margin: 0;
          font-size: 18px;
          font-weight: normal;
          color: #555;
        }
        .badge {
          background-color: #f8bbd0;
          padding: 4px 10px;
          border-radius: 6px;
          display: inline-block;
          font-size: 13px;
          color: #222;
          margin-top: 6px;
        }
        .info-section {
          background-color: #fce4ec;
          border: 2px solid #f8bbd0;
          border-radius: 12px;
          padding: 15px;
          margin-bottom: 30px;
        }
        .info-section p {
          margin: 5px 0;
          font-size: 15px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #f8bbd0;
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #f06292;
          color: white;
        }
        tbody tr:nth-child(even) {
          background-color: #fdf2f7;
        }
        .totales {
          margin-top: 30px;
          background-color: #fce4ec;
          border: 2px solid #f8bbd0;
          border-radius: 12px;
          padding: 15px;
        }
        .totales p {
          font-size: 15px;
          margin: 6px 0;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 13px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="encabezado">
        <img src="https://i.imgur.com/SIWKQYb.png" alt="Logo Colegio DACPA" class="logo">
        <div class="titulo">
          <h1>Colegio DACPA</h1>
          <h2>Pagos de Colegiatura</h2>
          <div class="badge">Generado el: ${fechaActual}</div>
        </div>
      </div>
      <div class="info-section">
        <p><strong>Padre de Familia:</strong> Juan Pérez Ramírez</p>
        <p><strong>Estudiante:</strong> ${nombreEstudiante}</p>
        <p><strong>ID del Reporte:</strong> ${reporteId}</p>
        <p><strong>Periodo:</strong> ${formatDate(fechaInicio)} - ${formatDate(fechaFin)}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Alumno</th>
            <th>Mes</th>
            <th>Fecha de Pago</th>
            <th>Monto</th>
            <th>Forma de Pago</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${nombreEstudiante}</td>
            <td>Febrero</td>
            <td>05/02/2025</td>
            <td>$1,200.00</td>
            <td>Transferencia</td>
            <td>Pagado</td>
          </tr>
          <tr>
            <td>${nombreEstudiante}</td>
            <td>Marzo</td>
            <td>05/03/2025</td>
            <td>$1,200.00</td>
            <td>Mercado Pago</td>
            <td>Pagado</td>
          </tr>
          <tr>
            <td>${nombreEstudiante}</td>
            <td>Abril</td>
            <td>-</td>
            <td>$1,200.00</td>
            <td>-</td>
            <td>Pendiente</td>
          </tr>
        </tbody>
      </table>
      <div class="totales">
        <p><strong>Total Pagado:</strong> $2,400.00</p>
        <p><strong>Total Pendiente:</strong> $1,200.00</p>
      </div>
      <div class="footer">
        Colegio DACPA · Av. Conocimiento #123, Ciudad del Saber · contacto@dacpa.edu.mx
      </div>
    </body>
    </html>
    `;
  } else {
    // Plantilla por defecto para otros tipos de reporte
    html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { text-align: left; }
        </style>
      </head>
      <body>
        <h1>Reporte - ${tipo}</h1>
        <p><strong>Alumno:</strong> ${nombreEstudiante}</p>
        <p><strong>ID del Reporte:</strong> ${reporteId}</p>
        <p><strong>Periodo:</strong> ${formatDate(fechaInicio)} - ${formatDate(fechaFin)}</p>
        <p>Este reporte no tiene un formato específico definido.</p>
      </body>
    </html>
    `;
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    
    // Configuración para imprimir
    const pdfBuffer = await page.pdf({ 
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px"
      }
    });
    
    await browser.close();

    // Crear nombre de archivo más descriptivo
    const nombreReporte = obtenerNombreReporte(tipo);
    const nombreArchivo = `${reporteId}-${estudianteId}-${nombreReporte}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${nombreArchivo}"`,
      },
    });
  } catch (error) {
    console.error("Error al generar PDF:", error);
    return new NextResponse(JSON.stringify({ error: "Error al generar el PDF" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

// Función para obtener el nombre descriptivo del reporte
function obtenerNombreReporte(tipo: string): string {
  switch (tipo) {
    case "estadoCuenta":
      return "EstadoDeCuenta";
    case "pagosColegiatura":
      return "PagosColegiatura";
    case "comprasProductos":
      return "ComprasProductos";
    default:
      return "Reporte";
  }
}