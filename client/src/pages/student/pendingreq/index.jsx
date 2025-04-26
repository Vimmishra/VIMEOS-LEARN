import PendingRequests from '@/components/PendingRequests';
import { AuthContext } from '@/context/auth-context';
import { useContext } from 'react';


const ParentComponent = () => {

    const { auth } = useContext(AuthContext)

    const userId = auth?.user?._id; // Replace with the actual user ID
    const token = JSON.parse(sessionStorage.getItem("accessToken"));; // Replace with the actual access token

    return (
        <div>
            <PendingRequests userId={userId} token={token} />
        </div>
    );
};

export default ParentComponent;