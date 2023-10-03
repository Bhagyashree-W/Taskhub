import React, { useState, useEffect } from 'react';

interface AlertProps {
  message: string;
  type: string;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 3000); // Adjust the duration as needed (2 seconds in this example)

    return () => clearTimeout(timer);
  }, [onClose]);

  return visible ? (
    <div className={`alert alert-${type}`}>
      <strong>{type.charAt(0).toUpperCase() + type.slice(1)}!</strong> {message}
    </div>
  ) : null;
};

export default Alert;
