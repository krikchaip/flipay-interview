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
  return []
}

export default {
  fromString,
  toNodeList
}
