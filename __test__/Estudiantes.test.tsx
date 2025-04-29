import { render, screen, within } from "@testing-library/react"
import { Estudiantes } from "@/app/components/profile/tabs/Estudiantes"
import { Database } from "@/app/lib/types"

type Alumno = Database['public']['Tables']['Alumno']['Row']

const estudiantes: Alumno[] = [
  {
    id_alumno: 1,
    id_padre: 10,
    nombre: "Juan",
    apellido_paterno: "Pérez",
    apellido_materno: "López",
    fecha_nacimiento: "2010-05-12",
    grado: "3",
    grupo: "A",
    ciclo_escolar: "2024-2025",
    fecha_inscripción: "2024-08-15",
    estado: "Activo",
    convenio: true,
  },
]

describe("<Estudiantes />", () => {
  it("renderiza tabs y contenido cuando hay estudiantes", () => {
    render(<Estudiantes hijosData={estudiantes} />)

    expect(screen.getByText(/Juan Pérez López/)).toBeInTheDocument()
    expect(screen.getByText(/Matrícula:/)).toBeInTheDocument()

    // 🛠️ Corregido: busca "1" dentro del contenedor de "Matrícula:"
    const matriculaContainer = screen.getByText(/Matrícula:/).closest("div")!
    expect(within(matriculaContainer).getByText("1")).toBeInTheDocument()

    // Academic Info
    expect(screen.getByText(/Información Académica/)).toBeInTheDocument()
    const gradoGrupo = screen.getAllByText("3A");
    expect(gradoGrupo.length).toBeGreaterThan(1);

    expect(screen.getByText("2024-2025")).toBeInTheDocument()
    expect(screen.getByText("2024-08-15")).toBeInTheDocument()
    expect(screen.getAllByText("Activo")[0]).toBeInTheDocument()
  })
})
