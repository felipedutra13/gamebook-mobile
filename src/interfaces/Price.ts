export default interface Price {
    platformId: number;
    price: string;
    discount: string;
    additionalDiscount?: string;
    additionalInfo?: string;
    url: string;
};