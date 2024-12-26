import React from 'react'
import { mbClasses, mlClasses, mrClasses, mtClasses, sizeClasses } from '../util/sizeClasses';

const CustomInput = ({
    type,
    name,
    handler,
    placeholder,
    value,
    size,
    mb,
    mt,
    mr,
    ml
}) => {
    
    const inputSizeClass = sizeClasses[size] || sizeClasses.m;
    const inputMrClasses = mrClasses[mr] || ""
    const inputMtClasses = mtClasses[mt] || ""
    const inputMbClasses = mbClasses[mb] || ""
    const inputMlClasses = mlClasses[ml] || ""
    return (
        <input 
        type={type}
        name={name}
        className={`${inputSizeClass} ${inputMrClasses} ${inputMtClasses} ${inputMbClasses} ${inputMlClasses}`}
        onChange={handler}
        placeholder={placeholder}
        value={value}
        />
    )
}

export default CustomInput;
