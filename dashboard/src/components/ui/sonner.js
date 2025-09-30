import * as React from "react"
import { toast as sonnerToast } from "sonner"

const Toaster = ({ ...props }) => {
  return (
    <div {...props}>
      {/* Sonner toast provider is automatically handled */}
    </div>
  )
}

export { Toaster, sonnerToast as toast }