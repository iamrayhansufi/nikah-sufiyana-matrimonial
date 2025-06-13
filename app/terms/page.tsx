"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950 dark:to-amber-950">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Nikah Sufiyana Matrimonial Services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
            
            <Separator className="my-4" />
            
            <h2>2. Eligibility</h2>
            <p>
              To use our services, you must be at least 18 years of age and legally eligible for marriage according to the laws applicable to you.
            </p>
            
            <Separator className="my-4" />
            
            <h2>3. Registration and Account</h2>
            <p>
              3.1. You must provide accurate, current, and complete information during the registration process.
            </p>
            <p>
              3.2. You are responsible for maintaining the confidentiality of your account credentials.
            </p>
            <p>
              3.3. You are solely responsible for all activities that occur under your account.
            </p>
            
            <Separator className="my-4" />
            
            <h2>4. User Conduct</h2>
            <p>
              4.1. You agree not to use the service for any unlawful purpose or in violation of these Terms.
            </p>
            <p>
              4.2. You will not provide false or misleading information about yourself or your intentions.
            </p>
            <p>
              4.3. You will not harass, intimidate, or harm other users.
            </p>
            <p>
              4.4. You will not use the service for commercial solicitation.
            </p>
            
            <Separator className="my-4" />
            
            <h2>5. Content</h2>
            <p>
              5.1. You retain all rights to the content you submit, but grant us a worldwide, non-exclusive license to use it for the purposes of providing and improving our services.
            </p>
            <p>
              5.2. You are responsible for ensuring that all content you submit complies with applicable laws and does not infringe on the rights of others.
            </p>
            
            <Separator className="my-4" />
            
            <h2>6. Privacy</h2>
            <p>
              Your use of our services is also governed by our Privacy Policy, which is incorporated by reference into these Terms.
            </p>
            
            <Separator className="my-4" />
            
            <h2>7. Service Modifications</h2>
            <p>
              We reserve the right to modify or terminate our services at any time, with or without notice.
            </p>
            
            <Separator className="my-4" />
            
            <h2>8. Subscription and Payments</h2>
            <p>
              8.1. We offer both free and premium subscription options.
            </p>
            <p>
              8.2. Premium subscriptions are billed according to the plan you select.
            </p>
            <p>
              8.3. Subscription fees are non-refundable except as required by law.
            </p>
            
            <Separator className="my-4" />
            
            <h2>9. Disclaimer of Warranties</h2>
            <p>
              Our services are provided "as is" without warranties of any kind, either express or implied.
            </p>
            
            <Separator className="my-4" />
            
            <h2>10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services.
            </p>
            
            <Separator className="my-4" />
            
            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify and hold us harmless from any claims, damages, liabilities, costs, or expenses arising from your use of our services or violation of these Terms.
            </p>
            
            <Separator className="my-4" />
            
            <h2>12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>
            
            <Separator className="my-4" />
            
            <h2>13. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. The updated Terms will be effective upon posting, and your continued use of our services after the effective date constitutes your acceptance of the updated Terms.
            </p>
            
            <Separator className="my-4" />
            
            <h2>14. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at support@nikahsufiyana.com.
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
