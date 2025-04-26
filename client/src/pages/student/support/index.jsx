import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { Phone } from "lucide-react";
import { useState } from "react";
// Phone icon for better UI

const Help = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        issue: "",
    });

    const [loading, setLoading] = useState(false);
    const tollFreeNumber = "98772-13550"; // Replace with your actual number

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        const token = JSON.parse(sessionStorage.getItem("accessToken"));
        if (!token) {
            console.error("User not logged in");
            return;
        }

        if (!formData.name || !formData.email || !formData.issue) {
            toast({ title: "Error", description: "All fields are required!", duration: 3000 });
            return;
        }

        setLoading(true);

        try {
            await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/help`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast({ title: "Success", description: "Your issue has been submitted!", duration: 3000 });

            setFormData({ name: "", email: "", issue: "" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to submit. Try again!", duration: 3000 });
            console.error("Error submitting help request:", error);
        }

        setLoading(false);
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-md shadow-md mt-24 mb-12">
            {/* Animation Image */}
            <div className="flex justify-center mb-4">
                <img
                    src="contact-us.png"  // Replace with your actual image path
                    alt="Technical Support"
                    className="w-40 md:w-60"
                />
            </div>

            <div className="text-center bg-blue-100 p-3 rounded-md mb-4">
                <p className="text-lg font-semibold text-blue-700">Need Immediate Help?</p>
                <p className="text-md text-gray-600">Call our Toll-Free Number</p>
                <a
                    href={`tel:${tollFreeNumber}`}
                    className="mt-2 inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-lg font-semibold"
                >
                    <Phone className="mr-2" /> {tollFreeNumber}
                </a>
            </div>

            <h2 className="text-xl font-semibold text-center mb-4">Need Help? Contact Us!</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input */}
                <div>
                    <label className="block font-medium mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter your name"
                    />
                </div>

                {/* Email Input */}
                <div>
                    <label className="block font-medium mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter your email"
                    />
                </div>

                {/* Issue Description */}
                <div>
                    <label className="block font-medium mb-1">Describe Your Issue</label>
                    <textarea
                        name="issue"
                        value={formData.issue}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        rows="4"
                        placeholder="Describe your issue..."
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default Help;
