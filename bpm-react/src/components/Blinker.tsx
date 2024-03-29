import { cn } from '../utils/cn';

interface IBlinkerProps {
    beat: boolean;
    offBeat: boolean;
    isBlinking: boolean;
    split: number;
    color1: string;
    color2: string;
}

export default function Blinker({
    beat,
    offBeat,
    isBlinking,
    split,
    color1,
    color2,
}: IBlinkerProps) {
    return (
        <div
            className={cn('grid h-full w-full grid-cols-1', {
                'grid-cols-2': split === 2 || split === 4,
            })}>
            <div
                className="h-full w-full"
                style={{
                    backgroundColor: beat || !isBlinking ? color1 : color2,
                }}
            />
            {split >= 2 ? (
                <div
                    className="h-full w-full"
                    style={{
                        backgroundColor:
                            offBeat || !isBlinking ? color1 : color2,
                    }}
                />
            ) : null}
            {split >= 4 ? (
                <>
                    <div
                        className="h-full w-full"
                        style={{
                            backgroundColor:
                                offBeat || !isBlinking ? color1 : color2,
                        }}
                    />
                    <div
                        className="h-full w-full"
                        style={{
                            backgroundColor:
                                beat || !isBlinking ? color1 : color2,
                        }}
                    />
                </>
            ) : null}
        </div>
    );
}
