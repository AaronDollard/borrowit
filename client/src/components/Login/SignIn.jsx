import { Button, ButtonGroup, Heading, VStack, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AccountContext } from '../Contexts/AccountContext'
import * as Yup from "yup";
import TextField from "./TextField";

const SignIn = () => {
    const { setUser } = useContext(AccountContext);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    return (
        <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={Yup.object({
                username: Yup.string()
                    .required("Username required!")
                    .min(6, "Username too short!")
                    .max(20, "Username too long!"),
                password: Yup.string()
                    .required("Password required!")
                    .min(6, "Password too short!")
                    .max(20, "Password too long!"),
            })}
            onSubmit={(values, actions) => {
                const vals = { ...values };
                actions.resetForm();
                fetch(`${process.env.REACT_APP_SERVER_URL}/auth/login`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(vals),
                })
                    .catch(err => {
                        return;
                    })
                    .then(res => {
                        if (!res || !res.ok || res.status >= 400) {
                            return;
                        }
                        return res.json();
                    })
                    .then(data => {
                        if (!data) return;
                        setUser({ ...data });
                        if (data.status) {
                            setError(data.status);

                        } else if (data.loggedIn) {
                            console.log(data);
                            console.log(process.env.REACT_APP_SERVER_URL)
                            localStorage.setItem("token", data.token);
                            navigate("/browse");
                        }
                    });
            }}
        >
            <VStack
                as={Form}
                w={{ base: "90%", md: "500px" }}
                m="auto"
                justify="center"
                h="100vh"
                spacing="1rem"
            >
                <Heading>Log In</Heading>
                <Text as="p" color="red.500">{error}</Text>
                <TextField
                    name="username"
                    placeholder="Enter username"
                    autoComplete="off"
                    label="Username"
                />

                <TextField
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    autoComplete="off"
                    label="Password"
                />

                <ButtonGroup pt="1rem">
                    <Button colorScheme="teal" type="submit">
                        Log In
                    </Button>
                    <Button onClick={() => navigate("/register")}>Create Account</Button>
                </ButtonGroup>
            </VStack>
        </Formik >
    );
};

export default SignIn;