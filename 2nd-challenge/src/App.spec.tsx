import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import App from './App'

it('render without crashing', () => {
  render(<App />)
})

it('empty output when no input', () => {
  const { getByTestId } = render(<App />)
  fireEvent.change(getByTestId('input'), { target: { value: '' } })
  expect(getByTestId('output')).toBeEmpty()
})
