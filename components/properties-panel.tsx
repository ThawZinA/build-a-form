"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { X, Plus, Trash2 } from "lucide-react"

interface FormElement {
  id: string
  type: "text" | "textarea" | "select" | "checkbox" | "radio" | "number" | "email" | "date" | "button"
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
  properties?: Record<string, any>
}

interface PropertiesPanelProps {
  element: FormElement
  onUpdateElement: (elementId: string, updates: Partial<FormElement>) => void
  onClose: () => void
}

export function PropertiesPanel({ element, onUpdateElement, onClose }: PropertiesPanelProps) {
  const [localOptions, setLocalOptions] = useState(element.options || [])

  const handleUpdate = (field: keyof FormElement, value: any) => {
    onUpdateElement(element.id, { [field]: value })
  }

  const addOption = () => {
    const newOptions = [...localOptions, `Option ${localOptions.length + 1}`]
    setLocalOptions(newOptions)
    handleUpdate("options", newOptions)
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...localOptions]
    newOptions[index] = value
    setLocalOptions(newOptions)
    handleUpdate("options", newOptions)
  }

  const removeOption = (index: number) => {
    const newOptions = localOptions.filter((_, i) => i !== index)
    setLocalOptions(newOptions)
    handleUpdate("options", newOptions)
  }

  const hasOptions = element.type === "select" || element.type === "radio"

  return (
    <Card className="w-80 p-4 border-l">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Properties</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Element Type */}
        <div>
          <Label className="text-sm font-medium">Element Type</Label>
          <div className="mt-1 p-2 bg-muted rounded text-sm capitalize">{element.type}</div>
        </div>

        {/* Label */}
        <div>
          <Label htmlFor="element-label" className="text-sm font-medium">
            Label
          </Label>
          <Input
            id="element-label"
            value={element.label}
            onChange={(e) => handleUpdate("label", e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Placeholder */}
        {element.type !== "checkbox" && element.type !== "radio" && element.type !== "button" && (
          <div>
            <Label htmlFor="element-placeholder" className="text-sm font-medium">
              Placeholder
            </Label>
            <Input
              id="element-placeholder"
              value={element.placeholder || ""}
              onChange={(e) => handleUpdate("placeholder", e.target.value)}
              className="mt-1"
            />
          </div>
        )}

        {/* Required */}
        {element.type !== "button" && (
          <div className="flex items-center justify-between">
            <Label htmlFor="element-required" className="text-sm font-medium">
              Required
            </Label>
            <Switch
              id="element-required"
              checked={element.required || false}
              onCheckedChange={(checked) => handleUpdate("required", checked)}
            />
          </div>
        )}

        {/* Options */}
        {hasOptions && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">Options</Label>
              <Button variant="outline" size="sm" onClick={addOption}>
                <Plus className="h-3 w-3 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {localOptions.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1"
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
