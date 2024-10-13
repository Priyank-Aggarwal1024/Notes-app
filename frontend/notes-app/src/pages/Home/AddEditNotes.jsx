import { useState } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from '../../utils/asiosInstance';

function AddEditNotes({ noteData, type, onClose, getAllNotes, showToastMessage }) {
    const [title, setTitle] = useState(noteData?.title || "");
    const [content, setContent] = useState(noteData?.content || "");
    const [tags, setTags] = useState(noteData?.tags || []);
    const [error, setError] = useState(null);

    // Add Note
    const addNewNote = async () => {
        try {
            // ...
            const response = await axiosInstance.post("/add-note", {
                title,
                content,
                tags
            });
            if (response.data && response.data.note) {
                getAllNotes();
                onClose();
                showToastMessage("Notes Added Successfully ", "add")
            }
        } catch (err) {
            // ...
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            }
        }
    }

    // Edit Note
    const editNote = async () => {
        try {
            // ...
            const response = await axiosInstance.put(`/edit-note/${noteData._id}`, {
                title,
                content,
                tags
            });
            if (response.data && response.data.note) {
                showToastMessage("Notes Update Successfully ", "add")
                getAllNotes();
                onClose();
            }
        } catch (err) {
            // ...
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            }
        }
    }

    const handleAddNote = () => {
        console.log("Hello World")
        if (!title) {
            setError("Please enter the title");
            return;
        }
        if (!content) {
            setError("Please enter the content");
            return;
        }
        console.log(error)
        setError("");
        if (type == "edit") {
            editNote()
        } else {
            addNewNote()
        }
    }
    return (
        <div className="relative">
            <button className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500"
                onClick={onClose}>
                <MdClose className="text-xl text-slate-400" />
            </button>
            <div className="flex flex-col gap-2">
                <label htmlFor="" className="input-label"
                >TITLE</label>
                <input type="text"
                    className="text-2xl text-slate-950 outline-none"
                    placeholder="Go To Gym At 5"
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>
            <div className="flex flex-col gap-2 mt-4">
                <label htmlFor="" className="input-label">CONTENT</label>
                <textarea className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
                    placeholder="Content"
                    rows={10}
                    type="text"
                    value={content}
                    onChange={({ target }) => setContent(target.value)} ></textarea>
            </div>
            <div className="mt-3">
                <label className="input-label">TAGS</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>
            {error && (<p className="text-red-500 text-xs pt-4 ">{error}</p>)}
            <button className="btn-primary font-medium mt-5 p-3" onClick={() => { handleAddNote() }}>{type == "add" ? "ADD" : "UPDATE"}</button>
        </div>
    );
}

export default AddEditNotes;