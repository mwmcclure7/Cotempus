export interface Schedule {
    id: string;
    title: string;
    description: string;
    created_at: string;
    responses: Array<any>;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    time_slot_interval: number;
} 