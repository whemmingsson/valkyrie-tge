import WebGame from "./WebGame.js";

export class GameStore {
    private gameStore: { [key: string]: WebGame } = {};

    getWebGame(clientId: string): WebGame | null {
        return this.gameStore[clientId] || null;
    }

    clearWebGame(clientId: string): void {
        if (this.gameStore[clientId]) {
            delete this.gameStore[clientId];
        }
    }

    setWebGame(clientId: string, webGame: WebGame): void {
        this.gameStore[clientId] = webGame;
    }
}

export class MessageStore {
    private messageStore: { [key: string]: string[] } = {};

    getMessages(clientId: string): string[] {
        return this.messageStore[clientId] || [];
    }

    setMessages(clientId: string, messages: string[]): void {
        if (!this.messageStore[clientId]) {
            this.messageStore[clientId] = [];
        }
        this.messageStore[clientId].push(...messages);
    }

    clearMessages(clientId: string): void {
        if (this.messageStore[clientId]) {
            delete this.messageStore[clientId];
        }
    }
}