import Price from "./Price";

export interface Platform {
    id: number;
    name: string;
    image_url: string;
    externalId: number;
    price: Price;
};