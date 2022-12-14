import React from "react";

interface Props {
    title: string;
    isActive? : Boolean;
    onClick? : React.MouseEventHandler<HTMLElement>;
}

function NavButton({ title, isActive, onClick }: Props) {
    return (
        <button onClick={onClick}
            className={`${isActive && "bg-[#036756]"} hover:bg-[#036756] text-white py-2 px-4 rounded font-bold`}>{title}</button>
    );
}

export default NavButton;