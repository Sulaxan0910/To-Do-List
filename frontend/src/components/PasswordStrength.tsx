import React from 'react';
import { authHelpers } from '../utils/auth';

interface PasswordStrengthProps {
  password: string;
  showStrength?: boolean;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ 
  password, 
  showStrength = true 
}) => {
  const validation = authHelpers.validatePassword(password);

  const calculateStrength = (pass: string): number => {
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score += 1;
    return score;
  };
  
  const strength = calculateStrength(password);

  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return '#e53e3e'; // Red
    if (strength === 3) return '#d69e2e'; // Yellow
    return '#38a169'; // Green
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 2) return 'Weak';
    if (strength === 3) return 'Fair';
    return 'Strong';
  };

  if (!showStrength && password.length === 0) {
    return null;
  }

  return (
    <div className="password-strength">
      {showStrength && password.length > 0 && (
        <div className="strength-meter">
          <div 
            className="strength-bar"
            style={{
              width: `${(strength / 5) * 100}%`,
              backgroundColor: getStrengthColor(strength)
            }}
          />
          <div className="strength-text">
            Strength: <strong>{getStrengthText(strength)}</strong>
          </div>
        </div>
      )}
      
      {validation.errors.length > 0 && (
        <div className="password-requirements">
          <p className="requirements-title">Password must:</p>
          <ul className="requirements-list">
            <li className={password.length >= 6 ? 'met' : 'unmet'}>
              Be at least 6 characters long
            </li>
            <li className={/[A-Z]/.test(password) ? 'met' : 'unmet'}>
              Contain at least one uppercase letter
            </li>
            <li className={/[a-z]/.test(password) ? 'met' : 'unmet'}>
              Contain at least one lowercase letter
            </li>
            <li className={/\d/.test(password) ? 'met' : 'unmet'}>
              Contain at least one number
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrength;