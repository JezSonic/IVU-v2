import React, { forwardRef, ReactNode } from 'react';

interface CardProps {
    title?: ReactNode;
    footer?: ReactNode;
    children: ReactNode;
    className?: string;
	onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
    const { title, footer, children, className = '', onClick, ...rest } = props;

    return (
        <div
            ref={ref}
            className={className + ' p-4 bg-surface rounded-lg shadow-md min-w-14'}
            {...rest}
			onClick={onClick}
		>
            {title && <div className='mb-2 text-lg font-semibold'>{title}</div>}
            <>{children}</>
            {footer && <div className='mt-3 text-sm text-muted-foreground'>{footer}</div>}
        </div>
    );
});

Card.displayName = 'Card';

export default Card;