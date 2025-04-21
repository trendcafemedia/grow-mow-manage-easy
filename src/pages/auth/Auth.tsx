
import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
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
      await signInWithGoogle();
      // Note: No need to handle redirect here as it will be done by Supabase
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignUp 
              ? 'Enter your email to create your account'
              : 'Enter your email to sign in to your account'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="bg-background"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className="bg-background"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
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
              <span className="w-full border-t" />
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
            className="w-full bg-background"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              'Google'
            )}
          </Button>

          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline"
              disabled={isLoading}
            >
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
