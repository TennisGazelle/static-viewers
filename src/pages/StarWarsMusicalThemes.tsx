import { Link } from 'react-router-dom'
import StarWarsGraph from '../components/StarWarsGraph'

function StarWarsMusicalThemes() {
  return (
    <main>
      <p>
        <Link to="/">&larr; Home</Link>
      </p>
      <h1>Star Wars Musical Themes</h1>
      <StarWarsGraph />
    </main>
  )
}

export default StarWarsMusicalThemes
