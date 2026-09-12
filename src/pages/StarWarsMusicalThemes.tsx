import { Link } from 'react-router-dom'
import StarWarsGraph from '../components/StarWarsGraph'

function StarWarsMusicalThemes() {
  return (
    <main className="star-wars-page">
      <header className="star-wars-hero">
        <Link className="back-link" to="/">&larr; Static viewers</Link>
        <p className="eyebrow">Frank Lehman’s thematic catalogue · 2023 edition</p>
        <h1>The musical galaxy, connected</h1>
        <p className="star-wars-deck">
          Explore how films, leitmotifs, component ideas, set pieces, narrative subjects,
          and analytical relationships orbit one another across the Star Wars scores.
          Census links grow with the number of statements heard in each film.
        </p>
      </header>
      <StarWarsGraph />
    </main>
  )
}

export default StarWarsMusicalThemes
