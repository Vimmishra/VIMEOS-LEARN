import { Facebook, Instagram, Linkedin, Mail, Phone, Twitter, Youtube } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-100 text-gray-700 py-10">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-sm">

                {/* Logo & Tagline */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        <span className="text-orange-500">VIMEOS</span> Learn
                    </h2>
                    <p className="mt-2 text-xl text-gray-600">Where education meets real-world needs.</p>
                </div>

                {/* Helpful Links */}
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">HELPFUL LINKS</h3>
                    <ul className="mt-2 space-y-2">
                        <li><a href="/courses" className="hover:text-orange-500 text-sm">Courses</a></li>
                        <li><a href="/privacy-policy" className="hover:text-orange-500 text-sm">Privacy Policy</a></li>
                        <li><a href="/refund-policy" className="hover:text-orange-500 text-sm">Refund Policy</a></li>
                        <li><a href="/terms" className="hover:text-orange-500 text-sm">Terms & Conditions</a></li>
                    </ul>
                </div>

                {/* Contact Section */}
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">GET IN TOUCH</h3>
                    <ul className="mt-2 space-y-2">
                        <li className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 " /> vm45231@gmail.com</li>
                        <li className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 " /> Support: 10am - 6pm</li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">CONNECT WITH US</h3>
                    <div className="flex flex-col space-y-2 mt-2">
                        <a href="#" className="flex items-center gap-2 hover:text-orange-500 text-sm"><Facebook className="w-4 h-4" /> Facebook</a>
                        <a href="#" className="flex items-center gap-2 hover:text-orange-500 text-sm"><Twitter className="w-4 h-4" /> Twitter</a>
                        <a href="#" className="flex items-center gap-2 hover:text-orange-500 text-sm"><Youtube className="w-4 h-4" /> YouTube</a>
                        <a href="#" className="flex items-center gap-2 hover:text-orange-500 text-sm"><Instagram className="w-4 h-4" /> Instagram</a>
                        <a href="#" className="flex items-center gap-2 hover:text-orange-500 text-sm"><Linkedin className="w-4 h-4" /> LinkedIn</a>
                    </div>
                </div>

            </div>
            <div className="text-center mt-8 text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Vimeo Learn. All rights reserved.
            </div>
        </footer>
    );
}
