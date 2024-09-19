
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
    return (
        <button
            {...props}
            className={`border-gray-100 border m-1 pr-4 pl-4 pt-2 pb-2 ml-4 text-white disabled:opacity-50 ${props.className || ''}`}
        >
            {children}
        </button>
    );
};

export default Button;