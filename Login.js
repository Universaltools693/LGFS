const { useState } = React;

function Login({ onLogin }) {
  const [authName, setAuthName] = useState('');
  const [authNumber, setAuthNumber] = useState('');
  const [userName, setUserName] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 20) return "Good Evening";
    return "Good Night";
  };

  const handleGo = () => {
    if (authName !== 'Vikas Tiwari' || authNumber !== '7974123411') {
      setError('Invalid Authorized Name or Number');
      return;
    }
    setShowOtp(true);
    setError('');
  };

  const handleOtpSubmit = () => {
    if (otp === '654321') {
      onLogin(userName);
    } else {
      setError('Invalid OTP');
    }
  };

  return (
    <div className="login-container">
      <h1 className="greeting">{getGreeting()}</h1>
      <h2>Need Authentication</h2>
      <div className="input-group">
        <label>Authorize Person Name</label>
        <input type="text" value={authName} onChange={e => setAuthName(e.target.value)} placeholder="Enter Vikas Tiwari" />
      </div>
      <div className="input-group">
        <label>Authorize Person Mobile Number</label>
        <input type="text" value={authNumber} onChange={e => setAuthNumber(e.target.value)} placeholder="Enter 7974123411" />
      </div>
      <div className="input-group">
        <label>Your Name</label>
        <input type="text" value={userName} onChange={e => setUserName(e.target.value)} placeholder="Enter Your Name" />
      </div>
      {showOtp && (
        <div className="input-group">
          <label>Please Input Authorization Code</label>
          <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" />
        </div>
      )}
      <button className="go-button" onClick={showOtp ? handleOtpSubmit : handleGo}>Go</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
