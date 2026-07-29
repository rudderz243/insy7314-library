import React, { useEffect, useState } from "react";

export const HealthCheckPage: React.FC = () => {
  const [isWorking, setIsWorking] = useState<boolean | null>(null);

  const testHealth = async () => {
    try {
      const res = await fetch("http://localhost:3000/home/healthCheck");
      setIsWorking(res.ok);
    } catch {
      setIsWorking(false);
    }

    // the useEffect runs whenever anything changes
    useEffect(() => {
      testHealth();
    }, []);

    return (
      <div className='bento-grid'>
        <div className='bento-card bento-col-12 teal-header'>
          <h2 className='card-title'>
            <span>Is the API Working?</span>
            <button className='btn btn-teal btn-sm' onClick={testHealth}>
              Check Again!
            </button>
          </h2>
          {isWorking === null ? (
            <p>We are checking...</p>
          ) : isWorking ? (
            <div className='health-status-box yes'>Yes</div>
          ) : (
            <div className='health-status-box no'>No</div>
          )}
        </div>
      </div>
    );
  };
};
