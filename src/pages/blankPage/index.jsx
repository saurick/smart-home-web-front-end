import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const BlankPage = () => {
    const navigate = useNavigate()
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(-1)
        }, 0)
        return () => clearTimeout(timer)
    }, [])

    return (
      <div />
    )
}
