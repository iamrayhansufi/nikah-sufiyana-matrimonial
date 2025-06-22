"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  returnUrl: string;
}

export function AuthRequiredModal({ isOpen, onClose, returnUrl }: AuthRequiredModalProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(isOpen);
  // Safe URL encoding function
  const safeEncodeURI = (url: string) => {
    try {
      return encodeURIComponent(url);
    } catch (e) {
      console.error("Error encoding URL:", e);
      return encodeURIComponent("/browse"); // Default safe fallback
    }
  };

  const handleLogin = () => {
    setIsDialogOpen(false);
    onClose();
    try {
      const safeUrl = safeEncodeURI(returnUrl || "/browse");
      router.push(`/login?callbackUrl=${safeUrl}`);
    } catch (e) {
      console.error("Error navigating to login:", e);
      router.push('/login');
    }
  };

  const handleRegister = () => {
    setIsDialogOpen(false);
    onClose();
    try {
      const safeUrl = safeEncodeURI(returnUrl || "/browse");
      router.push(`/register?callbackUrl=${safeUrl}`);
    } catch (e) {
      console.error("Error navigating to register:", e);
      router.push('/register');
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => {
      setIsDialogOpen(open);
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Authentication Required</DialogTitle>
          <DialogDescription className="text-center">
            Please login or create an account to view complete profiles
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <Button 
            onClick={handleLogin} 
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Login to your account
          </Button>
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-lg">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <Button 
            onClick={handleRegister} 
            variant="outline" 
            className="border-red-600 text-red-600 hover:bg-red-50"
          >
            Create a new account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
