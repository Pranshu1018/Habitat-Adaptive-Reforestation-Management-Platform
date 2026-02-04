import React, { useEffect, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
    value: number;
    decimals?: number;
    duration?: number;
    className?: string;
    suffix?: string;
    prefix?: string;
}

/**
 * Animated Number Ticker Component
 * 
 * Smoothly animates number changes with spring physics
 * Perfect for displaying live metrics and scores
 */
export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
    value,
    decimals = 0,
    duration = 1000,
    className = '',
    suffix = '',
    prefix = ''
}) => {
    const springValue = useSpring(0, {
        stiffness: 100,
        damping: 30,
        mass: 1
    });

    const display = useTransform(springValue, (latest) => {
        return `${prefix}${latest.toFixed(decimals)}${suffix}`;
    });

    useEffect(() => {
        springValue.set(value);
    }, [value, springValue]);

    return (
        <motion.span className={className}>
            {display}
        </motion.span>
    );
};

export default AnimatedNumber;
