/*
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/context/auth-context";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

const StudentProfile = () => {
    const { auth } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        about: "",
        phoneNo: "",
        class: "",
        collegeName: "",
        universityName: "",
        dob: "",
        imageBase64: ""
    });
    const [preview, setPreview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [showScratchCard, setShowScratchCard] = useState(false);
    const [scratched, setScratched] = useState(false);
    const couponCode = "PROFILE25"; // Your fixed coupon code

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/students/${auth.user._id}`);
            setProfile(res.data);
            setFormData(res.data);
        } catch (error) {
            console.error("No profile found. Student needs to create one.");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, imageBase64: reader.result });
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            if (profile) {
                await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/students/${auth.user._id}`, formData);
                toast({
                    title: "profile updated successfully!"

                })

            } else {
                await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/students`, { ...formData, userId: auth.user._id });
                setShowScratchCard(true);

                toast({
                    title: "profile created successfully!"
                })

            }
            fetchProfile();
            setIsEditing(false);
            setIsCreating(false);



        } catch (error) {
            console.error("Error saving profile:", error);

        }
    };

    return (
        <div className="max-w-lg mx-auto mt-20 p-4 ">
            {profile ? (
                <Card className="p-4 shadow-lg">
                    <CardContent>
                        <div className="text-center">
                            <img
                                src={profile.imageUrl || "/default-profile.png"}
                                alt="Profile"
                                className="w-32 h-32 object-cover rounded-full mx-auto"
                            />
                            <h2 className="text-2xl font-semibold mt-2">{auth.user.userName}</h2>
                            <p><strong>{profile.about}</strong></p>
                        </div>
                        <div className="mt-4 space-y-2">

                            <p><strong>Phone:</strong> {profile.phoneNo}</p>
                            <p><strong>Class:</strong> {profile.class}</p>
                            <p><strong>College:</strong> {profile.collegeName}</p>
                            <p><strong>University:</strong> {profile.universityName}</p>
                            <p><strong>DOB:</strong> {profile.dob}</p>
                            <p><strong>Address:</strong> {profile.address}</p>
                        </div>
                        <Dialog open={isEditing} onOpenChange={setIsEditing}>
                            <DialogTrigger asChild>
                                <Button className="w-full mt-4">Edit Profile</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle><h2 className="text-xl font-semibold mb-3">Edit Profile</h2></DialogTitle>

                                <Input name="about" value={formData.about} onChange={handleChange} placeholder="About" className="mb-2" />

                                <Input name="phoneNo" value={formData.phoneNo} onChange={handleChange} placeholder="Phone Number" className="mb-2" />
                                <Input name="class" value={formData.class} onChange={handleChange} placeholder="Class" className="mb-2" />
                                <Input name="collegeName" value={formData.collegeName} onChange={handleChange} placeholder="College Name" className="mb-2" />
                                <Input name="universityName" value={formData.universityName} onChange={handleChange} placeholder="University Name" className="mb-2" />
                                <Input type="date" name="dob" value={formData.dob} onChange={handleChange} className="mb-2" />
                                <Input name="address" value={formData.address} onChange={handleChange} placeholder="Enter your city,state" className="mb-2" />
                                <Input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />
                                {preview && <img src={preview} alt="Preview" className="w-full max-h-40 object-cover rounded-lg mb-2" />}
                                <Button className="w-full" onClick={handleSave}>Save Changes</Button>
                            </DialogContent>
                        </Dialog>


                        {showScratchCard && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600">
                                        🎉 You Won a Scratch Card! Click to Reveal
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <h2 className="text-xl font-semibold text-center mb-4">Scratch & Win 🎁</h2>
                                    <div
                                        className={`w-full h-24 bg-gray-300 flex items-center justify-center text-xl font-bold ${scratched ? "text-black bg-white" : "text-gray-300"
                                            }`}
                                        onClick={() => setScratched(true)}
                                    >
                                        {scratched ? couponCode : "Scratch Here"}
                                    </div>
                                    <p className="text-center mt-2 text-green-600 font-semibold">
                                        {scratched && "🎉 Use this coupon at payment gateway!"}
                                    </p>
                                </DialogContent>
                            </Dialog>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="text-center">
                    <p>No profile found. Please create one.</p>
                    <Dialog open={isCreating} onOpenChange={setIsCreating}>
                        <DialogTrigger asChild>
                            <Button className="mt-4">Create Profile</Button>
                        </DialogTrigger>
                        <p>Get a Scratch Card when you create your profile!</p>
                        <DialogContent>
                            <h2 className="text-xl font-semibold mb-3">Create Profile</h2>
                            <Input name="about" onChange={handleChange} placeholder="About" className="mb-2" />
                            <Input name="phoneNo" onChange={handleChange} placeholder="Phone Number" className="mb-2" />
                            <Input name="class" onChange={handleChange} placeholder="Class" className="mb-2" />
                            <Input name="collegeName" onChange={handleChange} placeholder="College Name" className="mb-2" />
                            <Input name="universityName" onChange={handleChange} placeholder="University Name" className="mb-2" />
                            <Input type="date" name="dob" onChange={handleChange} className="mb-2" />

                            <Input name="address" onChange={handleChange} placeholder="Enter your city,state" className="mb-2" />

                            <Input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />
                            {preview && <img src={preview} alt="Preview" className="w-full max-h-40 object-cover rounded-lg mb-2" />}
                            <Button className="w-full" onClick={handleSave}>Save Profile</Button>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>
    );
};

export default StudentProfile;


*/



import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/context/auth-context";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

