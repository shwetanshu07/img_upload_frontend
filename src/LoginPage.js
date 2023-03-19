import { useState } from "react"
import { Link } from "react-router-dom"
import toast from 'react-hot-toast';
import { LOGIN_API_URL } from "./constants";

export function LoginPage(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (event) => {
        fetch(LOGIN_API_URL, {
            method: "POST",
            headers: {
                'Content-Type' : 'application/JSON',
            },
            body : JSON.stringify({
                username : username,
                password : password
            })
        })
        .then(response => response.json())
        .then(response => {
            // if the response has some error message
            if (response.error) {
                toast.error(response.error, {
                    position: 'top-right',
                });
                return;
            }

            // otherwise set the token that has been recieved
            if (response.token) {
                localStorage.setItem("token", response.token);
                localStorage.setItem("user", response.username);
                toast.success('Successfully Logged In.', {
                    position: 'top-right',
                });
                window.location.href = '/home';
            } else {
                toast.error("Some error occurred. Token not recieved.", {
                    position: 'top-right',
                });
            }
        })
    }

    return (
        <div className="container login-container mt-5">
            <div className="site-header mb-3">Upload and Manage your images.</div>
            <div className="card my-form">
                <div className="card-header">
                    <h4 className="my-2"><strong>Login</strong></h4>
                </div>
                <div className="card-body">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="username-input" className="form-label">Enter Username<span className="req-text">*</span></label>
                            <input type="text" className="form-control" id="username-input" 
                            value={username} onChange={(event) => setUsername(event.target.value)}></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password-input" className="form-label">Enter Password<span className="req-text">*</span></label>
                            <input type="password" className="form-control" id="password-input" 
                            value={password} onChange={(event) => setPassword(event.target.value)}></input>
                        </div>
                    </form>
                </div>
                <div className="card-footer d-flex justify-content-end">
                    <button type="button" className="btn btn-primary" onClick={handleLogin}>Login</button>
                </div>
            </div>
            <p className="my-form my-3"> New user? <Link to="/register">Register here</Link></p>
        </div>
    )
}