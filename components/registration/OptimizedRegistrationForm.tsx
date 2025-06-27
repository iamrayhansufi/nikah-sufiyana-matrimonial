import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

// Placeholder form components - these would be created when splitting the registration form
const FormPlaceholder = ({ step, data, onChange, onNext, onPrev }: any) => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h2 className="text-xl font-semibold mb-4">Step {step} Form</h2>
    <p className="text-gray-600 mb-4">
      This is a placeholder for the {step} form component. 
      In a production environment, this would be replaced with the actual form components.
    </p>
    <div className="flex gap-4">
      {onPrev && (
        <button 
          onClick={onPrev}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Previous
        </button>
      )}
      {onNext && (
        <button 
          onClick={onNext}
          className="px-4 py-2 bg-royal-primary text-white rounded hover:bg-royal-primary/90"
        >
          Next
        </button>
      )}
    </div>
  </div>
);

// Lazy load registration form components when they exist
// For now, using placeholders to demonstrate the structure
const BasicInfoForm = ({ data, onChange, onNext }: any) => (
  <FormPlaceholder step="Basic Info" data={data} onChange={onChange} onNext={onNext} />
);

const PersonalDetailsForm = ({ data, onChange, onNext, onPrev }: any) => (
  <FormPlaceholder step="Personal Details" data={data} onChange={onChange} onNext={onNext} onPrev={onPrev} />
);

const ReligiousInfoForm = ({ data, onChange, onNext, onPrev }: any) => (
  <FormPlaceholder step="Religious Info" data={data} onChange={onChange} onNext={onNext} onPrev={onPrev} />
);

const FamilyInfoForm = ({ data, onChange, onNext, onPrev }: any) => (
  <FormPlaceholder step="Family Info" data={data} onChange={onChange} onNext={onNext} onPrev={onPrev} />
);

const PreferencesForm = ({ data, onChange, onNext, onPrev }: any) => (
  <FormPlaceholder step="Preferences" data={data} onChange={onChange} onNext={onNext} onPrev={onPrev} />
);

const PhotoUploadForm = ({ data, onChange, onPrev }: any) => (
  <FormPlaceholder step="Photo Upload" data={data} onChange={onChange} onPrev={onPrev} />
);

interface RegistrationFormProps {
  currentStep: number;
  formData: any;
  onFormDataChange: (data: any) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

// Loading component for form sections
const FormLoading = () => (
  <div className="flex items-center justify-center py-8">
    <Loader2 className="h-6 w-6 animate-spin text-royal-primary" />
    <span className="ml-2 text-gray-600">Loading form...</span>
  </div>
);

export default function OptimizedRegistrationForm({ 
  currentStep, 
  formData, 
  onFormDataChange, 
  onNextStep, 
  onPrevStep 
}: RegistrationFormProps) {
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoForm 
            data={formData} 
            onChange={onFormDataChange}
            onNext={onNextStep}
          />
        );
      
      case 2:
        return (
          <PersonalDetailsForm 
            data={formData} 
            onChange={onFormDataChange}
            onNext={onNextStep}
            onPrev={onPrevStep}
          />
        );
      
      case 3:
        return (
          <ReligiousInfoForm 
            data={formData} 
            onChange={onFormDataChange}
            onNext={onNextStep}
            onPrev={onPrevStep}
          />
        );
      
      case 4:
        return (
          <FamilyInfoForm 
            data={formData} 
            onChange={onFormDataChange}
            onNext={onNextStep}
            onPrev={onPrevStep}
          />
        );
      
      case 5:
        return (
          <PreferencesForm 
            data={formData} 
            onChange={onFormDataChange}
            onNext={onNextStep}
            onPrev={onPrevStep}
          />
        );
      
      case 6:
        return (
          <PhotoUploadForm 
            data={formData} 
            onChange={onFormDataChange}
            onPrev={onPrevStep}
          />
        );
      
      default:
        return (
          <BasicInfoForm 
            data={formData} 
            onChange={onFormDataChange}
            onNext={onNextStep}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50">
      {/* Progress indicator */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Registration</h1>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5, 6].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === currentStep
                      ? 'bg-royal-primary text-white'
                      : step < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-royal-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {renderCurrentStep()}
      </div>
    </div>
  );
}
