import { useEffect, useRef, useState } from "react"
import HeaderLogo from "./components/HeaderLogo";
import usePostCommand from "./hooks/usePostCommand";
import useGetGames from "./hooks/useGetGames";
import Button from "./components/Button";
import useStartGame from "./hooks/useStartGame";
import useStopGame from "./hooks/useStopGame";
import { TopBar } from "./components/TopBar";
import { trimList } from "./utils/trimList";

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
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const postCommand = usePostCommand();
  const games = useGetGames();
  const start = useStartGame();
  const stop = useStopGame();

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
      const serverMessages = trimList(postCommand.data).map((message: string) => { return { who: Who.Server, text: message } });
      setMessages([...messages, ...serverMessages]);
      setCommand("");
    }
  }, [postCommand.data, postCommand.isSuccess]);

  useEffect(() => {
    if (start.data) {
      const serverMessags = trimList(start.data).map((message: string) => { return { who: Who.Server, text: message } });
      setMessages([...serverMessags]);
      setGameIsRunning(true);
    }
  }, [start.data, start.isSuccess]);

  useEffect(() => {
    if (stop.data) {
      const serverMessags = trimList(stop.data).map((message: string) => { return { who: Who.Server, text: message } });
      setMessages([...messages, ...serverMessags]);
      setGameIsRunning(false);
    }
  }, [stop.data, stop.isSuccess]);

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  return (
    <>
      <TopBar />
      <div className="flex justify-center items-center" style={{ height: '90vh' }}>
        <div className="w-1/2 p-6 bg-slate-800 bg-opacity-35" style={{ boxShadow: '#171717 -5px 5px 10px 2px', border: "1px solid #313131" }}>

          <section className="m-4">
            <HeaderLogo />
          </section>

          {/* Game menu */}
          <section className="flex m-4 pt-4 pb-4 border-b border-t border-solid border-gray-300 items-center">
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
            <Button disabled={!selectedGame || gameIsRunning} onClick={() => { if (!selectedGame) return; start.mutate(selectedGame) }}>
              Start game
            </Button>

            <Button disabled={!gameIsRunning} onClick={() => { if (!gameIsRunning) return; stop.mutate() }}>
              Stop game
            </Button>
          </section>

          {/* Game messages */}
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

          {/* Command input */}
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
              onClick={() => sendCommand(command)}>Send command</Button>
          </section>
        </div>
      </div>

      <div className="fixed bg-slate-800 bottom-0 p-4 w-screen text-center text-slate-500">
        Information: This application uses cookies. By using this application, you agree to the use of cookies. Please do not delete the cookies from this application. Thank you!
      </div>
    </>
  )
}

export default App
