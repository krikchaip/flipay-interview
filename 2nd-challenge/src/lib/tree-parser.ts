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
    // ref: https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
    return (
      Object.keys(tree).length !== 0 &&
      tree.constructor === Object &&
      Object.entries<Node[]>(tree).every(([level, nodes]) =>
        nodes.every(n => Number(level) === n.level)
      )
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

  let tree: Tree = asEntriesSorted[0][1]

  let treePointer: Tree = tree
  let idIdxMap: { [id: string]: number } = Object.fromEntries(
    tree.map((n, idx) => [n.id, idx])
  )

  asEntriesSorted.slice(1).forEach(([, nodes]) => {
    nodes.forEach(n => {
      treePointer[idIdxMap[n.parent_id!]].children.push(n)
    })

    treePointer = nodes
    idIdxMap = Object.fromEntries(nodes.map((n, idx) => [n.id, idx]))
  })

  return tree
}

export default {
  fromString,
  toNodeList
}
