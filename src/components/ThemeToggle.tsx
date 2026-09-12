import type { ThemeMode } from '../theme'

type ThemeToggleProps = {
  mode: ThemeMode
  onChange: (mode: ThemeMode) => void
}

function ThemeToggle({ mode, onChange }: ThemeToggleProps) {
  const nextMode = mode === 'dark' ? 'light' : 'dark'

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-pressed={mode === 'dark'}
      aria-label={`Switch to ${nextMode} mode`}
      title={`Switch to ${nextMode} mode`}
      onClick={() => onChange(nextMode)}
    >
      <span aria-hidden="true">{mode === 'dark' ? '☀' : '☾'}</span>
      <span>{nextMode === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  )
}

export default ThemeToggle
