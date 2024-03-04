import { useEffect, useState } from 'react';
import { cn } from './utils/cn';
import ColorSelector from './components/ColorSelector';
import AutoAnalyzer from './components/AutoAnalyzer';
import Button from './components/Button';
import TapAnalyzer from './components/TapAnalyzer';
import Joyride from 'react-joyride';

const COLORS = [
    '#00C9FF', // Neon Blue
    'red',
    '#39FF14', // Neon Green
    '#FFFFFF', // Neon White (Light Gray for glow effect)
    'magenta', // Magenta
    '#FFFF00', // Neon Yellow
    '#FF5F1F', // Neon Orange
    '#00FFEF', // Neon Cyan
];

// Array of dark colors including black
const COLORS_2 = [
    '#000000', // Deep Black
    '#480048', // Rich Purple
    '#00035B', // Dark Blue
    '#9400D3', // Neon Purple
    '#005F39', // Deep Green
    '#800000', // Rich Maroon
    '#003B46', // Deep Cyan
    '#483D8B', // Dark Slate Blue
    ...COLORS,
];

const JOYRIDE_STEPS = [
    {
        target: '#input-bpm',
        content: 'Set the BPM here.',
        spotlightClicks: true,
        disableBeacon: true,
    },
    {
        target: '#button-tap',
        content: 'Or tap the button to detect the BPM.',
        spotlightClicks: true,
        disableBeacon: true,
    },
    {
        target: '#button-auto',
        content: 'Or let the app listen to the music.',
        spotlightClicks: true,
        disableBeacon: true,
    },
    {
        target: '#color-selectors',
        content: 'Choose the colors for the lights.',
        spotlightClicks: true,
        disableBeacon: true,
    },
    {
        target: '#button-random-colors',
        content: 'Or toggle random colors.',
        spotlightClicks: true,
        disableBeacon: true,
    },
    {
        target: '#button-split-colors',
        content: 'You can split the color area here.',
        spotlightClicks: true,
        disableBeacon: true,
    },
    {
        target: '#button-play',
        content: 'Now start the party!',
        spotlightClicks: true,
        disableBeacon: true,
    },
    {
        target: '#button-main',
        content: 'And click anywhere to toggle the menu.',
        disableBeacon: true,
    },
];

