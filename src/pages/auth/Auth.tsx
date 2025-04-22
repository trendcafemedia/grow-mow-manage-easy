
import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Mail, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isSignUp) {
        await signUp(email, password);
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your registration.",
        });
      } else {
        await signIn(email, password);
        // Navigation is handled by auth context via onAuthStateChange
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setErrorMessage(error.message || "An error occurred during authentication");
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message || "An error occurred during authentication",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      console.log('Initiating Google sign in from Auth page');
      await signInWithGoogle();
      // Navigation will be handled by the redirect
    } catch (error: any) {
      console.error('Google sign in error:', error);
      setErrorMessage(error.message || "An error occurred during Google sign in");
      toast({
        variant: "destructive",
        title: "Google Sign In Error",
        description: error.message || "An error occurred during Google sign in",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-4">
      <div className="w-full max-w-md text-center mb-8">
        <div className="flex justify-center mb-2">
          <span className="text-4xl">🌱</span>
        </div>
        <h1 className="text-3xl font-bold text-green-800">You Grow I Mow</h1>
        <p className="text-green-600 mt-2">Professional Lawn Care Services Management</p>
      </div>
      
      <Card className="w-full max-w-md border-green-200 shadow-lg">
        <CardHeader className="space-y-1 bg-green-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl text-center">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </CardTitle>
          <CardDescription className="text-center text-green-100">
            {isSignUp 
              ? 'Sign up to manage your lawn care business'
              : 'Sign in to continue managing your services'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-background pl-10"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-background pl-10"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                isSignUp ? 'Sign Up' : 'Sign In'
              )}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-green-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button 
            variant="outline" 
            type="button" 
            className="w-full bg-background border-green-300 hover:bg-green-50"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                Google
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-green-100 pt-4">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-green-700 hover:underline font-medium"
            disabled={isLoading}
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"}
          </button>
        </CardFooter>
      </Card>
      
      <div className="mt-8 text-sm text-green-700">
        <p>© {new Date().getFullYear()} You Grow I Mow. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Auth;
