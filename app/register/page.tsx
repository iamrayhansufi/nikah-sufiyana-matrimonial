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

export default function RegisterPage() {
  const [step, setStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
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
  const [formData, setFormData] = useState({
    // Basic Info
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    age: "",

    // Location
    country: "",
    city: "",

    // Education & Profession
    education: "",
    profession: "",
    income: "",

    // Islamic Details
    sect: "",
    hijabNiqab: "",
    beard: "",
    height: "",
    complexion: "",
    maritalPreferences: "",

    // Partner Preferences
    preferredAgeMin: "",
    preferredAgeMax: "",
    preferredEducation: "",
    preferredProfession: "",
    preferredLocation: "",
    housing: "",

    // Additional
    aboutMe: "",
    familyDetails: "",
    expectations: "",
    bioDataFile: null as File | null,

    // Agreements
    termsAccepted: false,
    privacyAccepted: false,
    profileVisibility: "public",

    // New fields
    motherTongue: "",
  })

  const totalSteps = 4

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

  const handleNext = () => {
    if (step === 1) {
      // Validate passwords match before allowing to proceed
      if (formData.password !== formData.confirmPassword) {
        setPasswordError("Passwords do not match");
        return;
      }
    }
    if (step < totalSteps) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted:", formData)
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {isProcessing && (
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
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender *</Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) => setFormData({ ...formData, gender: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male (Groom)</SelectItem>
                            <SelectItem value="female">Female (Bride)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email Address (Optional)</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">WhatsApp Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="WhatsApp Phone Number"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age">Age *</Label>
                        <Input
                          id="age"
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          placeholder="Enter your age"
                          min="18"
                          max="60"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="motherTongue">Mother Tongue *</Label>
                        <Select
                          value={formData.motherTongue}
                          onValueChange={(value) => setFormData({ ...formData, motherTongue: value })}
                        >
                          <SelectTrigger>
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
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Select
                          value={formData.country}
                          onValueChange={(value) => setFormData({ ...formData, country: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your country" />
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
                      </div>
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Enter city"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="password">Password *</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData({ ...formData, confirmPassword: value });
                            if (value !== formData.password) {
                              setPasswordError("Passwords do not match");
                            } else {
                              setPasswordError("");
                            }
                          }}
                          placeholder="Confirm your password"
                          className={passwordError ? "border-red-500" : ""}
                        />
                        {passwordError && (
                          <p className="text-sm text-red-500 mt-1">{passwordError}</p>
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
                        <Select value={formData.sect} onValueChange={(value) => setFormData({ ...formData, sect: value })}>
                          <SelectTrigger>
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
                      </div>
                      <div>
                        <Label htmlFor="education">Education *</Label>
                        <Input
                          id="education"
                          value={formData.education}
                          onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                          placeholder="e.g., Bachelor's in Computer Science"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="profession">Profession *</Label>
                        <Select
                          value={formData.profession}
                          onValueChange={(value) => setFormData({ ...formData, profession: value })}
                        >
                          <SelectTrigger>
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
                        <Select
                          value={formData.income}
                          onValueChange={(value) => setFormData({ ...formData, income: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select income source" />
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
                          value={formData.height}
                          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                          placeholder="e.g., 5'6''"
                        />
                      </div>
                      <div>
                        <Label htmlFor="complexion">Complexion</Label>
                        <Select
                          value={formData.complexion}
                          onValueChange={(value) => setFormData({ ...formData, complexion: value })}
                        >
                          <SelectTrigger>
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
                        <Select
                          value={formData.beard}
                          onValueChange={(value) => setFormData({ ...formData, beard: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select beard preference" />
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
                            value={formData.preferredAgeMin}
                            onChange={(e) => setFormData({ ...formData, preferredAgeMin: e.target.value })}
                            placeholder="Min age (e.g., 21)"
                            min="18"
                            max="60"
                          />
                          <Input
                            id="preferredAgeMax"
                            type="number"
                            value={formData.preferredAgeMax}
                            onChange={(e) => setFormData({ ...formData, preferredAgeMax: e.target.value })}
                            placeholder="Max age (e.g., 30)"
                            min="18"
                            max="60"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="preferredEducation">Preferred Education</Label>
                        <Select
                          value={formData.preferredEducation}
                          onValueChange={(value) => setFormData({ ...formData, preferredEducation: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select preferred education level" />
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
                          value={formData.preferredProfession}
                          onChange={(e) => setFormData({ ...formData, preferredProfession: e.target.value })}
                          placeholder="e.g., Doctor, Engineer, Teacher"
                        />
                      </div>
                      <div>
                        <Label htmlFor="housing">Housing Status</Label>
                        <Select
                          value={formData.housing}
                          onValueChange={(value) => setFormData({ ...formData, housing: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select current housing status" />
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
                          value={formData.preferredLocation}
                          onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                          placeholder="e.g., Mumbai, Maharashtra, India"
                        />
                      </div>
                      <div>
                        <Label htmlFor="maritalPreferences">Marital Preferences</Label>
                        <Select
                          value={formData.maritalPreferences}
                          onValueChange={(value) => setFormData({ ...formData, maritalPreferences: value })}
                        >
                          <SelectTrigger>
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
                        value={formData.familyDetails}
                        onChange={(e) => setFormData({ ...formData, familyDetails: e.target.value })}
                        placeholder="Brief information about your family background..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Profile Photo</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground mb-2">Upload your profile photo (Optional)</p>
                        <Button variant="outline" size="sm">
                          Choose File
                        </Button>
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
                    disabled={!formData.termsAccepted || !formData.privacyAccepted}
                  >
                    Create Profile
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

      <PreviewDialog />
      <Footer />
    </div>
  )
}