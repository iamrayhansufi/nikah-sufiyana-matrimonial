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

  const handleLogin = () => {
    setIsDialogOpen(false);
    onClose();
    router.push(`/login?callbackUrl=${encodeURIComponent(returnUrl || window.location.pathname)}`);
  };

  const handleRegister = () => {
    setIsDialogOpen(false);
    onClose();
    router.push(`/register?callbackUrl=${encodeURIComponent(returnUrl || window.location.pathname)}`);
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
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Login to your account
          </Button>
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <Button 
            onClick={handleRegister} 
            variant="outline" 
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          >
            Create a new account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
