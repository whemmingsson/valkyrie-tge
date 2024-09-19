import { forwardRef, useCallback } from "react";
import Button from "./Button";

interface AboutDialogProps { }

const AboutDialog = forwardRef<HTMLDialogElement, AboutDialogProps>(({ }, ref) => {

    const close = useCallback(() => {
        if (ref && 'current' in ref && ref.current) {
            ref.current.close();
        }
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLDialogElement, MouseEvent>) => {
        let rect = (e.target as HTMLElement).getBoundingClientRect();
        const isMouseOutsideDialogContent = rect.left > e.clientX ||
            rect.right < e.clientX ||
            rect.top > e.clientY ||
            rect.bottom < e.clientY;

        if (isMouseOutsideDialogContent) {
            close();
        }
    }

    return (
        <dialog ref={ref} style={{ background: '#242424' }} className="w-2/3 h-1/2 border-2 border-gray-400 border-solid max-w-5xl" onClick={handleClick}>
            <div className="w-full bg-slate-800 p-4 flex items-center">
                <h2 className="text-white text-4xl">About Valkyrie Engine</h2>
                <div className="ml-auto"><Button onClick={close}>Close</Button></div>
            </div>
            <div className="text-white p-4">

            </div>

        </dialog>

    );
});

export default AboutDialog;

