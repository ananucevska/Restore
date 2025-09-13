export type User = {
    name: string, 
    email: string;
    roles: string[];
}

export type Address = {
    name: string;
    line1: string;
    line2?: string | null;
    city: string;
    postal_code: string;
    country: string;
}