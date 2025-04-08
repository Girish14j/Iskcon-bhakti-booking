
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const AdminInfo = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

  return (
    <div className="container max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6">How to Get Administrator Access</h1>
      
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden p-6">
        <div className="space-y-6">
          <p>
            To get administrator rights in the Iskcon Bliss platform, your account needs to have the <code>is_admin</code> flag set to <code>true</code> in the database.
          </p>
          
          <h2 className="text-xl font-semibold mt-4">Current Status</h2>
          {user ? (
            <div className="p-4 bg-muted rounded-lg">
              <p>You are currently logged in as: <span className="font-semibold">{user.email}</span></p>
              <p className="mt-2">Admin status: <span className={isAdmin ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{isAdmin ? "Yes" : "No"}</span></p>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
              <p>You are not currently logged in. Please <a href="/auth" className="underline font-semibold">sign in</a> first.</p>
            </div>
          )}
          
          <h2 className="text-xl font-semibold mt-4">How to Become an Admin</h2>
          <p>There are two ways to get administrator rights:</p>
          
          <div className="mt-4 space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Option 1: Direct Database Update</h3>
              <p className="mt-2">As this is a development environment, you can directly update your user record in the Supabase database:</p>
              <ol className="list-decimal ml-6 mt-2 space-y-2">
                <li>Go to the Supabase dashboard</li>
                <li>Navigate to the SQL Editor</li>
                <li>Run the following SQL query (replace YOUR_EMAIL with your email):</li>
                <pre className="bg-gray-100 p-3 rounded mt-2 overflow-x-auto">
                  {`UPDATE profiles 
SET is_admin = true 
WHERE id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL');`}
                </pre>
              </ol>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Option 2: First User Automatic Admin</h3>
              <p className="mt-2">If you're the first user to register in the system, you can modify the <code>handle_new_user</code> function in Supabase to automatically make the first user an admin.</p>
            </div>
          </div>
          
          <p className="mt-6">After updating your admin status, sign out and sign back in to apply the changes.</p>
          
          <div className="flex gap-4 mt-6">
            <button 
              onClick={() => navigate("/")}
              className="px-4 py-2 border rounded-md hover:bg-muted transition-colors"
            >
              Return to Home
            </button>
            {user && !isAdmin && (
              <button 
                onClick={() => {
                  toast({
                    title: "Admin Access Required",
                    description: "Please update your admin status in the database.",
                    variant: "destructive",
                  });
                }}
                className="px-4 py-2 bg-iskcon-saffron text-white rounded-md hover:bg-iskcon-gold transition-colors"
              >
                Try Accessing Admin Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInfo;
