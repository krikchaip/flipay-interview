import React, { useEffect, useState } from 'react'
import Octokit from '@octokit/rest'

const DISPLAY_MAX = 10
const octokit = new Octokit({
  auth: process.env.REACT_APP_PAT,
  userAgent: 'flipay-interview'
})

type Repository = Pick<
  Octokit.ReposListPublicResponseItem,
  'id' | 'full_name' | 'html_url' | 'description'
>

const App: React.FC = () => {
  const [repos, setRepos] = useState<Repository[]>([])

  // paginate item display
  const [display, setDisplay] = useState({ from: 0, to: DISPLAY_MAX, page: 1 })

  // prevent user from spamming next button
  // while fetching new data
  const [disableNext, setDisableNext] = useState(false)

  // initial fetch
  useEffect(() => {
    ;(async () => {
      const { data: publicRepos } = await octokit.repos.listPublic()
      setRepos(
        publicRepos.map(({ id, full_name, html_url, description }) => ({
          id,
          full_name,
          html_url,
          description
        }))
      )
    })()
  }, [])

  function handlePrev() {
    if (display.from - DISPLAY_MAX < 0) return

    setDisplay(display => ({
      from: display.from - DISPLAY_MAX,
      to: display.to - DISPLAY_MAX,
      page: display.page - 1
    }))
  }

  async function handleNext() {
    if (display.from + DISPLAY_MAX > repos.length - 1) {
      setDisableNext(true)

      const { data: publicRepos } = await octokit.repos.listPublic({
        since: String(repos[repos.length - 1].id)
      })

      setDisableNext(false)

      setRepos(repos =>
        repos.concat(
          publicRepos.map(({ id, full_name, html_url, description }) => ({
            id,
            full_name,
            html_url,
            description
          }))
        )
      )
    }

    setDisplay(display => ({
      from: display.from + DISPLAY_MAX,
      to: display.to + DISPLAY_MAX,
      page: display.page + 1
    }))
  }

  return (
    <div>
      <button disabled={display.from === 0} onClick={handlePrev}>
        prev
      </button>
      <span>{display.page}</span>
      <button disabled={disableNext} onClick={handleNext}>
        next
      </button>
      <table>
        <thead>
          <tr>
            <th>Repository</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {repos.slice(display.from, display.to).map(rep => (
            <tr key={rep.id}>
              <td>
                <a
                  href={rep.html_url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {rep.full_name}
                </a>
              </td>
              <td>{rep.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
