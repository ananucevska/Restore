export type User = {
    id: string;
    email: string;
    roles: string[];
    city: string;
    name: string;
    municipality?: string;
    naselba?: string;
}