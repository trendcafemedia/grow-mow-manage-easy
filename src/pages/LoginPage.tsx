'use client'
import * as React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Leaf, Sprout, Flower2, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth/AuthContext"
import { useToast } from "@/components/ui/use-toast"

type IconProps = React.HTMLAttributes<SVGElement>

const Icons = {
  google: (props: IconProps) => (
    <svg role="img" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
      />
    </svg>
  ),
}

function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      })
      return
    }
    
    try {
      setIsLoading(true)
      const { error } = await signIn(email, password)
      
      if (error) {
        toast({
          title: "Authentication failed",
          description: error.message || "Please check your credentials and try again",
          variant: "destructive",
        })
      } else {
        navigate("/dashboard")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      const { error } = await signInWithGoogle()
      
      if (error) {
        toast({
          title: "Authentication failed",
          description: error.message || "Failed to sign in with Google",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 md:p-8">
      <Card className="w-full max-w-md border-green-100 dark:border-green-900">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sprout className="h-8 w-8 text-green-600" />
            <Leaf className="h-6 w-6 text-green-500" />
            <Flower2 className="h-7 w-7 text-green-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Grow-Mow-Manage-Easy</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to manage your lawn care business
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a 
                  href="#" 
                  className="text-sm text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
                >
                  Forgot password?
                </a>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="remember" 
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                disabled={isLoading}
              />
              <Label htmlFor="remember" className="text-sm text-muted-foreground">
                Remember me
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full" 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}
              Google
            </Button>
            
            <p className="text-center text-sm text-muted-foreground mt-4">
              Don't have an account?{" "}
              <a 
                href="#" 
                className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
              >
                Sign up
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default function LoginPageDemo() {
  return <LoginPage />
}
