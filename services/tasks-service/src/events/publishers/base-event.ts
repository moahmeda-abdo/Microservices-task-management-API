export interface BaseEventPayload<T> {
    event: string;
    service: string;
    occurredAt: string;
    data: T;
}