const StudentProfile = () => {
    const { auth } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        about: "",
        phoneNo: "",
        class: "",
        collegeName: "",
        universityName: "",
        dob: "",
        imageBase64: ""
    });
    const [preview, setPreview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [showScratchCard, setShowScratchCard] = useState(false);
    const [scratched, setScratched] = useState(false);
    const couponCode = "ILOVEYOU3000"; // fixed coupon code

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/students/${auth.user._id}`);
            setProfile(res.data);
            setFormData(res.data);
        } catch (error) {
            console.error("No profile found. Student needs to create one.");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, imageBase64: reader.result });
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            if (profile) {
                await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/students/${auth.user._id}`, formData);
                toast({
                    title: "profile updated successfully!"

                })

            } else {
                await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/students`, { ...formData, userId: auth.user._id });
                setShowScratchCard(true);

                toast({
                    title: "profile created successfully!"
                })

            }
            fetchProfile();
            setIsEditing(false);
            setIsCreating(false);



        } catch (error) {
            console.error("Error saving profile:", error);

        }
    };

    return (
        <div className="max-w-lg mx-auto mt-20 p-4 ">
            {profile ? (
                <Card className="p-4 shadow-lg">
                    <CardContent>
                        <div className="text-center">
                            <img
                                src={profile.imageUrl || "/default-profile.png"}
                                alt="Profile"
                                className="w-32 h-32 object-cover rounded-full mx-auto"
                            />
                            <h2 className="text-2xl font-semibold mt-2">{auth.user.userName}</h2>
                            <p><strong>{profile.about}</strong></p>
                        </div>
                        <div className="mt-4 space-y-2">

                            <p><strong>Phone:</strong> {profile.phoneNo}</p>
                            <p><strong>Class:</strong> {profile.class}</p>
                            <p><strong>College:</strong> {profile.collegeName}</p>
                            <p><strong>University:</strong> {profile.universityName}</p>
                            <p><strong>DOB:</strong> {profile.dob}</p>
                            <p><strong>Address:</strong> {profile.address}</p>
                        </div>
                        <Dialog open={isEditing} onOpenChange={setIsEditing}>
                            <DialogTrigger asChild>
                                <Button className="w-full mt-4">Edit Profile</Button>
                            </DialogTrigger>
                            <DialogContent className="p-4 max-w-md w-full">
                                <h2 className="text-xl font-semibold">Edit Profile</h2>

                                <div className={`flex flex-col gap-4 ${preview ? 'max-h-[400px] overflow-y-auto' : ''}`}>
                                    <Input name="about" value={formData.about} onChange={handleChange} placeholder="About" />
                                    <Input name="phoneNo" value={formData.phoneNo} onChange={handleChange} placeholder="Phone Number" />
                                    <Input name="class" value={formData.class} onChange={handleChange} placeholder="Class" />
                                    <Input name="collegeName" value={formData.collegeName} onChange={handleChange} placeholder="College Name" />
                                    <Input name="universityName" value={formData.universityName} onChange={handleChange} placeholder="University Name" />
                                    <Input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                                    <Input name="address" value={formData.address} onChange={handleChange} placeholder="Enter your city,state" />
                                    <Input type="file" accept="image/*" onChange={handleFileChange} />

                                    {preview && (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="w-full max-h-40 object-cover rounded-lg"
                                        />
                                    )}
                                </div>

                                <Button className="w-full mt-4" onClick={handleSave}>Save Changes</Button>
                            </DialogContent>

                        </Dialog>


                        {showScratchCard && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600">
                                        🎉 You Won a Scratch Card! Click to Reveal
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <h2 className="text-xl font-semibold text-center mb-4">Scratch & Win 🎁</h2>
                                    <div
                                        className={`w-full h-24 bg-gray-300 flex items-center justify-center text-xl font-bold ${scratched ? "text-black bg-white" : "text-gray-300"
                                            }`}
                                        onClick={() => setScratched(true)}
                                    >
                                        {scratched ? couponCode : "Scratch Here"}
                                    </div>
                                    <p className="text-center mt-2 text-green-600 font-semibold">
                                        {scratched && "🎉 Use this coupon at payment gateway!"}
                                    </p>
                                </DialogContent>
                            </Dialog>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="text-center">
                    <p>No profile found. Please create one.</p>
                    <Dialog open={isCreating} onOpenChange={setIsCreating}>
                        <DialogTrigger asChild>
                            <Button className="mt-4">Create Profile</Button>
                        </DialogTrigger>
                        <p>Get a Scratch Card when you create your profile!</p>
                        <DialogContent className="p-4 max-w-md w-full">
                            <h2 className="text-xl font-semibold mb-3">Create Profile</h2>

                            <div className={`flex flex-col gap-4 ${preview ? 'max-h-[400px] overflow-y-auto pr-1' : ''}`}>
                                <Input name="about" onChange={handleChange} placeholder="About" />
                                <Input name="phoneNo" onChange={handleChange} placeholder="Phone Number" />
                                <Input name="class" onChange={handleChange} placeholder="Class" />
                                <Input name="collegeName" onChange={handleChange} placeholder="College Name" />
                                <Input name="universityName" onChange={handleChange} placeholder="University Name" />
                                <Input type="date" name="dob" onChange={handleChange} />
                                <Input name="address" onChange={handleChange} placeholder="Enter your city,state" />
                                <Input type="file" accept="image/*" onChange={handleFileChange} />

                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full max-h-40 object-cover rounded-lg"
                                    />
                                )}
                            </div>

                            <Button className="w-full mt-4" onClick={handleSave}>Save Profile</Button>
                        </DialogContent>

                    </Dialog>
                </div>
            )}
        </div>
    );
};

export default StudentProfile;


