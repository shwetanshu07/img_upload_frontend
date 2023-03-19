import { Link } from "react-router-dom"
import toast from 'react-hot-toast';
import { useState } from "react";
import { REGISTER_API_URL } from "./constants";

export function RegisterPage() {
    const [new_username, setNewUsername] = useState("");
    const [new_password, setNewPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");

    const handleUserRegisteration = (event) => {
        if (new_username === "" || new_password === "" || confirm_password === "") {
            toast.error("Please fill all the fields", {
                position: 'top-right',
            });
            return;
        }

        if (new_password !== confirm_password) {
            toast.error("Passwords do not match", {
                position: 'top-right',
            });
            return;
        }

        fetch(REGISTER_API_URL, {
            method: "POST",
            headers: {
                'Content-Type' : 'application/JSON',
            },
            body : JSON.stringify({
                username : new_username,
                password : new_password,
                confirm_password : confirm_password
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
                toast.success('User Registered Successfully', {
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
                    <h4 className="my-2"><strong>Register User</strong></h4>
                </div>
                <div className="card-body">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="username-input" className="form-label">Enter Username<span className="req-text">*</span></label>
                            <input type="text" className="form-control" id="username-input" 
                            value={new_username} onChange={(event) => setNewUsername(event.target.value)}></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password-input" className="form-label">Enter Password<span className="req-text">*</span></label>
                            <input type="password" className="form-control" id="password-input" 
                            value={new_password} onChange={(event) => setNewPassword(event.target.value)}></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirm-password-input" className="form-label">Confirm Password<span className="req-text">*</span></label>
                            <input type="password" className="form-control" id="confirm-password-input" 
                            value={confirm_password} onChange={(event) => setConfirmPassword(event.target.value)}></input>
                        </div>
                    </form>
                </div>
                <div className="card-footer d-flex justify-content-end">
                    <button type="button" className="btn btn-primary" onClick={handleUserRegisteration}>Register</button>
                </div>
            </div>
            <p className="my-form my-3"> Already have an account? <Link to="/">Login here</Link></p>
        </div>
    )
}