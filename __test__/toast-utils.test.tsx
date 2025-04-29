import { render, screen } from "@testing-library/react"
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/app/components/ui/toast"

describe("Toast component", () => {
  it("renders title and description", () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>Título</ToastTitle>
          <ToastDescription>Descripción</ToastDescription>
        </Toast>
        <ToastViewport />
      </ToastProvider>
    )

    expect(screen.getByText("Título")).toBeInTheDocument()
    expect(screen.getByText("Descripción")).toBeInTheDocument()
  })
})
