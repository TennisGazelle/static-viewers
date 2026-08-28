import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import OppenheimerPlotMap from './pages/OppenheimerPlotMap'
import StarWarsMusicalThemes from './pages/StarWarsMusicalThemes'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/star-wars-musical-themes"
        element={<StarWarsMusicalThemes />}
      />
      <Route path="/oppenheimer-plot-map" element={<OppenheimerPlotMap />} />
    </Routes>
  )
}

export default App
