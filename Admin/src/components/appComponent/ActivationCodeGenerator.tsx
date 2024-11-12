// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Copy, Share2, Mail, MessageCircle, Smartphone, Link, Wand2 } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import {useGeneratedCodes} from "@/hooks/useGeneratedCodes"
// import { useUserState } from "@/recoil/user"

// export default function ActivationCodeGenerator() {
//   const [user,] = useUserState()
//   const { toast } = useToast()
//   const [codeCount, setCodeCount] = useState(0)
//   const [generatedCodes, setGeneratedCodes] = useState<string[]>([])

//   const generateCodes = async() => {
//     const codes = await useGeneratedCodes(user.token,codeCount)
//     if(codes.success){
//       setGeneratedCodes(codes.data)
//       toast({
//         title: "Codes Generated!",
//         description: "Activation codes generated successfully.",
//       })
//     }else{
//       toast({
//         title: "Error!",
//         description: "Failed to generate activation codes.",
//       })
//     }
//   }

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(generatedCodes.join(",\n")).then(() => {
//       toast({
//         title: "Copied!",
//         description: "Activation codes copied to clipboard.",
//       })
//     })
//   }

//   const shareVia = (medium: string) => {
//     const text = encodeURIComponent(`Here are your activation codes:\n${generatedCodes.join("\n")}`)
//     let url = ""

//     switch (medium) {
//       case "email":
//         url = `mailto:?subject=Activation Codes&body=${text}`
//         break
//       case "whatsapp":
//         url = `https://wa.me/?text=${text}`
//         break
//       case "telegram":
//         url = `https://t.me/share/url?url=${text}`
//         break
//       case "sms":
//         url = `sms:?body=${text}`
//         break
//       default:
//         copyToClipboard()
//         toast({
//           title: "Link Copied!",
//           description: "Share the activation codes using your preferred method.",
//         })
//         return
//     }

//     window.open(url, "_blank")
//   }
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-4 sm:p-6 md:p-8 flex items-center justify-center">
//       <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden">
//         <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6">
//           <h1 className="text-2xl sm:text-3xl font-bold">Activation Code Generator</h1>
//           <p className="text-pink-100 mt-2">Generate and share activation codes with users</p>
//         </div>
//         <div className="p-6">
//           <div className="grid w-full items-center gap-4">
//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="codeCount">Number of Codes</Label>
//               <Input
//                 id="codeCount"
//                 type="number"
//                 value={codeCount}
//                 onChange={(e) => setCodeCount(Math.max(1, parseInt(e.target.value)))}
//                 min="1"
//                 className="border-gray-300"
//               />
//             </div>
//             <Button 
//               onClick={generateCodes}
//               className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
//               disabled={codeCount < 1 || typeof codeCount !== "number" || Number.isNaN(codeCount)}
//             >
//               <Wand2 className="mr-2 h-4 w-4" /> Generate Codes
//             </Button>
//             {generatedCodes.length > 0 && (
//               <div className="flex flex-col space-y-1.5">
//                 <Label htmlFor="generatedCodes">Generated Codes</Label>
//                 <Textarea
//                   id="generatedCodes"
//                   value={generatedCodes.join("\n")}
//                   readOnly
//                   rows={Math.min(10, generatedCodes.length)}
//                   className="border-gray-300 bg-white/50"
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//         {generatedCodes.length > 0 && (
//           <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
//             <div className="flex space-x-2">
//               <Button variant="outline" size="icon" onClick={copyToClipboard}>
//                 <Copy className="h-4 w-4" />
//               </Button>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" size="icon">
//                     <Share2 className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent>
//                   <DropdownMenuItem onClick={() => shareVia("email")}>
//                     <Mail className="mr-2 h-4 w-4" />
//                     <span>Email</span>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => shareVia("whatsapp")}>
//                     <MessageCircle className="mr-2 h-4 w-4" />
//                     <span>WhatsApp</span>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => shareVia("telegram")}>
//                     <MessageCircle className="mr-2 h-4 w-4" />
//                     <span>Telegram</span>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => shareVia("sms")}>
//                     <Smartphone className="mr-2 h-4 w-4" />
//                     <span>SMS</span>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => shareVia("copy")}>
//                     <Link className="mr-2 h-4 w-4" />
//                     <span>Copy Link</span>
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//             <Button 
//               variant="outline" 
//               onClick={() => setGeneratedCodes([])}
//               className="hover:bg-red-100 hover:text-red-600 transition-colors"
//             >
//               Clear Codes
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Copy, Share2, Mail, MessageCircle, Smartphone, Link, Wand2, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useGeneratedCodes } from "@/hooks/useGeneratedCodes"
import { useUserState } from "@/recoil/user"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGetAllCodes } from "@/hooks/useGetAllCodes"

interface GeneratedCode {
  id: string
  code: string
  isUsed: boolean
  createdAt: string
}

