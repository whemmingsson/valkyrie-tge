import { useState } from "react";
import useGetGames from "../hooks/useGetGames";
import Button from "./Button";
import { UseMutationResult } from "react-query";

interface GameMenuProps {
    gameIsRunning: boolean;
    start: UseMutationResult<any, unknown, string, unknown>;
    stop: UseMutationResult<any, unknown, void, unknown>;
}

const GameMenu = ({ gameIsRunning, start, stop }: GameMenuProps) => {
    const [selectedGame, setSelectedGame] = useState<string | null>(null);
    const games = useGetGames();

    return (<section className="flex m-4 pt-4 pb-4 border-b border-t border-solid border-gray-300 items-center">
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
    </section>);
}

export default GameMenu;