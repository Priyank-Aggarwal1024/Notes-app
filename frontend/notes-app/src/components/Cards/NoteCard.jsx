import { MdOutlinePushPin, MdCreate, MdDelete } from 'react-icons/md'
function NoteCard({
    title,
    date,
    content,
    tags,
    isPinned,
    onEdit,
    onDelete,
    onPinNote

}) {
    return (
        <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-out">
            <div className="flex items-center justify-between">
                <div className="">
                    <h6 className="text-sm font-medium">{title}</h6>
                    <span className="text-xs text-slate-500">{date}</span>
                </div>
                <MdOutlinePushPin className={`icon-btn ${isPinned ? "text-primary" : "text-slate-300"}`} onClick={onPinNote} />
            </div>
            <p className="text-xs text-slate-600 mt-2"><pre>{content}</pre></p>
            <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-slate-500">
                    <div className="flex items-center gap-2 flex-wrap mt-2">
                        {
                            tags.map((tag, ind) => (<span className="flex items-center gap-2 text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded" key={ind}>
                                # {tag}</span>))
                        }
                    </div>
                </div>
                <div className="flex item-center gap-2">
                    <MdCreate
                        className="icon-btn hover:text-green-600"
                        onClick={onEdit}
                    />
                    <MdDelete
                        className="icon-btn hover:text-red-500"
                        onClick={onDelete}
                    />
                </div>
            </div>
        </div>
    );
}

export default NoteCard;
