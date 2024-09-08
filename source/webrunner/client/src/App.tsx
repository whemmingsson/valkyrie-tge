import { useEffect, useState } from "react"
import HeaderLogo from "./HeaderLogo";
import usePostCommand from "./hooks/usePostCommand";
import useServerHealth from "./hooks/useServerHealth";

enum Who {
  Player = "Player",
  Server = "Server"
}

interface Message {
  who: Who;
  text: string;
}

function App() {
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [command, setCommand] = useState<string>("");
  const mutate = usePostCommand();
  const healthCheck = useServerHealth();

  function sendCommand(cmd: string | null): void {
    if (!cmd) {
      return;
    }

    const playerCommand = "You said: " + cmd;
    const message = { who: Who.Player, text: playerCommand };
    setMessages([...messages, message]);

    mutate.mutate(cmd);
  }

  useEffect(() => {
    if (mutate.data) {
      const serverResponse = "Server response: " + mutate.data;
      const serverMessage = { who: Who.Server, text: serverResponse };
      setMessages([...messages, serverMessage]);
      setCommand("");
    }
  }, [mutate.data, mutate.isSuccess]);

  useEffect(() => {
    if (healthCheck.data === "OK" && healthCheck.isSuccess) {
      setServerOnline(true);
    }
    else {
      setServerOnline(false);
    }
  }, [healthCheck.isFetched]);


  return (
    <>
      <div className="bg-slate-800 p-4 sticky">
        <span>Server is running: {
          serverOnline === null ? "Loading..." : serverOnline ? <span className="text-green-600">Yes</span> : <span className="text-red-600">No</span>
        }</span>
        <button className="border-gray-100 border-2 border-solid m-1 pr-4 pl-4 pt-1 pb-1 ml-4"
          onClick={() => healthCheck.refetch()}>Check server</button>
      </div>
      <div className="flex justify-center items-center" style={{ height: '90vh' }}>
        <div className="w-1/2">

          <div className="m-4">
            <HeaderLogo />
          </div>

          <div className="m-4">
            <div className="min-h-72 border-gray-400 border-2 border-solid p-4 bg-slate-700">
              <ul>
                {messages?.map((message, index) => (
                  <li key={index}>
                    <span className={message.who === Who.Server ? "italic" : ""}>{message.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="m-4">
            <label className="text-gray-200 block" htmlFor="cmd">Type command</label>
            <input
              name="cmd"
              type="text"
              disabled={!serverOnline}
              className="text-black pr-4 pl-4 pt-2 pb-2  min-w-96 border-gray-100 border-2"
              placeholder="What do you want to do?"
              value={command}
              onChange={(e) => setCommand(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendCommand(e.currentTarget.value)
                }
              }} />
            <button
              disabled={!serverOnline || !command}
              className="border-gray-100 border-2 m-1 pr-4 pl-4 pt-2 pb-2 ml-4"
              onClick={() => sendCommand(command)}>Send command</button>
          </div>

        </div>
      </div>
    </>
  )
}

export default App
