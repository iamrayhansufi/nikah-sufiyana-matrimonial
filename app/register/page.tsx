"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Upload, Eye, EyeOff, FileText, PenSquare } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { playfair } from "../lib/fonts"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface ExtractedData {
  fullName?: string;
  age?: string;
  education?: string;
  profession?: string;
  country?: string;
  city?: string;
  height?: string;
  maritalStatus?: string;
  sect?: string;
  motherTongue?: string;
  [key: string]: string | undefined;
}

interface ValidationError {
  field: string;
  message: string;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
  gender: string;
  age: string;
  country: string;
  city: string;
  education: string;
  profession: string;
  income: string;
  sect: string;
  hijabNiqab: string;
  beard: string;
  height: string;
  complexion: string;
  maritalPreferences: string;
  preferredAgeMin: string;
  preferredAgeMax: string;
  preferredEducation: string;
  preferredProfession: string;
  preferredLocation: string;
  housing: string;
  aboutMe: string;
  familyDetails: string;
  expectations: string;
  bioDataFile?: File | null;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  profileVisibility: string;
  motherTongue: string;
  profilePhoto?: File | null;
  profilePhotoPreview?: string;
}

// Add this interface for field errors
interface FieldErrors {
  [key: string]: string;
}

// Add this function before the RegisterPage component
const isFieldFilled = (value: string | boolean | File | null) => {
  if (typeof value === 'boolean') return value;
  if (value === null) return false;
  return value.toString().trim().length > 0;
};

// Add this before the RegisterPage component
const inputStyles = "transition-colors focus:ring-2 focus:ring-primary/20 data-[filled=true]:bg-primary/5 data-[filled=true]:border-primary/30"

const selectTriggerStyles = cn(
  "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
  "transition-colors focus:ring-2 focus:ring-primary/20 data-[filled=true]:bg-primary/5 data-[filled=true]:border-primary/30"
)

