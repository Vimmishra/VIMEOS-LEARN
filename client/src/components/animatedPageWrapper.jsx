// components/FadeInOnScroll.jsx
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const fadeInVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const FadeInOnScroll = ({ children }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: true, // animate only the first time
        threshold: 0.2,     // how much needs to be visible
    });

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);

    return (
        <motion.div
            ref={ref}
            variants={fadeInVariant}
            initial="hidden"
            animate={controls}
        >
            {children}
        </motion.div>
    );
};

export default FadeInOnScroll;
