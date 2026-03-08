/**
 * Loader Component
 * 
 * A simple loading indicator component that displays a message while content is loading.
 * Used throughout the application to show loading states.
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Message to display during loading
 */
function Loader({ label = "Loading..." }) {
  return (
    <div className="empty">
      {/* Display the loading message */}
      {label}
    </div>
  );
}

export default Loader;
