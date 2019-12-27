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

const fromString: (str: string) => TreeByLevel = (str: string) => {
  return JSON.parse(str)
}

const toNodeList = () => {}

export default {
  fromString,
  toNodeList
}
