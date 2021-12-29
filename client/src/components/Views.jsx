import SignIn from './Login/SignIn'
import { Text } from '@chakra-ui/layout'
import SignUp from './Login/SignUp'
import NavBar from './NavBar/NavBar'
import { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import PrivateRoutes from './PrivateRouters';
import { AccountContext } from './Contexts/AccountContext';
import Dashboard from './Dashboard/Dashboard'
import Browse from './Browse/Browse'
import Loading from './assets/Loading'
import '../styles/styles.css'

const Views = () => {
    //The below part render the login and signup components only if the user is logged out
    const { user } = useContext(AccountContext)

    //If user is logged in render routers otherwise render login
    return user.loggedIn === null ? <></>
        // <Loading class='center-screen'></Loading><Text>Loading Borrowit...</Text> 
        : (
            <>
                {user.loggedIn === true && (
                    <NavBar />
                )}

                <Routes>
                    <Route path="/" element={<SignIn />} />
                    <Route path="/register" element={<SignUp />} />


                    <Route element={<PrivateRoutes />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/browse" element={<Browse />} />
                    </Route>


                    <Route path="*" element={<SignUp />} />
                </Routes>
            </>
        );

};

export default Views
