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

describe('toNodeList', () => {
  describe('node.children should be filled with its own children', () => {
    it('1-level nested', () => {
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

    it('2-level nested', () => {
      const data: TreeByLevel = {
        '0': [
          {
            id: 10,
            title: 'House',
            level: 0,
            children: [],
            parent_id: null
          }
        ],
        '1': [
          {
            id: 12,
            title: 'Red Roof',
            level: 1,
            children: [],
            parent_id: 10
          },
          {
            id: 18,
            title: 'Blue Roof',
            level: 1,
            children: [],
            parent_id: 10
          },
          {
            id: 13,
            title: 'Wall',
            level: 1,
            children: [],
            parent_id: 10
          }
        ],
        '2': [
          {
            id: 17,
            title: 'Blue Window',
            level: 2,
            children: [],
            parent_id: 12
          },
          {
            id: 16,
            title: 'Door',
            level: 2,
            children: [],
            parent_id: 13
          },
          {
            id: 15,
            title: 'Red Window',
            level: 2,
            children: [],
            parent_id: 12
          }
        ]
      }

      const expected = [
        {
          id: 10,
          title: 'House',
          level: 0,
          children: [
            {
              id: 12,
              title: 'Red Roof',
              level: 1,
              children: [
                {
                  id: 17,
                  title: 'Blue Window',
                  level: 2,
                  children: [],
                  parent_id: 12
                },
                {
                  id: 15,
                  title: 'Red Window',
                  level: 2,
                  children: [],
                  parent_id: 12
                }
              ],
              parent_id: 10
            },
            {
              id: 18,
              title: 'Blue Roof',
              level: 1,
              children: [],
              parent_id: 10
            },
            {
              id: 13,
              title: 'Wall',
              level: 1,
              children: [
                {
                  id: 16,
                  title: 'Door',
                  level: 2,
                  children: [],
                  parent_id: 13
                }
              ],
              parent_id: 10
            }
          ],
          parent_id: null
        }
      ]

      expect(parser.toNodeList(data)).toEqual(expected)
    })

    it('n-level nested', () => {
      const data: TreeByLevel = {
        '0': [
          {
            id: 0,
            title: 'Root',
            level: 0,
            children: [],
            parent_id: null
          }
        ],
        '1': [
          {
            id: 10,
            title: 'Level1-0',
            level: 1,
            children: [],
            parent_id: 0
          },
          {
            id: 11,
            title: 'Level1-1',
            level: 1,
            children: [],
            parent_id: 0
          }
        ],
        '2': [
          {
            id: 20,
            title: 'Level2-0',
            level: 2,
            children: [],
            parent_id: 10
          },
          {
            id: 21,
            title: 'Level2-1',
            level: 2,
            children: [],
            parent_id: 10
          },
          {
            id: 22,
            title: 'Level2-2',
            level: 2,
            children: [],
            parent_id: 11
          }
        ],
        '3': [
          {
            id: 30,
            title: 'Level3-0',
            level: 3,
            children: [],
            parent_id: 22
          }
        ]
      }

      const expected: Tree = [
        {
          id: 0,
          title: 'Root',
          level: 0,
          children: [
            {
              id: 10,
              title: 'Level1-0',
              level: 1,
              children: [
                {
                  id: 20,
                  title: 'Level2-0',
                  level: 2,
                  children: [],
                  parent_id: 10
                },
                {
                  id: 21,
                  title: 'Level2-1',
                  level: 2,
                  children: [],
                  parent_id: 10
                }
              ],
              parent_id: 0
            },
            {
              id: 11,
              title: 'Level1-1',
              level: 1,
              children: [
                {
                  id: 22,
                  title: 'Level2-2',
                  level: 2,
                  children: [
                    {
                      id: 30,
                      title: 'Level3-0',
                      level: 3,
                      children: [],
                      parent_id: 22
                    }
                  ],
                  parent_id: 11
                }
              ],
              parent_id: 0
            }
          ],
          parent_id: null
        }
      ]

      expect(parser.toNodeList(data)).toEqual(expected)
    })

    it('multiple roots', () => {
      const data: TreeByLevel = {
        '0': [
          {
            id: 0,
            title: 'Root0',
            level: 0,
            children: [],
            parent_id: null
          },
          {
            id: 1,
            title: 'Root1',
            level: 0,
            children: [],
            parent_id: null
          }
        ],
        '1': [
          {
            id: 10,
            title: 'Level1-0',
            level: 1,
            children: [],
            parent_id: 0
          },
          {
            id: 11,
            title: 'Level1-1',
            level: 0,
            children: [],
            parent_id: 0
          }
        ]
      }

      const expected: Tree = [
        {
          id: 0,
          title: 'Root0',
          level: 0,
          children: [
            {
              id: 10,
              title: 'Level1-0',
              level: 1,
              children: [],
              parent_id: 0
            },
            {
              id: 11,
              title: 'Level1-1',
              level: 0,
              children: [],
              parent_id: 0
            }
          ],
          parent_id: null
        },
        {
          id: 1,
          title: 'Root1',
          level: 0,
          children: [],
          parent_id: null
        }
      ]

      expect(parser.toNodeList(data)).toEqual(expected)
    })
  })
})
