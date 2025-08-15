import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-white-400 text-white focus:border-white-700'
                    : 'border-transparent text-white hover:border-gray-300') +
                className
            }
        >
            {children}
        </Link>
    );
}
