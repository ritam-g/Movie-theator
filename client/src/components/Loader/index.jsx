/**
 * Loader Component
 * 
 * A premium loading indicator component that displays animated spinner
 * while content is loading. Used throughout the application to show loading states.
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Message to display during loading
 * @param {string} props.size - Size of the spinner: 'sm', 'md', 'lg'
 * @param {boolean} props.fullScreen - Whether to show full screen loader
 */
import { motion } from "framer-motion";

function Loader({ label = "Loading...", size = "md", fullScreen = false }) {
  const sizeClass = size === 'sm' ? 'loader-spinner-sm' : size === 'lg' ? 'loader-spinner-lg' : '';

  if (fullScreen) {
    return (
      <motion.div
        className="loader-fullscreen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className={`loader-spinner loader-spinner-xl`} />
        <span className="loader-text">{label}</span>
      </motion.div>
    );
  }

  return (
    <div className="loader-container">
      <div className={`loader-spinner ${sizeClass}`} />
      <motion.span
        className="loader-text"
        key={label}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.span>
    </div>
  );
}

export default Loader;

