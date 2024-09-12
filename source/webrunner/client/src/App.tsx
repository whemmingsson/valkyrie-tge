import { useEffect, useState } from "react"
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
  console.log("App component rendered");
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [command, setCommand] = useState<string>("");
  const [gameIsRunning, setGameIsRunning] = useState<boolean>(false);

  const postCommand = usePostCommand();
  const healthCheck = useServerHealth();
  const games = useGetGames();
  const clientId = useClientId();
  const start = useStartGame();

  function sendCommand(cmd: string | null): void {
    if (!cmd) {
      return;
    }

    const playerCommand = "You said: " + cmd;
    const message = { who: Who.Player, text: playerCommand };
    setMessages([...messages, message]);

    postCommand.mutate(cmd);
  }

  useEffect(() => {
    if (postCommand.data) {
      const serverResponse = "Server response: " + postCommand.data;
      const serverMessage = { who: Who.Server, text: serverResponse };
      setMessages([...messages, serverMessage]);
      setCommand("");
    }
  }, [postCommand.data, postCommand.isSuccess]);

  useEffect(() => {
    if (start.data) {
      const serverMessags = start.data.map((message: string) => { return { who: Who.Server, text: message } });
      setMessages([...messages, ...serverMessags]);
      setGameIsRunning(true);
    }
  }, [start.data, start.isSuccess]);


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

          <div className="m-4">
            <HeaderLogo />
          </div>


          <div className="m-4">
            <select className="bg-slate-800 p-2 border-gray-100 border border-solid" onChange={(e) => {
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
          </div>


          <div className="m-4">
            <div className="min-h-72 border-gray-400 border border-solid p-4 bg-slate-700">
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
              disabled={!healthCheck.data}
              className="text-black pr-4 pl-4 pt-2 pb-2 min-w-96 border-gray-100 border"
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
          </div>

          <div className="m-4 sticky">
            Information: This application uses cookies. By using this application, you agree to the use of cookies. Please do not delete the cookies from this application. Thank you!
          </div>
        </div>


      </div>
    </>
  )
}

export default App
