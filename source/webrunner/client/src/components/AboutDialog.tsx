import { forwardRef, useCallback } from "react";
import Button from "./Button";

interface AboutDialogProps { }

interface CCProps {
    children: React.ReactNode;
}

const CC = ({ children }: CCProps) => {
    return <code className="bg-gray-950 text-gray-100 p-1">{children}</code>;
};

const F = ({ children }: CCProps) => {
    return <span className="bg-yellow-600 p-1">{children}</span>;
}


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
            <div className="w-full bg-slate-800 p-3 flex items-center border-b border-gray-400 border-solid">
                <h2 className="text-white text-2xl">About Valkyrie Engine</h2>
                <div className="ml-auto"><Button onClick={close}>Close</Button></div>
            </div>
            <div className="text-white p-4">
                <p className="pb-2 pt-2">A Valkyrie Game is a text based adventure where you progress in the game by typing commands.<br /> Some examples of commands are <CC>open door</CC>, <CC>turn left</CC> and <CC>inspect chest</CC></p>
                <p className="mt-3 mb-3 pb-2 pt-2">A command often consists of just two word, the action and the target. There are exceptions to this rule though, an example of this is the command <CC>help</CC> </p>
                <p className="mt-3 mb-3  pb-2 pt-2">To start a game, select one from the drop down list. Games are developed, thoroughly tested and added continously.</p>
                <p className="mt-3 mb-3  pb-2 pt-2 ">Your game progress is tied to your unique client ID (found in the top of the screen). This ID is yours and yours alone - do not share it. It is backed by a cookie, a small piece of data stored in your web browser. If you delete this cookie while having a game running, your game progression will be lost! </p>
                <p className="mt-3 mb-3  pb-2 pt-2 "><F>Feature pending</F> Progress is continously saved by the game engine and can be loaded back at any time </p>
                <p className="mt-3 mb-3  pb-2 pt-2 ">If you have any bugs to report or new features you would like to add, please use the designted buttons at the top</p>
            </div>

        </dialog >

    );
});

export default AboutDialog;

