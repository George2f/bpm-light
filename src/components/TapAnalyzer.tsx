import { useRef } from 'react';
import Button from './Button';

interface ITapAnalyzerProps {
    onBPMChange?: (bpm: number) => void;
    id?: string;
}

interface TapRecord {
    timestamp: number;
    bpm: number;
}

export default function TapAnalyzer({ id, onBPMChange }: ITapAnalyzerProps) {
    const history = useRef<TapRecord[]>([]);

    function handleTapperClick() {
        const now = Date.now();

        if (history.current.length === 0) {
            return history.current.push({ timestamp: now, bpm: 0 });
        }

        const lastTap = history.current[history.current.length - 1];
        const bpm = 60000 / (now - lastTap.timestamp);
        history.current.push({ timestamp: now, bpm });

        // Remove taps older than 5 seconds
        const fiveSecondsAgo = now - 5000;
        history.current = history.current.filter(
            (tap) => tap.timestamp > fiveSecondsAgo
        );

        const averageBpm = Math.round(
            history.current.reduce((sum, tap) => sum + tap.bpm, 0) /
                history.current.length
        );

        onBPMChange?.(averageBpm);
    }
    return (
        <Button onClick={handleTapperClick} id={id}>
            Tap
        </Button>
    );
}
