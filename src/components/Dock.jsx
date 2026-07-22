import { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import './Dock.css'

function DockItem({ children, className = '', onClick, mouseX, spring, distance, magnification, baseItemSize, label, current, testId }) {
  const ref = useRef(null)
  const isHovered = useMotionValue(0)
  const mouseDistance = useTransform(mouseX, (value) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseItemSize }
    return value - rect.x - rect.width / 2
  })
  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize])
  const size = useSpring(targetSize, spring)

  return (
    <motion.button
      ref={ref}
      type="button"
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`dock-item ${className}`}
      aria-label={label}
      aria-current={current ? 'page' : undefined}
      data-testid={testId}
    >
      {Children.map(children, (child) => cloneElement(child, { isHovered }))}
    </motion.button>
  )
}

function DockLabel({ children, isHovered }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => isHovered.on('change', (value) => setVisible(value === 1)), [isHovered])

  return (
    <AnimatePresence>
      {visible && (
        <motion.span
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -8 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.15 }}
          className="dock-label"
          role="tooltip"
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

function DockIcon({ children }) {
  return <span className="dock-icon">{children}</span>
}

export default function Dock({
  items,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 60,
  distance = 160,
  panelHeight = 62,
  dockHeight = 180,
  baseItemSize = 44,
}) {
  const mouseX = useMotionValue(Infinity)
  const isHovered = useMotionValue(0)
  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [dockHeight, magnification],
  )
  const targetHeight = useTransform(isHovered, [0, 1], [panelHeight, maxHeight])
  const height = useSpring(targetHeight, spring)

  return (
    <motion.div style={{ height }} className="dock-outer">
      <motion.nav
        onMouseMove={({ clientX }) => {
          isHovered.set(1)
          mouseX.set(clientX)
        }}
        onMouseLeave={() => {
          isHovered.set(0)
          mouseX.set(Infinity)
        }}
        className="dock-panel"
        style={{ height: panelHeight }}
        aria-label="Primary navigation"
      >
        {items.map((item) => (
          <DockItem
            key={item.label}
            {...item}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.nav>
    </motion.div>
  )
}
