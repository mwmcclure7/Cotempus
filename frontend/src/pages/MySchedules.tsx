import { useState, useEffect } from 'react';
import api from '../api';
import ScheduleCard from '../components/ScheduleCard';
import '../styles/MySchedules.css';

interface Schedule {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    time_slot_interval: number;
    responses: Response[];
    created_at: string;
}

interface Response {
    id: string;
    name: string;
    time_slots: TimeSlot[];
}

interface TimeSlot {
    start_time: string;
    end_time: string;
}

function MySchedules() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const response = await api.get<Schedule[]>('/api/schedules/');
            setSchedules(response.data);
            if (response.data.length > 0) {
                setSelectedSchedule(response.data[0]);
            }
        } catch (err) {
            setError('Failed to load schedules');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSchedule = async (scheduleId: string) => {
        try {
            await api.delete(`/api/schedules/${scheduleId}/`);
            setSchedules(prevSchedules => 
                prevSchedules.filter(schedule => schedule.id !== scheduleId)
            );
            if (selectedSchedule?.id === scheduleId) {
                const remainingSchedules = schedules.filter(s => s.id !== scheduleId);
                setSelectedSchedule(remainingSchedules.length > 0 ? remainingSchedules[0] : null);
            }
        } catch (err) {
            setError('Failed to delete schedule');
        }
    };

    if (loading) return <div className="loading">Loading your schedules...</div>;
    if (error) return <div className="error">{error}</div>;
    if (schedules.length === 0) {
        return (
            <div className="empty-state">
                <h2>No Schedules Yet</h2>
                <p>Create your first schedule to start finding the perfect meeting time!</p>
                <button onClick={() => window.location.href = '/create'} className="create-button">
                    Create Schedule
                </button>
            </div>
        );
    }

    return (
        <div className="my-schedules-container">
            <div className="page-header">
                <h1>My Schedules</h1>
                <button onClick={() => window.location.href = '/create'} className="create-button">
                    Create New Schedule
                </button>
            </div>
            
            <div className="schedules-list">
                {schedules.map(schedule => (
                    <ScheduleCard 
                        key={schedule.id} 
                        schedule={schedule}
                        onUpdate={fetchSchedules}
                        onClick={() => setSelectedSchedule(schedule)}
                        isSelected={selectedSchedule?.id === schedule.id}
                        onDelete={handleDeleteSchedule}
                    />
                ))}
            </div>
        </div>
    );
}

export default MySchedules; 