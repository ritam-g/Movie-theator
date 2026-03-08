/**
 * Skeleton Component
 * 
 * A loading placeholder component that displays a skeleton animation
 * while content is being fetched. This provides a better UX by showing
 * the layout structure before the actual content loads.
 * 
 * @param {Object} props - Component props
 * @param {number} props.count - Number of skeleton cards to display
 * @param {string} props.variant - Variant: 'card', 'text', 'circle'
 */
import { motion } from "framer-motion";

function Skeleton({ count = 8, variant = 'card' }) {
  // Animation variants for stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  // If variant is not card, render simple skeleton
  if (variant === 'text') {
    return (
      <motion.div
        className="skeleton-text"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      />
    );
  }

  if (variant === 'circle') {
    return (
      <motion.div
        className="skeleton-circle skeleton-circle-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      />
    );
  }

  // Default: card skeleton grid
  return (
    <div className="card-grid">
      {Array.from({ length: count }).map((_, index) => (
        <motion.article
          key={`skeleton-${index}`}
          className="skeleton-card"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="skeleton-poster" />
          <div className="skeleton-body">
            <div className="skeleton-title" />
            <div className="skeleton-meta" />
            <div className="skeleton-meta" />
          </div>
        </motion.article>
      ))}
    </div>
  );
}

export default Skeleton;

