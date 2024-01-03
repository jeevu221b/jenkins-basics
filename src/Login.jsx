import React, { useState, useEffect } from 'react';
import './Login.css';

const Login = () => {
    const token = localStorage.getItem('token');
    const [email, setEmail] = useState('');
    const [showOTPField, setShowOTPField] = useState(false);
    const [otp, setOTP] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loader, setLoader] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const [invalidOTP, setInvalidOTP] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [addInfo, setaddInfo] = useState(false);
    // const [userInfo, setUserInfo] = useState('');
    const [aadharNumber, setaadharNumber] = useState('');
    const [panNumber, setpanNumber] = useState('');




    useEffect(() => {
        if (token) {
            fetchUserData(token);
        }
    }, [token]);

    const fetchUserData = async (token) => {
        setLoader(true);
        try {
            const response = await fetch('http://localhost:4000/getuser', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                }
            });
            if (response.ok) {
                console.log("Inside if")
                const userData = await response.json();
                setUserData(userData);
                console.log(userData)
                setLoggedIn(true);
                setInvalidOTP(false);
            } else {
                const errorData = await response.json();
                console.log('User verification failed:', errorData);
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setLoader(false);
    };

    const handleEmailSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                setShowOTPField(true);
                setInvalidEmail(false);
                setServerError(false);
            } else {
                console.error('Email verification failed');
                setInvalidEmail(true);
            }
        } catch (error) {
            console.error('This is the error', error);
            setServerError(true);
        }
    };

    const handleOTPSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, otp })
            });

            if (response.ok) {
                // setLoggedIn(true);
                const loggedData = await response.json();
                console.log(loggedData.authorization);
                localStorage.setItem('token', loggedData.authorization);
                setLoggedIn(true)
                fetchUserData(loggedData.authorization);
                console.log("Succesfully called fetchUserData")

            } else {
                const errorData = await response.json();
                console.error('OTP verification failed:', errorData.message);
                setInvalidOTP(true);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:4000/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.getItem('token')
                }
            });

            if (response.ok) {
                localStorage.removeItem('token'); // Clear token from local storage
                setLoggedIn(false); // Update logged-in state
                setUserData(null); // Clear user data
                setShowOTPField(false)

            } else {
                const errorData = await response.json();
                console.error('Logout failed:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleAddInfo = async (event) => {
        event.preventDefault();
        setShowOTPField(false)
        setLoggedIn(false)
        setaddInfo(true)
        try {
            // const requestBody = {};
            // requestBody[title] = valueName;
            const response = await fetch('http://localhost:4000/user', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify({ aadharNumber, panNumber })
            });
            if (response.ok) {
                // event.preventDefault();
                // setShowOTPField(false)
                // setLoggedIn(false)
                console.log("Success")
            } else {
                console.log("Failed")
            }
        } catch (error) {
            console.error('This is the error', error);
        }

    }


    return (
        <div className="login-container">
            {!showOTPField && !loggedIn && !addInfo && (
                <form className="login-form" onSubmit={handleEmailSubmit}>
                    {/* <label htmlFor="email">Email</label> */}
                    <input
                        type="email"
                        placeholder="Email address"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit">Submit</button>
                </form>
            )}

            {serverError && (
                <p className="error-message">Server Error</p>
            )}


            {invalidEmail && (
                <p className="error-message">Invalid Email</p>
            )}


            {showOTPField && !loggedIn && (
                <form className="login-form" onSubmit={handleOTPSubmit}>
                    {/* <label htmlFor="OTP">OTP</label> */}
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        id="OTP"
                        name="OTP"
                        value={otp}
                        onChange={(e) => setOTP(e.target.value)}
                    />
                    <button type="submit">Verify OTP</button>
                </form>
            )}
            {invalidOTP && (
                <p className="error-message">Invalid OTP</p>
            )}

            {loggedIn && (
                <div>
                    {userData ? (
                        <div>
                            <p>User Data:</p>
                            <p>Email: {userData.email}</p>
                            <p>Job: {userData.Job}</p>
                            <p>Aadhar: {userData.aadharNumber}</p>
                            <p>Pan: {userData.panNumber}</p>
                            <button onClick={handleAddInfo}> Add Info</button>
                            <span style={{ margin: '0 10px' }}></span> {/* Space between buttons */}
                            <button onClick={handleLogout}>Logout</button>
                            {/* Display other user data properties */}
                        </div>
                    ) : (
                        <p>Loading user data...</p>
                    )}
                </div>
            )}
            {addInfo && (
                <form className="login-form" onSubmit={handleAddInfo}>
                    <input
                        type="text"
                        placeholder="aadharNumber"
                        id="aadharNumber"
                        name="aadharNumber"
                        value={aadharNumber}
                        onChange={(e) => setaadharNumber(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="panNumber"
                        id="panNumber"
                        name="panNumber"
                        value={panNumber}
                        onChange={(e) => setpanNumber(e.target.value)}
                    />
                    <button type="submit">Submit</button>
                </form>

            )}







        </div>
    );
};

export default Login;
