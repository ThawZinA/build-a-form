"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, Download, FileCode, FileJson, Globe } from "lucide-react"
import { toast } from "sonner"
import type { FormElement } from "@/components/form-element-renderer"

interface FormExporterProps {
  formTitle: string
  formElements: FormElement[]
  trigger?: React.ReactNode
  showInline?: boolean
}

export function FormExporter({ formTitle, formElements, trigger, showInline = false }: FormExporterProps) {
  const [activeFormat, setActiveFormat] = useState<"json" | "html" | "react">("json")

  const generateJSON = () => {
    return JSON.stringify(
      {
        title: formTitle,
        elements: formElements,
        metadata: {
          version: "1.0.0",
          createdAt: new Date().toISOString(),
          totalElements: formElements.length,
          requiredFields: formElements.filter((el) => el.required).length,
        },
      },
      null,
      2,
    )
  }

  const generateHTML = () => {
    const formHTML = formElements
      .map((element) => {
        switch (element.type) {
          case "text":
          case "email":
          case "number":
          case "date":
            return `    <div class="form-group">
      <label for="${element.id}">${element.label}${element.required ? " *" : ""}</label>
      <input type="${element.type}" id="${element.id}" name="${element.id}" placeholder="${element.placeholder || ""}"${element.required ? " required" : ""} />
    </div>`

          case "textarea":
            return `    <div class="form-group">
      <label for="${element.id}">${element.label}${element.required ? " *" : ""}</label>
      <textarea id="${element.id}" name="${element.id}" placeholder="${element.placeholder || ""}"${element.required ? " required" : ""}></textarea>
    </div>`

          case "select":
            const options =
              element.options
                ?.map(
                  (option) => `        <option value="${option.toLowerCase().replace(/\s+/g, "-")}">${option}</option>`,
                )
                .join("\n") || ""
            return `    <div class="form-group">
      <label for="${element.id}">${element.label}${element.required ? " *" : ""}</label>
      <select id="${element.id}" name="${element.id}"${element.required ? " required" : ""}>
        <option value="">${element.placeholder || "Select an option"}</option>
${options}
      </select>
    </div>`

          case "checkbox":
            return `    <div class="form-group">
      <input type="checkbox" id="${element.id}" name="${element.id}" value="checked"${element.required ? " required" : ""} />
      <label for="${element.id}">${element.label}</label>
    </div>`

          case "radio":
            const radioOptions =
              element.options
                ?.map(
                  (option, index) =>
                    `      <input type="radio" id="${element.id}-${index}" name="${element.id}" value="${option.toLowerCase().replace(/\s+/g, "-")}"${element.required && index === 0 ? " required" : ""} />
      <label for="${element.id}-${index}">${option}</label>`,
                )
                .join("\n      ") || ""
            return `    <div class="form-group">
      <fieldset>
        <legend>${element.label}${element.required ? " *" : ""}</legend>
        ${radioOptions}
      </fieldset>
    </div>`

          case "button":
            return `    <button type="submit">${element.label}</button>`

          default:
            return `    <!-- Unknown element type: ${element.type} -->`
        }
      })
      .join("\n\n")

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formTitle}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, textarea, select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        fieldset { border: 1px solid #ddd; border-radius: 4px; padding: 10px; }
        legend { font-weight: bold; }
    </style>
</head>
<body>
    <h1>${formTitle}</h1>
    <form method="POST" action="/submit">
${formHTML}
${!formElements.some((el) => el.type === "button") ? '\n    <button type="submit">Submit Form</button>' : ""}
    </form>
</body>
</html>`
  }

  const generateReact = () => {
    const imports = `import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'`

    const formElements_JSX = formElements
      .map((element) => {
        switch (element.type) {
          case "text":
          case "email":
          case "number":
          case "date":
            return `        <div className="space-y-2">
          <Label htmlFor="${element.id}">${element.label}${element.required ? " *" : ""}</Label>
          <Input
            type="${element.type}"
            id="${element.id}"
            name="${element.id}"
            placeholder="${element.placeholder || ""}"
            required={${element.required || false}}
          />
        </div>`

          case "textarea":
            return `        <div className="space-y-2">
          <Label htmlFor="${element.id}">${element.label}${element.required ? " *" : ""}</Label>
          <Textarea
            id="${element.id}"
            name="${element.id}"
            placeholder="${element.placeholder || ""}"
            required={${element.required || false}}
          />
        </div>`

          case "select":
            const options =
              element.options
                ?.map(
                  (option) =>
                    `            <SelectItem value="${option.toLowerCase().replace(/\s+/g, "-")}">${option}</SelectItem>`,
                )
                .join("\n") || ""
            return `        <div className="space-y-2">
          <Label htmlFor="${element.id}">${element.label}${element.required ? " *" : ""}</Label>
          <Select name="${element.id}" required={${element.required || false}}>
            <SelectTrigger>
              <SelectValue placeholder="${element.placeholder || "Select an option"}" />
            </SelectTrigger>
            <SelectContent>
${options}
            </SelectContent>
          </Select>
        </div>`

          case "checkbox":
            return `        <div className="flex items-center space-x-2">
          <Checkbox id="${element.id}" name="${element.id}" required={${element.required || false}} />
          <Label htmlFor="${element.id}">${element.label}</Label>
        </div>`

          case "radio":
            const radioOptions =
              element.options
                ?.map(
                  (option, index) =>
                    `            <div className="flex items-center space-x-2">
              <RadioGroupItem value="${option.toLowerCase().replace(/\s+/g, "-")}" id="${element.id}-${index}" />
              <Label htmlFor="${element.id}-${index}">${option}</Label>
            </div>`,
                )
                .join("\n") || ""
            return `        <div className="space-y-2">
          <Label>${element.label}${element.required ? " *" : ""}</Label>
          <RadioGroup name="${element.id}" required={${element.required || false}}>
${radioOptions}
          </RadioGroup>
        </div>`

          case "button":
            return `        <Button type="submit">${element.label}</Button>`

          default:
            return `        {/* Unknown element type: ${element.type} */}`
        }
      })
      .join("\n\n")

    return `${imports}

export default function ${formTitle.replace(/\s+/g, "")}Form() {
  const [formData, setFormData] = useState({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(formData.entries())
    console.log('Form submitted:', data)
    // Handle form submission here
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">${formTitle}</h1>
          <p className="text-muted-foreground">Please fill out this form with your information</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
${formElements_JSX}
${!formElements.some((el) => el.type === "button") ? '\n          <Button type="submit" className="w-full">Submit Form</Button>' : ""}
        </form>
      </div>
    </div>
  )
}`
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        toast.success("Copied to clipboard!", {
          description: "The code has been copied to your clipboard.",
        })
      })
      .catch(() => {
        toast.error("Failed to copy", {
          description: "Please try selecting and copying manually.",
        })
      })
  }

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("File downloaded!", {
      description: `${filename} has been downloaded to your device.`,
    })
  }

  const getContent = () => {
    switch (activeFormat) {
      case "json":
        return generateJSON()
      case "html":
        return generateHTML()
      case "react":
        return generateReact()
      default:
        return ""
    }
  }

  const getFileExtension = () => {
    switch (activeFormat) {
      case "json":
        return "json"
      case "html":
        return "html"
      case "react":
        return "tsx"
      default:
        return "txt"
    }
  }

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Export Form</h2>
          <p className="text-muted-foreground">Export your form in different formats</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <span className="font-medium">{formElements.length}</span>
            <span className="text-muted-foreground">Elements</span>
          </Badge>
        </div>
      </div>

      <Separator />

      <Tabs value={activeFormat} onValueChange={(value) => setActiveFormat(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="json" className="gap-2">
            <FileJson className="h-4 w-4" />
            JSON
          </TabsTrigger>
          <TabsTrigger value="html" className="gap-2">
            <Globe className="h-4 w-4" />
            HTML
          </TabsTrigger>
          <TabsTrigger value="react" className="gap-2">
            <FileCode className="h-4 w-4" />
            React
          </TabsTrigger>
        </TabsList>

        <TabsContent value="json" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Export form configuration as JSON for importing into other systems
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(getContent())} className="gap-2">
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadFile(getContent(), `${formTitle.toLowerCase().replace(/\s+/g, "-")}.json`)}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="html" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Export as standalone HTML file with embedded CSS styling</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(getContent())} className="gap-2">
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadFile(getContent(), `${formTitle.toLowerCase().replace(/\s+/g, "-")}.html`)}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="react" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Export as React component with TypeScript and shadcn/ui components
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(getContent())} className="gap-2">
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadFile(getContent(), `${formTitle.replace(/\s+/g, "")}Form.tsx`)}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Card className="p-4">
        <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm max-h-96">
          <code>{getContent()}</code>
        </pre>
      </Card>
    </div>
  )

  if (showInline) {
    return <div className="p-6">{content}</div>
  }

  return trigger ? (
    <div
      onClick={() => {
        /* This would open a modal or drawer with the content */
      }}
    >
      {trigger}
    </div>
  ) : null
}
