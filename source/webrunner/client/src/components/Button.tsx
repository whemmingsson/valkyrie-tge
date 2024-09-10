
interface ButtonProps {
    children: React.ReactElement | string;
    disabled?: boolean;
    onClick?: () => void;
}

const Button = (props: ButtonProps) => {
    return (
        <button onClick={props.onClick}
            disabled={props.disabled}
            className="border-gray-100 border m-1 pr-4 pl-4 pt-2 pb-2 ml-4 disabled:opacity-50"
        >{props.children}</button>
    )
}

export default Button;