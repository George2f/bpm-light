import { cn } from '../utils/cn';

export default function Button({
    className,
    ...otherProps
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={cn(
                'size-10 w-full select-none rounded-xl bg-zinc-700 active:bg-transparent',
                className
            )}
            {...otherProps}
        />
    );
}
