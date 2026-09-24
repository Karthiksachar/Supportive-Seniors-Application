
import { useState, useEffect } from "react";
import { Home, Heart, Shield, Users, Settings, Moon, Sun, HelpCircle, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import VoiceNavigation from "./VoiceNavigation";
import HealthDashboard from "./HealthDashboard";
import EmergencyAssistance from "./EmergencyAssistance";
import SocialFeatures from "./SocialFeatures";
import UserProfile from "./UserProfile";
import { useUser } from "@/contexts/UserContext"; // Add this import

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();
  const { user } = useUser(); // Add this line
  
  // Handle theme change
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  
  // Handle voice commands
  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes("home")) {
      setActiveTab("home");
    } else if (lowerCommand.includes("health") || lowerCommand.includes("medication")) {
      setActiveTab("health");
    } else if (lowerCommand.includes("emergency") || lowerCommand.includes("help")) {
      setActiveTab("emergency");
    } else if (lowerCommand.includes("social") || lowerCommand.includes("contacts")) {
      setActiveTab("social");
    } else if (lowerCommand.includes("profile") || lowerCommand.includes("my profile")) {
      setActiveTab("my profile");
    } else if (lowerCommand.includes("call emergency")) {
      setActiveTab("emergency");
      toast({
        title: "Emergency Simulation",
        description: "In a real application, this would initiate an emergency call to 911.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };
  
  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-white p-10 rounded-3xl shadow-lg border border-blue-100">
              <h1 className="text-5xl font-bold text-blue-800 mb-6 animate-fade-in text-center">
                Welcome to Supportive Seniors
              </h1>
              <div className="bg-gradient-to-r from-white to-blue-50 p-6 rounded-2xl border border-blue-50">
                <p className="text-2xl text-blue-600 leading-relaxed animate-fade-up text-center">
                  Your personal assistant for health, safety, and staying connected
                </p>
              </div>
            </div>
            
            <VoiceNavigation onCommand={handleVoiceCommand} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <Button 
                onClick={() => setActiveTab("health")} 
                variant="outline" 
                className="h-32 feature-card flex flex-col items-center justify-center transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-pink-100 to-red-50 hover:from-red-200 hover:to-pink-100 border-red-200 shadow-lg hover:shadow-xl"
              >
                <Heart size={32} className="text-red-500 mb-2 animate-pulse" />
                <span className="text-xl font-medium bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Health Dashboard</span>
              </Button>
              
              <Button 
                onClick={() => setActiveTab("emergency")} 
                variant="outline" 
                className="h-32 feature-card flex flex-col items-center justify-center transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-orange-100 to-yellow-50 hover:from-yellow-200 hover:to-orange-100 border-yellow-200 shadow-lg hover:shadow-xl"
              >
                <Shield size={32} className="text-orange-500 mb-2" />
                <span className="text-xl font-medium bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">Emergency Help</span>
              </Button>
              
              <Button 
                onClick={() => setActiveTab("social")} 
                variant="outline" 
                className="h-32 feature-card flex flex-col items-center justify-center transform hover:scale-105 transition-all duration-300 bg-gradient-to-br from-blue-100 to-green-50 hover:from-green-200 hover:to-blue-100 border-green-200 shadow-lg hover:shadow-xl"
              >
                <Users size={32} className="text-green-500 mb-2" />
                <span className="text-xl font-medium bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Emergency Contacts</span>
              </Button>
            </div>
          </div>
        );
      case "health":
        return <HealthDashboard />;
      case "emergency":
        return <EmergencyAssistance />;
      case "social":
        return <SocialFeatures />;
      case "my profile":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">My Profile</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-6">
                <UserCircle size={64} className="text-blue-600" />
                <div>
                  <h3 className="text-xl font-semibold">{user?.name || 'Benny Joel P'}</h3>
                  <p className="text-gray-600">{user?.email || 'galaxyman123@gmail.com'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Age</span>
                  <span>{user?.age || '60'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Emergency Contact</span>
                  <span>{user?.emergencyContact || '6363313949'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Medical Conditions</span>
                  <span>{user?.medicalConditions || 'Fever,cold,cough'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Allergies</span>
                  <span>{user?.allergies || 'Dust allergy'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Blood Type</span>
                  <span>{user?.bloodType || 'O+'}</span>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Page not found</div>;
    }
  };
  
  const getBackgroundClass = () => {
    switch (activeTab) {
      case "home":
        return "bg-[url('https://www.fvdublin.org/wp-content/uploads/2022/11/senior-woman-with-smart-home-device.jpg')] bg-cover bg-center bg-fixed";
      case "health":
        return "bg-gradient-to-b from-blue-50 to-white";
      case "emergency":
        return "bg-gradient-to-b from-blue-50 to-white";
      case "social":
        return "bg-gradient-to-b from-blue-50 to-white";
      default:
        return "bg-gradient-to-b from-blue-50 to-white";
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${getBackgroundClass()}`}>
      {/* Header */}
      <header className="bg-blue-600 shadow-md border-b border-blue-400 sticky top-0 z-10 animate-fade-in">
        <div className="container flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3OvhDyKaZBTvGsQaOSMZt02YE06npVnp2Fw&s" 
              alt="Supportive Seniors Logo" 
              className="w-16 h-16 rounded-full object-cover shadow-lg hover:scale-110 transition-transform duration-200 border-2 border-white"
            />
            <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent text-3xl">
              Supportive Seniors
            </span>
          </h1>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="large-target text-white hover:bg-blue-500 hover:text-white animate-entrance"
              onClick={() => setDarkMode(!darkMode)}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="large-target text-white hover:bg-blue-500 hover:text-white animate-entrance animation-delay-100"
              onClick={() => toast({ title: "Help", description: "Need assistance? Just say 'help' to activate voice commands." })}
              aria-label="Help"
            >
              <HelpCircle size={24} />
            </Button>
            <UserProfile />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 container py-6 px-4 animate-fade-up rounded-lg my-6">
        {renderTabContent()}
      </main>
      
      {/* Navigation Footer */}
      <footer className="bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.1)] border-t border-blue-100 sticky bottom-0 z-10">
        <div className="container flex justify-around items-center p-2">
          <Button 
            variant={activeTab === "home" ? "default" : "ghost"} 
            className={`large-target flex-col py-3 h-auto rounded-lg flex-1 animate-entrance ${
              activeTab === "home" ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-110" : "text-blue-600 hover:bg-blue-50"
            }`}
            onClick={() => setActiveTab("home")}
          >
            <Home size={activeTab === "home" ? 32 : 24} className={`transition-all duration-200 ${activeTab === "home" ? "animate-bounce" : ""}`} />
            <span className={`text-sm mt-1 ${activeTab === "home" ? "font-bold tracking-wide" : ""}`}>Home</span>
          </Button>
          
          <Button 
            variant={activeTab === "health" ? "default" : "ghost"} 
            className={`large-target flex-col py-3 h-auto rounded-lg flex-1 animate-entrance animation-delay-100 ${
              activeTab === "health" ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-110" : "text-blue-600 hover:bg-blue-50"
            }`}
            onClick={() => setActiveTab("health")}
          >
            <Heart size={activeTab === "health" ? 32 : 24} className={`transition-all duration-200 ${activeTab === "health" ? "animate-pulse" : ""}`} />
            <span className={`text-sm mt-1 ${activeTab === "health" ? "font-bold tracking-wide" : ""}`}>Health</span>
          </Button>
          
          <Button 
            variant={activeTab === "emergency" ? "default" : "ghost"} 
            className={`large-target flex-col py-3 h-auto rounded-lg flex-1 animate-entrance animation-delay-200 ${
              activeTab === "emergency" ? "bg-gradient-to-r from-yellow-500 to-red-500 text-white shadow-lg scale-110" : "text-blue-600 hover:bg-blue-50"
            }`}
            onClick={() => setActiveTab("emergency")}
          >
            <Shield size={activeTab === "emergency" ? 32 : 24} className={`transition-all duration-200 ${activeTab === "emergency" ? "animate-pulse" : ""}`} />
            <span className={`text-sm mt-1 ${activeTab === "emergency" ? "font-bold tracking-wide" : ""}`}>Emergency</span>
          </Button>
          
          <Button 
            variant={activeTab === "social" ? "default" : "ghost"} 
            className={`large-target flex-col py-3 h-auto rounded-lg flex-1 animate-entrance animation-delay-300 ${
              activeTab === "social" ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-110" : "text-blue-600 hover:bg-blue-50"
            }`}
            onClick={() => setActiveTab("social")}
          >
            <Users size={activeTab === "social" ? 32 : 24} className={`transition-all duration-200 ${activeTab === "social" ? "animate-bounce" : ""}`} />
            <span className={`text-sm mt-1 ${activeTab === "social" ? "font-bold tracking-wide" : ""}`}>Social</span>
          </Button>
          
          <Button 
            variant={activeTab === "my profile" ? "default" : "ghost"} 
            className={`large-target flex-col py-3 h-auto rounded-lg flex-1 animate-entrance animation-delay-400 ${
              activeTab === "my profile" ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg scale-110" : "text-blue-600 hover:bg-blue-50"
            }`}
            onClick={() => setActiveTab("my profile")}
          >
            <UserCircle size={activeTab === "my profile" ? 32 : 24} className={`transition-all duration-200 ${activeTab === "my profile" ? "animate-bounce" : ""}`} />
            <span className={`text-sm mt-1 ${activeTab === "my profile" ? "font-bold tracking-wide" : ""}`}>My Profile</span>
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
