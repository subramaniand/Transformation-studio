import { useState } from 'react';
import { useAuthStore } from '../authStore';

const UST_LOGO = (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L22 12L12 22L2 12Z" fill="#003D82" stroke="#003D82" strokeWidth="1" />
    <path d="M12 8L16 12L12 16L8 12Z" fill="white" />
  </svg>
);

export default function LoginShell() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore(state => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !password) {
      setError('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    const result = await login(username, password);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="login-shell">
      <div className="lbox">
        <div className="llogo" style={{ marginBottom: '28px' }}>
          <div style={{ marginBottom: '12px' }}>{UST_LOGO}</div>
          <div className="llogo-name" style={{ fontSize: '26px', fontWeight: '700', color: '#003D82', letterSpacing: '2px' }}>
            UST
          </div>
          <div className="llogo-sub" style={{ fontSize: '12px', fontWeight: '500', marginTop: '8px' }}>
            Transformation Studio
          </div>
          <div style={{ fontSize: '10px', color: 'var(--tx3)', marginTop: '6px' }}>
            Transformation Studio
          </div>
        </div>

        <div className={`lerr ${error ? 'show' : ''}`} id="lerr">
          {error}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="lfld">
            <label>Username</label>
            <input
              type="text"
              placeholder="Username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="lfld">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="lbtn" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>

      </div>
    </div>
  );
}
