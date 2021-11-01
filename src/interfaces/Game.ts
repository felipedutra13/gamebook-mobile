import ExternalGame from "./ExternalGame";
import Price from "./Price";

export interface Game {
    id: number;
    title: string;
    imageUrl: string;
    artworkUrl: string;
    platforms: string[];
    videoIds: string[];
    aggregatedRating: string;
    developer: string;
    publisher: string;
    genres: string[];
    releaseDate: Date;
    summary: string;
    dlcs: Game[];
    similarGames: Game[];
    externalGames: ExternalGame[];
    prices: Price[];
};