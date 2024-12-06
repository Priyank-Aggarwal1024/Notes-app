import { useNavigate } from "react-router-dom";
import ProfileInfo from "../Cards/ProfileInfo";
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";

function Navbar({ userInfo, onSearchNote, handleClearSearch }) {
    const [search, setSearch] = useState("")
    const navigate = useNavigate();
    const onLogout = () => {
        // Logout Function
        localStorage.clear();
        navigate("/login")
    }
    const handleSearch = () => {
        // Handle Search
        if (search) {
            onSearchNote(search);
        };
    }
    const clearSearch = () => {
        setSearch("")
        handleClearSearch()
        // Clear Search
    };
    return (
        <>
            <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
                <h2 className="text-xl font-medium text-black py-2">Notes</h2>
                <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} handleSearch={handleSearch} onClearSearch={clearSearch} />
                {userInfo && <ProfileInfo userInfo={userInfo} onLogout={onLogout} />}
            </div>
        </>
    );
}

export default Navbar;