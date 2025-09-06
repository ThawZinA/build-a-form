"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface FormElement {
  id: string
  type: "text" | "textarea" | "select" | "checkbox" | "radio" | "number" | "email" | "date" | "button"
  label: string
  placeholder?: string
  required?: boolean
  options?: string[]
  properties?: Record<string, any>
}

interface FormElementRendererProps {
  element: FormElement
  isPreview?: boolean
  className?: string
}

export function FormElementRenderer({ element, isPreview = false, className = "" }: FormElementRendererProps) {
  const baseProps = {
    className: `w-full ${element.required ? "required" : ""} ${className}`,
    placeholder: element.placeholder,
    required: isPreview ? element.required : false,
    disabled: !isPreview,
    name: isPreview ? element.id : undefined,
    id: isPreview ? element.id : `preview-${element.id}`,
  }

  const renderElement = () => {
    switch (element.type) {
      case "text":
        return <Input {...baseProps} type="text" />

      case "number":
        return <Input {...baseProps} type="number" />

      case "email":
        return <Input {...baseProps} type="email" />

      case "date":
        return <Input {...baseProps} type="date" />

      case "textarea":
        return <Textarea {...baseProps} rows={4} />

      case "select":
        return (
          <Select disabled={!isPreview} required={isPreview ? element.required : false} name={baseProps.name}>
            <SelectTrigger className={className}>
              <SelectValue placeholder={element.placeholder || "Select an option"} />
            </SelectTrigger>
            <SelectContent>
              {element.options?.map((option, index) => (
                <SelectItem key={index} value={option.toLowerCase().replace(/\s+/g, "-")}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "checkbox":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={baseProps.id}
              name={baseProps.name}
              required={isPreview ? element.required : false}
              disabled={!isPreview}
              value="checked"
            />
            <Label
              htmlFor={baseProps.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {element.label}
            </Label>
          </div>
        )

      case "radio":
        return (
          <RadioGroup required={isPreview ? element.required : false} disabled={!isPreview} name={baseProps.name}>
            {element.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.toLowerCase().replace(/\s+/g, "-")}
                  id={`${baseProps.id}-${index}`}
                  disabled={!isPreview}
                />
                <Label htmlFor={`${baseProps.id}-${index}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "button":
        return (
          <Button type={isPreview ? "submit" : "button"} className="w-auto" disabled={!isPreview}>
            {element.label}
          </Button>
        )

      default:
        return <Input {...baseProps} />
    }
  }

  return (
    <div className="space-y-2">
      {element.type !== "checkbox" && element.type !== "button" && (
        <Label htmlFor={baseProps.id} className="text-sm font-medium">
          {element.label}
          {element.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {renderElement()}
    </div>
  )
}

export function getElementIcon(type: FormElement["type"]) {
  const iconMap = {
    text: "Type",
    number: "Hash",
    email: "Mail",
    date: "Calendar",
    textarea: "AlignLeft",
    select: "List",
    checkbox: "CheckSquare",
    radio: "Circle",
    button: "MousePointer",
  }
  return iconMap[type] || "Type"
}

export function getElementLabel(type: FormElement["type"]) {
  const labelMap = {
    text: "Text Input",
    number: "Number Input",
    email: "Email Input",
    date: "Date Picker",
    textarea: "Text Area",
    select: "Select Input",
    checkbox: "Checkbox",
    radio: "Radio Button",
    button: "Button",
  }
  return labelMap[type] || "Form Element"
}

export function createNewElement(type: FormElement["type"]): FormElement {
  const baseElement = {
    id: `${type}-${Date.now()}`,
    type,
    label: getElementLabel(type),
    required: false,
  }

  switch (type) {
    case "button":
      return {
        ...baseElement,
        label: "Submit",
      }

    case "select":
    case "radio":
      return {
        ...baseElement,
        placeholder: type === "select" ? "Choose an option" : undefined,
        options: ["Option 1", "Option 2", "Option 3"],
      }

    case "checkbox":
      return {
        ...baseElement,
        label: "I agree to the terms and conditions",
      }

    default:
      return {
        ...baseElement,
        placeholder: `Enter ${type === "textarea" ? "your message" : type}`,
      }
  }
}
