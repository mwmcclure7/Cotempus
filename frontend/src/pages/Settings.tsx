import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';
import '../styles/Settings.css';

function Settings() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match');
            return;
        }
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/api/auth/change-password/', {
                current_password: currentPassword,
                new_password: newPassword
            });
            setSuccess('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to update password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/api/auth/change-email/', {
                new_email: newEmail
            });
            setSuccess('Email updated successfully');
            setNewEmail('');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to update email');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        navigate('/');
        window.location.reload();
    };

    const handleDeleteAccount = async () => {
        const initialConfirm = window.confirm(
            '⚠️ Warning: This action cannot be undone! Are you sure you want to delete your account?'
        );
        
        if (initialConfirm) {
            const confirmText = prompt(
                'To confirm deletion, please type "DELETE" in all caps:'
            );
            
            if (confirmText === 'DELETE') {
                try {
                    await api.delete('/api/auth/delete-account/');
                    localStorage.removeItem(ACCESS_TOKEN);
                    navigate('/register');
                } catch (err: any) {
                    setError(err.response?.data?.detail || 'Failed to delete account');
                }
            } else {
                setError('Account deletion cancelled - confirmation text did not match');
            }
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-card">
                <h2>Account Settings</h2>
                
                {error && <div className="settings-error">{error}</div>}
                {success && <div className="settings-success">{success}</div>}

                <form onSubmit={handlePasswordChange} className="settings-form">
                    <h3>Change Password</h3>
                    <div className="form-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmNewPassword">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>
                    <button type="submit" disabled={isLoading}>Change Password</button>
                </form>

                <form onSubmit={handleEmailChange} className="settings-form">
                    <h3>Change Email</h3>
                    <div className="form-group">
                        <label htmlFor="newEmail">New Email</label>
                        <input
                            type="email"
                            id="newEmail"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={isLoading}>Change Email</button>
                </form>

                <div className="settings-actions">
                    <button onClick={handleSignOut} className="signout-button">
                        Sign Out
                    </button>
                    <button onClick={handleDeleteAccount} className="delete-button">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings; 