import NoteCard from "../../components/Cards/NoteCard";
import Navbar from "../../components/Navbar/Navbar";
import { MdAdd } from 'react-icons/md'
import AddEditNotes from "./AddEditNotes";
import { useEffect, useState } from "react";
import Modal from 'react-modal'
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/asiosInstance";
import EmptyNotes from "../../components/EmptyNotes/EmptyNotes";
import moment from 'moment';
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import addNote from '../../assets/add-note.svg'
import noData from '../../assets/no-data.png'
function Home() {
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: "add",
        data: null
    })
    const [showToastMsg, setShowToastMsg] = useState({
        isShown: false,
        message: "",
        type: "add"
    })
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [isSearch, setIsSeaarch] = useState(false);
    const showToastMessage = (message, type) => {
        setShowToastMsg({
            isShown: true,
            message,
            type
        })
    }
    const handleCloseToast = () => {
        setShowToastMsg({
            isShown: false,
            message: "",
        })
    }

    // Get User Info
    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get("/get-user");
            if (response.data && response.data.user) {
                setUserInfo(response.data.user);
                return true;
            }
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    }
    // Get All Notes
    const getAllNotes = async () => {
        try {
            const response = await axiosInstance("/get-all-notes");
            if (response.data && response.data.notes) {
                setNotes(response.data.notes);
            }
        } catch (err) {

            alert("An unexpected error occur. Please try again");
            navigate("/login")
        }
    }
    const handleEdit = (noteDetails) => {
        setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
    }

    // Delete Notes
    const handleDelete = async (noteId) => {
        try {
            const response = await axiosInstance.delete(`/delete-note/${noteId}`);
            if (response.data && response.data.message) {
                showToastMessage("Note Deleted Successfully", "delete");
                getAllNotes();
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                console.log(err.response.data.message);
            }
        }
    }

    // Pin Notes
    const handlePinNotes = async (noteId, isPinned) => {
        try {
            const response = await axiosInstance.put(`/update-note-pinned/${noteId}`, {
                isPinned: !isPinned
            });
            if (response.data && response.data.message) {
                showToastMessage(`Note ${isPinned ? "Unpinned" : "Pinned"} Successfully`, "add");
                getAllNotes();
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                console.log(err.response.data.message);
            }
        }
    }
    // Search for note
    const onSearchNote = async (query) => {
        try {
            const response = await axiosInstance.get("/search-notes", {
                params: { query }
            })
            if (response.data && response.data.notes) {
                setIsSeaarch(true)
                setNotes(response.data.notes);
            }

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                console.log(err.response.data.message);
            }
        }
    }
    const handleClearSearch = () => {
        setIsSeaarch(false);
        getAllNotes();
    }
    useEffect(() => {
        getUserInfo();
        getAllNotes();
        return () => { };
    }, [])
    return (
        <>
            <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />
            <div className="container mx-auto">
                {notes.length == 0 ? <EmptyNotes img={isSearch ? noData : addNote} message={isSearch ? "Oops! No Notes found matching your search." : `Start creating your first note! Click the 'Add' button to jot down your thoughts, ideas, and reminders. Let's get started!`} /> : <div className="grid lg:grid-cols-3 px-4 sm:grid-cols-2 gap-4 mt-8 ">
                    {
                        notes.map((item) => (<NoteCard
                            key={item._id}
                            title={item.title}
                            date={moment(item.createdOn).format("Do MMM YY")}
                            content={item.content}
                            tags={item.tags}
                            isPinned={item.isPinned}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => handleDelete(item._id)}
                            onPinNote={() => handlePinNotes(item._id, item.isPinned)}
                        />))
                    }
                </div>}
            </div>
            <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10" onClick={() => { setOpenAddEditModal({ isShown: true, type: "add", data: null }) }}>
                <MdAdd className="text-[32px] text-white" />
            </button>
            <Modal
                isOpen={openAddEditModal.isShown}
                onRequestClose={() => { }}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.2)",
                    },
                }}
                contentLabel=""
                className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-auto" >

                <AddEditNotes
                    type={openAddEditModal.type}
                    noteData={openAddEditModal.data}
                    onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
                    getAllNotes={getAllNotes}
                    showToastMessage={showToastMessage}
                />
            </Modal>
            {
                showToastMsg.isShown && <ToastMessage
                    isShown={showToastMsg.isShown}
                    message={showToastMsg.message}
                    type={showToastMsg.type}
                    onClose={handleCloseToast}
                />
            }

        </>
    );
}

export default Home;