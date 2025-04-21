import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <div className="mb-6 text-6xl">🌱</div>
        <p className="text-xl text-muted-foreground mb-4">Oops! This page doesn't exist</p>
        <Link to="/" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
