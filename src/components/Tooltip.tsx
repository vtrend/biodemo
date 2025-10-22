interface TooltipProps {
  children: React.ReactNode;
  position: { top: number; left: number };
}

const Tooltip = ({ children, position }: TooltipProps) => {
  const hidden = position.top === 0 && position.left === 0 ? 'hidden' : '';

  return (
    <div
      className={`absolute bg-gray-800 text-white text-xs rounded p-2 pointer-events-none ${hidden}`}
      style={{ top: position.top, left: position.left }}
    >
      {children}
    </div>
  );
};

export default Tooltip;
