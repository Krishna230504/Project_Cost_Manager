
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  
  useEffect(() => {
    console.log("Index page - Auth state:", user ? "Authenticated" : "Not authenticated");
    
    // Use a small timeout to ensure auth state is properly loaded
    const redirectTimeout = setTimeout(() => {
      if (user) {
        console.log("Redirecting to dashboard");
        navigate('/dashboard');
      } else {
        console.log("Redirecting to login");
        navigate('/login');
      }
    }, 100);
    
    return () => clearTimeout(redirectTimeout);
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
};

export default Index;
