import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import TimeSelector from '../components/TimeSelector';
import '../styles/JoinSchedule.css';

interface Schedule {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    time_slot_duration: number;
    timezone: string;
}

interface AvailabilityBlock {
    start: Date;
    end: Date;
}

function JoinSchedule() {
    const { scheduleId } = useParams();
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [name, setName] = useState('');
    const [availabilityBlocks, setAvailabilityBlocks] = useState<AvailabilityBlock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!scheduleId) {
            navigate('/');
            return;
        }
        
        const fetchSchedule = async () => {
            try {
                const response = await api.get<Schedule>(`/api/schedules/${scheduleId}/`);
                setSchedule(response.data);
            } catch (err) {
                setError('Failed to load schedule details.');
                console.error('Error fetching schedule:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [scheduleId, navigate]);

    const handleAvailabilityChange = (blocks: AvailabilityBlock[]) => {
        setAvailabilityBlocks(blocks);
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }

        if (availabilityBlocks.length === 0) {
            setError('Please select at least one time slot');
            return;
        }

        try {
            await api.post(`/api/schedules/${scheduleId}/respond/`, {
                name: name.trim(),
                time_slots: availabilityBlocks.map(block => ({
                    start_time: block.start.toISOString(),
                    end_time: block.end.toISOString()
                }))
            });
            setSubmitted(true);
            setError(null);
        } catch (err) {
            setError('Failed to save availability. Please try again.');
            console.error('Error submitting response:', err);
        }
    };

    if (loading) {
        return (
            <div className="join-schedule-container">
                <div className="loading">Loading schedule details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="join-schedule-container">
                <div className="error">{error}</div>
            </div>
        );
    }

    if (!schedule) {
        return (
            <div className="join-schedule-container">
                <div className="error">Schedule not found</div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="join-schedule-container">
                <div className="success-message">
                    <h2>Thank you for submitting your availability!</h2>
                    <p>Your response has been recorded.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="join-schedule-container">
            <div className="schedule-header">
                <h1>{schedule.title}</h1>
                {schedule.description && <p className="description">{schedule.description}</p>}
                <p>Select your available time slots by clicking and dragging on the calendar.</p>
            </div>
            
            <div className="name-input-container">
                <label htmlFor="name">Your Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                />
            </div>

            <TimeSelector
                dateRange={{
                    start: new Date(schedule.start_date),
                    end: new Date(schedule.end_date)
                }}
                timeRange={{
                    start: schedule.start_time,
                    end: schedule.end_time
                }}
                interval={schedule.time_slot_duration}
                onAvailabilityChange={handleAvailabilityChange}
                name={name}
            />

            <div className="action-buttons">
                <button 
                    className="submit-button"
                    onClick={handleSubmit}
                    disabled={availabilityBlocks.length === 0 || !name.trim()}
                >
                    Submit Availability
                </button>
            </div>
        </div>
    );
}

export default JoinSchedule;