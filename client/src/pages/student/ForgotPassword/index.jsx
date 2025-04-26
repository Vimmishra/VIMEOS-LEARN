

import OtpDialog from "@/components/OtpDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useState } from "react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [step, setStep] = useState(1);
    const [dialogOpen, setDialogOpen] = useState(false);



    const sendOtp = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/send-otp`, { userEmail: email });
            setDialogOpen(true);
            setStep(2);

            toast({
                title: "OTP sent successfully!",
                description: "Valid for only 3 minutes!",
            });

        } catch (error) {
            console.error("Error sending OTP", error);
            toast({
                title: "Error",
                description: "Email is not registered with us!",
                variant: "destructive",
            });
        }
    };



    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-6">

            <Card className="w-[400px] shadow-lg rounded-lg">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-semibold">Forgot Password</CardTitle>
                </CardHeader>
                <CardContent>
                    {step === 1 && (
                        <div className="space-y-4">
                            <p className="text-gray-500 text-sm text-center">
                                Enter your registered email to receive a password reset OTP.
                            </p>
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full"
                            />
                            <Button className="w-full" onClick={sendOtp}>
                                Send OTP
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>


            <OtpDialog open={dialogOpen} setOpen={setDialogOpen} userEmail={email} setStep={setStep} />
        </div>
    );
};

export default ForgotPassword;

