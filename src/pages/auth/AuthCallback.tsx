
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Auth callback processing...');
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error);
          setError(error.message);
          setTimeout(() => navigate('/auth'), 3000);
        } else {
          console.log('Auth callback successful, redirecting to home');
          navigate('/');
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        setError('An unexpected error occurred');
        setTimeout(() => navigate('/auth'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-6 max-w-sm mx-auto bg-card rounded-lg shadow-md">
        {error ? (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-destructive">Authentication Error</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <p className="text-sm">Redirecting you back to login...</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-2">Completing sign in...</h2>
            <div className="flex justify-center my-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <p className="text-muted-foreground">Please wait while we redirect you.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
