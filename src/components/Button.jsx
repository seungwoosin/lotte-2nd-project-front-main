import { mbClasses, mlClasses, mrClasses, mtClasses, sizeClassesBtn } from "../util/sizeClasses";

export const CustomButton = ({
    type,
    handler,
    size,
    mb,
    mt,
    ml,
    mr,
    text,
    color,
    bg,
    height
}) => {
    
    const buttonSizeClasses = sizeClassesBtn[size] || sizeClassesBtn.m;
    const inputMrClasses = mrClasses[mr] || ""
    const inputMtClasses = mtClasses[mt] || ""
    const inputMbClasses = mbClasses[mb] || ""
    const inputMlClasses = mlClasses[ml] || ""
    return (
        <button
            style={{height:height}}
            type={type}
            onClick={handler}
            className={`${buttonSizeClasses} ${inputMrClasses} ${inputMtClasses} ${inputMbClasses} ${inputMlClasses} bg-${bg} ${color}`}
        >
            {text}
        </button>
    )
}