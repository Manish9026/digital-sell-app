import React from 'react'

const CustomText = ({
    title,
    size = "text-base",
    color = "text-gray-800",
    weight = "font-normal",
    className = "",
    onClick,
    children,
    ...props
}) => {
  return (
    <p className={`${size} ${className}`}>
        {title}
    </p>
  )
}

export default CustomText