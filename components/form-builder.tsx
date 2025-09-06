"use client"

import { useState, useEffect } from "react"
import { DragDropContext, type DropResult } from "@hello-pangea/dnd"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { FormElementsSidebar } from "@/components/form-elements-sidebar"
import { FormCanvas } from "@/components/form-canvas"
import { PropertiesPanel } from "@/components/properties-panel"
import { type FormElement, createNewElement } from "@/components/form-element-renderer"
import { RotateCcw, Lightbulb } from "lucide-react"

interface FormBuilderProps {
  formElements: FormElement[]
  setFormElements: (elements: FormElement[]) => void
  formTitle: string
  setFormTitle: (title: string) => void
}

export function FormBuilder({ formElements, setFormElements, formTitle, setFormTitle }: FormBuilderProps) {
  const [selectedElement, setSelectedElement] = useState<FormElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    setHasUnsavedChanges(true)
  }, [formElements, formTitle])

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false)

    if (!result.destination) {
      return
    }

    const { source, destination, draggableId } = result

    // Prevent dropping in invalid locations
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    // If dragging from sidebar to canvas
    if (source.droppableId === "sidebar" && destination.droppableId === "canvas") {
      const elementType = draggableId as FormElement["type"]
      const newElement = createNewElement(elementType)

      const newElements = [...formElements]
      newElements.splice(destination.index, 0, newElement)
      setFormElements(newElements)
      setSelectedElement(newElement)

      toast.success(`Added ${newElement.label} to form`, {
        description: "You can customize it in the properties panel",
      })
    }

    // If reordering within canvas
    if (source.droppableId === "canvas" && destination.droppableId === "canvas") {
      const newElements = Array.from(formElements)
      const [reorderedItem] = newElements.splice(source.index, 1)
      newElements.splice(destination.index, 0, reorderedItem)
      setFormElements(newElements)

      toast.success("Element reordered", {
        description: "Form element position updated",
      })
    }
  }

  const updateElement = (elementId: string, updates: Partial<FormElement>) => {
    setFormElements(formElements.map((el) => (el.id === elementId ? { ...el, ...updates } : el)))
    if (selectedElement?.id === elementId) {
      setSelectedElement({ ...selectedElement, ...updates })
    }
  }

  const deleteElement = (elementId: string) => {
    const elementToDelete = formElements.find((el) => el.id === elementId)
    setFormElements(formElements.filter((el) => el.id !== elementId))
    if (selectedElement?.id === elementId) {
      setSelectedElement(null)
    }

    if (elementToDelete) {
      toast.success(`Deleted ${elementToDelete.label}`, {
        description: "Element removed from form",
      })
    }
  }

  const duplicateElement = (elementId: string) => {
    const elementToDuplicate = formElements.find((el) => el.id === elementId)
    if (!elementToDuplicate) return

    const duplicatedElement: FormElement = {
      ...elementToDuplicate,
      id: `${elementToDuplicate.type}-${Date.now()}`,
      label: `${elementToDuplicate.label} (Copy)`,
    }

    const elementIndex = formElements.findIndex((el) => el.id === elementId)
    const newElements = [...formElements]
    newElements.splice(elementIndex + 1, 0, duplicatedElement)
    setFormElements(newElements)
    setSelectedElement(duplicatedElement)

    toast.success(`Duplicated ${elementToDuplicate.label}`, {
      description: "Copy created below original element",
    })
  }

  const clearForm = () => {
    setFormElements([])
    setSelectedElement(null)
    setFormTitle("My first form")
    toast.success("Form cleared", {
      description: "All elements have been removed",
    })
  }

  const createContactForm = () => {
    const elements: FormElement[] = [
      createNewElement("text"),
      createNewElement("email"),
      createNewElement("textarea"),
      createNewElement("button"),
    ]

    elements[0].label = "Full Name"
    elements[0].placeholder = "Enter your full name"
    elements[0].required = true

    elements[1].label = "Email Address"
    elements[1].placeholder = "Enter your email"
    elements[1].required = true

    elements[2].label = "Message"
    elements[2].placeholder = "Enter your message"
    elements[2].required = true

    elements[3].label = "Send Message"

    setFormElements(elements)
    setFormTitle("Contact Us")
    setSelectedElement(null)

    toast.success("Contact form template loaded!", {
      description: "A basic contact form has been created",
    })
  }

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className={`flex h-[calc(100vh-73px)] transition-all ${isDragging ? "select-none" : ""}`}>
        {/* Sidebar with form elements */}
        <FormElementsSidebar isDragging={isDragging} />

        {/* Main canvas area */}
        <div className="flex-1 flex">
          <div className="flex-1 p-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="form-title" className="text-sm font-medium">
                  Form Title {hasUnsavedChanges && <span className="text-destructive">*</span>}
                </Label>
                <div className="flex items-center gap-2">
                  {formElements.length === 0 && (
                    <Button variant="outline" size="sm" onClick={createContactForm} className="gap-2 bg-transparent">
                      <Lightbulb className="h-4 w-4" />
                      Quick Start
                    </Button>
                  )}
                  {formElements.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearForm} className="gap-2 bg-transparent">
                      <RotateCcw className="h-4 w-4" />
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
              <Input
                id="form-title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="text-xl font-semibold border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Enter form title"
              />
            </div>

            <FormCanvas
              formElements={formElements}
              selectedElement={selectedElement}
              onSelectElement={setSelectedElement}
              onDeleteElement={deleteElement}
              onDuplicateElement={duplicateElement}
              isDragging={isDragging}
            />
          </div>

          {/* Properties panel */}
          {selectedElement && (
            <PropertiesPanel
              element={selectedElement}
              onUpdateElement={updateElement}
              onClose={() => setSelectedElement(null)}
            />
          )}
        </div>
      </div>
    </DragDropContext>
  )
}
