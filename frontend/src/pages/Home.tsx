import '../styles/Home.css'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in, .slide-in').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="home-container">
            <div className="hero-section">
                <p className="hero-question">
                    Having trouble finding a date and time that works for everyone?
                </p>
                <h1 className="hero-title">
                    Introducing the <span className="gradient-text">Free Time Finder</span>
                </h1>
            </div>

            <div className="features-section">
                <div className="how-it-works">
                    <h2>How It Works</h2>
                    <div className="steps-container">
                        <div className="step fade-in">
                            <div className="step-number">1</div>
                            <h3>Create a Schedule</h3>
                            <p>Start by creating a schedule for your event. Share the generated link with your group.</p>
                            <button onClick={() => navigate('/create')} className="cta-button">
                                Create Schedule
                            </button>
                        </div>

                        <div className="step fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="step-number">2</div>
                            <h3>Share & Input</h3>
                            <p>Group members click the link and input their availability using our intuitive interface.</p>
                            <div className="availability-graphic">
                                <div className="calendar-icon">📅</div>
                                <div className="arrow-icon">➜</div>
                                <div className="people-icon">👥</div>
                            </div>
                        </div>

                        <div className="step fade-in" style={{ animationDelay: '0.4s' }}>
                            <div className="step-number">3</div>
                            <h3>Get Results</h3>
                            <p>We'll analyze everyone's availability and show you the best times to meet.</p>
                            <div className="results-graphic">
                                <div className="match-indicator perfect">Perfect Match!</div>
                                <div className="match-indicator good">Good Option</div>
                                <div className="match-indicator limited">Limited Availability</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="benefits-section slide-in">
                    <h2>Why Use Free Time Finder?</h2>
                    <div className="benefits-grid">
                        <div className="benefit">
                            <span className="benefit-icon">⚡</span>
                            <h4>Save Time</h4>
                            <p>No more back-and-forth emails or messages</p>
                        </div>
                        <div className="benefit">
                            <span className="benefit-icon">🎯</span>
                            <h4>Perfect Timing</h4>
                            <p>Find the time that works best for everyone</p>
                        </div>
                        <div className="benefit">
                            <span className="benefit-icon">🔒</span>
                            <h4>Private & Secure</h4>
                            <p>Your schedule data stays private</p>
                        </div>
                        <div className="benefit">
                            <span className="benefit-icon">🌐</span>
                            <h4>Easy Sharing</h4>
                            <p>Simple link sharing with your group</p>
                        </div>
                    </div>
                </div>

                <div className="cta-section fade-in">
                    <h2>Ready to find the perfect time?</h2>
                    <div className="cta-buttons">
                        <button onClick={() => navigate('/create')} className="primary-button">
                            Create a Schedule
                        </button>
                        <button onClick={() => navigate('/join')} className="secondary-button">
                            Join Existing Schedule
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home