export default function RegisterPage() {
  const [step, setStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false) // For bio-data file processing
  const [isSubmittingForm, setIsSubmittingForm] = useState(false) // For final form submission
  const [processingProgress, setProcessingProgress] = useState(0)
  const [extractedPreview, setExtractedPreview] = useState<{
    text: string;
    data: ExtractedData | null;
    showDialog: boolean;
  }>({
    text: "",
    data: null,
    showDialog: false,
  })
  const { toast } = useToast()
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    age: "",
    country: "",
    city: "",
    education: "",
    profession: "",
    income: "",
    sect: "",
    hijabNiqab: "",
    beard: "",
    height: "",
    complexion: "",
    maritalPreferences: "",
    preferredAgeMin: "",
    preferredAgeMax: "",
    preferredEducation: "",
    preferredProfession: "",
    preferredLocation: "",
    housing: "",
    aboutMe: "",
    familyDetails: "",
    expectations: "",
    bioDataFile: null,
    termsAccepted: false,
    privacyAccepted: false,
    profileVisibility: "public",
    motherTongue: "",
    profilePhoto: null,
    profilePhotoPreview: ""
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const totalSteps = 4
  const router = useRouter()

  // Load data from localStorage on page load
  useEffect(() => {
    const savedData = localStorage.getItem("heroRegistrationData")
    if (savedData) {
      try {
        const heroData = JSON.parse(savedData)
        setFormData({
          ...formData,
          fullName: heroData.fullName || "",
          gender: heroData.lookingFor === "bride" ? "male" : heroData.lookingFor === "groom" ? "female" : "",
          phone: heroData.countryCode && heroData.mobileNumber 
            ? `${heroData.countryCode}${heroData.mobileNumber}` 
            : ""
        })
      } catch (error) {
        console.error("Error parsing hero registration data:", error)
      }
    }
  }, [])

  const validateFields = (fields: { [key: string]: string }, fieldLabels: { [key: string]: string }) => {
    const errors: FieldErrors = {};
    Object.entries(fields).forEach(([key, value]) => {
      if (!value || value.trim() === '') {
        errors[key] = `${fieldLabels[key]} is required`;
      }
    });
    return errors;
  };

  const handleNext = () => {
    let errors: FieldErrors = {};
    
    if (step === 1) {
      // Basic Information validation
      errors = validateFields(
        {
          fullName: formData.fullName,
          gender: formData.gender,
          phone: formData.phone,
          age: formData.age,
          country: formData.country,
          city: formData.city,
          password: formData.password,
          confirmPassword: formData?.confirmPassword || "",
          motherTongue: formData.motherTongue
        },
        {
          fullName: "Full Name",
          gender: "Gender",
          phone: "Phone Number",
          age: "Age",
          country: "Country",
          city: "City",
          password: "Password",
          confirmPassword: "Confirm Password",
          motherTongue: "Mother Tongue"
        }
      );

      // Password validation
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      if (formData.password && formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters long";
      }

      // Phone number validation
      if (formData.phone) {
        const phoneRegex = /^\+?[1-9]\d{9,14}$/;
        if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
          errors.phone = "Please enter a valid phone number";
        }
      }
    }

    if (step === 2) {
      // Important Details validation
      errors = validateFields(
        {
          sect: formData.sect,
          education: formData.education,
          profession: formData.profession,
          income: formData.income,
          height: formData.height
        },
        {
          sect: "Sect",
          education: "Education",
          profession: "Profession",
          income: "Income",
          height: "Height"
        }
      );
    }

    if (step === 3) {
      // Partner Preferences validation
      errors = validateFields(
        {
          preferredAgeMin: formData.preferredAgeMin,
          preferredAgeMax: formData.preferredAgeMax,
          preferredLocation: formData.preferredLocation // Add preferredLocation for validation
        },
        {
          preferredAgeMin: "Minimum Preferred Age",
          preferredAgeMax: "Maximum Preferred Age",
          preferredLocation: "Preferred Location" // Add label for error message
        }
      );

      // Validate age range
      if (formData.preferredAgeMin && formData.preferredAgeMax) {
        if (parseInt(formData.preferredAgeMin) >= parseInt(formData.preferredAgeMax)) {
          errors.preferredAgeMax = "Maximum age should be greater than minimum age";
        }
      }
    }

    // If there are any errors, show them and prevent proceeding
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
      return;
    }

    // Clear any existing errors if validation passes
    setFieldErrors({});
    
    // Proceed to next step
    if (step < totalSteps) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    try {
      setIsSubmittingForm(true);
      
      // Convert form data to JSON format, omitting optional fields
      const { confirmPassword, profilePhotoPreview, bioDataFile, profilePhoto, ...rest } = formData;
      
      const jsonData = {
        ...rest,
        age: parseInt(formData.age, 10), // Convert age to number
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          const errorMessage = data.error || "An account with these details already exists.";
          toast({
            title: "Registration Failed",
            description: errorMessage,
            variant: "destructive",
          });

          const lowerErrorMessage = errorMessage.toLowerCase();
          
          // Check if error relates to fields in Step 1 and navigate back
          if (lowerErrorMessage.includes("phone") || lowerErrorMessage.includes("mobile") || lowerErrorMessage.includes("email")) {
            setStep(1); // Navigate user to Step 1

            if (lowerErrorMessage.includes("phone") || lowerErrorMessage.includes("mobile")) {
                setFieldErrors(prevErrors => ({ ...prevErrors, phone: errorMessage }));
            } else if (lowerErrorMessage.includes("email")) {
                // This 'else if' ensures only one field error is set if message is ambiguous,
                // prioritizing phone/mobile if keywords for both are present.
                // The toast will show the full original error message.
                setFieldErrors(prevErrors => ({ ...prevErrors, email: errorMessage }));
            }
          }
          // If the error is generic and not tied to phone/email by keywords,
          // user stays on current step, toast is the main feedback.

        } else if (response.status === 400 && data.details) {
          // Handle validation errors
          // Map errors to fields for inline display
          const fieldErrs: FieldErrors = {};
          (data.details as ValidationError[]).forEach((err: ValidationError) => {
            if (err.field) fieldErrs[err.field] = err.message;
          });
          setFieldErrors(fieldErrs);
          // Show all messages in toast as well
          const errorMessage = (data.details as ValidationError[])
            .map((err: ValidationError) => err.message)
            .join("\n");
          toast({
            title: "Validation Error",
            description: errorMessage,
            variant: "destructive",
          });
          // Optionally, navigate to the step containing the first error field
          // Example: if (fieldErrs.email || fieldErrs.phone) setStep(1);
        } else {
          // Generic error for other non-ok statuses
          toast({
            title: "Registration Failed",
            description: data.error || `An unexpected error occurred (Status: ${response.status}). Please try again.`,
            variant: "destructive",
          });
        }
        // No need to set setIsProcessing(false) here as it's not used for form submission
        setIsSubmittingForm(false);
        return;
      }

      // Clear form data from localStorage
      localStorage.removeItem("heroRegistrationData");

      // Store token and user data
      if (data.token && data.user) {
        localStorage.setItem("authToken", data.token);
        // Ensure 'id' is present for dashboard fetch compatibility
        const userObj = { ...data.user };
        if (!userObj.id && data.user.userId) userObj.id = data.user.userId;
        localStorage.setItem("currentUser", JSON.stringify(userObj));
        // Show success message
        toast({
          title: "Registration Successful!",
          description: `Welcome, ${userObj.fullName}! You are now logged in. Redirecting to your dashboard...`,
        });

        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        // Fallback if token/user is somehow missing despite a 200 OK
        // This case should ideally not happen if the API is consistent
        toast({
          title: "Registration Completed",
          description: "Your profile has been created, but an issue occurred with auto-login. Please try logging in manually.",
          variant: "default"
        });
        router.push('/login'); // Or '/success' if preferred as a fallback
      }

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const API_BASE_URL = '';  // Empty string for same-origin requests

  const processBioData = async (file: File) => {
    console.log('Starting bio data processing for file:', file.name);
    setIsProcessing(true);
    setProcessingProgress(0);
    
    try {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Invalid file type. Please upload a PDF or DOCX file. Received: ${file.type}`);
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('File size too large. Please upload a file smaller than 10MB.');
      }

      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      console.log('Sending file to API...');
      let response;
      try {
        response = await fetch(`${API_BASE_URL}/api/process-biodata`, {
          method: 'POST',
          body: formData,
        });
      } catch (networkError) {
        console.error('Network error:', networkError);
        throw new Error('Failed to connect to the server. Please check your internet connection.');
      }

      clearInterval(progressInterval);
      setProcessingProgress(100);

      console.log('API Response status:', response.status);
      
      // Read the response body once
      let text;
      try {
        text = await response.text(); // Get the raw text first
        console.log('Raw response:', text);
      } catch (textError) {
        console.error('Error reading response text:', textError);
        throw new Error('Failed to read server response');
      }

      let result;
      try {
        result = JSON.parse(text); // Then parse it
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Server returned an invalid response format');
      }

      if (!response.ok || !result.success) {
        const errorMessage = result.error || 'Failed to process bio data';
        console.error('API error:', errorMessage);
        throw new Error(errorMessage);
      }

      console.log('API Response:', result);

      if (!result.data) {
        throw new Error('No data could be extracted from the file');
      }

      console.log('Setting preview data:', {
        text: result.text ? result.text.substring(0, 100) + '...' : 'No text',
        data: result.data
      });

      // Show preview dialog
      setExtractedPreview({
        text: result.text || "",
        data: result.data || null,
        showDialog: true
      });

      toast({
        title: "Bio Data Processed",
        description: "Please review the extracted information.",
      });

    } catch (error) {
      console.error('Error processing bio data:', error);
      toast({
        title: "Error Processing Bio Data",
        description: error instanceof Error ? error.message : "There was an error processing your bio data. Please try again or fill the form manually.",
        variant: "destructive",
      });
      setProcessingProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      console.log('No file selected');
      return;
    }

    const file = files[0];
    console.log('File selected:', file.name, 'Type:', file.type);
    processBioData(file);
  };

  const confirmAndFillForm = () => {
    console.log('Confirming and filling form with data:', extractedPreview.data);
    if (extractedPreview.data) {
      // Pre-fill the form with extracted data
      setFormData(prevData => ({
        ...prevData,
        fullName: extractedPreview.data?.fullName || prevData.fullName,
        age: extractedPreview.data?.age || prevData.age,
        education: extractedPreview.data?.education || prevData.education,
        profession: extractedPreview.data?.profession || prevData.profession,
        country: extractedPreview.data?.country || prevData.country,
        city: extractedPreview.data?.city || prevData.city,
        height: extractedPreview.data?.height || prevData.height,
        maritalPreferences: extractedPreview.data?.maritalStatus || prevData.maritalPreferences,
        sect: extractedPreview.data?.sect || prevData.sect,
      }));

      toast({
        title: "Bio Data Applied Successfully",
        description: "Your information has been pre-filled in the form. Please review and complete any missing details.",
      });

      // Close dialog and move to form
      setExtractedPreview(prev => ({ ...prev, showDialog: false }));
      setStep(1);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    
    setFormData(prev => ({
      ...prev,
      profilePhoto: file,
      profilePhotoPreview: previewUrl
    }));
  };

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (formData.profilePhotoPreview) {
        URL.revokeObjectURL(formData.profilePhotoPreview);
      }
    };
  }, [formData.profilePhotoPreview]);

  // Preview Dialog Component
  const PreviewDialog = () => (
    <Dialog open={extractedPreview.showDialog} onOpenChange={(open) => setExtractedPreview(prev => ({ ...prev, showDialog: open }))}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Review Extracted Information</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div>
            <h3 className="font-semibold mb-2">Extracted Data</h3>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              {extractedPreview.data && (
                <div className="space-y-2">
                  {Object.entries(extractedPreview.data).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <p className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</p>
                      <p className="text-sm text-muted-foreground">{value || 'Not found'}</p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Original Text</h3>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {extractedPreview.text || 'No text content available'}
              </p>
            </ScrollArea>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setExtractedPreview(prev => ({ ...prev, showDialog: false }))}>
            Cancel
          </Button>
          <Button onClick={confirmAndFillForm}>
            Use This Information
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Choice screen component
  const ChoiceScreen = () => (
    <Card className="mb-8">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Heart className="h-8 w-8 text-primary mr-2" />
          <h1 className={`${playfair.className} text-2xl font-bold`}>Create Your Profile</h1>
        </div>
        <p className="text-muted-foreground">Choose how you want to create your profile</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setStep(1)}>
            <CardContent className="pt-6">
              <div className="text-center">
                <PenSquare className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className={`${playfair.className} font-semibold text-lg mb-2`}>Fill Form Manually</h3>
                <p className="text-sm text-muted-foreground">
                  Create your profile by filling out our step-by-step form
                </p>
                <Button className="mt-4 w-full">Start Form</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardContent className="pt-6">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className={`${playfair.className} font-semibold text-lg mb-2`}>Upload Bio Data</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your bio data and we'll automatically fill the form for you
                </p>
                <Input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  className="hidden" 
                  id="bioDataFile"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                />
                <Button 
                  className="mt-4 w-full"
                  onClick={() => document.getElementById('bioDataFile')?.click()}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Upload Bio Data"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  // Loading overlay for form submission
  const LoadingOverlay = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span className="text-lg font-semibold text-primary">Creating your profile, please wait...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Show bio-data processing UI only during step 0 (file upload) */}
          {isProcessing && step === 0 && (
            <Card className="mb-4">
              <CardContent className="py-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center">
                    <FileText className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <h3 className={`${playfair.className} font-semibold`}>Processing Bio Data</h3>
                  <Progress value={processingProgress} className="w-full max-w-xs mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    {processingProgress < 100 
                      ? "Extracting information from your document..." 
                      : "Almost done..."}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 0 ? (
            <ChoiceScreen />
          ) : (
            <>
              {/* Progress Header */}
              <Card className="mb-8">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Heart className="h-8 w-8 text-primary mr-2" />
                    <h1 className={`${playfair.className} text-2xl font-bold`}>Create Your Profile</h1>
                  </div>
                  <div className="flex justify-center space-x-2 mb-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          i <= step ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Step {step} of {totalSteps}:{" "}
                    {step === 1
                      ? "Basic Information"
                      : step === 2
                        ? "Important Details"
                        : step === 3
                          ? "Partner Preferences"
                          : "Final Details"}
                  </div>
                </CardHeader>
              </Card>

              {/* Step 1: Basic Information */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          className={cn(
                            inputStyles,
                            fieldErrors.fullName && "border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500"
                          )}
                          data-filled={isFieldFilled(formData.fullName)}
                          value={formData.fullName}
                          onChange={(e) => {
                            setFormData({ ...formData, fullName: e.target.value });
                            if (fieldErrors.fullName) {
                              setFieldErrors({ ...fieldErrors, fullName: "" });
                            }
                          }}
                          placeholder="Enter your full name"
                        />
                        {fieldErrors.fullName && (
                          <p className="text-sm text-red-500 mt-1">{fieldErrors.fullName}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender *</Label>
                        <Select value={formData.gender} onValueChange={(value) => {
                          setFormData({ ...formData, gender: value });
                          if (fieldErrors.gender) {
                            setFieldErrors({ ...fieldErrors, gender: "" });
                          }
                        }}>
                          <SelectTrigger className={cn(selectTriggerStyles, fieldErrors.gender && "border-red-500")} data-filled={isFieldFilled(formData.gender)}>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldErrors.gender && (
                          <p className="text-sm text-red-500 mt-1">{fieldErrors.gender}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address (Optional)</Label>
                        <Input
                          id="email"
                          type="email"
                          className={cn(inputStyles, fieldErrors.email && "border-red-500")}
                          data-filled={isFieldFilled(formData.email)}
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (fieldErrors.email) {
                              setFieldErrors({ ...fieldErrors, email: "" });
                            }
                          }}
                          placeholder="your@email.com"
                        />
                        {fieldErrors.email && (
                          <p className="text-sm text-red-500 mt-1">{fieldErrors.email}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">WhatsApp Phone Number *</Label>
                        <Input
                          id="phone"
                          className={cn(inputStyles, fieldErrors.phone && "border-red-500")}
                          data-filled={isFieldFilled(formData.phone)}
                          value={formData.phone}
                          onChange={(e) => {
                            setFormData({ ...formData, phone: e.target.value });
                            if (fieldErrors.phone) {
                              setFieldErrors({ ...fieldErrors, phone: "" });
                            }
                          }}
                          placeholder="WhatsApp Phone Number"
                        />
                        {fieldErrors.phone && (
                          <p className="text-sm text-red-500 mt-1">{fieldErrors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age">Age *</Label>
                        <Input
                          id="age"
                          type="number"
                          className={cn(inputStyles, fieldErrors.age && "border-red-500")}
                          data-filled={isFieldFilled(formData.age)}
                          value={formData.age}
                          onChange={(e) => {
                            setFormData({ ...formData, age: e.target.value });
                            if (fieldErrors.age) {
                              setFieldErrors({ ...fieldErrors, age: "" });
                            }
                          }}
                          placeholder="Enter your age"
                          min="18"
                          max="60"
                          required
                        />
                        {fieldErrors.age && (
                          <p className="text-sm text-red-500 mt-1">{fieldErrors.age}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="motherTongue">Mother Tongue *</Label>
                        <Select value={formData.motherTongue} onValueChange={(value) => {
                          setFormData({ ...formData, motherTongue: value });
                          if (fieldErrors.motherTongue) {
                            setFieldErrors({ ...fieldErrors, motherTongue: "" });
                          }
                        }}>
                          <SelectTrigger className={cn(selectTriggerStyles, fieldErrors.motherTongue && "border-red-500")} data-filled={isFieldFilled(formData.motherTongue)}>
                            <SelectValue placeholder="Select mother tongue" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urdu">Urdu</SelectItem>
                            <SelectItem value="hindi">Hindi</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="arabic">Arabic</SelectItem>
                            <SelectItem value="bengali">Bengali</SelectItem>
                            <SelectItem value="gujarati">Gujarati</SelectItem>
                            <SelectItem value="marathi">Marathi</SelectItem>
                            <SelectItem value="tamil">Tamil</SelectItem>
                            <SelectItem value="telugu">Telugu</SelectItem>
                            <SelectItem value="kannada">Kannada</SelectItem>
                            <SelectItem value="malayalam">Malayalam</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldErrors.motherTongue && (
                          <p className="text-sm text-red-500 mt-1">{fieldErrors.motherTongue}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Select value={formData.country} onValueChange={(value) => {
                          setFormData({ ...formData, country: value });
                          if (fieldErrors.country) {
                            setFieldErrors({ ...fieldErrors, country: "" });
                          }
                        }}>
                          <SelectTrigger className={cn(selectTriggerStyles, fieldErrors.country && "border-red-500")} data-filled={isFieldFilled(formData.country)}>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="india">India</SelectItem>                      
                            <SelectItem value="uae">United Arab Emirates</SelectItem>
                            <SelectItem value="saudi-arabia">Saudi Arabia</SelectItem>
                            <SelectItem value="qatar">Qatar</SelectItem>
                            <SelectItem value="kuwait">Kuwait</SelectItem>
                            <SelectItem value="oman">Oman</SelectItem>
                            <SelectItem value="bahrain">Bahrain</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldErrors.country && (
                          <p className="text-sm text-red-500 mt-1">{fieldErrors.country}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          className={cn(inputStyles, fieldErrors.city && "border-red-500")}
                          data-filled={isFieldFilled(formData.city)}
                          value={formData.city}
                          onChange={(e) => {
                            setFormData({ ...formData, city: e.target.value });
                            if (fieldErrors.city) {
                              setFieldErrors({ ...fieldErrors, city: "" });
                            }
                          }}
                          placeholder="Enter city"
                        />
                        {fieldErrors.city && (
                          <p className="text-sm text-red-500 mt-1">{fieldErrors.city}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="password">Password *</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className={cn(inputStyles, fieldErrors.password && "border-red-500")}
                            data-filled={isFieldFilled(formData.password)}
                            value={formData.password}
                            onChange={(e) => {
                              setFormData({ ...formData, password: e.target.value });
                              if (fieldErrors.password) {
                                setFieldErrors({ ...fieldErrors, password: "" });
                              }
                            }}
                            placeholder="Create a strong password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {fieldErrors.password && (
                          <p className="text-sm text-red-500 mt-1">{fieldErrors.password}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          className={cn(inputStyles, fieldErrors.confirmPassword && "border-red-500")}
                          data-filled={isFieldFilled(formData.confirmPassword || "")}
                          value={formData.confirmPassword || ""}
                          onChange={(e) => {
                            setFormData({ ...formData, confirmPassword: e.target.value });
                            if (fieldErrors.confirmPassword) {
                              setFieldErrors({ ...fieldErrors, confirmPassword: "" });
                            }
                          }}
                          placeholder="Confirm your password"
                        />
                        {fieldErrors.confirmPassword && (
                          <p className="text-sm text-red-500 mt-1">{fieldErrors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Important Details */}
              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Important Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sect">Maslak / Sect *</Label>
                        <Select value={formData.sect} onValueChange={(value) => {
                          setFormData({ ...formData, sect: value });
                          if (fieldErrors.sect) {
                            setFieldErrors({ ...fieldErrors, sect: "" });
                          }
                        }}>
                          <SelectTrigger className={cn(selectTriggerStyles, fieldErrors.sect && "border-red-500")} data-filled={isFieldFilled(formData.sect)}>
                            <SelectValue placeholder="Select Maslak" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sunni">Sunni</SelectItem>
                            <SelectItem value="shafii">Shafi'i</SelectItem>
                            <SelectItem value="barelvi">Barelvi</SelectItem>
                            <SelectItem value="deobandi">Deobandi</SelectItem>
                            <SelectItem value="hanafi">Hanafi</SelectItem>
                            <SelectItem value="shia">Shia</SelectItem>
                            <SelectItem value="revert">Revert Muslim</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="no-preference">No Preference</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldErrors.sect && (
                          <p className="text-sm text-red-500 mt-1">{fieldErrors.sect}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="education">Education *</Label>
                        <Input
                          id="education"
                          className={cn(inputStyles, fieldErrors.education && "border-red-500")}
                          data-filled={isFieldFilled(formData.education)}
                          value={formData.education}
                          onChange={(e) => {
                            setFormData({ ...formData, education: e.target.value });
                            if (fieldErrors.education) {
                              setFieldErrors({ ...fieldErrors, education: "" });
                            }
                          }}
                          placeholder="e.g., Bachelor's in Computer Science"
                        />
                        {fieldErrors.education && (
                          <p className="text-sm text-red-500 mt-1">{fieldErrors.education}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="profession">Profession *</Label>
                        <Select value={formData.profession} onValueChange={(value) => setFormData({ ...formData, profession: value })}>
                          <SelectTrigger className={selectTriggerStyles} data-filled={isFieldFilled(formData.profession)}>
                            <SelectValue placeholder="Select profession" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="it-software">IT & Software</SelectItem>
                            <SelectItem value="engineering">Engineering</SelectItem>
                            <SelectItem value="medicine">Medical & Healthcare</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="government">Government</SelectItem>
                            <SelectItem value="banking">Banking & Finance</SelectItem>
                            <SelectItem value="arts">Arts & Design</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="income">Income Source *</Label>
                        <Select value={formData.income} onValueChange={(value) => setFormData({ ...formData, income: value })}>
                          <SelectTrigger className={selectTriggerStyles} data-filled={isFieldFilled(formData.income)}>
                            <SelectValue placeholder="Select income range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="salaried">Salaried</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="self-employed">Self-Employed</SelectItem>
                            <SelectItem value="family-business">Family Business</SelectItem>
                            <SelectItem value="investment">Investment</SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                            <SelectItem value="not-working">Not Working</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="height">Height *</Label>
                        <Input
                          id="height"
                          className={cn(inputStyles, fieldErrors.height && "border-red-500")}
                          data-filled={isFieldFilled(formData.height)}
                          value={formData.height}
                          onChange={(e) => {
                            setFormData({ ...formData, height: e.target.value });
                            if (fieldErrors.height) {
                              setFieldErrors({ ...fieldErrors, height: "" });
                            }
                          }}
                          placeholder="e.g., 5'6''"
                        />
                        {fieldErrors.height && (
                          <p className="text-sm text-red-500 mt-1">{fieldErrors.height}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="complexion">Complexion</Label>
                        <Select value={formData.complexion} onValueChange={(value) => setFormData({ ...formData, complexion: value })}>
                          <SelectTrigger className={selectTriggerStyles} data-filled={isFieldFilled(formData.complexion)}>
                            <SelectValue placeholder="Select complexion" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="very-fair">Very Fair</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="wheatish">Wheatish</SelectItem>
                            <SelectItem value="wheatish-brown">Wheatish Brown</SelectItem>
                            <SelectItem value="brown">Brown</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {formData.gender === "male" && (
                      <div>
                        <Label htmlFor="beard">Beard</Label>
                        <Select value={formData.beard} onValueChange={(value) => setFormData({ ...formData, beard: value })}>
                          <SelectTrigger className={selectTriggerStyles} data-filled={isFieldFilled(formData.beard)}>
                            <SelectValue placeholder="Select beard style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full">Full beard</SelectItem>
                            <SelectItem value="trimmed">Trimmed beard</SelectItem>
                            <SelectItem value="mustache">Mustache only</SelectItem>
                            <SelectItem value="clean">Clean shaven</SelectItem>
                            <SelectItem value="growing">Growing beard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Partner Preferences */}
              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Partner Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="preferredAgeMin">Preferred Age Range *</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="preferredAgeMin"
                            type="number"
                            className={cn(inputStyles, fieldErrors.preferredAgeMin && "border-red-500")}
                            data-filled={isFieldFilled(formData.preferredAgeMin)}
                            value={formData.preferredAgeMin}
                            onChange={(e) => {
                              setFormData({ ...formData, preferredAgeMin: e.target.value });
                              if (fieldErrors.preferredAgeMin) {
                                setFieldErrors({ ...fieldErrors, preferredAgeMin: "" });
                              }
                            }}
                            placeholder="Min age (e.g., 21)"
                            min="18"
                            max="60"
                          />
                          <Input
                            id="preferredAgeMax"
                            type="number"
                            className={cn(inputStyles, fieldErrors.preferredAgeMax && "border-red-500")}
                            data-filled={isFieldFilled(formData.preferredAgeMax)}
                            value={formData.preferredAgeMax}
                            onChange={(e) => {
                              setFormData({ ...formData, preferredAgeMax: e.target.value });
                              if (fieldErrors.preferredAgeMax) {
                                setFieldErrors({ ...fieldErrors, preferredAgeMax: "" });
                              }
                            }}
                            placeholder="Max age (e.g., 30)"
                            min="18"
                            max="60"
                          />
                        </div>
                        {fieldErrors.preferredAgeMin && (
                          <p className="text-sm text-red-500 mt-1">{fieldErrors.preferredAgeMin}</p>
                        )}
                        {fieldErrors.preferredAgeMax && (
                          <p className="text-sm text-red-500 mt-1">{fieldErrors.preferredAgeMax}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="preferredEducation">Preferred Education</Label>
                        <Select value={formData.preferredEducation} onValueChange={(value) => setFormData({ ...formData, preferredEducation: value })}>
                          <SelectTrigger className={selectTriggerStyles} data-filled={isFieldFilled(formData.preferredEducation)}>
                            <SelectValue placeholder="Select preferred education" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="any">Any</SelectItem>
                            <SelectItem value="high-school">High School & above</SelectItem>
                            <SelectItem value="bachelors">Bachelor's & above</SelectItem>
                            <SelectItem value="masters">Master's & above</SelectItem>
                            <SelectItem value="islamic-studies">Islamic Studies preferred</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="preferredProfession">Preferred Profession</Label>
                        <Input
                          id="preferredProfession"
                          className={inputStyles}
                          data-filled={isFieldFilled(formData.preferredProfession)}
                          value={formData.preferredProfession}
                          onChange={(e) => setFormData({ ...formData, preferredProfession: e.target.value })}
                          placeholder="e.g., Doctor, Engineer, Teacher"
                        />
                      </div>
                      <div>
                        <Label htmlFor="housing">Housing Status</Label>
                        <Select value={formData.housing} onValueChange={(value) => setFormData({ ...formData, housing: value })}>
                          <SelectTrigger className={selectTriggerStyles} data-filled={isFieldFilled(formData.housing)}>
                            <SelectValue placeholder="Select housing status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="own">Own House</SelectItem>
                            <SelectItem value="rental">Rental</SelectItem>
                            <SelectItem value="family">Living with Family</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="preferredLocation">Preferred Location</Label>
                        <Input
                          id="preferredLocation"
                          className={inputStyles}
                          data-filled={isFieldFilled(formData.preferredLocation)}
                          value={formData.preferredLocation}
                          onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                          placeholder="e.g., Mumbai, Maharashtra, India"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maritalPreferences">Marital Preferences</Label>
                        <Select value={formData.maritalPreferences} onValueChange={(value) => setFormData({ ...formData, maritalPreferences: value })}>
                          <SelectTrigger className={selectTriggerStyles} data-filled={isFieldFilled(formData.maritalPreferences)}>
                            <SelectValue placeholder="Select marital status preference" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="never-married">Never Married</SelectItem>
                            <SelectItem value="divorced">Divorced</SelectItem>
                            <SelectItem value="widowed">Widowed</SelectItem>
                            <SelectItem value="any">Any</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="expectations">What are you looking for in a life partner?</Label>
                      <Textarea
                        id="expectations"
                        className={inputStyles}
                        data-filled={isFieldFilled(formData.expectations)}
                        value={formData.expectations}
                        onChange={(e) => setFormData({ ...formData, expectations: e.target.value })}
                        placeholder="Describe your expectations, values, and what matters most to you in a life partner..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Final Details */}
              {step === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Final Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="aboutMe">About Me</Label>
                      <Textarea
                        id="aboutMe"
                        className={inputStyles}
                        data-filled={isFieldFilled(formData.aboutMe)}
                        value={formData.aboutMe}
                        onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                        placeholder="Tell us about yourself, your interests, and what makes you unique..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="familyDetails">Family Details</Label>
                      <Textarea
                        id="familyDetails"
                        className={inputStyles}
                        data-filled={isFieldFilled(formData.familyDetails)}
                        value={formData.familyDetails}
                        onChange={(e) => setFormData({ ...formData, familyDetails: e.target.value })}
                        placeholder="Brief information about your family background..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Profile Photo</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                        <div className="space-y-4">
                          {formData.profilePhotoPreview ? (
                            <div className="relative w-32 h-32 mx-auto">
                              <img
                                src={formData.profilePhotoPreview}
                                alt="Profile preview"
                                className="w-full h-full object-cover rounded-full"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                                onClick={() => {
                                  if (formData.profilePhotoPreview) {
                                    URL.revokeObjectURL(formData.profilePhotoPreview);
                                  }
                                  setFormData(prev => ({
                                    ...prev,
                                    profilePhoto: null,
                                    profilePhotoPreview: ""
                                  }));
                                }}
                              >
                                ×
                              </Button>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                              <p className="text-sm text-muted-foreground mb-2">Upload your profile photo</p>
                              <p className="text-xs text-muted-foreground mb-4">JPG or PNG, max 5MB</p>
                            </div>
                          )}
                          
                          <div className="flex justify-center">
                            <Input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id="profilePhoto"
                              onChange={handlePhotoChange}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('profilePhoto')?.click()}
                            >
                              {formData.profilePhoto ? 'Change Photo' : 'Choose Photo'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Profile Visibility</Label>
                      <RadioGroup
                        value={formData.profileVisibility}
                        onValueChange={(value) => setFormData({ ...formData, profileVisibility: value })}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="public" id="public" />
                          <Label htmlFor="public">Public - Visible to all members</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="private" id="private" />
                          <Label htmlFor="private">Private - Only visible after mutual interest</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.termsAccepted}
                          onCheckedChange={(checked) => setFormData({ ...formData, termsAccepted: checked as boolean })}
                        />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the{" "}
                          <Link href="/terms" className="text-primary hover:underline">
                            Terms of Service
                          </Link>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="privacy"
                          checked={formData.privacyAccepted}
                          onCheckedChange={(checked) => setFormData({ ...formData, privacyAccepted: checked as boolean })}
                        />
                        <Label htmlFor="privacy" className="text-sm">
                          I agree to the{" "}
                          <Link href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={handlePrevious} disabled={step === 1}>
                  Previous
                </Button>

                {step < totalSteps ? (
                  <Button onClick={handleNext} className="gradient-emerald text-white">
                    Next Step
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="gradient-emerald text-white"
                    disabled={isSubmittingForm || !formData.termsAccepted || !formData.privacyAccepted}
                  >
                    {isSubmittingForm ? "Creating Profile..." : "Create Profile"}
                  </Button>
                )}
              </div>

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Loading overlay shown during registration submission */}
      {isSubmittingForm && <LoadingOverlay />}
      <PreviewDialog />
      <Footer />
    </div>
  )
}