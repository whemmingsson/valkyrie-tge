import { useEffect, useRef, useState } from "react"
import HeaderLogo from "./components/HeaderLogo";
import usePostCommand from "./hooks/usePostCommand";
import useServerHealth from "./hooks/useServerHealth";
import useGetGames from "./hooks/useGetGames";
import Button from "./components/Button";
import useClientId from "./hooks/useGetClientId";
import HealthStatus from "./components/HeatlhStatus";
import useStartGame from "./hooks/useStartGame";

enum Who {
  Player = "Player",
  Server = "Server"
}

interface Message {
  who: Who;
  text: string;
}

function App() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [command, setCommand] = useState<string>("");
  const [gameIsRunning, setGameIsRunning] = useState<boolean>(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const postCommand = usePostCommand();
  const healthCheck = useServerHealth();
  const games = useGetGames();
  const clientId = useClientId();
  const start = useStartGame();

  const sendCommand = (cmd: string | null): void => {
    if (!cmd) {
      return;
    }
    const playerCommand = "You said: " + cmd;
    const message = { who: Who.Player, text: playerCommand };
    setMessages([...messages, message]);

    postCommand.mutate(cmd);
  }

  const formatMessage = (message: string): JSX.Element => {
    if (message === "" || message === "\n") {
      return (<br />);
    }
    return (<span>{message}</span>);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (postCommand.data) {
      const serverMessages = postCommand.data.map((message: string) => { return { who: Who.Server, text: message } });
      setMessages([...messages, ...serverMessages]);
      setCommand("");
    }
  }, [postCommand.data, postCommand.isSuccess]);

  useEffect(() => {
    if (start.data) {
      const serverMessags = start.data.map((message: string) => { return { who: Who.Server, text: message } });
      setMessages([...serverMessags]);
      setGameIsRunning(true);
    }
  }, [start.data, start.isSuccess]);

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  return (
    <>
      <div className="bg-slate-800 p-4 sticky flex justify-between items-center">
        <div>
          <HealthStatus />
        </div>
        {clientId && <span className="text-slate-600">Client ID: {clientId}</span>}


      </div>
      <div className="flex justify-center items-center" style={{ height: '90vh' }}>
        <div className="w-1/2">

          <section className="m-4">
            <HeaderLogo />
          </section>


          <section className="m-4">
            <select className=" bg-slate-700 p-2 border-gray-100 border border-solid" onChange={(e) => {
              if (e.target.value !== "na") {
                setSelectedGame(e.target.value)
              }
              else {
                setSelectedGame(null)
              }
            }}>
              <option value="na">Select a game to play</option>
              {games.data?.map((game, index) => (
                <option key={index} value={game.name}>{game.name}</option>))}
            </select>
            <Button disabled={!healthCheck.data || !selectedGame || gameIsRunning} onClick={() => { if (!selectedGame) return; start.mutate(selectedGame) }}>
              Let's go!
            </Button>
          </section>


          <section className="m-4">
            <div className="min-h-80 max-h-80 border-gray-400 border border-solid p-4 bg-slate-700 overflow-y-scroll">
              <ul>
                {messages?.map((message, index) => (
                  <li key={index}>
                    <span className={message.who === Who.Server ? "italic" : "text-slate-400"}>
                      {formatMessage(message.text)}
                    </span>
                  </li>
                ))}
              </ul>
              <div ref={messagesEndRef} />
            </div>
          </section>

          <section className="m-4">
            <label className="text-gray-200 block" htmlFor="cmd">Type command</label>
            <input
              name="cmd"
              type="text"
              disabled={!healthCheck.data}
              className="pr-4 pl-4 pt-2 pb-2 min-w-96 border-gray-100 border bg-slate-700 text-white"
              placeholder="What do you want to do?"
              value={command}
              onChange={(e) => setCommand(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendCommand(e.currentTarget.value)
                }
              }} />
            <Button
              disabled={!healthCheck.data || !command}
              onClick={() => sendCommand(command)}>Send command</Button>
          </section>
        </div>
      </div>
      <div className="absolute bg-slate-800 bottom-0 p-4 w-screen text-center text-slate-500">
        Information: This application uses cookies. By using this application, you agree to the use of cookies. Please do not delete the cookies from this application. Thank you!
      </div>
    </>
  )
}

export default App
