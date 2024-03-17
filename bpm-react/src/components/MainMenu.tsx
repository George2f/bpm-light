import { cn } from '../utils/cn';
import AutoAnalyzer from './AutoAnalyzer';
import Button from './Button';
import TapAnalyzer from './TapAnalyzer';

interface IMainMenuProps {
    onColor1Click?: () => void;
    onColor2Click?: () => void;
    onRandomizeColorsClick?: () => void;
    onSplitColorsClick?: () => void;
    onBPMChange: (bpm: number) => void;
    onTutorialClick?: () => void;
    onPlayClick?: () => void;
    onBPMMinusClick?: () => void;
    onBPMPlusClick?: () => void;
    randomizeColors: boolean;
    split: number;
    bpm: number;
    isBlinking: boolean;
    runTutorial: boolean;
}

export default function MainMenu({
    onColor1Click,
    onColor2Click,
    onRandomizeColorsClick,
    onSplitColorsClick,
    onBPMChange,
    onTutorialClick,
    onPlayClick,
    onBPMMinusClick,
    onBPMPlusClick,
    randomizeColors,
    split,
    bpm,
    isBlinking,
    runTutorial,
}: IMainMenuProps) {
    return (
        <div className="fixed bottom-0 m-4 flex flex-col gap-2 rounded-xl bg-zinc-800 p-4 text-xl font-bold text-white">
            <div className="grid grid-cols-3 gap-2">
                <div className="grid grid-cols-1 gap-2">
                    <h2 className="m-0 w-full text-center">Color</h2>
                    <div
                        className="grid gap-2 md:grid-cols-2"
                        id="color-selectors">
                        <Button onClick={onColor1Click}>Choose 1</Button>
                        <Button onClick={onColor2Click}>Choose 2</Button>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                        <Button
                            id="button-random-colors"
                            className={cn({
                                'bg-zinc-800': !randomizeColors,
                                'bg-zinc-500': randomizeColors,
                            })}
                            onClick={onRandomizeColorsClick}>
                            Random
                        </Button>
                        <Button
                            id="button-split-colors"
                            onClick={onSplitColorsClick}>
                            {split > 1 ? `1/${split}` : '1'}
                        </Button>
                    </div>
                </div>
                <form id="bpm" className="block w-full">
                    <input
                        className="h-full !w-full rounded-xl bg-zinc-800 text-center"
                        value={bpm}
                        id="input-bpm"
                        type="number"
                        inputMode="decimal"
                        onChange={(e) =>
                            onBPMChange(Number.parseInt(e.target.value))
                        }
                    />
                </form>
                <div className="grid grid-cols-1 gap-2">
                    <h2 className="m-0 w-full text-center">BPM</h2>
                    <div className="grid gap-2 md:grid-cols-2">
                        <TapAnalyzer
                            onBPMChange={(v) => onBPMChange(v)}
                            id="button-tap"
                        />
                        <AutoAnalyzer
                            id="button-auto"
                            onBPMChange={(v) => onBPMChange(v)}
                            onListenStart={() => {
                                if (isBlinking) {
                                    onPlayClick?.();
                                }
                            }}
                        />
                    </div>
                    {!runTutorial ? (
                        <Button onClick={onTutorialClick}>Tutorial</Button>
                    ) : null}
                </div>
            </div>
            <div
                className="grid grid-cols-3 gap-2 rounded-xl bg-zinc-900 p-2"
                id="player">
                <Button onClick={onBPMMinusClick}>-</Button>
                <Button
                    className={cn({
                        'bg-zinc-100': !isBlinking,
                        'text-zinc-900': !isBlinking,
                        'bg-zinc-500': isBlinking,
                    })}
                    type="submit"
                    form="bpm"
                    id="button-play"
                    autoFocus
                    onClick={(e) => {
                        e.preventDefault();
                        onPlayClick?.();
                    }}>
                    {isBlinking ? 'PAUSE' : 'PLAY'}
                </Button>
                <Button onClick={onBPMPlusClick}>+</Button>
            </div>
        </div>
    );
}
