import React from "react";

const _variants = {
	primary: "bg-background shadow-sm hover:bg-background/50",
	default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
	destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
	outline: "border border-gray-500 border-input bg-background shadow-sm hover:bg-surface",
	secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
	ghost: "hover:bg-surface",
	link: "text-primary underline-offset-4 hover:underline",
};
const _sizes = {
	default: "h-9 px-4 py-2",
	sm: "h-8 rounded-md px-3 text-xs",
	lg: "h-10 rounded-md px-8",
	icon: "size-9",
	xs: "rounded-md p-3 text-xs text-xs",
};

const _baseClass = "cursor-pointer inline-flex outline-gray-500 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";
type ButtonVariant = keyof typeof _variants
type ButtonSize = keyof typeof _sizes

export function Button({ variant, size, className, onClick, disabled = false, children }: {
	variant?: ButtonVariant,
	size?: ButtonSize,
	className?: string,
	onClick?: () => void,
	disabled?: boolean,
	children: React.ReactNode
}) {
	const finalClass = `${_baseClass} ${_variants[variant || "default"]} ${_sizes[size || "default"]} ${className || ""}`;
	return (<button className={finalClass} onClick={onClick ? onClick : undefined} disabled={disabled}>
			{children}
		</button>
	);
}