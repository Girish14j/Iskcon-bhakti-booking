
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function useProtectedRoute(adminOnly = false) {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please login to access this page",
          variant: "destructive",
        });
        navigate("/auth");
      } else if (adminOnly && !isAdmin) {
        toast({
          title: "Access denied",
          description: "You need administrator rights to access this page",
          variant: "destructive",
        });
        navigate("/");
      }
    }
  }, [user, isAdmin, isLoading, navigate, adminOnly, toast]);

  return { isAuthorized: user !== null && (!adminOnly || isAdmin), isLoading };
}
