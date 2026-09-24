import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, UserIcon, Settings, Heart, Shield, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Camera } from "lucide-react"; // Add this import
import { toast } from "@/components/ui/use-toast"; // Assuming toast comes from this location
// Remove this line
// import { login } from "@/contexts/UserContext";

const UserProfile = () => {
  // Update the useUser hook to include login
  const { user, logout, isAuthenticated, login } = useUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [imageHover, setImageHover] = useState(false);

  if (!isAuthenticated) {
    return (
      <Button
        onClick={() => navigate("/signin")}
        variant="outline"
        className="bg-white/20 backdrop-blur-sm border-blue-200 text-blue-700 hover:bg-blue-50 animate-fade-in"
      >
        Sign In
      </Button>
    );
  }

  const handleSignOut = () => {
    setOpen(false);
    logout();
    navigate("/signin");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result as string;
          // Update user avatar in local storage
          const userData = localStorage.getItem(user?.email || '');
          if (userData && user) {
            const parsedData = JSON.parse(userData);
            parsedData.avatar = imageUrl;
            localStorage.setItem(user.email, JSON.stringify(parsedData));

            // Use login from useUser hook
            login(user.email, '', { ...user, avatar: imageUrl });
          }
        };
        reader.readAsDataURL(file);

        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been successfully updated.",
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: "Error updating profile picture",
          description: "Please try again with a different image.",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="rounded-full p-0 w-10 h-10 animate-entrance">
          <Avatar className="h-10 w-10 border-2 border-blue-300 hover:border-blue-500 transition-all">
            <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
            <AvatarFallback className="bg-blue-100 text-blue-800">
              {user?.name ? getInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-white border-blue-100">
        <SheetHeader className="text-left">
          <SheetTitle className="text-blue-900 text-xl flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-blue-700" />
            User Profile
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex items-center gap-4">
            <div
              className="relative group"
              onMouseEnter={() => setImageHover(true)}
              onMouseLeave={() => setImageHover(false)}
            >
              <Avatar className="h-16 w-16 border-2 border-blue-200 transition-all duration-300 group-hover:border-blue-400">
                <AvatarImage src={user?.avatar} alt={user?.name || "User"} />
                <AvatarFallback className="bg-blue-100 text-blue-800 text-xl">
                  {user?.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>

              <label
                htmlFor="avatar-upload"
                className={`absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer transition-opacity duration-300 ${
                  imageHover ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Camera className="h-6 w-6 text-white" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-blue-900">{user?.name}</h3>
              <p className="text-blue-600 text-sm">{user?.email}</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-blue-800">Quick Access</h4>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="flex flex-col h-auto py-3 border-blue-100 hover:border-blue-300"
                onClick={() => {
                  setOpen(false);
                  navigate("/");
                }}
              >
                <Heart className="h-5 w-5 text-blue-600 mb-1" />
                <span className="text-xs">Health</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col h-auto py-3 border-blue-100 hover:border-blue-300"
                onClick={() => {
                  setOpen(false);
                  navigate("/");
                }}
              >
                <Shield className="h-5 w-5 text-blue-600 mb-1" />
                <span className="text-xs">Emergency</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col h-auto py-3 border-blue-100 hover:border-blue-300"
                onClick={() => {
                  setOpen(false);
                  navigate("/");
                }}
              >
                <Users className="h-5 w-5 text-blue-600 mb-1" />
                <span className="text-xs">Social</span>
              </Button>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start border-blue-100 text-blue-800 hover:bg-blue-50"
              onClick={() => {
                setOpen(false);
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start border-blue-100 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserProfile;