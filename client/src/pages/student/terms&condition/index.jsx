import { useEffect } from "react";

const TermsCondition = () => {
    useEffect(() => {
        document.title = "Privacy Policy - LMS LEARN";
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 text-gray-800 mt-20 mb-12">
            <h1 className="text-3xl font-extrabold text-center mb-6">Terms and Conditions</h1>


            <h2 className="text-2xl font-bold mt-6 mb-2">1. INTRODUCTION</h2>
            <p className="mb-4 text-lg">
                1. Apna College provides online courses and conducts online classes, live demo, doubt clearing sessions for the students seeking to enrol for such courses (the " Services"), which Services are accessible at https://www.apnacollege.in/ and any other websites through which Apna College makes the Services available (collectively, the "Site ") and as applications for mobile, tablet and other smart devices and application program interfaces (collectively, the "Applications").
                2. By accessing or using the Site, Application or Services or by downloading or posting any content from or on the Site, via the Applications, you would be indicating that you have read, and that you understand and agree to be bound by these terms and receive our Services (“ Terms of Services” or “Terms”), whether or not you have registered with the Site and/or Application.
                3. Therefore, kindly read these Terms of service before accessing or using the Site, Application or Services or downloading or posting any content from or on the Site, via the Application or through the Services, carefully as they contain important information regarding your legal rights, remedies and obligations.
                4. If you do not agree to these Terms, then you have no right to access or use the Site, Application, Services, or Collective Content (as defined below).
                5. If you are using the Site, Application or Services then these Terms of Service are binding between you and Apna College.
            </p>



        </div>
    );
};

export default TermsCondition;
