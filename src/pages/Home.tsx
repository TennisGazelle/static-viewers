import { Link } from 'react-router-dom'

function Home() {
  return (
    <main>
      <h1>static-viewers</h1>
      <ul>
        <li>
          <Link to="/star-wars-musical-themes">Star Wars Musical Themes</Link>
        </li>
        <li>
          <Link to="/oppenheimer-plot-map">Oppenheimer Plot Map</Link>
        </li>
      </ul>
    </main>
  )
}

export default Home
