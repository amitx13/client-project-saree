import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Copy, Check } from 'lucide-react'

export default function ReferralCodeCard() {
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()
  const referralCode = "FRIEND2023" // This would typically come from your backend or state management

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralCode)
      setIsCopied(true)
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      })
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-2">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Your Referral Code</CardTitle>
        <CardDescription>Share this code with friends to earn rewards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Input
            value={referralCode}
            readOnly
            className="font-mono text-lg"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            className="flex-shrink-0"
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy referral code</span>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-2">
        <p className="text-sm text-muted-foreground">
          How it works:
        </p>
        <ol className="list-decimal list-inside text-sm text-muted-foreground">
          <li>Share your unique code with friends</li>
          <li>On every sucessfull referal earn 300rs</li>
        </ol>
      </CardFooter>
    </Card>
  )
}