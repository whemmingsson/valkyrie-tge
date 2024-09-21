import { useRef } from "react";
import Button from "./Button";
import useClientId from "../hooks/useGetClientId";
import AboutDialog from "./AboutDialog";

import logo from "../assets/valkyrie_logo.png";

export const TopBar = () => {
    const clientId = useClientId();
    const dialogRef = useRef<HTMLDialogElement>(null);

    return (
        <>
            <div className="bg-slate-800 p-4 sticky flex justify-between items-center">
                <div>
                    <img src={logo} alt="Valkyrie logo" className="h-16" />
                </div>
                <div className="ml-auto">
                    {clientId && <span className="text-slate-600">Client ID: {clientId}</span>}

                    <Button onClick={(_) => {
                        if (!dialogRef.current?.open) {
                            dialogRef.current?.showModal();
                        }
                        else {
                            dialogRef.current?.close();
                        }
                    }} theme="gray">
                        About
                    </Button>

                    <Button theme="gray">
                        <a href="https://github.com/whemmingsson/valkyrie-tge/issues/new?assignees=&labels=&projects=&template=bug_report.md&title=" target="_blank" className="no-underline">
                            Report bug
                        </a>
                    </Button>

                    <Button theme="gray">
                        <a href="https://github.com/whemmingsson/valkyrie-tge/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=" target="_blank" className="no-underline">
                            Request feature
                        </a>
                    </Button>
                </div>
            </div >

            <AboutDialog ref={dialogRef} />
        </>
    )
}