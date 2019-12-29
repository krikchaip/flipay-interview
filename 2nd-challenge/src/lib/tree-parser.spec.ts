import parser, { TreeByLevel, Tree } from './tree-parser'

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

    const tree: TreeByLevel = {
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

    expect(parser.fromString(correctInput)).toEqual(tree)
  })

  describe('return null when', () => {
    // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
    it('passing JSON primitives', () => {
      expect(parser.fromString('null')).toBeNull()
      expect(parser.fromString('undefined')).toBeNull()
      expect(parser.fromString('false')).toBeNull()
      expect(parser.fromString('123')).toBeNull()
      expect(parser.fromString('"wow"')).toBeNull()
      expect(parser.fromString('{ "a": 3 }')).toBeNull()
      expect(parser.fromString('["a", "b", "c"]')).toBeNull()
    })

    it('node.level not matching its group', () => {
      const notMatching = `{
        "0": [
          {
            "id": 10,
            "title": "House",
            "level": 30,
            "children": [],
            "parent_id": null
          }
        ]
      }`

      expect(parser.fromString(notMatching)).toBeNull()
    })

    xit('some root level nodes containing a valid parent_id', () => {
      const validParent = `{
        "0": [
          {
            "id": 10,
            "title": "House",
            "level": 0,
            "children": [],
            "parent_id": 3
          },
          {
            "id": 20,
            "title": "Hotel",
            "level": 0,
            "children": [],
            "parent_id": 7
          },
          {
            "id": 30,
            "title": "Apartment",
            "level": 0,
            "children": [],
            "parent_id": null
          }
        ]
      }`

      expect(parser.fromString(validParent)).toBeNull()
    })

    xit('some nodes missing parent_id field', () => {
      const missingParent = `{
        "1": [
          {
            "id": 11,
            "title": "A",
            "level": 1,
            "children": [],
            "parent_id": null
          }
        ],
        "2": [
          {
            "id": 21,
            "title": "B",
            "level": 2,
            "children": [],
            "parent_id": 17
          },
          {
            "id": 22,
            "title": "C",
            "level": 2,
            "children": [],
            "parent_id": 17
          }
        ]
      }`

      expect(parser.fromString(missingParent)).toBeNull()
    })
  })
})

fdescribe('toNodeList', () => {
  it('node.children should be filled with its own children', () => {
    const data: TreeByLevel = {
      '0': [
        {
          id: 1,
          title: 'Root',
          level: 0,
          parent_id: null,
          children: []
        }
      ],
      '1': [
        {
          id: 10,
          title: 'Child1',
          level: 1,
          parent_id: 1,
          children: []
        },
        {
          id: 11,
          title: 'Child2',
          level: 1,
          parent_id: 1,
          children: []
        }
      ]
    }

    const filledWithOwnChildren: Tree = [
      {
        id: 1,
        title: 'Root',
        level: 0,
        parent_id: null,
        children: [
          {
            id: 10,
            title: 'Child1',
            level: 1,
            parent_id: 1,
            children: []
          },
          {
            id: 11,
            title: 'Child2',
            level: 1,
            parent_id: 1,
            children: []
          }
        ]
      }
    ]

    expect(parser.toNodeList(data)).toEqual<Tree>(filledWithOwnChildren)
  })
})
