import { Skeleton } from "@/components/ui/skeleton";
import { initialSignInFormData, initialSignUpFormData } from "@/config";
import { toast } from "@/hooks/use-toast";
import { checkAuthService, loginService, registerService } from "@/services";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {

    const navigate = useNavigate();

    const [signInFormData, setSignInFormData] = useState(initialSignInFormData);
    const [signUpFormData, setSignUpFormData] = useState(initialSignUpFormData);
    const [auth, setAuth] = useState({
        authenticate: false,
        user: null,
    });

    const [loading, setLoading] = useState(true);

    async function handleRegisterUser(event) {
        event.preventDefault();
        const data = await registerService(signUpFormData);

        if (data.success) {
            toast({
                title: "Welcome!",
                description: "You have signed Up successfully."
            });

            navigate('/auth')
        }

        else {
            toast({
                title: "Sorry!",
                description: data.message,
                variant: "destructive"
            });
            console.log(data.message)
        }






    }


    async function handleLoginUser(event) {
        event.preventDefault();
        const data = await loginService(signInFormData);

        if (data.success) {


            sessionStorage.setItem("accessToken", JSON.stringify(data.data.accessToken))
            setAuth({
                authenticate: true,
                user: data.data.user,
            });



            //toast
            toast({
                title: "Welcome back!",
                description: "You have signed in successfully."
            });



        } else {
            setAuth({
                authenticate: false,
                user: null,
            });

            toast({
                title: "Login Failed!",
                description: data.message,
                variant: "destructive"
            })
        }

    }

    //check Auth user: 
    async function checkAuthUser() {

        try {
            const data = await checkAuthService();

            if (data.success) {
                setAuth({
                    authenticate: true,
                    user: data.data.user,
                });
                setLoading(false)
            } else {
                setAuth({
                    authenticate: false,
                    user: null,
                });
                setLoading(false)
            }

        } catch (error) {
            console.log(error)
            if (!error?.response?.data?.success) {
                setAuth({
                    authenticate: false,
                    user: null,
                });
                setLoading(false)
            }
        }

    }


    function resetCredentials() {
        setAuth({
            authentication: false,
            user: null
        })
    }


    useEffect(() => {
        checkAuthUser()
    }, []);


    console.log(auth)


    return <AuthContext.Provider value={{
        signInFormData, setSignInFormData,
        signUpFormData, setSignUpFormData,
        handleRegisterUser, handleLoginUser,
        auth, resetCredentials,
    }}>
        {
            loading ? <Skeleton /> : children
        }
    </AuthContext.Provider>
}