import React, { useState, useEffect } from 'react'

import parser from 'lib/tree-parser'

const App: React.FC = () => {
  const [raw, setRaw] = useState('')
  const [code, setCode] = useState('')

  useEffect(() => {
    if (!raw) return setCode('')

    const treeByLevel = parser.fromString(raw)

    if (treeByLevel) {
      const tree = parser.toNodeList(treeByLevel)
      return setCode(JSON.stringify(tree, null, 2))
    }

    return setCode('Sorry, Wrong format!!')
  }, [raw])

  return (
    <div className="App">
      <textarea
        data-testid="input"
        className="App__Textfield"
        spellCheck={false}
        value={raw}
        onChange={e => setRaw(e.target.value)}
      ></textarea>
      <div className="App__Textfield">
        <pre data-testid="output" style={{ font: 'inherit' }}>
          {code}
        </pre>
      </div>
    </div>
  )
}

export default App
