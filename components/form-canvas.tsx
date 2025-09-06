"use client"

import { Droppable, Draggable } from "@hello-pangea/dnd"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FormElementRenderer, type FormElement } from "@/components/form-element-renderer"
import { Trash2, GripVertical, Copy } from "lucide-react"

interface FormCanvasProps {
  formElements: FormElement[]
  selectedElement: FormElement | null
  onSelectElement: (element: FormElement) => void
  onDeleteElement: (elementId: string) => void
  onDuplicateElement: (elementId: string) => void
  isDragging: boolean
}

export function FormCanvas({
  formElements,
  selectedElement,
  onSelectElement,
  onDeleteElement,
  onDuplicateElement,
  isDragging,
}: FormCanvasProps) {
  return (
    <Card className="flex-1 p-6 min-h-[600px]">
      <Droppable droppableId="canvas">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`min-h-full space-y-4 transition-all duration-200 ${
              snapshot.isDraggingOver ? "bg-primary/5 border-2 border-dashed border-primary rounded-lg p-4" : ""
            } ${isDragging ? "bg-muted/20" : ""}`}
          >
            {formElements.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-64 text-center">
                <div className="max-w-md">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <GripVertical className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Start building your form</h3>
                  <p className="text-muted-foreground text-sm">
                    Drag components from the sidebar to add them to your form. You can reorder and customize each
                    element.
                  </p>
                </div>
              </div>
            )}

            {snapshot.isDraggingOver && formElements.length === 0 && (
              <div className="flex items-center justify-center h-32 text-center border-2 border-dashed border-primary rounded-lg bg-primary/5 animate-pulse">
                <div>
                  <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
                    <GripVertical className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-primary font-medium">Drop your component here</p>
                </div>
              </div>
            )}

            {formElements.map((element, index) => (
              <Draggable key={element.id} draggableId={element.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`group relative transition-all duration-200 ${
                      snapshot.isDragging ? "shadow-xl rotate-1 z-50 scale-105" : ""
                    }`}
                  >
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedElement?.id === element.id
                          ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20"
                          : "border-border hover:border-primary/50 hover:shadow-sm"
                      } ${snapshot.isDragging ? "bg-background shadow-lg" : ""}`}
                      onClick={() => onSelectElement(element)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          {...provided.dragHandleProps}
                          className={`transition-all duration-200 cursor-grab active:cursor-grabbing mt-1 p-1 rounded hover:bg-muted ${
                            isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground hover:text-primary" />
                        </div>

                        {/* Form Element */}
                        <div className="flex-1 min-w-0">
                          <FormElementRenderer element={element} isPreview={false} />
                        </div>

                        <div
                          className={`flex items-center gap-1 transition-all duration-200 ${
                            isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-primary hover:bg-primary/10 mt-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              onDuplicateElement(element.id)
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeleteElement(element.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {selectedElement?.id === element.id && (
                        <div className="absolute -inset-px bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg pointer-events-none animate-pulse" />
                      )}
                    </div>

                    {snapshot.isDragging && (
                      <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Card>
  )
}
