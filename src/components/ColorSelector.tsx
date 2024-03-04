export default function ColorSelector({
    colors,
    onChange,
}: {
    colors: string[];
    onChange: (colorIndex: number) => void;
}) {
    return (
        <div className="m-4 ml-auto mr-auto grid max-h-svh w-[200px] grid-cols-2 gap-4 overflow-scroll rounded-xl bg-zinc-800 p-4">
            {colors.map((color, index) => (
                <button
                    key={color}
                    className="size-20 w-full rounded-xl text-2xl"
                    style={{ backgroundColor: color }}
                    onClick={() => onChange(index)}
                />
            ))}
        </div>
    );
}
