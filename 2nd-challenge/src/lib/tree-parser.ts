export type Node = {
  id: number
  title: string
  level: number
  children: Node[]
  parent_id: number | null
}

export type Tree = Node[]

export type TreeByLevel = {
  [level: string]: Node[]
}

// validator function
function isTreeByLevel(tree: any): tree is TreeByLevel {
  try {
    return Object.entries<Node[]>(tree).every(([level, nodes]) =>
      nodes.every(n => Number(level) === n.level)
    )
  } catch {
    return false
  }
}

function fromString(str: string): TreeByLevel | null {
  try {
    const treeByLevel = JSON.parse(str)

    // validation
    if (typeof treeByLevel === 'boolean') return null
    if (typeof treeByLevel === 'number') return null
    if (!isTreeByLevel(treeByLevel)) return null

    return treeByLevel as TreeByLevel
  } catch {
    return null
  }
}

function toNodeList(byLevel: TreeByLevel): Tree {
  const asEntriesSorted = Object.entries(byLevel).sort(
    ([levelA], [levelB]) => Number(levelA) - Number(levelB)
  )

  console.log(JSON.stringify(asEntriesSorted, null, 2))

  let result: Tree = []
  let idIdxMap: { [id: string]: number } = {}

  asEntriesSorted.forEach(([level, nodes]) => {
    const lv = Number(level)

    if (lv === 0) {
      result = nodes
      idIdxMap = Object.fromEntries(nodes.map((n, idx) => [n.id, idx]))
      return
    }

    nodes.forEach(n => {
      result[idIdxMap[n.parent_id!]].children.push(n)
    })
  })

  console.log(JSON.stringify(result, null, 2))

  return result
}

export default {
  fromString,
  toNodeList
}
