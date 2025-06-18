"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  User, 
  AlertCircle, 
  Check, 
  Loader2, 
  Save,
  UserCircle, 
  Book, 
  GraduationCap, 
  Heart, 
  Home,
  Settings,
  Upload,
  Image,
  X,
  Plus,
  CheckCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

// Form types
interface BasicProfileForm {
  fullName: string;
  age: string;
  gender: string;
  location: string;
  maritalStatus: string;
  maritalStatusOther?: string;
  sect: string;
  height: string;
  complexion: string;
  aboutMe: string;
  city: string;
  country: string;
  address: string;
}

interface EducationCareerForm {
  education: string;
  educationDetails: string;
  profession: string;
  income: string;
  jobTitle: string;
}

interface SiblingInfo {
  name: string;
  maritalStatus: string;
  siblingType: string;
  occupation: string;
}

interface SiblingBrotherInLaw {
  name: string;
  occupation: string;
}

interface MaternalPaternal {
  relation: string;
  name: string;
  occupation: string;
}

interface FamilyInfoForm {
  familyDetails: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  motherOccupationOther?: string;
  siblings: SiblingInfo[];
  brotherInLaws: SiblingBrotherInLaw[];
  maternalPaternal: MaternalPaternal[];
  housingStatus: string;
  housingStatusOther?: string;
}

interface PartnerPreferencesForm {
  preferredAgeMin: string;
  preferredAgeMax: string;
  preferredLocation: string;
  preferredEducation: string;
  preferredOccupation: string;
  preferredHeight: string;
  preferredComplexion: string;
  preferredMaslak: string;
  expectations: string;
}

interface PrivacySettingsForm {
  showContactInfo: boolean;
  showPhotos: boolean;
  hideProfile: boolean;
  showOnlineStatus: boolean;
  showFatherNumber: boolean;
  fatherMobile: string;
  showMotherNumber: boolean;
  motherMobile: string;
  mobileNumber: string;
  profilePhotos?: string[];
}

// Helper component for form fields with validation
interface FormFieldProps {
  label: string;
  filled: boolean;
  children: React.ReactNode;
}

const FormField = ({ label, filled, children }: FormFieldProps) => {
  return (
    <div className="space-y-2 relative">
      <div className="flex justify-between items-center">
        <Label>{label}</Label>
        {filled && (
          <CheckCircle className="h-4 w-4 text-green-500" />
        )}
      </div>
      {children}
    </div>
  );
};

