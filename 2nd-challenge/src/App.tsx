import React, { useState } from 'react'

import parser from 'lib/tree-parser'

const App: React.FC = () => {
  const [code, setCode] = useState('')
  return (
    <div className="App">
      <textarea
        className="App__Textfield"
        spellCheck={false}
        value={code}
        onChange={e => setCode(e.target.value)}
      ></textarea>
      <div className="App__Textfield">
        <pre style={{ font: 'inherit' }}>{code}</pre>
      </div>
    </div>
  )
}

export default App
