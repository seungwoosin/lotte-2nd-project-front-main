import { gubunClasses } from "../util/sizeClasses"

export const CustomGubun = ({
    gubun,
    text,
}) => {
    
    const gubunSelectedClass = gubunClasses[gubun] || ""
    return (
        <div className={`${gubunSelectedClass}`}>
            {text}
        </div>
    )
}