import { render, screen } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import App from '../App'
import Table from './Table'

test('Renders correct Tree Component', () => {
  render(
    <Router>
      <App>
        <Table />
      </App>
    </Router>,
  )
 
})