export default function ActivationCodeGenerator() {
  const [user,] = useUserState()
  const { toast } = useToast()
  const [codeCount, setCodeCount] = useState(0)
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([])
  const [allCodes, setAllCodes] = useState<GeneratedCode[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const codesPerPage = 5

  useEffect(() => {
    fetchAllCodes()
  }, [])

  const fetchAllCodes = async () => {
    const codes = await useGetAllCodes(user.token)
    if (codes.success) {
      setAllCodes(codes.data)
    } else {
      toast({
        title: "Error!",
        description: "Failed to fetch activation codes.",
      })
    }
  }

  const generateCodes = async () => {
    const codes = await useGeneratedCodes(user.token, codeCount)
    if (codes.success) {
      setGeneratedCodes(codes.data)
      fetchAllCodes() // Refresh the list of all codes
      toast({
        title: "Codes Generated!",
        description: "Activation codes generated successfully.",
      })
    } else {
      toast({
        title: "Error!",
        description: "Failed to generate activation codes.",
      })
    }
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast({
        title: "Copied!",
        description: "Activation code copied to clipboard.",
      })
    })
  }

  const shareVia = (medium: string, code: string) => {
    const text = encodeURIComponent(`Here is your activation code: ${code}`)
    let url = ""

    switch (medium) {
      case "email":
        url = `mailto:?subject=Activation Code&body=${text}`
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
        copyToClipboard(code)
        toast({
          title: "Link Copied!",
          description: "Share the activation code using your preferred method.",
        })
        return
    }

    window.open(url, "_blank")
  }

  const indexOfLastCode = currentPage * codesPerPage
  const indexOfFirstCode = indexOfLastCode - codesPerPage
  const currentCodes = allCodes.slice(indexOfFirstCode, indexOfLastCode)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-start">
      <div className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Activation Code Generator</h1>
          <p className="text-pink-100 mt-2">Generate and share activation codes with users</p>
        </div>
        <div className="p-6">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="codeCount">Number of Codes</Label>
              <Input
                id="codeCount"
                type="number"
                value={codeCount}
                onChange={(e) => setCodeCount(Math.max(1, parseInt(e.target.value)))}
                min="1"
                className="border-gray-300"
              />
            </div>
            <Button 
              onClick={generateCodes}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
              disabled={codeCount < 1 || typeof codeCount !== "number" || Number.isNaN(codeCount)}
            >
              <Wand2 className="mr-2 h-4 w-4" /> Generate Codes
            </Button>
            {generatedCodes.length > 0 && (
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="generatedCodes">Generated Codes</Label>
                <Textarea
                  id="generatedCodes"
                  value={generatedCodes.join("\n")}
                  readOnly
                  rows={Math.min(10, generatedCodes.length)}
                  className="border-gray-300 bg-white/50"
                />
              </div>
            )}
          </div>
        </div>
        {generatedCodes.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(generatedCodes.join("\n"))}>
                <Copy className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => shareVia("email", generatedCodes.join("\n"))}>
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Email</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => shareVia("whatsapp", generatedCodes.join("\n"))}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <span>WhatsApp</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => shareVia("telegram", generatedCodes.join("\n"))}>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <span>Telegram</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => shareVia("sms", generatedCodes.join("\n"))}>
                    <Smartphone className="mr-2 h-4 w-4" />
                    <span>SMS</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => shareVia("copy", generatedCodes.join("\n"))}>
                    <Link className="mr-2 h-4 w-4" />
                    <span>Copy Link</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setGeneratedCodes([])}
              className="hover:bg-red-100 hover:text-red-600 transition-colors"
            >
              Clear Codes
            </Button>
          </div>
        )}
      </div>

      <div className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6">
          <h2 className="text-2xl font-bold">All Generated Codes</h2>
        </div>
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCodes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell>{code.code}</TableCell>
                  <TableCell className={`${code.isUsed ? "text-red-500":"text-green-500"}`}>{code.isUsed ? "Used" : "Unused"}</TableCell>
                  <TableCell>{new Date(code.createdAt).toLocaleString()}</TableCell>
                  {!code.isUsed ?<TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard(code.code)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => shareVia("email", code.code)}>
                            <Mail className="mr-2 h-4 w-4" />
                            <span>Email</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => shareVia("whatsapp", code.code)}>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            <span>WhatsApp</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => shareVia("telegram", code.code)}>
                            <MessageCircle className="mr-2 h-4 w-4" />
                            <span>Telegram</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => shareVia("sms", code.code)}>
                            <Smartphone className="mr-2 h-4 w-4" />
                            <span>SMS</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => shareVia("copy", code.code)}>
                            <Link className="mr-2 h-4 w-4" />
                            <span>Copy Link</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell> : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-between items-center">
            <Button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
            <span>Page {currentPage} of {Math.ceil(allCodes.length / codesPerPage)}</span>
            <Button
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastCode >= allCodes.length}
              variant="outline"
            >
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}