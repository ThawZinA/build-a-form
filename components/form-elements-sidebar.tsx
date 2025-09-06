"use client"

import { Droppable, Draggable } from "@hello-pangea/dnd"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Type, Hash, AlignLeft, List, CheckSquare, Circle, Calendar, Mail, MousePointer } from "lucide-react"

const formElements = [
  { id: "text", label: "Text Input", icon: Type, description: "Single line text input", category: "Input" },
  { id: "number", label: "Number Input", icon: Hash, description: "Numeric input field", category: "Input" },
  { id: "email", label: "Email Input", icon: Mail, description: "Email address input", category: "Input" },
  { id: "date", label: "Date Picker", icon: Calendar, description: "Date selection input", category: "Input" },
  { id: "textarea", label: "Text Area", icon: AlignLeft, description: "Multi-line text input", category: "Input" },
  { id: "select", label: "Select Input", icon: List, description: "Dropdown selection", category: "Choice" },
  { id: "checkbox", label: "Checkbox", icon: CheckSquare, description: "Single checkbox option", category: "Choice" },
  { id: "radio", label: "Radio Button", icon: Circle, description: "Multiple choice selection", category: "Choice" },
  { id: "button", label: "Button", icon: MousePointer, description: "Submit or action button", category: "Action" },
]

interface FormElementsSidebarProps {
  isDragging: boolean
}

export function FormElementsSidebar({ isDragging }: FormElementsSidebarProps) {
  return (
    <div
      className={`w-72 bg-sidebar border-r border-sidebar-border transition-all duration-200 ${
        isDragging ? "shadow-lg" : ""
      }`}
    >
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground mb-1">Form Elements</h2>
        <p className="text-sm text-sidebar-foreground/70">Drag elements to the canvas to build your form</p>
      </div>

      <div className="p-4">
        <Droppable droppableId="sidebar" isDropDisabled={true}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {formElements.map((element, index) => (
                <Draggable key={element.id} draggableId={element.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`p-4 cursor-grab active:cursor-grabbing transition-all duration-200 ${
                        snapshot.isDragging
                          ? "shadow-xl rotate-2 bg-sidebar-accent border-sidebar-primary scale-105 z-50"
                          : "hover:bg-sidebar-accent/50 border-sidebar-border hover:shadow-md hover:scale-102"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            element.category === "Input"
                              ? "bg-blue-100 text-blue-600"
                              : element.category === "Choice"
                                ? "bg-green-100 text-green-600"
                                : "bg-orange-100 text-orange-600"
                          }`}
                        >
                          <element.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-sidebar-foreground text-sm">{element.label}</h3>
                            <Badge
                              variant="secondary"
                              className={`text-xs px-2 py-0 ${
                                element.category === "Input"
                                  ? "bg-blue-50 text-blue-700"
                                  : element.category === "Choice"
                                    ? "bg-green-50 text-green-700"
                                    : "bg-orange-50 text-orange-700"
                              }`}
                            >
                              {element.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-sidebar-foreground/60 leading-relaxed">{element.description}</p>
                        </div>
                      </div>

                      {snapshot.isDragging && (
                        <div className="absolute inset-0 border-2 border-dashed border-sidebar-primary rounded-lg bg-sidebar-primary/5" />
                      )}
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  )
}
