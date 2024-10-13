import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import { useState } from "react";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/asiosInstance";

function Signup() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [error, setError] = useState(null)
    const navigate = useNavigate();
    const handleSignup = async (e) => {
        e.preventDefault();
        if (!name) {
            setError("Please enter a your name");
            return;
        }
        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }
        if (!password) {
            setError("Please enter the password");
            return;
        }
        setError("")

        // Signup Api Call
        try {
            // 
            const response = await axiosInstance.post("/create-account", {
                email,
                password,
                fullName: name
            })
            // Handle Successful login response
            if (response.data && response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken);
                navigate("/");
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("An unexpected error occured. Please try again.")
            }
        }

    }
    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center mt-28">
                <div className="w-96 border rounded bg-white px-7 py-10">
                    <form action="" onSubmit={handleSignup}>
                        <h4 className="text-2xl mb-7">Signup</h4>
                        <input type="text" name="name" id="name" className="input-box" placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input type="text" name="email" id="email" className="input-box" placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <PasswordInput
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        {
                            error && <p className="text-red-500 text-xs pb-1 ">
                                {error}
                            </p>}
                        <button type="submit" className="btn-primary">
                            Create Account
                        </button>
                        <div className="text-sm text-center mt-4">
                            Already have an account?{" "}
                            <Link to={"/login"} className="font-medium text-primary underline">
                                Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Signup;