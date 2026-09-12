import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import ThemeToggle from './components/ThemeToggle'
import Home from './pages/Home'
import OppenheimerPlotMap from './pages/OppenheimerPlotMap'
import StarWarsMusicalThemes from './pages/StarWarsMusicalThemes'
import { applyTheme, getInitialTheme, type ThemeMode } from './theme'

function App() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <>
      <ThemeToggle mode={theme} onChange={setTheme} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/star-wars-musical-themes"
          element={<StarWarsMusicalThemes />}
        />
        <Route
          path="/oppenheimer-plot-map"
          element={<OppenheimerPlotMap theme={theme} />}
        />
      </Routes>
    </>
  )
}

export default App
