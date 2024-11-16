import { useState } from 'react';
import '../styles/CreateSchedule.css';
import api from '../api';

function CreateSchedule() {
    const [step, setStep] = useState(1);
    const [createdScheduleId, setCreatedScheduleId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dateRange: {
            start: '',
            end: ''
        },
        timeRange: {
            start: '09:00',
            end: '17:00'
        },
        timeSlotDuration: 15, // minutes
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    const isStepValid = (stepNumber: number): boolean => {
        switch (stepNumber) {
            case 1:
                return formData.title.trim() !== ''; // Title is required
            case 2:
                return (
                    formData.dateRange.start !== '' &&
                    formData.dateRange.end !== '' &&
                    formData.timeRange.start !== '' &&
                    formData.timeRange.end !== '' &&
                    new Date(formData.dateRange.start) <= new Date(formData.dateRange.end)
                );
            case 3:
                return true; // All fields in step 3 have default values
            default:
                return false;
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent as keyof typeof prev] as object,
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post<{ id: string }>('/api/schedules/', {
                title: formData.title,
                description: formData.description,
                start_date: formData.dateRange.start,
                end_date: formData.dateRange.end,
                start_time: formData.timeRange.start,
                end_time: formData.timeRange.end,
                time_slot_duration: formData.timeSlotDuration,
                timezone: formData.timezone
            });
            
            setCreatedScheduleId(response.data.id);
        } catch (error) {
            console.error('Error creating schedule:', error);
        }
    };

    const nextStep = (e: React.MouseEvent) => {
        e.stopPropagation();  // Stop event bubbling
        setStep(prev => Math.min(prev + 1, 3));
    };
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const shareableLink = createdScheduleId 
        ? `${window.location.origin}/schedule/${createdScheduleId}` 
        : null;

    return (
        <div className="create-schedule-container">
            <div className="progress-bar">
                <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                    <div className="step-number">1</div>
                    <span>Basic Info</span>
                </div>
                <div className={`progress-line ${step >= 2 ? 'active' : ''}`} />
                <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                    <div className="step-number">2</div>
                    <span>Date & Time</span>
                </div>
                <div className={`progress-line ${step >= 3 ? 'active' : ''}`} />
                <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                    <div className="step-number">3</div>
                    <span>Settings</span>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="schedule-form">
                {step === 1 && (
                    <div className="form-step fade-in">
                        <h2>Basic Information</h2>
                        <div className="form-group">
                            <label htmlFor="title">Schedule Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="e.g., Team Weekly Meeting"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description (Optional)</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Add any additional details about the schedule"
                                rows={4}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="form-step fade-in">
                        <h2>Date & Time Settings</h2>
                        <div className="form-group">
                            <label>Date Range</label>
                            <div className="date-range-inputs">
                                <input
                                    type="date"
                                    name="dateRange.start"
                                    value={formData.dateRange.start}
                                    onChange={handleInputChange}
                                    required
                                />
                                <span>to</span>
                                <input
                                    type="date"
                                    name="dateRange.end"
                                    value={formData.dateRange.end}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Daily Time Range</label>
                            <div className="time-range-inputs">
                                <input
                                    type="time"
                                    name="timeRange.start"
                                    value={formData.timeRange.start}
                                    onChange={handleInputChange}
                                    required
                                />
                                <span>to</span>
                                <input
                                    type="time"
                                    name="timeRange.end"
                                    value={formData.timeRange.end}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="form-step fade-in">
                        <h2>Additional Settings</h2>
                        <div className="form-group">
                            <label htmlFor="timeSlotDuration">Time Slot Duration</label>
                            <select
                                id="timeSlotDuration"
                                name="timeSlotDuration"
                                value={formData.timeSlotDuration}
                                onChange={handleInputChange}
                            >
                                <option value={15}>15 minutes</option>
                                <option value={30}>30 minutes</option>
                                <option value={60}>1 hour</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="timezone">Timezone</label>
                            <select
                                id="timezone"
                                name="timezone"
                                value={formData.timezone}
                                onChange={handleInputChange}
                            >
                                {[
                                    'UTC', 'GMT', 'America/New_York', 'Europe/London', 
                                    'Asia/Tokyo', 'Australia/Sydney' // Add more time zones as needed
                                ].map((tz: string) => (
                                    <option key={tz} value={tz}>{tz}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                <div className="form-navigation">
                    {step > 1 && (
                        <button 
                            type="button" 
                            onClick={prevStep} 
                            className="nav-button"
                        >
                            Back
                        </button>
                    )}
                    {step < 3 ? (
                        <button 
                            type="button" 
                            onClick={(e) => {
                                e.preventDefault();  // Prevent any default behavior
                                nextStep(e);
                            }} 
                            className="nav-button primary"
                            disabled={!isStepValid(step)}
                        >
                            Next
                        </button>
                    ) : (
                        <button 
                            type="submit"
                            className="nav-button primary"
                            onClick={() => {
                                const button = document.querySelector('button[type="submit"]') as HTMLButtonElement;
                                button.disabled = true;
                                setTimeout(() => {
                                    button.disabled = false;
                                }, 2000);
                            }}
                            disabled={!isStepValid(1) || !isStepValid(2) || !isStepValid(3)}
                        >
                            Create Schedule
                        </button>
                    )}
                </div>
            </form>

            {createdScheduleId && (
                <div className="fade-in success-message">
                    <h3>Schedule Created Successfully!</h3>
                    <p>Share this link with others to collect their availability:</p>
                    <div className="share-link-container">
                        <input 
                            type="text" 
                            value={shareableLink || ''} 
                            readOnly 
                            onClick={(e) => e.currentTarget.select()}
                        />
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(shareableLink!);
                                // Optionally add a toast notification here
                            }}
                            className="copy-button"
                        >
                            Copy Link
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateSchedule;