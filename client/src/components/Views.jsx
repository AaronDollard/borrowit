import SignIn from './Login/SignIn'
import SignUp from './Login/SignUp'
import NavBar from './NavBar/NavBar'
import Footer from './NavBar/Footer'
import { useContext, useEffect, useState, createContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import PrivateRoutes from './PrivateRouters';
import { AccountContext } from './Contexts/AccountContext';
import Dashboard from './Dashboard/DashBoard'
import Browse from './Browse/Browse'
import Loading from './assets/Loading'
import '../styles/styles.css'
import BrowseSpecificItem from './Browse/BrowseSpecificItem'
import BrowseSpecificUser from './Browse/BrowseSpecificUser'
import ChatMain from './Communication/ChatMain'
import socketConnection from "../Socket/socket";
import Administration from './Administration/Administration'
import useSocketSetup from '../Socket/useSocketSetup'

export const SocketContext = createContext();


const Views = () => {
    //The below part render the login and signup components only if the user is logged out
    const { user } = useContext(AccountContext)


    const [contactList, setContactList] = useState([]);
    const [messages, setMessages] = useState([]);
    const [contactIndex, setContactIndex] = useState(0);


    const [socket, setSocket] = useState(() => socketConnection(user));


    useEffect(() => {
        setSocket(() => socketConnection(user));
    }, []);

    useSocketSetup(setContactList, setMessages, socket);

    //If user is logged in render routers otherwise render login
    return user.loggedIn === null ? <></>
        // <Loading class='center-screen'></Loading><Text>Loading Borrowit...</Text> 
        : (
            <>
                {user.loggedIn === true && (
                    <>
                        <SocketContext.Provider value={{ socket }}>
                            <NavBar />
                            <Routes>
                                <Route element={<PrivateRoutes />}>
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/chat" element={<ChatMain />} />
                                    <Route path="/browse" element={<Browse />} />
                                    <Route path="/browse/:itemid" element={<BrowseSpecificItem />} />
                                    <Route path="/users/:username" element={<BrowseSpecificUser />} />
                                    {user.userrole === "admin" && (
                                        <>
                                            <Route path="/administration" element={<Administration />} />
                                        </>
                                    )}
                                </Route>
                            </Routes>
                        </SocketContext.Provider>
                    </>
                )}

                {user.loggedIn === false && (
                    <>
                        <Routes>
                            <Route path="/" element={<SignIn />} />
                            <Route path="/register" element={<SignUp />} />
                            <Route path="*" element={<SignIn />} />
                        </Routes>
                        <Footer />
                    </>
                )}
            </>
        );

};

export default Views
