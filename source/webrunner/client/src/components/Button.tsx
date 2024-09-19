

type ButtonTheme = 'default' | 'gray';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    theme?: ButtonTheme;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {

    const theme = props.theme || 'default';
    delete props.theme;

    const themeClasses = {
        default: 'border-gray-100 text-white',
        gray: 'border-gray-300 text-gray-300',
    };

    return (
        <button
            {...props}
            className={`border m-1 pr-4 pl-4 pt-2 pb-2 ml-4 e disabled:opacity-50 ${props.className || ''} ${themeClasses[theme]}`}
        >
            {children}
        </button>
    );
};

export default Button;