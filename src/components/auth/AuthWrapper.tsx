
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!auth) {
      console.error("Firebase authentication is not initialized");
      toast.error("Firebase authentication error. Check console for details.");
      return;
    }

    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, 
      (user) => {
        console.log("Auth state changed:", user ? "User logged in" : "No user");
        dispatch(setUser(user));
      },
      (error) => {
        console.error("Auth state change error:", error);
        toast.error("Authentication error. Please check your Firebase configuration.");
      }
    );

    return () => {
      console.log("Cleaning up auth state listener");
      unsubscribe();
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthWrapper;
