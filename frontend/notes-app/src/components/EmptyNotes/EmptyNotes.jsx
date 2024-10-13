
function EmptyNotes({ message, img }) {
    return (
        <div className="flex justify-center items-center flex-col w-full mt-12">
            <img src={img} className="w-[320px] max-w-full" alt="" />

            <p className="w-[620px] max-w-full text-center font-[500] leading-12 text-lg">{message}</p>
        </div>
    );
}

export default EmptyNotes;