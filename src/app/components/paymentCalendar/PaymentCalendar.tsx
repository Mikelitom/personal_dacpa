import { ChevronLeft, ChevronRight } from "lucide-react"; // Importa íconos de lucide-react

// Componente funcional PaymentCalendar
export default function PaymentCalendar()  {
  // Días de la semana
  const daysOfWeek: string[] = ['D', 'L', 'Mi', 'Ju', 'Vi', 'S', 'Do'];
  
  // Función para renderizar los días del calendario
  const renderCalendarDays = () => {
    return [...Array(31)].map((_, i) => ( // Crea un array de 31 elementos
      <div 
        key={i} 
        className={`p-2 ${i + 1 === 30 ? 'bg-pink-500 text-white rounded-full' : ''}`} // Resalta el día 30
      >
        {i + 1} {/* Muestra el número del día */}
      </div>
    ));
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4"> {/* Contenedor principal del calendario */}
      <h2 className="text-lg font-semibold mb-4 text-center">Próximo Pago</h2> {/* Título del calendario */}
      <div className="bg-white rounded-lg shadow-sm p-4"> {/* Contenedor del calendario */}
        {/* Encabezado del calendario */}
        <div className="flex justify-between items-center mb-4"> {/* Contenedor para los botones de navegación */}
          <button className="text-gray-500 hover:text-pink-500"> {/* Botón para retroceder */}
            <ChevronLeft size={20} />
          </button>
          <span className="font-semibold">November 2024</span> {/* Muestra el mes y año actual */}
          <button className="text-gray-500 hover:text-pink-500"> {/* Botón para avanzar */}
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500"> {/* Contenedor para los días de la semana */}
          {daysOfWeek.map((day) => (
            <div key={day}>{day}</div> // Muestra cada día de la semana
          ))}
        </div>

        {/* Días del calendario */}
        <div className="grid grid-cols-7 text-center text-sm"> {/* Contenedor para los días del mes */}
          {renderCalendarDays()} {/* Llama a la función para renderizar los días */}
        </div>
      </div>
    </div>
  );
};