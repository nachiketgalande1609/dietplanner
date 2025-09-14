export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    age: number;
    birthDate: string;
    weight: number;
    height: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}
