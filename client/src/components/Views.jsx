import SignIn from './Login/SignIn'
import { Text } from '@chakra-ui/layout'
import SignUp from './Login/SignUp'
import Home from './Home/Home'
import { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import PrivateRoutes from './PrivateRouters';
import { AccountContext } from './Contexts/AccountContext';

const Views = () => {
    //The below part render the login and signup components only if the user is logged out
    const { user } = useContext(AccountContext)

    //If user is logged in render routers otherwise render login
    return user.loggedIn === null ? <Text>Loading Borrowit...</Text> : (
        <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/register" element={<SignUp />} />


            <Route element={<PrivateRoutes />}>
                <Route path="/home" element={<Home />} />
            </Route>


            <Route path="*" element={<SignUp />} />
        </Routes>
    );
};

export default Views
