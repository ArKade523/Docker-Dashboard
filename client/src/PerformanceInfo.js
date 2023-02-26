import React, { useState, useEffect } from 'react';

const PerformanceInfo = () => {
    const [performanceInfo, setPerformanceInfo] = useState({});
    const [memoryValue, setMemoryValue] = useState({});

    useEffect(() => {
        fetch('/performance')
            .then(response => response.json())
            .then(data => {
                setPerformanceInfo(data);
                setMemoryValue(Math.round((data.memory.total - data.memory.free) / data.memory.total * 100));
            })
            .catch(error => console.error(error));

        const intervalId = setInterval(async () => {
            const response = await fetch('/performance');
            const data = await response.json();
            setPerformanceInfo(data);
            setMemoryValue(Math.round((data.memory.total - data.memory.free) / data.memory.total * 100));
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const gauge = document.getElementById("gauge");
        gauge.querySelector(".gauge-fill").style.transform = `rotate(${memoryValue / 200}turn)`;
        gauge.querySelector(".gauge-cover").textContent = `${memoryValue}%`;
    }, [memoryValue]);

    function formatUptime(uptime) {
        const days = Math.floor(uptime / (24 * 60 * 60));
        const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((uptime % (60 * 60)) / 60);
        const seconds = Math.floor(uptime % 60);
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    return (
        <div class="block">
            <h1>System Performance Info</h1>
            <div id="gauge">
                <div className="gauge-body">
                    <div className="gauge-fill"></div>
                    <div className="gauge-cover"></div>
                </div>
                <p className="gauge-label">Memory Utilization</p>
            </div>
            <p>System Uptime: {formatUptime(performanceInfo.uptime)}</p>
        </div>
    )
}

export default PerformanceInfo;