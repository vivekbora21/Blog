import React, { useState } from 'react';
import "./forgotPassword.css";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [step, setStep] = useState('email'); // 'email' or 'otp'
    const [email, setEmail] = useState('');

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData(e.target);
        const emailValue = formData.get('email');
        setEmail(emailValue);

        try {
            const response = await fetch('http://localhost:8000/forgot-password/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess(data.message);
                toast.success(data.message);
                setStep('otp');
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'An error occurred');
                toast.error(errorData.detail || 'An error occurred');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const otp = e.target.otp.value;

        try {
            const response = await fetch('http://localhost:8000/verify-otp/', {
                method: 'POST',
                body: new FormData(e.target),
            });

            if (response.ok) {
                const data = await response.json();
                setSuccess(data.message);
                navigate('/reset-password', { state: { email } });
            } else {
                const errorData = await response.json();
                setError(errorData.detail || 'An error occurred');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>Forgot Password</h2>
            {step === 'email' && (
                <form onSubmit={handleEmailSubmit}>
                    <div>
                        <label>Email: <span className='required'> *</span></label>
                        <input type="email" name="email" required />
                    </div>
                    {error && <span className="error-message">{error}</span>}
                    {success && <span className="success-message">{success}</span>}
                    <div className="button-group">
                        <button type="submit" disabled={loading}>
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                        <button type="button" onClick={() => navigate("/login")}>Back to Login</button>
                    </div>
                </form>
            )}
            {step === 'otp' && (
                <form onSubmit={handleOtpSubmit}>
                    <div>
                        <label>OTP: <span className='required'> *</span></label>
                        <input type="text" name="otp" required maxLength="6" />
                        <input type="hidden" name="email" value={email} />
                    </div>
                    

                    {error && <span className="error-message">{error}</span>}
                    {success && <span style={{ color: 'green' }}>{success}</span>}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                    <button type="button" onClick={() => setStep('email')}>Back</button>
                </form>
            )}
        </div>
    );
};

export default ForgotPassword;
