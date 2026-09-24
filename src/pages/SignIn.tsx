
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LogIn, UserPlus, Key, Mail } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";

const SignIn = () => {
  const [isSigningIn, setIsSigningIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isAuthenticated } = useUser();
  const synthRef = useRef<SpeechSynthesis | null>(null);
  
  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
      
      // Welcome message
      const welcomeMessage = "Welcome to Supportive Seniors. Please sign in to your account or create a new one to continue.";
      speak(welcomeMessage);
    }
  }, []);

  const speak = (text: string) => {
    if (!synthRef.current) return;
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    synthRef.current.speak(utterance);
  };

  // Modify handleAuth to include voice feedback
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!isSigningIn) {
        // Registration validation
        if (password !== confirmPassword) {
          toast({
            title: "Password mismatch",
            description: "Passwords do not match. Please try again.",
            variant: "destructive",
          });
          return;
        }

        // Check if email already exists (simulate API call)
        const emailExists = localStorage.getItem(email);
        if (emailExists) {
          toast({
            title: "Email already registered",
            description: "Please use a different email or sign in.",
            variant: "destructive",
          });
          return;
        }

        // Store user data
        const userData = { name, email, password };
        localStorage.setItem(email, JSON.stringify(userData));
        speak("Creating your new account. Please wait.");
      } else {
        // Login validation
        const userData = localStorage.getItem(email);
        if (!userData) {
          toast({
            title: "Account not found",
            description: "Please check your email or create a new account.",
            variant: "destructive",
          });
          return;
        }

        const user = JSON.parse(userData);
        if (user.password !== password) {
          toast({
            title: "Invalid credentials",
            description: "Please check your password and try again.",
            variant: "destructive",
          });
          return;
        }
      }

      // Proceed with login
      await login(email, password, { name });
      speak(isSigningIn ? "Welcome back! You have successfully signed in." : "Your account has been created successfully.");
      navigate("/");
    } catch (error) {
      speak("An error occurred. Please try again.");
      toast({
        title: "Authentication error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Add voice guidance for form switching
  const handleFormSwitch = () => {
    setIsSigningIn(!isSigningIn);
    speak(isSigningIn ? 
      "Let's create a new account. Please fill in your details." : 
      "Welcome back! Please enter your credentials to sign in."
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated background elements */}
        <div className="absolute -top-14 -left-14 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 -right-14 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      <Card className="w-full max-w-md border border-blue-100 bg-white/80 backdrop-blur-sm shadow-xl animate-fade-in">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto bg-primary rounded-full p-3 w-16 h-16 flex items-center justify-center mb-2 animate-scale-in">
            <LogIn className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-900">
            {isSigningIn ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription className="text-blue-600">
            {isSigningIn 
              ? "Enter your credentials to access your account" 
              : "Fill in your details to create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isSigningIn && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center">
                  <UserPlus className="mr-2 h-4 w-4 text-blue-500" />
                  <Label htmlFor="name" className="text-blue-800">Full Name</Label>
                </div>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-blue-200 focus:border-blue-400 transition-all"
                  required={!isSigningIn}
                />
              </motion.div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-blue-500" />
                <Label htmlFor="email" className="text-blue-800">Email</Label>
              </div>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-blue-200 focus:border-blue-400 transition-all"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Key className="mr-2 h-4 w-4 text-blue-500" />
                <Label htmlFor="password" className="text-blue-800">Password</Label>
              </div>
              <Input 
                id="password" 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-blue-200 focus:border-blue-400 transition-all"
                required
              />
            </div>
            
            {!isSigningIn && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center">
                  <Key className="mr-2 h-4 w-4 text-blue-500" />
                  <Label htmlFor="confirmPassword" className="text-blue-800">Confirm Password</Label>
                </div>
                <Input 
                  id="confirmPassword" 
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-blue-200 focus:border-blue-400 transition-all"
                  required={!isSigningIn}
                />
              </motion.div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all animate-pulse-gentle"
            >
              {isSigningIn ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-center text-sm text-blue-600">
            {isSigningIn ? "Don't have an account?" : "Already have an account?"}
            <Button 
              variant="link" 
              className="text-blue-800 hover:text-blue-900 ml-1 p-0"
              onClick={handleFormSwitch}
            >
              {isSigningIn ? "Sign Up" : "Sign In"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
