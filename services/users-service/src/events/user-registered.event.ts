export interface UserRegisteredEvent {
    user_id: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    created_at: string;
}