/*

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const OtpDialog = ({ open, setOpen, userEmail, setStep }) => {
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [stage, setStage] = useState(2); 
    const navigate = useNavigate();

    const verifyOtp = async () => {
        if (!userEmail) {
            console.error("❌ ERROR: `userEmail` is undefined! Ensure it's passed to `OtpDialog`.");
            return;
        }

        console.log("🟢 Sending to verify-otp:", { userEmail, otp }); // Debugging

        try {
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/verify-otp`, {
                userEmail,
                otp,
            });

            console.log("✅ OTP Verification Success:", res.data);
            if (res.data.success) {
                setStage(3);
            }


            toast({
                title: "Otp verified!",

            })

        } catch (error) {
            console.error("❌ Invalid OTP:", error.response?.data?.message || error.message);

            toast({
                title: "error",
                description: error.response?.data?.message || error.message,
                variant: "destructive"
            })
        }
    };



    const resetPassword = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/reset-password`, { userEmail, newPassword });
            setOpen(false);
            setStep(1);

            toast({
                title: "Password reset successfully!",
                description: "Now you can signIn with new Password."
            })

            navigate("/auth")

        } catch (error) {
            console.error("❌ Error resetting password:", error.response?.data?.message || error.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div className="p-4">
                {stage === 2 && (
                    <div>
                        <h2 className="text-xl">Enter OTP</h2>
                        <Input type="text" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                        <Button onClick={verifyOtp}>Verify OTP</Button>
                    </div>
                )}
                {stage === 3 && (
                    <div>
                        <h2 className="text-xl">Create New Password</h2>
                        <Input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Button onClick={resetPassword} disabled={stage !== 3}>
                            Reset Password
                        </Button>
                    </div>
                )}
            </div>
        </Dialog>
    );
};

export default OtpDialog;
*/


import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const OtpDialog = ({ open, setOpen, userEmail, setStep }) => {
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [stage, setStage] = useState(2);
    const navigate = useNavigate();

    const verifyOtp = async () => {
        if (!userEmail) {
            console.error("❌ ERROR: `userEmail` is undefined! Ensure it's passed to `OtpDialog`.");
            return;
        }

        console.log("🟢 Sending to verify-otp:", { userEmail, otp });

        try {
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/verify-otp`, {
                userEmail,
                otp,
            });

            console.log("✅ OTP Verification Success:", res.data);
            if (res.data.success) {
                setStage(3);
                toast({ title: "OTP verified!" });
            }
        } catch (error) {
            console.error("❌ Invalid OTP:", error.response?.data?.message || error.message);
            toast({
                title: "Error",
                description: error.response?.data?.message || error.message,
                variant: "destructive",
            });
        }
    };

    const resetPassword = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/auth/reset-password`, { userEmail, newPassword });
            setOpen(false);
            setStep(1);

            toast({
                title: "Password reset successfully!",
                description: "Now you can sign in with your new password.",
            });

            navigate("/auth");
        } catch (error) {
            console.error("❌ Error resetting password:", error.response?.data?.message || error.message);
            toast({
                title: "Error",
                description: error.response?.data?.message || error.message,
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div className="p-6 space-y-4">
                {stage === 2 && (
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">Enter OTP</h2>
                        <p className="text-gray-500 text-sm">Enter the 6-digit code sent to your email.</p>
                        <InputOTP maxLength={6} value={otp} onChange={setOtp} className="mt-4">
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSeparator />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                        <Button className="mt-4 w-full" onClick={verifyOtp}>Verify OTP</Button>
                    </div>
                )}

                {stage === 3 && (
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">Create New Password</h2>
                        <p className="text-gray-500 text-sm">Enter your new password below.</p>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2 border rounded mt-4"
                        />
                        <Button className="mt-4 w-full" onClick={resetPassword} disabled={stage !== 3}>
                            Reset Password
                        </Button>
                    </div>
                )}
            </div>
        </Dialog>
    );
};

export default OtpDialog;
