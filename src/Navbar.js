import { LOGOUT_API_URL } from "./constants"
import toast from "react-hot-toast";

export function Navbar(props) {
    const handleLogout = (event) => {
        fetch(LOGOUT_API_URL, {
            method: "GET",
            headers: {
                'Authorization' : 'Token ' + localStorage.getItem('token')
            }
        })
        .then(response => response.json())
        .then(response => {
            if (response.message) {
                toast.success(response.message, {
                    position: 'top-right',
                });
                localStorage.removeItem('token');
                window.location.href = '/';
                return;
            }
            console.log(response);
        })
    }

    return (
        <nav className="navbar bg-body-tertiary">
            <div className="container-fluid">
                <span className="navbar-brand mb-0 h1">imgUpload</span>
                {props.logged_in_status ? (
                    <div className="d-flex">
                        <div className="me-2"><small>{localStorage.getItem('user')}</small></div>
                        <a href="#" onClick={handleLogout}><small>Logout</small></a>
                    </div>
                ) : null}
            </div>
        </nav>
    )
}