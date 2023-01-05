import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'
import renderer from 'react-test-renderer'

test('renders learn text', () => {
  const tree = renderer
    .create(
      <Router>
        <App />
      </Router>,
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
