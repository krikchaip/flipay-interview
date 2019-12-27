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
})

describe('toNodeList', () => {})
