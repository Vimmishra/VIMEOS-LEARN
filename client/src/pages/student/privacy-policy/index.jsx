import { useEffect } from "react";

const PrivacyPolicy = () => {
    useEffect(() => {
        document.title = "Privacy Policy - LMS LEARN";
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 text-gray-800 mt-20 mb-12">
            <h1 className="text-3xl font-extrabold text-center mb-6">PRIVACY POLICY</h1>
            <p className="mb-4">
                This Privacy Policy discloses the privacy practices for VIMEO LEARN regarding
                your use of our platform. This Privacy Policy describes how we collect,
                compile, store, use, share, and secure your personal information across
                our website.
            </p>
            <p className="mb-4">
                By using our website, you agree to be bound by the terms and conditions of
                this Privacy Policy. If you do not agree with the terms, kindly do not
                access this website.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-2">1. COLLECTION OF INFORMATION</h2>
            <p className="mb-4">
                As a visitor, you can browse through our website to explore courses and
                features. You are not required to provide any personal data if you are
                merely a visitor. However, when you register, purchase courses, or
                interact with our platform, we may collect your personal data for
                authentication, support, and service improvement.
            </p>
            <p className="mb-4">
                The primary purpose of collecting your personal information is to enhance
                your learning experience, provide online courses, study material, and
                support services. We do not share your data with third parties without
                your consent.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-2">2. USAGE OF INFORMATION</h2>
            <p className="mb-4">
                We use your personal information to provide seamless access to our
                platform, process transactions, send important notifications, and improve
                our services. Your data helps us personalize your experience and enhance
                the platform’s usability.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-2">3. DATA SECURITY</h2>
            <p className="mb-4">
                We take appropriate security measures to protect your data from
                unauthorized access, alteration, disclosure, or destruction. However, we
                cannot guarantee absolute security due to the inherent risks of digital
                data storage.
            </p>

            <h2 className="text-2xl font-bold mt-6 mb-2">4. CHANGES TO PRIVACY POLICY</h2>
            <p className="mb-4">
                We reserve the right to update this Privacy Policy at any time. Changes
                will be posted on this page, and we encourage users to review it
                periodically.
            </p>
        </div>
    );
};

export default PrivacyPolicy;
