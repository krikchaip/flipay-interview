import parser, { TreeByLevel } from './tree-parser'

describe('fromString', () => {
  it('return TreeByLevel with correct input', () => {
    const correctInput = `{
      "0": [
        {
          "id": 10,
          "title": "House",
          "level": 0,
          "children": [],
          "parent_id": null
        }
      ]
    }`

    const tree = {
      '0': [
        {
          id: 10,
          title: 'House',
          level: 0,
          children: [],
          parent_id: null
        }
      ]
    }

    expect(parser.fromString(correctInput)).toEqual<TreeByLevel>(tree)
  })

  describe('return null for any other input', () => {
    // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
    it('JSON primitives', () => {
      expect(parser.fromString('null')).toBeNull()
      expect(parser.fromString('undefined')).toBeNull()
      expect(parser.fromString('false')).toBeNull()
      expect(parser.fromString('123')).toBeNull()
      expect(parser.fromString('"wow"')).toBeNull()
      expect(parser.fromString('{ "a": 3 }')).toBeNull()
      expect(parser.fromString('["a", "b", "c"]')).toBeNull()
    })
  })
})

describe('toNodeList', () => {})
