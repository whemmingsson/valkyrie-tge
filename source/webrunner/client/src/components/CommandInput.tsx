import Button from "./Button";

interface CommandInputProps {
    gameIsRunning: boolean;
    command: string;
    setCommand: (command: string) => void;
    sendCommand: (command: string) => void;
}

const CommandInput = ({ gameIsRunning, command, setCommand, sendCommand }: CommandInputProps) => {
    return (
        <section className="m-4">
            <label className="text-gray-200 block" htmlFor="cmd">Type command</label>
            <input
                name="cmd"
                type="text"
                disabled={!gameIsRunning}
                className="pr-4 pl-4 pt-2 pb-2 min-w-96 border-gray-100 border bg-slate-700 text-white disabled:bg-inherit disabled:opacity-50"
                placeholder="What do you want to do?"
                value={command}
                onChange={(e) => setCommand(e.currentTarget.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        sendCommand(e.currentTarget.value)
                    }
                }} />
            <Button
                disabled={!command || !gameIsRunning}
                onClick={() => sendCommand(command)}>Send command
            </Button>
        </section>
    )
};

export default CommandInput;