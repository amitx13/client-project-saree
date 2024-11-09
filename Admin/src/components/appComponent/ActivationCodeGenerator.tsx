"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Copy, Share2, Mail, MessageCircle, Smartphone, Link } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ActivationCodeGenerator() {
    const { toast } = useToast()
  const [codeCount, setCodeCount] = useState(1)
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([])

  const generateCodes = () => {
    const codes = Array.from({ length: codeCount }, () =>
      Math.random().toString(36).substring(2, 10).toUpperCase()
    )
    setGeneratedCodes(codes)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCodes.join("\n")).then(() => {
      toast({
        title: "Copied!",
        description: "Activation codes copied to clipboard.",
      })
    })
  }

  const shareVia = (medium: string) => {
    const text = encodeURIComponent(`Here are your activation codes:\n${generatedCodes.join("\n")}`)
    let url = ""

    switch (medium) {
      case "email":
        url = `mailto:?subject=Activation Codes&body=${text}`
        break
      case "whatsapp":
        url = `https://wa.me/?text=${text}`
        break
      case "telegram":
        url = `https://t.me/share/url?url=${text}`
        break
      case "sms":
        url = `sms:?body=${text}`
        break
      default:
        copyToClipboard()
        toast({
          title: "Link Copied!",
          description: "Share the activation codes using your preferred method.",
        })
        return
    }

    window.open(url, "_blank")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Activation Code Generator</CardTitle>
        <CardDescription>Generate and share activation codes with users</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="codeCount">Number of Codes</Label>
            <Input
              id="codeCount"
              type="number"
              value={codeCount}
              onChange={(e) => setCodeCount(Math.max(1, parseInt(e.target.value)))}
              min="1"
            />
          </div>
          <Button onClick={generateCodes}>Generate Codes</Button>
          {generatedCodes.length > 0 && (
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="generatedCodes">Generated Codes</Label>
              <Textarea
                id="generatedCodes"
                value={generatedCodes.join("\n")}
                readOnly
                rows={Math.min(10, generatedCodes.length)}
              />
            </div>
          )}
        </div>
      </CardContent>
      {generatedCodes.length > 0 && (
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => shareVia("email")}>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareVia("whatsapp")}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  <span>WhatsApp</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareVia("telegram")}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  <span>Telegram</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareVia("sms")}>
                  <Smartphone className="mr-2 h-4 w-4" />
                  <span>SMS</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareVia("copy")}>
                  <Link className="mr-2 h-4 w-4" />
                  <span>Copy Link</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button variant="outline" onClick={() => setGeneratedCodes([])}>
            Clear Codes
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}