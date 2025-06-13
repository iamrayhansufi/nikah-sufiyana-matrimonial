"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h2>1. Introduction</h2>
            <p>
              Nikah Sufiyana Matrimonial Services ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our matrimonial service.
            </p>
            
            <Separator className="my-4" />
            
            <h2>2. Information We Collect</h2>
            <p>
              We collect various types of information, including:
            </p>
            <ul>
              <li><strong>Personal Information:</strong> Name, age, gender, contact details, location, education, profession, and other details you provide while creating and updating your profile.</li>
              <li><strong>Profile Information:</strong> Photos, preferences, interests, family details, and other information you share on your profile.</li>
              <li><strong>Authentication Data:</strong> Login credentials, password (stored in encrypted format), security questions.</li>
              <li><strong>Communication Data:</strong> Messages, chat histories, and interactions with other users.</li>
              <li><strong>Usage Data:</strong> Information about your interactions with our service, such as pages visited, features used, and time spent.</li>
            </ul>
            
            <Separator className="my-4" />
            
            <h2>3. How We Use Your Information</h2>
            <p>
              We use the collected information for various purposes, including:
            </p>
            <ul>
              <li>Creating and managing your account</li>
              <li>Providing matrimonial match suggestions based on your preferences</li>
              <li>Facilitating communication between users</li>
              <li>Processing payments and managing subscriptions</li>
              <li>Improving our services and user experience</li>
              <li>Sending important notifications and updates</li>
              <li>Ensuring compliance with our Terms of Service</li>
            </ul>
            
            <Separator className="my-4" />
            
            <h2>4. Disclosure of Your Information</h2>
            <p>
              We may disclose your information in the following circumstances:
            </p>
            <ul>
              <li><strong>To Other Users:</strong> Information you include in your profile will be visible to other users based on your privacy settings.</li>
              <li><strong>Service Providers:</strong> We may share information with third-party vendors who provide services on our behalf.</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to legal processes.</li>
              <li><strong>Business Transfers:</strong> Information may be transferred if we are involved in a merger, acquisition, or sale of assets.</li>
            </ul>
            
            <Separator className="my-4" />
            
            <h2>5. Your Privacy Choices</h2>
            <p>
              You have several choices regarding your information:
            </p>
            <ul>
              <li><strong>Profile Visibility:</strong> You can control who can view your profile through privacy settings.</li>
              <li><strong>Communication Preferences:</strong> You can manage who can contact you.</li>
              <li><strong>Information Updates:</strong> You can update or correct your profile information at any time.</li>
              <li><strong>Account Deletion:</strong> You can request the deletion of your account.</li>
            </ul>
            
            <Separator className="my-4" />
            
            <h2>6. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            
            <Separator className="my-4" />
            
            <h2>7. Data Retention</h2>
            <p>
              We retain your information for as long as your account is active or as needed to provide services. We may retain certain information even after account deletion if required for legal or legitimate business purposes.
            </p>
            
            <Separator className="my-4" />
            
            <h2>8. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect information from children.
            </p>
            
            <Separator className="my-4" />
            
            <h2>9. International Data Transfers</h2>
            <p>
              Your information may be stored and processed in countries other than your own, where data protection laws may differ.
            </p>
            
            <Separator className="my-4" />
            
            <h2>10. Changes to this Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on our website or by other means.
            </p>
            
            <Separator className="my-4" />
            
            <h2>11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@nikahsufiyana.com.
            </p>
            
            <div className="mt-6 text-center">
              <p>Last updated: June 14, 2025</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
