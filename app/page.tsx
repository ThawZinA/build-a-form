"use client"

import { useState } from "react"
import { FormBuilder } from "@/components/form-builder"
import { FormPreview } from "@/components/form-preview"
import { FormExporter } from "@/components/form-exporter"
import { Button } from "@/components/ui/button"
import { Eye, Code, Settings, Save, Download, Upload } from "lucide-react"
import { toast } from "sonner"

export default function Home() {
  const [activeTab, setActiveTab] = useState<"builder" | "preview" | "code">("builder")
  const [formElements, setFormElements] = useState<any[]>([])
  const [formTitle, setFormTitle] = useState("My first form")
  const [isSaving, setIsSaving] = useState(false)

  const saveForm = async () => {
    setIsSaving(true)
    try {
      const formData = {
        title: formTitle,
        elements: formElements,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      localStorage.setItem("form-builder-data", JSON.stringify(formData))

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast.success("Form saved successfully!", {
        description: "Your form has been saved to local storage.",
      })
    } catch (error) {
      toast.error("Failed to save form", {
        description: "Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const loadForm = () => {
    try {
      const savedData = localStorage.getItem("form-builder-data")
      if (savedData) {
        const formData = JSON.parse(savedData)
        setFormTitle(formData.title || "My first form")
        setFormElements(formData.elements || [])
        toast.success("Form loaded successfully!", {
          description: "Your saved form has been restored.",
        })
      } else {
        toast.error("No saved form found", {
          description: "Create a form first, then save it.",
        })
      }
    } catch (error) {
      toast.error("Failed to load form", {
        description: "The saved data might be corrupted.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-primary">FormBuilder</h1>
            <div className="flex items-center gap-2">
              <Button
                variant={activeTab === "builder" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("builder")}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Builder
              </Button>
              <Button
                variant={activeTab === "preview" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("preview")}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button
                variant={activeTab === "code" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("code")}
                className="gap-2"
              >
                <Code className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadForm} className="gap-2 bg-transparent">
              <Upload className="h-4 w-4" />
              Load
            </Button>
            <Button variant="outline" size="sm" onClick={saveForm} disabled={isSaving} className="gap-2 bg-transparent">
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <FormExporter
              formTitle={formTitle}
              formElements={formElements}
              trigger={
                <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              }
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {activeTab === "builder" && (
          <FormBuilder
            formElements={formElements}
            setFormElements={setFormElements}
            formTitle={formTitle}
            setFormTitle={setFormTitle}
          />
        )}
        {activeTab === "preview" && <FormPreview formElements={formElements} formTitle={formTitle} />}
        {activeTab === "code" && <FormExporter formTitle={formTitle} formElements={formElements} showInline={true} />}
      </main>
    </div>
  )
}