export default function EditProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [savingTab, setSavingTab] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<any>(null)
  // Default to basic tab and make sure we're not using the 'religious' tab anymore
  const [activeTab, setActiveTab] = useState("basic")  
  
  // Form states for each tab
  const [basicForm, setBasicForm] = useState<BasicProfileForm>({
    fullName: "",
    age: "",
    gender: "",
    location: "",
    maritalStatus: "",
    sect: "",
    height: "",
    complexion: "",
    aboutMe: "",
    city: "",
    country: "",
    address: ""
  })
  
  const [educationCareerForm, setEducationCareerForm] = useState<EducationCareerForm>({
    education: "",
    educationDetails: "",
    profession: "",
    income: "",
    jobTitle: ""
  })
  
  const [familyForm, setFamilyForm] = useState<FamilyInfoForm>({
    familyDetails: "",
    fatherName: "",
    fatherOccupation: "",
    motherName: "",
    motherOccupation: "Home Queen",
    motherOccupationOther: "",
    siblings: [],
    brotherInLaws: [],
    maternalPaternal: [],
    housingStatus: "",
    housingStatusOther: ""
  })
    const [partnerForm, setPartnerForm] = useState<PartnerPreferencesForm>({
    preferredAgeMin: "",
    preferredAgeMax: "",
    preferredLocation: "",
    preferredEducation: "",
    preferredOccupation: "",
    preferredHeight: "",
    preferredComplexion: "",
    preferredMaslak: "",    expectations: ""
  })
  
  const [privacyForm, setPrivacyForm] = useState<PrivacySettingsForm>({
    showContactInfo: true,
    showPhotos: true,
    hideProfile: false,
    showOnlineStatus: true,
    showFatherNumber: false,
    fatherMobile: "",
    showMotherNumber: false,
    motherMobile: "",
    mobileNumber: "",
    profilePhotos: []
  })

  // Fetch profile data on component mount
  useEffect(() => {
    let isMounted = true;
    
    async function fetchProfile() {
      if (status === "loading") return
      
      if (status === "unauthenticated") {
        if (isMounted) {
          setError("Please log in to access your profile")
        }
        router.push('/login?callbackUrl=/edit-profile')
        return
      }
      
      if (!session?.user?.id) {
        if (isMounted) {
          setError("User ID not found. Please log in again.")
        }
        return
      }
      
      if (isMounted) {
        setLoading(true)
      }

      try {
        console.log("Fetching profile with ID:", session.user.id);
        
        // Test database connection first
        const testResponse = await fetch('/api/test/db')
        if (!testResponse.ok) {
          console.error("Database connection test failed");
          throw new Error("Database connection error. Please try again later.")
        }
        
        const response = await fetch(`/api/profiles/${session.user.id}`)
        
        if (!response.ok) {
          console.error("Failed to fetch profile:", response.status);
          // Try to get error details
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(`Failed to fetch profile: ${errorData.error || response.status}`)
        }
        
        const data = await response.json()
        console.log("Profile data received:", Object.keys(data).length, "fields");
        
        if (isMounted) {
          setProfileData(data)
            // Populate form data for each tab
          setBasicForm({            fullName: data.fullName || "",
            age: data.age ? String(data.age) : "",
            gender: data.gender || "",
            location: data.location || "",
            maritalStatus: data.maritalStatus || "",
            maritalStatusOther: data.maritalStatusOther || "",
            sect: data.sect || "",
            height: data.height || "",
            complexion: data.complexion || "",
            aboutMe: data.aboutMe || "",
            city: data.city || "",
            country: data.country || "",
            address: data.address || ""
          })
          
          setEducationCareerForm({
            education: data.education || "",
            educationDetails: data.educationDetails || "",
            profession: data.profession || "",
            income: data.income || "",
            jobTitle: data.jobTitle || ""
          })          // Process siblings data if it exists
          let siblingsArray: SiblingInfo[] = [];
          try {
            if (data.siblings && typeof data.siblings === 'string') {
              // Skip parsing if it's "Not specified" or not valid JSON
              if (data.siblings !== "Not specified" && data.siblings.charAt(0) === '[') {
                // Try to parse if it's a JSON string
                siblingsArray = JSON.parse(data.siblings);
                console.log("Successfully parsed siblings from JSON string:", siblingsArray);
              }
            } else if (Array.isArray(data.siblings)) {
              siblingsArray = data.siblings;
              console.log("Siblings was already an array:", siblingsArray);
            }
            
            // Ensure each sibling has all required properties
            siblingsArray = siblingsArray.map(sibling => ({
              name: sibling.name || '',
              siblingType: sibling.siblingType || 'brother',
              maritalStatus: sibling.maritalStatus || 'unmarried',
              occupation: sibling.occupation || ''
            }));
            
          } catch (e) {
            console.warn("Could not parse siblings data:", e);
            console.error(e);
          }
          
          console.log("Final siblings array for form:", siblingsArray);// Process brother-in-law data if it exists
          let brotherInLawsArray: SiblingBrotherInLaw[] = [];
          try {
            if (data.brotherInLaws && typeof data.brotherInLaws === 'string') {
              // Skip parsing if it's "Not specified" or not valid JSON
              if (data.brotherInLaws !== "Not specified" && data.brotherInLaws.charAt(0) === '[') {
                brotherInLawsArray = JSON.parse(data.brotherInLaws);
              }
            } else if (Array.isArray(data.brotherInLaws)) {
              brotherInLawsArray = data.brotherInLaws;
            }
          } catch (e) {
            console.warn("Could not parse brother-in-law data:", e);
          }          // Process maternal/paternal data if it exists
          let maternalPaternalArray: MaternalPaternal[] = [];
          try {
            if (data.maternalPaternal && typeof data.maternalPaternal === 'string') {
              // Skip parsing if it's "Not specified" or not valid JSON
              if (data.maternalPaternal !== "Not specified" && data.maternalPaternal.charAt(0) === '[') {
                maternalPaternalArray = JSON.parse(data.maternalPaternal);
              }
            } else if (Array.isArray(data.maternalPaternal)) {
              maternalPaternalArray = data.maternalPaternal;
            }          } catch (e) {
            console.warn("Could not parse maternal/paternal data:", e);
          }
            setFamilyForm({
            familyDetails: data.familyDetails || "",
            fatherName: data.fatherName || "",
            fatherOccupation: data.fatherOccupation || "",
            motherName: data.motherName || "",
            motherOccupation: data.motherOccupation || "Home Queen",
            motherOccupationOther: data.motherOccupation !== "Home Queen" && data.motherOccupation !== "" ? data.motherOccupation : "",
            siblings: siblingsArray || [],
            brotherInLaws: brotherInLawsArray || [],
            maternalPaternal: maternalPaternalArray || [],
            housingStatus: data.housingStatus || ""
          })
            setPartnerForm({
            preferredAgeMin: data.preferredAgeMin ? String(data.preferredAgeMin) : "",
            preferredAgeMax: data.preferredAgeMax ? String(data.preferredAgeMax) : "",
            preferredLocation: data.preferredLocation || "",
            preferredEducation: data.preferredEducation || "",
            preferredOccupation: data.preferredOccupation || "",
            preferredHeight: data.preferredHeight || "",
            preferredComplexion: data.preferredComplexion || "",
            preferredMaslak: data.preferredMaslak || "",
            expectations: data.expectations || ""
          })
            setPrivacyForm({
            showContactInfo: data.showContactInfo !== undefined ? data.showContactInfo : true,
            showPhotos: data.showPhotos !== undefined ? data.showPhotos : true,
            hideProfile: data.hideProfile !== undefined ? data.hideProfile : false,
            showOnlineStatus: data.showOnlineStatus !== undefined ? data.showOnlineStatus : true,
            showFatherNumber: data.showFatherNumber !== undefined ? data.showFatherNumber : false,
            fatherMobile: data.fatherMobile || "",
            showMotherNumber: data.showMotherNumber !== undefined ? data.showMotherNumber : false,
            motherMobile: data.motherMobile || "",
            mobileNumber: data.mobileNumber || "",
            profilePhotos: Array.isArray(data.profilePhotos) ? data.profilePhotos : 
                          typeof data.profilePhotos === 'string' ? JSON.parse(data.profilePhotos || '[]') : []
          })
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching profile:", error)
          setError("Failed to load your profile data")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    fetchProfile()
    
    return () => {
      isMounted = false
    }
  }, [session, status, router])
  
  // Handle form input changes for different tabs
  const handleBasicChange = (field: keyof BasicProfileForm, value: string) => {
    setBasicForm(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  
  const handleEducationCareerChange = (field: keyof EducationCareerForm, value: string) => {
    setEducationCareerForm(prev => ({
      ...prev,
      [field]: value
    }))
  }
    const handleFamilyChange = (field: keyof FamilyInfoForm, value: string) => {
    setFamilyForm(prev => ({
      ...prev,
      [field]: value
    }))
  }
    const handleSiblingChange = (index: number, field: keyof SiblingInfo, value: string) => {
    setFamilyForm(prev => {
      const siblings = [...prev.siblings];
      siblings[index] = { ...siblings[index], [field]: value };
      return { ...prev, siblings };
    });
  }
    const addSibling = () => {
    setFamilyForm(prev => ({
      ...prev,
      siblings: [
        ...prev.siblings,
        { name: "", siblingType: "", maritalStatus: "", occupation: "" }
      ]
    }));
  }
  
  const removeSibling = (index: number) => {
    setFamilyForm(prev => ({
      ...prev,
      siblings: prev.siblings.filter((_, i) => i !== index)
    }));
  }
  
  const handleBrotherInLawChange = (index: number, field: keyof SiblingBrotherInLaw, value: string) => {
    setFamilyForm(prev => {
      const brotherInLaws = [...prev.brotherInLaws];
      brotherInLaws[index] = { ...brotherInLaws[index], [field]: value };
      return { ...prev, brotherInLaws };
    });
  }
  
  const addBrotherInLaw = () => {
    setFamilyForm(prev => ({
      ...prev,
      brotherInLaws: [
        ...prev.brotherInLaws,
        { name: "", occupation: "" }
      ]
    }));
  }
  
  const removeBrotherInLaw = (index: number) => {
    setFamilyForm(prev => ({
      ...prev,
      brotherInLaws: prev.brotherInLaws.filter((_, i) => i !== index)
    }));
  }
  
  const handleMaternalPaternalChange = (index: number, field: keyof MaternalPaternal, value: string) => {
    setFamilyForm(prev => {
      const maternalPaternal = [...prev.maternalPaternal];
      maternalPaternal[index] = { ...maternalPaternal[index], [field]: value };
      return { ...prev, maternalPaternal };
    });
  }
  
  const addMaternalPaternal = () => {
    setFamilyForm(prev => ({
      ...prev,
      maternalPaternal: [
        ...prev.maternalPaternal,
        { relation: "", name: "", occupation: "" }
      ]
    }));
  }
  
  const removeMaternalPaternal = (index: number) => {
    setFamilyForm(prev => ({
      ...prev,
      maternalPaternal: prev.maternalPaternal.filter((_, i) => i !== index)
    }));
  }
  // Handle mobile number change in privacy settings
  const handleMobileNumberChange = (value: string) => {
    setPrivacyForm(prev => ({
      ...prev,
      mobileNumber: value
    }))
  }
  
  const handlePartnerChange = (field: keyof PartnerPreferencesForm, value: string) => {
    setPartnerForm(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handlePrivacyChange = (field: keyof PrivacySettingsForm, value: boolean | string) => {
    setPrivacyForm(prev => ({
      ...prev,
      [field]: value    }))
  }
  // Generic update function for all tabs
  const updateProfile = async (tabData: object, tabName: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to update your profile",
        variant: "destructive"
      })
      return
    }
    
    setSavingTab(tabName)
    
    try {    // Process the tabData to avoid sending empty strings that would overwrite existing values
      const cleanedData = Object.entries(tabData).reduce((acc: Record<string, any>, [key, value]) => {
        // Handle special cases first
        if (key === "height" || key === "complexion" || 
            key === "preferredHeight" || key === "preferredComplexion") {
          // Explicitly include these fields, even with empty values
          acc[key] = value; 
        }        // Special handling for siblings, brothers-in-law, and other arrays
        else if (key === "siblings" || key === "brotherInLaws" || key === "maternalPaternal") {
          // Always include arrays even if empty to ensure proper updating
          // Make sure we send a properly formatted array
          if (Array.isArray(value)) {
            acc[key] = value;
            console.log(`${key} is array with ${value.length} items:`, JSON.stringify(value));
          } else if (typeof value === 'string') {
            try {
              // Try to parse if it's a JSON string
              acc[key] = value && value.charAt(0) === '[' ? JSON.parse(value) : [];
            } catch (e) {
              console.error(`Error parsing ${key} JSON:`, e);
              acc[key] = []; // Fallback to empty array
            }
          } else {
            acc[key] = []; // Default to empty array for other cases
          }
            // Log sibling data specifically for debugging
          if (key === "siblings") {
            debugger; // Debugging siblings
            console.log(`${key} data being sent (${typeof acc[key]}, length: ${Array.isArray(acc[key]) ? acc[key].length : 'not array'}):`);
            console.log(JSON.stringify(acc[key]));
          }
        }        // Handle fatherOccupation specifically to ensure it saves properly
        else if (key === "fatherOccupation") {
          // Always include fatherOccupation in the update
          debugger; // Debugging Father's Occupation
          acc[key] = value || 'Not specified';
          console.log(`fatherOccupation being sent: '${acc[key]}'`);
        }
        // For other fields, only include if they're not empty
        else if (value !== "") {
          acc[key] = value;
        }
        return acc;
      }, {});
        // Log the data we're sending for debugging
      console.log(`Updating ${tabName} with data:`, JSON.stringify(cleanedData, null, 2));
      
      // Special logging for height and complexion fields
      if (cleanedData.height !== undefined) {
        console.log(`Height being sent: '${cleanedData.height}'`);
      }
      if (cleanedData.complexion !== undefined) {
        console.log(`Complexion being sent: '${cleanedData.complexion}'`);
      }
      if (cleanedData.preferredHeight !== undefined) {
        console.log(`Preferred Height being sent: '${cleanedData.preferredHeight}'`);
      }
      if (cleanedData.preferredComplexion !== undefined) {
        console.log(`Preferred Complexion being sent: '${cleanedData.preferredComplexion}'`);
      }
      
      const response = await fetch(`/api/profiles/${session.user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        },
        body: JSON.stringify(cleanedData)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update profile: ${response.status}`)
      }
      
      const updatedProfile = await response.json()
      console.log(`Profile update response:`, updatedProfile);
      setProfileData({...profileData, ...updatedProfile})
      
      // Store updated data in localStorage to ensure persistence
      const localStorageKey = `profile_${session.user.id}_${tabName.replace(/\s/g, '_')}`;
      localStorage.setItem(localStorageKey, JSON.stringify(tabData));
        // Refetch the complete profile to ensure all data is in sync
      try {
        await refetchProfile();
        console.log("Profile data refreshed after save");
      } catch (refreshError) {
        console.error("Error refreshing profile data:", refreshError);
        // Continue without failing the overall operation
      }
      
      toast({
        title: "Profile Updated",
        description: `Your ${tabName} information has been successfully updated`,
        variant: "default"
      })
    } catch (error) {
      console.error(`Error updating ${tabName} information:`, error)
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : `Failed to update your ${tabName} information`,
        variant: "destructive"
      })
    } finally {
      setSavingTab(null)
    }
  }
    // Function to refetch the complete profile
  const refetchProfile = async () => {
    if (!session?.user?.id) return;
    
    try {
      console.log("Refetching profile data for user:", session.user.id);
      const response = await fetch(`/api/profiles/${session.user.id}`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate"
        },
        next: { revalidate: 0 } // Ensure Next.js doesn't cache this request
      });
      
      if (!response.ok) {
        console.error("Failed to fetch profile during refetch:", response.status);
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Refetched profile data:", Object.keys(data).length, "fields");
      setProfileData(data);
        // Process siblings data if it exists
      let siblingsArray: SiblingInfo[] = [];
      try {
        if (data.siblings && typeof data.siblings === 'string') {
          // Skip parsing if it's "Not specified" or not valid JSON
          if (data.siblings !== "Not specified" && data.siblings.charAt(0) === '[') {
            siblingsArray = JSON.parse(data.siblings);
          }
        } else if (Array.isArray(data.siblings)) {
          siblingsArray = data.siblings;
        }
      } catch (e) {
        console.warn("Could not parse siblings data during refetch:", e);
      }
          // Process brother-in-law data if it exists
      let brotherInLawsArray: SiblingBrotherInLaw[] = [];
      try {
        if (data.brotherInLaws && typeof data.brotherInLaws === 'string') {
          // Skip parsing if it's "Not specified" or not valid JSON
          if (data.brotherInLaws !== "Not specified" && data.brotherInLaws.charAt(0) === '[') {
            brotherInLawsArray = JSON.parse(data.brotherInLaws);
          }
        } else if (Array.isArray(data.brotherInLaws)) {
          brotherInLawsArray = data.brotherInLaws;
        }
      } catch (e) {
        console.warn("Could not parse brother-in-law data during refetch:", e);
      }

      // Process maternal/paternal data if it exists
      let maternalPaternalArray: MaternalPaternal[] = [];
      try {
        if (data.maternalPaternal && typeof data.maternalPaternal === 'string') {
          // Skip parsing if it's "Not specified" or not valid JSON
          if (data.maternalPaternal !== "Not specified" && data.maternalPaternal.charAt(0) === '[') {
            maternalPaternalArray = JSON.parse(data.maternalPaternal);
          }
        } else if (Array.isArray(data.maternalPaternal)) {
          maternalPaternalArray = data.maternalPaternal;
        }
      } catch (e) {
        console.warn("Could not parse maternal/paternal data during refetch:", e);
      }
      
      // Update all form states with the fresh data
      
      // Basic form data
      setBasicForm({        fullName: data.fullName || "",
        age: data.age ? String(data.age) : "",
        gender: data.gender || "",
        location: data.location || "",
        maritalStatus: data.maritalStatus || "",
        maritalStatusOther: data.maritalStatusOther || "",
        sect: data.sect || "",
        height: data.height || "",
        complexion: data.complexion || "",
        aboutMe: data.aboutMe || "",
        city: data.city || "",
        country: data.country || "",
        address: data.address || ""
      });
      
      // Education & Career form data
      setEducationCareerForm({
        education: data.education || "",
        educationDetails: data.educationDetails || "",
        profession: data.profession || "",
        income: data.income || "",
        jobTitle: data.jobTitle || ""
      });        // Family form data
      setFamilyForm({
        familyDetails: data.familyDetails || "",
        fatherName: data.fatherName || "",
        fatherOccupation: data.fatherOccupation || "Not specified",
        motherName: data.motherName || "",
        motherOccupation: data.motherOccupation || "Home Queen",
        motherOccupationOther: data.motherOccupation !== "Home Queen" && data.motherOccupation !== "" ? data.motherOccupation : "",
        siblings: siblingsArray || [],
        brotherInLaws: brotherInLawsArray || [],
        maternalPaternal: maternalPaternalArray || [],
        housingStatus: data.housingStatus || ""
      });
      
      // Partner preferences form data
      setPartnerForm({
        preferredAgeMin: data.preferredAgeMin ? String(data.preferredAgeMin) : "",
        preferredAgeMax: data.preferredAgeMax ? String(data.preferredAgeMax) : "",
        preferredLocation: data.preferredLocation || "",
        preferredEducation: data.preferredEducation || "",
        preferredOccupation: data.preferredOccupation || "",
        preferredHeight: data.preferredHeight || "",
        preferredComplexion: data.preferredComplexion || "",
        preferredMaslak: data.preferredMaslak || "",
        expectations: data.expectations || ""
      });
        // Privacy settings form data
      setPrivacyForm({
        showContactInfo: data.showContactInfo !== undefined ? data.showContactInfo : true,
        showPhotos: data.showPhotos !== undefined ? data.showPhotos : true,
        hideProfile: data.hideProfile !== undefined ? data.hideProfile : false,
        showOnlineStatus: data.showOnlineStatus !== undefined ? data.showOnlineStatus : true,
        showFatherNumber: data.showFatherNumber !== undefined ? data.showFatherNumber : false,
        fatherMobile: data.fatherMobile || "",
        showMotherNumber: data.showMotherNumber !== undefined ? data.showMotherNumber : false,
        motherMobile: data.motherMobile || "",
        mobileNumber: data.mobileNumber || "",
        profilePhotos: Array.isArray(data.profilePhotos) ? data.profilePhotos : 
                          typeof data.profilePhotos === 'string' ? JSON.parse(data.profilePhotos || '[]') : []
      });
      
      // And similarly for other form sections
    } catch (error) {
      console.error("Error refetching profile:", error);
    }
  }
    // Tab-specific form submission handlers
  const handleBasicSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProfile(basicForm, "basic")
  }
  
  const handleEducationCareerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProfile(educationCareerForm, "education and career")
  }
  
  const handleFamilySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Handle mother's occupation for "other" selection
    let finalMotherOccupation = familyForm.motherOccupation;
    if (familyForm.motherOccupation === "other" && familyForm.motherOccupationOther) {
      finalMotherOccupation = familyForm.motherOccupationOther;
    }
      
    // Create a copy of the family form data with processed occupation fields
    const formData = {
      ...familyForm,
      // Set final mother occupation based on selection
      motherOccupation: finalMotherOccupation,
      // Remove the temporary field used for UI only
      motherOccupationOther: undefined
    };
      // Ensure siblings data is properly formatted as an array
    console.log("Siblings before submit:", JSON.stringify(formData.siblings));
    
    // Make sure siblings is an array before updating
    if (!Array.isArray(formData.siblings)) {
      try {
        // Try to parse if it's a JSON string (first check and cast the type)
        const siblingsData = formData.siblings as unknown;
        if (typeof siblingsData === 'string' && 
            siblingsData && 
            siblingsData.charAt(0) === '[') {
          formData.siblings = JSON.parse(siblingsData);
          console.log("Parsed siblings from JSON string");
        } else {
          formData.siblings = [];
          console.log("Siblings was not an array or valid JSON, fixed to empty array");
        }
      } catch (e) {
        console.error("Error parsing siblings data:", e);
        formData.siblings = [];
      }
    }
    
    // Ensure all siblings have the required properties and clean empty entries
    if (Array.isArray(formData.siblings)) {
      formData.siblings = formData.siblings
        .map(sibling => ({
          name: sibling.name || '',
          siblingType: sibling.siblingType || 'brother',
          maritalStatus: sibling.maritalStatus || 'unmarried',
          occupation: sibling.occupation || ''
        }))
        .filter(sibling => 
          // Keep sibling if they have at least a name OR occupation
          (sibling.name && sibling.name.trim() !== '') || 
          (sibling.occupation && sibling.occupation.trim() !== '')
        );
    }
    
    console.log("Siblings after processing:", JSON.stringify(formData.siblings));
    
    await updateProfile(formData, "family");
  }
  
  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProfile(partnerForm, "partner preferences")
  }
    const handlePrivacySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Only send parent mobile numbers if the corresponding checkbox is checked
    const formData = {
      ...privacyForm,
      fatherMobile: privacyForm.showFatherNumber ? privacyForm.fatherMobile : "",
      motherMobile: privacyForm.showMotherNumber ? privacyForm.motherMobile : ""
    };
    
    await updateProfile(formData, "privacy settings")
  }// Handle photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    const file = files[0]
    console.log("Selected file:", file.name, "Type:", file.type, "Size:", file.size);
    
    // Check file size client-side
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "The image file is too large. Please select an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }
    
    // Check file type client-side
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPG, PNG, GIF, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    const formData = new FormData()
    formData.append('photo', file) // Using 'photo' as the key to match the API
    
    try {
      setSavingTab('photo')
      
      // Add user ID to request - this is critical for the API to associate the photo with the user
      if (session?.user?.id) {
        formData.append('userId', session.user.id);
        console.log("Adding user ID to request:", session.user.id);
      } else {
        console.warn("No user ID available in session");
      }
      
      console.log("Sending photo upload request...");
      
      const response = await fetch('/api/profiles/upload-photo', {
        method: 'POST',
        body: formData,
        // Ensure no caching to get fresh response
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
        console.log("Upload response status:", response.status);
      
      let responseData;
      try {
        // Check if there's actually content before trying to parse
        const text = await response.text();
        if (text) {
          responseData = JSON.parse(text);
          console.log("Successfully parsed response JSON");
        } else {
          console.error("Empty response from server");
          throw new Error("Server returned an empty response");
        }      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        throw new Error(`Failed to parse server response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }
      
      if (!response.ok) {
        console.error("Upload failed with response:", responseData);
        throw new Error(responseData?.error || 'Failed to upload profile photo')
      }
        console.log("Upload successful:", responseData);
      
      // Ensure responseData contains a URL
      if (!responseData || !responseData.url) {
        console.error("Missing URL in response data:", responseData);
        throw new Error("Server response is missing the photo URL");
      }
      
      // Update the profile data with the new photo URL and add a timestamp to force refresh
      const photoUrl = `${responseData.url}?t=${new Date().getTime()}`;
      console.log("Setting new photo URL:", photoUrl);
      setProfileData({...profileData, profilePhoto: photoUrl})
      
      // Force update the profile in the database with the new photo URL
      if (session?.user?.id) {
        await fetch(`/api/profiles/${session.user.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            profilePhoto: responseData.url
          })
        });
      }
      
      toast({
        title: "Photo Updated",
        description: "Your profile photo has been successfully uploaded and saved",
        variant: "default"
      })
      
      // Refresh the page data to ensure everything is up to date
      await refetchProfile();
    } catch (error) {
      console.error("Photo upload error:", error)
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload your photo. Please try again with a smaller image (less than 5MB).",
        variant: "destructive"
      })
    } finally {
      setSavingTab(null)
    }
  }
  // Handle multiple photo uploads
  const handleMultiplePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    // Convert FileList to Array for easier processing
    const filesArray = Array.from(files);
    console.log("Selected files:", filesArray);
    
    // Check total size client-side (limit to 15MB for 3 photos)
    const maxTotalSize = 15 * 1024 * 1024; // 15MB
    const totalSize = filesArray.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > maxTotalSize) {
      toast({
        title: "Files Too Large",
        description: "The selected image files are too large. Please select images smaller than 15MB in total.",
        variant: "destructive"
      });
      return;
    }
    
    // Check file types client-side
    const invalidFiles = filesArray.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid File Type",
        description: "Please select only image files (JPG, PNG, GIF, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    const formData = new FormData();
    filesArray.forEach(file => {
      formData.append('photos', file); // Using 'photos' as the key to match the API
    });
    
    try {
      setSavingTab('photos')
      
      // Add user ID to request
      if (session?.user?.id) {
        formData.append('userId', session.user.id);
      }
      
      console.log("Sending multiple photo upload request...");
      
      const response = await fetch('/api/profiles/upload-photos', {
        method: 'POST',
        body: formData,
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      let responseData;
      try {
        // Check if there's actually content before trying to parse
        const text = await response.text();
        if (!text) {
          console.error("Empty response from server");
          throw new Error("Server returned an empty response");
        }
        
        try {
          responseData = JSON.parse(text);
          console.log("Successfully parsed response JSON for multiple photos");
        } catch (jsonError) {
          console.error("Error parsing JSON response:", jsonError, "Response text:", text);
          throw new Error(`Failed to parse JSON response: ${jsonError instanceof Error ? jsonError.message : 'Unknown JSON parsing error'}`);
        }
      } catch (parseError) {
        console.error("Error processing response:", parseError);
        throw new Error(`Failed to process server response: ${parseError instanceof Error ? parseError.message : 'Unknown processing error'}`);
      }
      
      if (!response.ok) {
        console.error("Upload failed with response:", responseData);
        throw new Error(responseData?.error || 'Failed to upload profile photos')
      }
      
      console.log("Upload successful:", responseData);
      
      // Check if the response has the expected structure
      if (!responseData || !responseData.urls || !Array.isArray(responseData.urls)) {
        console.error("Invalid response structure:", responseData);
        throw new Error("Server response doesn't contain photo URLs in the expected format");
      }
      
      // Update the profile data with the new photo URLs
      const newPhotoUrls = responseData.urls.map((url: string) => `${url}?t=${new Date().getTime()}`);
      console.log("Setting new photo URLs:", newPhotoUrls);
        // Safely update the profile data
      setProfileData((prev: any) => {
        const currentPhotos = Array.isArray(prev?.profilePhotos) ? prev.profilePhotos : [];
        return {
          ...prev,
          profilePhotos: [...currentPhotos, ...newPhotoUrls]
        };
      });
      
      // Update the privacy form to include the new photos
      setPrivacyForm(prev => ({
        ...prev,
        profilePhotos: [...(prev.profilePhotos || []), ...newPhotoUrls]
      }));
      
      // Refresh the profile data
      await refetchProfile();
      
      toast({
        title: "Photos Updated",
        description: "Your profile photos have been successfully uploaded and saved",
        variant: "default"
      })
    } catch (error) {
      console.error("Multiple photo upload error:", error)
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload your photos. Please try again with smaller images (less than 15MB in total).",
        variant: "destructive"
      })
    } finally {
      setSavingTab(null)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your profile...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="flex items-center text-2xl">
                  <UserCircle className="mr-2" /> Edit Your Profile
                </CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Update your information to make your profile more attractive to potential matches.
                </CardDescription>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center">                {profileData?.profileStatus && (
                  <Badge className="mr-2 bg-green-500">
                    APPROVED
                  </Badge>
                )}
                
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-2 border-primary overflow-hidden bg-slate-200">
                    {profileData?.profilePhoto ? (
                      <img 
                        src={profileData.profilePhoto} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <User size={30} />
                      </div>
                    )}
                  </div>
                  <label 
                    htmlFor="profile-photo" 
                    className="absolute -right-1 -bottom-1 h-8 w-8 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    {savingTab === 'photo' ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <Upload className="h-4 w-4 text-white" />
                    )}
                    <input 
                      id="profile-photo" 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <Tabs 
          defaultValue="basic" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="education">Education & Career</TabsTrigger>
            <TabsTrigger value="family">Family Info</TabsTrigger>
            <TabsTrigger value="preferences">Partner Preferences</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Settings</TabsTrigger>
          </TabsList>
            {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" /> Basic Information
                </CardTitle>
                <CardDescription>
                  Your main profile details that will be visible to others
                </CardDescription>
              </CardHeader>
              <CardContent>                <form onSubmit={handleBasicSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                    {/* 1. Full Name */}
                    <FormField label="Full Name" filled={!!basicForm.fullName}>
                      <Input 
                        id="fullName"
                        value={basicForm.fullName}
                        onChange={(e) => handleBasicChange('fullName', e.target.value)}
                        placeholder="Your full name"
                        className={basicForm.fullName ? "border-green-200 focus:border-green-300" : ""}
                      />
                    </FormField>
                    
                    {/* 2. Gender */}
                    <FormField label="Gender" filled={!!basicForm.gender}>
                      <Select 
                        value={basicForm.gender} 
                        onValueChange={(value) => handleBasicChange('gender', value)}
                      >
                        <SelectTrigger className={basicForm.gender ? "border-green-200" : ""}>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male (Groom)</SelectItem>
                          <SelectItem value="female">Female (Bride)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                    
                    {/* 3. Age */}
                    <FormField label="Age" filled={!!basicForm.age}>
                      <Input 
                        id="age"
                        type="number"
                        value={basicForm.age}
                        onChange={(e) => handleBasicChange('age', e.target.value)}
                        placeholder="Your age"
                        min="18"
                        max="80"
                        className={basicForm.age ? "border-green-200 focus:border-green-300" : ""}
                      />
                    </FormField>
                    
                    {/* 4. Height */}
                    <FormField label="Height" filled={!!basicForm.height}>
                      <Input 
                        id="height"
                        value={basicForm.height}
                        onChange={(e) => handleBasicChange('height', e.target.value)}
                        placeholder="e.g., 5'6''"
                        className={basicForm.height ? "border-green-200 focus:border-green-300" : ""}
                      />
                    </FormField>
                    
                    {/* 5. Complexion */}
                    <FormField label="Complexion" filled={!!basicForm.complexion}>
                      <Select 
                        value={basicForm.complexion} 
                        onValueChange={(value) => handleBasicChange('complexion', value)}
                      >
                        <SelectTrigger className={basicForm.complexion ? "border-green-200" : ""}>
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
                    </FormField>
                    
                    {/* 6. Marital Status */}
                    <FormField label="Marital Status" filled={!!basicForm.maritalStatus}>
                      <Select 
                        value={basicForm.maritalStatus} 
                        onValueChange={(value) => handleBasicChange('maritalStatus', value)}
                      >
                        <SelectTrigger className={basicForm.maritalStatus ? "border-green-200" : ""}>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never-married">Never Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                      {basicForm.maritalStatus === 'other' && (
                      <FormField label="Please Specify" filled={!!basicForm.maritalStatusOther}>
                        <Input 
                          id="maritalStatusOther"
                          value={basicForm.maritalStatusOther || ''}
                          onChange={(e) => handleBasicChange('maritalStatusOther', e.target.value)}
                          placeholder="Please specify your marital status"
                          className={basicForm.maritalStatusOther ? "border-green-200 focus:border-green-300" : ""}
                        />
                      </FormField>
                    )}
                    
                    {/* 7. Maslak */}
                    <FormField label="Maslak" filled={!!basicForm.sect}>
                      <Select 
                        value={basicForm.sect} 
                        onValueChange={(value) => handleBasicChange('sect', value)}
                      >
                        <SelectTrigger className={basicForm.sect ? "border-green-200" : ""}>
                          <SelectValue placeholder="Select Maslak" />
                        </SelectTrigger>                        <SelectContent>
                          <SelectItem value="ahle-sunnat-wal-jamaat">Ahle Sunnat Wal Jamaat</SelectItem>
                          <SelectItem value="deobandi">Sunni - Deobandi</SelectItem>
                          <SelectItem value="ahl-e-hadees">Ahl-E-Hadees</SelectItem>
                          <SelectItem value="revert">Revert Muslim</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="no-preference">No Preference</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>                    
                    {/* 8. Address */}
                    <FormField label="Address" filled={!!basicForm.address}>
                      <Input 
                        id="address"
                        value={basicForm.address}
                        onChange={(e) => handleBasicChange('address', e.target.value)}
                        placeholder="Your complete address"
                        className={basicForm.address ? "border-green-200 focus:border-green-300" : ""}
                      />
                    </FormField>
                    
                    {/* 9. City */}
                    <FormField label="City" filled={!!basicForm.city}>
                      <Input 
                        id="city"
                        value={basicForm.city}
                        onChange={(e) => handleBasicChange('city', e.target.value)}
                        placeholder="Your city"
                        className={basicForm.city ? "border-green-200 focus:border-green-300" : ""}
                      />
                    </FormField>
                    
                    {/* 10. Country */}
                    <FormField label="Country" filled={!!basicForm.country}>
                      <Select 
                        value={basicForm.country} 
                        onValueChange={(value) => handleBasicChange('country', value)}
                      >
                        <SelectTrigger className={basicForm.country ? "border-green-200" : ""}>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Popular countries first */}
                          <SelectItem value="india">India</SelectItem>                      
                          <SelectItem value="uae">United Arab Emirates</SelectItem>
                          <SelectItem value="saudi-arabia">Saudi Arabia</SelectItem>
                          <SelectItem value="qatar">Qatar</SelectItem>
                          <SelectItem value="kuwait">Kuwait</SelectItem>
                          <SelectItem value="oman">Oman</SelectItem>
                          <SelectItem value="bahrain">Bahrain</SelectItem>
                          
                          {/* Western countries */}
                          <SelectItem value="usa">United States</SelectItem>
                          <SelectItem value="canada">Canada</SelectItem>
                          <SelectItem value="australia">Australia</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="new-zealand">New Zealand</SelectItem>
                          <SelectItem value="germany">Germany</SelectItem>
                          <SelectItem value="france">France</SelectItem>
                          
                          {/* Other countries */}
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>
                    <div className="space-y-2">
                    <Label htmlFor="aboutMe">
                      {basicForm.gender === 'male' ? 'About Groom' : basicForm.gender === 'female' ? 'About Bride' : 'About Me'}
                    </Label>
                    <Textarea 
                      id="aboutMe"
                      value={basicForm.aboutMe}
                      onChange={(e) => handleBasicChange('aboutMe', e.target.value)}
                      className="min-h-[100px]"
                      placeholder="Tell potential matches about yourself..."
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={savingTab === 'basic'}>
                    {savingTab === 'basic' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Basic Information
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
  
            {/* Education & Career Tab */}
          <TabsContent value="education" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5" /> Education & Career
                </CardTitle>
                <CardDescription>
                  Details about your education and professional life
                </CardDescription>
              </CardHeader>
              <CardContent>                <form onSubmit={handleEducationCareerSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Qualification" filled={!!educationCareerForm.education}>
                      <Select 
                        value={educationCareerForm.education} 
                        onValueChange={(value) => handleEducationCareerChange('education', value)}
                      >
                        <SelectTrigger className={educationCareerForm.education ? "border-green-200" : ""}>
                          <SelectValue placeholder="Select your qualification" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="undergraduate">Undergraduate</SelectItem>
                          <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                          <SelectItem value="master">Master's Degree</SelectItem>
                          <SelectItem value="doctorate">Doctorate</SelectItem>
                          <SelectItem value="other">Other (Please Specify)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                    
                    <FormField label="Educational Details" filled={!!educationCareerForm.educationDetails}>
                      <Input 
                        id="educationDetails"
                        value={educationCareerForm.educationDetails}
                        onChange={(e) => handleEducationCareerChange('educationDetails', e.target.value)}
                        placeholder="University/institution, field of study"
                        className={educationCareerForm.educationDetails ? "border-green-200 focus:border-green-300" : ""}
                      />
                    </FormField>
                    
                    <FormField label="Profession" filled={!!educationCareerForm.profession}>
                      <Input 
                        id="profession"
                        value={educationCareerForm.profession}
                        onChange={(e) => handleEducationCareerChange('profession', e.target.value)}
                        placeholder="Your profession"
                        className={educationCareerForm.profession ? "border-green-200 focus:border-green-300" : ""}
                      />
                    </FormField>
                    
                    <FormField label="Job Title" filled={!!educationCareerForm.jobTitle}>
                      <Input 
                        id="jobTitle"
                        value={educationCareerForm.jobTitle}
                        onChange={(e) => handleEducationCareerChange('jobTitle', e.target.value)}
                        placeholder="Your current position"
                        className={educationCareerForm.jobTitle ? "border-green-200 focus:border-green-300" : ""}
                      />
                    </FormField>
                      <FormField label="Income Range (Optional)" filled={!!educationCareerForm.income}>
                      <Select 
                        value={educationCareerForm.income} 
                        onValueChange={(value) => handleEducationCareerChange('income', value)}
                      >
                        <SelectTrigger className={educationCareerForm.income ? "border-green-200" : ""}>
                          <SelectValue placeholder="Select range (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          <SelectItem value="under-30k">Under ₹30,000 monthly</SelectItem>
                          <SelectItem value="30k-50k">₹30,000 - ₹50,000 monthly</SelectItem>
                          <SelectItem value="50k-100k">₹50,000 - ₹1,00,000 monthly</SelectItem>
                          <SelectItem value="above-100k">Above ₹1,00,000 monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={savingTab === 'education'}>
                    {savingTab === 'education' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Education & Career Information
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
            {/* Family Info Tab */}
          <TabsContent value="family" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="mr-2 h-5 w-5" /> Family Information
                </CardTitle>
                <CardDescription>
                  Details about your family background
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFamilySubmit} className="space-y-4">                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                    <FormField label="Father's Name" filled={!!familyForm.fatherName}>
                      <Input 
                        id="fatherName"
                        value={familyForm.fatherName}
                        onChange={(e) => handleFamilyChange('fatherName', e.target.value)}
                        placeholder="Your father's name"
                        className={familyForm.fatherName ? "border-green-200 focus:border-green-300" : ""}
                      />
                    </FormField>                    <FormField label="Father's Occupation" filled={!!familyForm.fatherOccupation}>
                      <Input 
                        id="fatherOccupation"
                        value={familyForm.fatherOccupation}
                        onChange={(e) => handleFamilyChange('fatherOccupation', e.target.value)}
                        placeholder="Enter father's occupation"
                        className={familyForm.fatherOccupation ? "border-green-200 focus:border-green-300" : ""}
                      />
                      <p className="text-xs text-muted-foreground">
                        {!familyForm.fatherOccupation ? 
                          "Will display as \"Not specified\" if left empty" : 
                          `Current value: ${familyForm.fatherOccupation}`}
                      </p>
                    </FormField>
                      <FormField label="Mother's Name" filled={!!familyForm.motherName}>
                      <Input 
                        id="motherName"
                        value={familyForm.motherName}
                        onChange={(e) => handleFamilyChange('motherName', e.target.value)}
                        placeholder="Your mother's name"
                        className={familyForm.motherName ? "border-green-200 focus:border-green-300" : ""}
                      />
                    </FormField>
                    
                    <FormField label="Mother's Occupation" filled={!!familyForm.motherOccupation}>
                      <Select 
                        value={familyForm.motherOccupation} 
                        onValueChange={(value) => {
                          handleFamilyChange('motherOccupation', value);
                          // Reset the 'other' field if this is not 'other'
                          if (value !== "other" && familyForm.motherOccupationOther) {
                            handleFamilyChange('motherOccupationOther', '');
                          }
                        }}
                      >
                        <SelectTrigger className={familyForm.motherOccupation ? "border-green-200" : ""}>
                          <SelectValue placeholder="Select mother's occupation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Home Queen">Home Queen</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                      {familyForm.motherOccupation === "other" && (
                      <FormField label="Specify Mother's Occupation" filled={!!familyForm.motherOccupationOther}>
                        <Input 
                          id="motherOccupationOther"
                          value={familyForm.motherOccupationOther || ""}
                          onChange={(e) => handleFamilyChange('motherOccupationOther', e.target.value)}
                          placeholder="Please specify"
                          className={familyForm.motherOccupationOther ? "border-green-200 focus:border-green-300" : ""}
                        />
                      </FormField>
                    )}                      <FormField label="Housing Status" filled={!!familyForm.housingStatus}>
                      <Select 
                        value={familyForm.housingStatus} 
                        onValueChange={(value) => handleFamilyChange('housingStatus', value)}
                      >
                        <SelectTrigger className={familyForm.housingStatus ? "border-green-200" : ""}>
                          <SelectValue placeholder="Select housing status" />
                        </SelectTrigger>                        <SelectContent>
                          <SelectItem value="owned">Own House</SelectItem>
                          <SelectItem value="rented">Rented</SelectItem>
                          <SelectItem value="other">Other (Please specify)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                    
                    {familyForm.housingStatus === 'other' && (
                      <FormField label="Please Specify" filled={!!familyForm.housingStatusOther}>
                        <Input 
                          id="housingStatusOther"
                          value={familyForm.housingStatusOther || ''}
                          onChange={(e) => handleFamilyChange('housingStatusOther', e.target.value)}
                          placeholder="Please specify your housing status"
                          className={familyForm.housingStatusOther ? "border-green-200 focus:border-green-300" : ""}
                        />
                      </FormField>
                    )}                      <FormField label="Family Details" filled={!!familyForm.familyDetails}>
                      <Textarea
                        id="familyDetails"
                        className={familyForm.familyDetails ? "border-green-200 focus:border-green-300" : ""}
                        value={familyForm.familyDetails}
                        onChange={(e) => handleFamilyChange('familyDetails', e.target.value)}
                        placeholder="Additional details about your family..."
                      />
                    </FormField>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Siblings</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={addSibling}
                      >
                        Add Sibling
                      </Button>
                    </div>
                    
                    {familyForm.siblings.length > 0 ? (
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="p-2 text-left">Name</th>
                              <th className="p-2 text-left">Brother/Sister</th>
                              <th className="p-2 text-left">Marital Status</th>
                              <th className="p-2 text-left">Occupation</th>
                              <th className="p-2 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {familyForm.siblings.map((sibling, index) => (
                              <tr key={index} className="border-t">
                                <td className="p-2">
                                  <Input 
                                    value={sibling.name} 
                                    onChange={(e) => handleSiblingChange(index, 'name', e.target.value)} 
                                    placeholder="Name"
                                    className="h-8"
                                  />
                                </td>
                                <td className="p-2">
                                  <Select
                                    value={sibling.siblingType}
                                    onValueChange={(value) => handleSiblingChange(index, 'siblingType', value)}
                                  >
                                    <SelectTrigger className="h-8">
                                      <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="brother">Brother</SelectItem>
                                      <SelectItem value="sister">Sister</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="p-2">
                                  <Select
                                    value={sibling.maritalStatus}
                                    onValueChange={(value) => handleSiblingChange(index, 'maritalStatus', value)}
                                  >
                                    <SelectTrigger className="h-8">
                                      <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="married">Married</SelectItem>
                                      <SelectItem value="unmarried">Unmarried</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="p-2">
                                  <Input 
                                    value={sibling.occupation} 
                                    onChange={(e) => handleSiblingChange(index, 'occupation', e.target.value)} 
                                    placeholder="Occupation"
                                    className="h-8"
                                  />
                                </td>
                                <td className="p-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => removeSibling(index)}
                                  >
                                    Remove
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center p-4 border rounded-md bg-muted/10">
                        <p className="text-sm text-muted-foreground">No siblings added yet</p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={addSibling}
                        >
                          Add Sibling
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Brother-in-Law Section */}
                  <div className="space-y-4 mt-6">
                    <div className="flex items-center justify-between">
                      <Label>Brothers-in-Law</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={addBrotherInLaw}
                      >
                        Add Brother-in-Law
                      </Button>
                    </div>
                    
                    {familyForm.brotherInLaws.length > 0 ? (
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="p-2 text-left">Name</th>
                              <th className="p-2 text-left">Occupation</th>
                              <th className="p-2 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {familyForm.brotherInLaws.map((brotherInLaw, index) => (
                              <tr key={index} className="border-t">
                                <td className="p-2">
                                  <Input 
                                    value={brotherInLaw.name} 
                                    onChange={(e) => handleBrotherInLawChange(index, 'name', e.target.value)} 
                                    placeholder="Name"
                                    className="h-8"
                                  />
                                </td>
                                <td className="p-2">
                                  <Input 
                                    value={brotherInLaw.occupation} 
                                    onChange={(e) => handleBrotherInLawChange(index, 'occupation', e.target.value)} 
                                    placeholder="Occupation"
                                    className="h-8"
                                  />
                                </td>
                                <td className="p-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => removeBrotherInLaw(index)}
                                  >
                                    Remove
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center p-4 border rounded-md bg-muted/10">
                        <p className="text-sm text-muted-foreground">No brother-in-law added yet</p>
                        <p className="text-xs text-muted-foreground mt-1">Add brother-in-law details for married sisters</p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={addBrotherInLaw}
                        >
                          Add Brother-in-Law
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Maternal/Paternal Relations */}
                  <div className="space-y-4 mt-6">
                    <div className="flex items-center justify-between">
                      <Label>Maternal/Paternal Relations</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={addMaternalPaternal}
                      >
                        Add Relation
                      </Button>
                    </div>
                    
                    {familyForm.maternalPaternal.length > 0 ? (
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="p-2 text-left">Relation Type</th>
                              <th className="p-2 text-left">Name</th>
                              <th className="p-2 text-left">Occupation</th>
                              <th className="p-2 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {familyForm.maternalPaternal.map((relation, index) => (
                              <tr key={index} className="border-t">
                                <td className="p-2">
                                  <Select
                                    value={relation.relation}
                                    onValueChange={(value) => handleMaternalPaternalChange(index, 'relation', value)}
                                  >
                                    <SelectTrigger className="h-8">
                                      <SelectValue placeholder="Relation" />
                                    </SelectTrigger>
                                    <SelectContent>                                      <SelectItem value="maternal-uncle">Maternal Uncle</SelectItem>
                                      <SelectItem value="paternal-uncle">Paternal Uncle</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="p-2">
                                  <Input 
                                    value={relation.name} 
                                    onChange={(e) => handleMaternalPaternalChange(index, 'name', e.target.value)} 
                                    placeholder="Name"
                                    className="h-8"
                                  />
                                </td>
                                <td className="p-2">
                                  <Input 
                                    value={relation.occupation} 
                                    onChange={(e) => handleMaternalPaternalChange(index, 'occupation', e.target.value)} 
                                    placeholder="Occupation"
                                    className="h-8"
                                  />
                                </td>
                                <td className="p-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => removeMaternalPaternal(index)}
                                  >
                                    Remove
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center p-4 border rounded-md bg-muted/10">
                        <p className="text-sm text-muted-foreground">No maternal/paternal relations added yet</p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={addMaternalPaternal}
                        >
                          Add Relation
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={savingTab === 'family'}>
                    {savingTab === 'family' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Family Information
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
            {/* Partner Preferences Tab */}
          <TabsContent value="preferences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5" /> Partner Preferences
                </CardTitle>
                <CardDescription>
                  Details about what you're looking for in a partner
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePartnerSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                    <FormField label="Preferred Age Range (Min)" filled={!!partnerForm.preferredAgeMin}>
                      <Input 
                        id="preferredAgeMin"
                        type="number"
                        value={partnerForm.preferredAgeMin}
                        onChange={(e) => handlePartnerChange('preferredAgeMin', e.target.value)}
                        placeholder="Minimum age"
                        min="18"
                        className={partnerForm.preferredAgeMin ? "border-green-200 focus:border-green-300" : ""}
                      />
                    </FormField>
                    
                    <FormField label="Preferred Age Range (Max)" filled={!!partnerForm.preferredAgeMax}>
                      <Input 
                        id="preferredAgeMax"
                        type="number"
                        value={partnerForm.preferredAgeMax}
                        onChange={(e) => handlePartnerChange('preferredAgeMax', e.target.value)}
                        placeholder="Maximum age"
                        min="18"
                        className={partnerForm.preferredAgeMax ? "border-green-200 focus:border-green-300" : ""}
                      />
                    </FormField>
                      <FormField label="Preferred Height" filled={!!partnerForm.preferredHeight}>
                      <Input 
                        id="preferredHeight"
                        value={partnerForm.preferredHeight}
                        onChange={(e) => handlePartnerChange('preferredHeight', e.target.value)}
                        placeholder="e.g., 5'6'' or above"
                        className={partnerForm.preferredHeight ? "border-green-200 focus:border-green-300" : ""}
                      />
                    </FormField>
                    
                    <FormField label="Preferred Complexion" filled={!!partnerForm.preferredComplexion}>
                      <Select 
                        value={partnerForm.preferredComplexion} 
                        onValueChange={(value) => handlePartnerChange('preferredComplexion', value)}
                      >
                        <SelectTrigger className={partnerForm.preferredComplexion ? "border-green-200" : ""}>
                          <SelectValue placeholder="Select preferred complexion" />
                        </SelectTrigger>                        <SelectContent>
                          <SelectItem value="very-fair">Very Fair</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="wheatish">Wheatish</SelectItem>
                          <SelectItem value="wheatish-brown">Wheatish Brown</SelectItem>
                          <SelectItem value="brown">Brown</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="no-preference">No Preference</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                      <FormField label="Preferred Education Level" filled={!!partnerForm.preferredEducation}>
                      <Input 
                        id="preferredEducation"
                        value={partnerForm.preferredEducation}
                        onChange={(e) => handlePartnerChange('preferredEducation', e.target.value)}
                        placeholder="Education preference"
                        className={partnerForm.preferredEducation ? "border-green-200 focus:border-green-300" : ""}
                      />
                    </FormField>
                      <FormField label="Preferred Location" filled={!!partnerForm.preferredLocation}>
                      <Input 
                        id="preferredLocation"
                        value={partnerForm.preferredLocation}
                        onChange={(e) => handlePartnerChange('preferredLocation', e.target.value)}
                        placeholder="City, country or region"
                        className={partnerForm.preferredLocation ? "border-green-200 focus:border-green-300" : ""}
                      />
                    </FormField>
                    
                    <FormField label="Preferred Occupation" filled={!!partnerForm.preferredOccupation}>
                      <Input 
                        id="preferredOccupation"
                        value={partnerForm.preferredOccupation}
                        onChange={(e) => handlePartnerChange('preferredOccupation', e.target.value)}
                        placeholder="Occupation preference"
                        className={partnerForm.preferredOccupation ? "border-green-200 focus:border-green-300" : ""}
                      />
                    </FormField>
                      <FormField label="Preferred Maslak / Sect" filled={!!partnerForm.preferredMaslak}>
                      <Select 
                        value={partnerForm.preferredMaslak} 
                        onValueChange={(value) => handlePartnerChange('preferredMaslak', value)}
                    >
                      <SelectTrigger className={partnerForm.preferredMaslak ? "border-green-200" : ""}>
                        <SelectValue placeholder="Select preferred Maslak" />
                      </SelectTrigger>                      <SelectContent>
                        <SelectItem value="ahle-sunnat-wal-jamaat">Ahle Sunnat Wal Jamaat</SelectItem>
                        <SelectItem value="deobandi">Sunni - Deobandi</SelectItem>
                        <SelectItem value="ahl-e-hadees">Ahl-E-Hadees</SelectItem>
                        <SelectItem value="revert">Revert Muslim</SelectItem>                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="no-preference">No Preference</SelectItem>                      </SelectContent>
                    </Select>
                  </FormField>
                  </div>
                  
                  <div className="space-y-2">
                    <FormField label="Expectations & Requirements" filled={!!partnerForm.expectations}>
                      <Textarea 
                        id="expectations"
                        value={partnerForm.expectations}
                        onChange={(e) => handlePartnerChange('expectations', e.target.value)}
                        className={`min-h-[100px] ${partnerForm.expectations ? "border-green-200 focus:border-green-300" : ""}`}
                        placeholder="Describe your expectations from a potential spouse..."
                      />
                    </FormField>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={savingTab === 'preferences'}>
                    {savingTab === 'preferences' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Partner Preferences
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
            {/* Privacy Settings Tab */}
          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" /> Privacy Settings
                </CardTitle>
                <CardDescription>
                  Control who can see your profile and information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePrivacySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="showContactInfo"
                        checked={privacyForm.showContactInfo}
                        onChange={(e) => handlePrivacyChange('showContactInfo', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                      />
                      <Label htmlFor="showContactInfo">Show Contact Information to Matches</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="showPhotos"
                        checked={privacyForm.showPhotos}
                        onChange={(e) => handlePrivacyChange('showPhotos', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                      />
                      <Label htmlFor="showPhotos">Show Photos to All Members</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="hideProfile"
                        checked={privacyForm.hideProfile}
                        onChange={(e) => handlePrivacyChange('hideProfile', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                      />
                      <Label htmlFor="hideProfile">Hide Profile from Search Results</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="showOnlineStatus"
                        checked={privacyForm.showOnlineStatus}
                        onChange={(e) => handlePrivacyChange('showOnlineStatus', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                      />
                      <Label htmlFor="showOnlineStatus">Show Online Status</Label>
                    </div>
                  </div>                    <div className="border p-4 rounded-md bg-yellow-50/30">
                      <h3 className="font-medium text-sm mb-2">Parent Contact Information (Premium Only)</h3>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <input
                              type="checkbox"
                              id="showFatherNumber"
                              checked={privacyForm.showFatherNumber}
                              onChange={(e) => handlePrivacyChange('showFatherNumber', e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                            />
                            <Label htmlFor="showFatherNumber">Show Father's Contact Number</Label>
                          </div>
                          
                          {privacyForm.showFatherNumber && (
                            <div className="pl-6 mt-2">
                              <Label htmlFor="fatherMobile" className="text-sm mb-1 block">Father's Mobile Number</Label>                              <Input 
                                id="fatherMobile"
                                value={privacyForm.fatherMobile}
                                onChange={(e) => handlePrivacyChange('fatherMobile', e.target.value)}
                                placeholder="Enter father's mobile number"
                                className={`max-w-md ${privacyForm.fatherMobile ? "border-green-200 focus:border-green-300" : ""}`}
                              />
                              {privacyForm.fatherMobile && (
                                <div className="flex items-center text-xs text-green-600 mt-1">
                                  <CheckCircle className="mr-1 h-3 w-3" /> Mobile number saved
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-2">
                          <div className="flex items-center space-x-2 mb-2">
                            <input
                              type="checkbox"
                              id="showMotherNumber"
                              checked={privacyForm.showMotherNumber}
                              onChange={(e) => handlePrivacyChange('showMotherNumber', e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                            />
                            <Label htmlFor="showMotherNumber">Show Mother's Contact Number</Label>
                          </div>
                          
                          {privacyForm.showMotherNumber && (
                            <div className="pl-6 mt-2">
                              <Label htmlFor="motherMobile" className="text-sm mb-1 block">Mother's Mobile Number</Label>                              <Input 
                                id="motherMobile"
                                value={privacyForm.motherMobile}
                                onChange={(e) => handlePrivacyChange('motherMobile', e.target.value)}
                                placeholder="Enter mother's mobile number"
                                className={`max-w-md ${privacyForm.motherMobile ? "border-green-200 focus:border-green-300" : ""}`}
                              />
                              {privacyForm.motherMobile && (
                                <div className="flex items-center text-xs text-green-600 mt-1">
                                  <CheckCircle className="mr-1 h-3 w-3" /> Mobile number saved
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  
                    <div className="border p-4 rounded-md bg-blue-50/30 mt-4 space-y-4">
                      <h3 className="font-medium text-md mb-2">Photo Gallery</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload additional photos to showcase in your profile gallery. You can add up to 5 photos.
                      </p>
                      
                      {/* Multiple Photo Upload */}
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-4">
                          {/* Main Profile Photo */}
                          <div className="relative">
                            <div className="h-32 w-32 rounded-md border-2 border-primary overflow-hidden bg-slate-200">
                              {profileData?.profilePhoto ? (
                                <img 
                                  src={profileData.profilePhoto} 
                                  alt="Profile" 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-400">
                                  <User size={24} />
                                </div>
                              )}
                            </div>
                            <Badge className="absolute -top-2 -right-2 bg-primary">Main</Badge>
                          </div>
                          
                          {/* Additional Photos */}
                          {profileData?.profilePhotos && profileData.profilePhotos.map((photo: string, index: number) => (
                            <div key={index} className="relative">
                              <div className="h-32 w-32 rounded-md border border-gray-200 overflow-hidden">
                                <img 
                                  src={photo} 
                                  alt={`Photo ${index + 1}`} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <button 
                                type="button"
                                onClick={() => {
                                  // Add functionality to remove photo
                                  const updatedPhotos = [...profileData.profilePhotos];
                                  updatedPhotos.splice(index, 1);
                                  setProfileData({...profileData, profilePhotos: updatedPhotos});
                                }}
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          
                          {/* Add More Photos Button */}
                          {(!profileData?.profilePhotos || profileData.profilePhotos.length < 5) && (
                            <label 
                              htmlFor="additional-photos" 
                              className="h-32 w-32 rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                            >
                              {savingTab === 'photos' ? (
                                <Loader2 className="h-8 w-8 mb-2 animate-spin text-primary" />
                              ) : (
                                <>
                                  <Plus className="h-8 w-8 mb-2 text-gray-400" />
                                  <span className="text-xs text-gray-500">Add Photos</span>
                                </>
                              )}
                              <input 
                                id="additional-photos" 
                                type="file" 
                                accept="image/*"
                                multiple 
                                onChange={handleMultiplePhotoUpload} 
                                className="hidden" 
                              />
                            </label>
                          )}
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <p>
                            <strong>Note:</strong> Each photo should be less than 5MB. For best results, use square images.
                          </p>
                        </div>
                      </div>
                    </div>
                  
                  <div className="pt-4">
                    <Alert>
                      <AlertDescription>
                        Privacy settings control what information is visible to other users. 
                        Premium members have additional privacy controls and can view protected information.
                      </AlertDescription>
                    </Alert>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={savingTab === 'privacy'}>
                    {savingTab === 'privacy' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Privacy Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Navigation */}
        <Separator className="my-6" />
        <div className="flex justify-between items-center">
          <Button variant="outline" asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
          
          <Link href="/api/auth/debug" target="_blank">
            <Button variant="ghost" size="sm">
              View Debug Info
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
