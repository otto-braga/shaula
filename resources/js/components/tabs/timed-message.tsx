import { useState, useEffect } from 'react'

import { ReactNode } from 'react';

interface MessageProps {
    variant: string;
    children: ReactNode;
    duration?: number;
}

const TimedMessage = ({ variant, children, duration = 3000 }: MessageProps) => {
    const [show, setShow] = useState(true)

    // On componentDidMount set the timer
    useEffect(() => {
        const timeId = setTimeout(() => {
            // After 3 seconds set the show value to false
            setShow(false)
        }, duration)

        return () => {
            clearTimeout(timeId)
        }
    }, []);

    // If show is false the component will return null and stop here
    if (!show) {
        return null;
    }

    // If show is true this will be returned
    return (
        <div className={`alert alert-${variant}`}>
            {children}
        </div>
    )
}

TimedMessage.defaultPros = {
    variant: 'info',
}

export default TimedMessage;
