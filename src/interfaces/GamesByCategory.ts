import { Game } from './Game';

export interface GamesByCategory {
    id: number;
    title: string;
    games: Game[];
}