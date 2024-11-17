import { useEffect, useState } from "react"
import HeaderLogo from "./components/HeaderLogo";
import usePostCommand from "./hooks/usePostCommand";
import useStartGame from "./hooks/useStartGame";
import useStopGame from "./hooks/useStopGame";
import { TopBar } from "./components/TopBar";
import { trimList } from "./utils/trimList";
import Footer from "./components/Footer";
import { Message, Who } from "./types";
import Messages from "./components/Messages";
import CommandInput from "./components/CommandInput";
import GameMenu from "./components/GameMenu";

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [command, setCommand] = useState<string>("");
  const [gameIsRunning, setGameIsRunning] = useState<boolean>(false);

  const postCommand = usePostCommand();
  const start = useStartGame();
  const stop = useStopGame();

  const updateMessages = (newMessages: Message[], clearState: boolean = false) => {
    if (clearState) {
      setMessages(newMessages);
    } else {
      setMessages([...messages, ...newMessages]);
    }
  }

  const sendCommand = (cmd: string | null): void => {
    if (!cmd) {
      return;
    }

    updateMessages([{ who: Who.Player, text: "You said: " + cmd }]);
    postCommand.mutate(cmd);
  }

  const mapToServerMessage = (message: string): Message => {
    return { who: Who.Server, text: message };
  }

  useEffect(() => {
    if (postCommand.data) {
      updateMessages(trimList(postCommand.data).map(mapToServerMessage));
      setCommand("");
    }
  }, [postCommand.data]);

  useEffect(() => {
    if (start.data) {
      updateMessages([{ who: Who.Server, text: "Game started!" }], true);
      setGameIsRunning(true);
    }
  }, [start.data]);

  useEffect(() => {
    if (stop.data) {
      updateMessages(trimList(stop.data).map(mapToServerMessage))
      setGameIsRunning(false);
    }
  }, [stop.data]);

  return (
    <>
      <TopBar />
      <div className="flex justify-center items-center" style={{ height: '90vh' }}>
        <div className="w-1/2 p-6 bg-slate-800 bg-opacity-35" style={{ boxShadow: '#171717 -5px 5px 10px 2px', border: "1px solid #313131" }}>

          <section className="m-4">
            <HeaderLogo />
          </section>

          <GameMenu gameIsRunning={gameIsRunning} start={start} stop={stop} />
          <Messages messages={messages} />
          <CommandInput gameIsRunning={gameIsRunning} command={command} setCommand={setCommand} sendCommand={sendCommand} />
        </div>
      </div>

      <Footer />
    </>
  )
}

export default App
