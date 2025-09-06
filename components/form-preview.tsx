"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FormElementRenderer, type FormElement } from "@/components/form-element-renderer"
import { Eye, EyeOff, Smartphone, Tablet, Monitor, RotateCcw } from "lucide-react"
import { toast } from "sonner"

interface FormPreviewProps {
  formElements: FormElement[]
  formTitle: string
}

type ViewportSize = "mobile" | "tablet" | "desktop"

export function FormPreview({ formElements, formTitle }: FormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [showValidation, setShowValidation] = useState(false)
  const [viewportSize, setViewportSize] = useState<ViewportSize>("desktop")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowValidation(true)
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const formDataEntries = new FormData(e.target as HTMLFormElement)
    const submittedData = Object.fromEntries(formDataEntries.entries())

    console.log("Form submitted with data:", submittedData)
    toast.success("Form submitted successfully!", {
      description: "All form data has been processed.",
    })

    setIsSubmitting(false)
    setFormData(submittedData)
  }

  const resetForm = () => {
    setFormData({})
    setShowValidation(false)
    const form = document.querySelector("form") as HTMLFormElement
    form?.reset()
    toast.success("Form reset", {
      description: "All fields have been cleared.",
    })
  }

  const getViewportClasses = () => {
    switch (viewportSize) {
      case "mobile":
        return "max-w-sm"
      case "tablet":
        return "max-w-md"
      case "desktop":
        return "max-w-2xl"
      default:
        return "max-w-2xl"
    }
  }

  const getViewportIcon = (size: ViewportSize) => {
    switch (size) {
      case "mobile":
        return Smartphone
      case "tablet":
        return Tablet
      case "desktop":
        return Monitor
    }
  }

  const requiredFields = formElements.filter((el) => el.required && el.type !== "button")
  const totalFields = formElements.filter((el) => el.type !== "button").length

  return (
    <div className="p-6">
      {/* Preview Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Form Preview</h2>
          <div className="flex items-center gap-2">
            {(["mobile", "tablet", "desktop"] as ViewportSize[]).map((size) => {
              const Icon = getViewportIcon(size)
              return (
                <Button
                  key={size}
                  variant={viewportSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewportSize(size)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowValidation(!showValidation)} className="gap-2">
            {showValidation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showValidation ? "Hide" : "Show"} Validation
          </Button>
          <Button variant="outline" size="sm" onClick={resetForm} className="gap-2 bg-transparent">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Form Stats */}
      {formElements.length > 0 && (
        <div className="mb-6 flex items-center gap-4">
          <Badge variant="secondary" className="gap-1">
            <span className="font-medium">{totalFields}</span>
            <span className="text-muted-foreground">Total Fields</span>
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <span className="font-medium">{requiredFields.length}</span>
            <span className="text-muted-foreground">Required</span>
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <span className="font-medium">{formElements.filter((el) => el.type === "button").length || 1}</span>
            <span className="text-muted-foreground">Actions</span>
          </Badge>
        </div>
      )}

      <Separator className="mb-6" />

      {/* Form Preview */}
      <div className={`mx-auto transition-all duration-300 ${getViewportClasses()}`}>
        <Card className="p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-balance mb-2">{formTitle}</h1>
              <p className="text-muted-foreground">Please fill out this form with your information</p>
              {requiredFields.length > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Fields marked with <span className="text-destructive">*</span> are required
                </p>
              )}
            </div>

            {formElements.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Eye className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No form elements yet</h3>
                <p className="text-muted-foreground">Go back to the builder to add some elements to your form.</p>
              </div>
            ) : (
              <>
                {formElements.map((element, index) => (
                  <div key={element.id} className="space-y-2">
                    <FormElementRenderer element={element} isPreview={true} />
                    {showValidation && element.required && element.type !== "button" && element.type !== "checkbox" && (
                      <p className="text-xs text-muted-foreground">
                        This field is required and will be validated on submit
                      </p>
                    )}
                    {index < formElements.length - 1 && formElements[index + 1].type !== "button" && (
                      <div className="pt-2" />
                    )}
                  </div>
                ))}

                {/* Add default submit button if no button elements exist */}
                {!formElements.some((el) => el.type === "button") && (
                  <div className="pt-4">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Form"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </form>
        </Card>
      </div>

      {/* Form Data Debug (only show if form has been submitted) */}
      {Object.keys(formData).length > 0 && (
        <div className="mt-8 max-w-2xl mx-auto">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Submitted Form Data</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
              <code>{JSON.stringify(formData, null, 2)}</code>
            </pre>
          </Card>
        </div>
      )}
    </div>
  )
}