export default function App() {
    const [bpm, setBpm] = useState(140);
    const [beat, setBeat] = useState(true);
    const [runTutorial, setRunTutorial] = useState(false);
    const [offBeat, setOffBeat] = useState(false);
    const [isBlinking, setIsBlinking] = useState(false);
    const [colorIndex, setColorIndex] = useState([0, 0]);
    const [split, setSplit] = useState<number>(1);
    const [colorSelectorOpen, setColorSelectorOpen] = useState<
        boolean | number
    >(false);
    const [menuVisible, setMenuVisible] = useState(true);
    const [randomizeColors, setRandomizeColors] = useState(false);

    useEffect(() => {
        setRunTutorial(localStorage.getItem('visitedPreviously') !== 'true');
        setTimeout(
            () => localStorage.setItem('visitedPreviously', 'true'),
            10000
        );
    }, []);

    useEffect(() => {
        const interval = setInterval(
            () => {
                if (isBlinking) {
                    setColorIndex((old) => {
                        let index1 = old[0];
                        let index2 = old[1];

                        if (randomizeColors) {
                            const newIndex1 = Math.floor(
                                Math.random() * COLORS.length
                            );
                            let newIndex2 = Math.floor(
                                Math.random() * COLORS_2.length
                            );
                            if (COLORS[newIndex1] === COLORS_2[newIndex2]) {
                                newIndex2 = newIndex2 - 1;
                            }
                            index1 = newIndex1;
                            index2 = newIndex2;
                        }
                        return [index1, index2];
                    });

                    setBeat(true);
                    setTimeout(
                        () => {
                            setBeat(false);
                        },
                        (60 / bpm) * 250
                    );

                    setTimeout(
                        () => {
                            setOffBeat(true);
                        },
                        (60 / bpm) * 500
                    );
                    setTimeout(
                        () => {
                            setOffBeat(false);
                        },
                        (60 / bpm) * 750
                    );
                }
            },
            (60 / bpm) * 1000
        );

        return () => clearInterval(interval);
    }, [bpm, isBlinking, randomizeColors]);

    return (
        <div
            className={cn('flex h-full w-full flex-col items-center')}
            style={{ backgroundColor: 'black' }}>
            <button
                onClick={() => setMenuVisible((v) => !v)}
                className={cn('grid h-full w-full grid-cols-1', {
                    'grid-cols-2': split === 2 || split === 4,
                })}
                id="button-main"
                tabIndex={-1}>
                <div
                    className="h-full w-full"
                    style={{
                        backgroundColor:
                            beat || !isBlinking || colorSelectorOpen
                                ? COLORS[colorIndex[0]]
                                : COLORS_2[colorIndex[1]],
                    }}
                />
                {split >= 2 ? (
                    <div
                        className="h-full w-full"
                        style={{
                            backgroundColor:
                                offBeat || !isBlinking || colorSelectorOpen
                                    ? COLORS[colorIndex[0]]
                                    : COLORS_2[colorIndex[1]],
                        }}
                    />
                ) : null}
                {split >= 4 ? (
                    <>
                        <div
                            className="h-full w-full"
                            style={{
                                backgroundColor:
                                    offBeat || !isBlinking || colorSelectorOpen
                                        ? COLORS[colorIndex[0]]
                                        : COLORS_2[colorIndex[1]],
                            }}
                        />
                        <div
                            className="h-full w-full"
                            style={{
                                backgroundColor:
                                    beat || !isBlinking || colorSelectorOpen
                                        ? COLORS[colorIndex[0]]
                                        : COLORS_2[colorIndex[1]],
                            }}
                        />
                    </>
                ) : null}
            </button>
            {colorSelectorOpen ? (
                <div className="fixed left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center">
                    <button
                        onClick={() => setColorSelectorOpen(false)}
                        className="fixed left-0 top-0 -z-10 h-full w-full bg-black opacity-30"
                    />

                    <ColorSelector
                        colors={colorSelectorOpen === 1 ? COLORS : COLORS_2}
                        onChange={(ci) => {
                            if (colorSelectorOpen === 1) {
                                setColorIndex([ci, colorIndex[1]]);
                            } else {
                                setColorIndex([colorIndex[0], ci]);
                            }
                            setColorSelectorOpen(false);
                        }}
                    />
                </div>
            ) : null}
            {menuVisible ? (
                <div className="fixed bottom-0 m-4 flex flex-col gap-2 rounded-xl bg-zinc-800 p-4 text-xl font-bold text-white">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="grid grid-cols-1 gap-2">
                            <h2 className="m-0 w-full text-center">Color</h2>
                            <div
                                className="grid gap-2 md:grid-cols-2"
                                id="color-selectors">
                                <Button
                                    onClick={() => {
                                        setRandomizeColors(false);
                                        setColorSelectorOpen(1);
                                    }}>
                                    Choose 1
                                </Button>
                                <Button
                                    onClick={() => {
                                        setRandomizeColors(false);
                                        setColorSelectorOpen(2);
                                    }}>
                                    Choose 2
                                </Button>
                            </div>
                            <div className="grid gap-2 md:grid-cols-2">
                                <Button
                                    id="button-random-colors"
                                    className={cn({
                                        'bg-zinc-800': !randomizeColors,
                                        'bg-zinc-500': randomizeColors,
                                    })}
                                    onClick={() => {
                                        setRandomizeColors((v) => !v);
                                    }}>
                                    Random
                                </Button>
                                <Button
                                    id="button-split-colors"
                                    onClick={() => {
                                        setSplit((v) =>
                                            split === 4 ? 1 : v * 2
                                        );
                                    }}>
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
                                    setBpm(Number.parseInt(e.target.value))
                                }
                            />
                        </form>
                        <div className="grid grid-cols-1 gap-2">
                            <h2 className="m-0 w-full text-center">BPM</h2>
                            <div className="grid gap-2 md:grid-cols-2">
                                <TapAnalyzer
                                    onBPMChange={(v) => setBpm(v)}
                                    id="button-tap"
                                />
                                <AutoAnalyzer
                                    id="button-auto"
                                    onBPMChange={(v) => setBpm(v)}
                                    onListenStart={() => setIsBlinking(false)}
                                />
                            </div>
                            {!runTutorial ? (
                                <Button
                                    onClick={() => {
                                        setRunTutorial(true);
                                    }}>
                                    Tutorial
                                </Button>
                            ) : null}
                        </div>
                    </div>
                    <div
                        className="grid grid-cols-3 gap-2 rounded-xl bg-zinc-900 p-2"
                        id="player">
                        <Button
                            onClick={() => setBpm((v) => Math.max(1, v - 1))}>
                            -
                        </Button>
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
                                setIsBlinking((v) => !v);
                            }}>
                            {isBlinking ? 'PAUSE' : 'PLAY'}
                        </Button>
                        <Button
                            onClick={() =>
                                setBpm((v) => Math.min(3600, v + 1))
                            }>
                            +
                        </Button>
                    </div>
                </div>
            ) : null}
            <Joyride
                run={runTutorial}
                continuous
                showProgress
                showSkipButton
                styles={{
                    options: {
                        zIndex: 200,
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                }}
                steps={JOYRIDE_STEPS}
            />
        </div>
    );
}
