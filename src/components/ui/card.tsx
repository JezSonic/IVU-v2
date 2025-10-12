import React, { forwardRef, ReactNode } from 'react';

interface CardProps {
    title?: ReactNode;
    footer?: ReactNode;
    children: ReactNode;
    className?: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>((props, ref) => {
    const { title, footer, children, className = '', ...rest } = props;

    return (
        <div
            ref={ref}
            className={className + ' p-4 bg-surface rounded-lg shadow-md min-w-14'}
            {...rest}>
            {title && <div className='mb-2 text-lg font-semibold'>{title}</div>}
            <div className='flex flex-col gap-2'>{children}</div>
            {footer && <div className='mt-3 text-sm text-muted-foreground'>{footer}</div>}
        </div>
    );
});

Card.displayName = 'Card';

export default Card;