import { useState, useEffect } from "react"

import { Loader, Card, FormField } from '../components'

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />)
  }

  return (
    <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">{title}</h2>
  )
}

export function Home() {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedResults, setSearchedResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const result = await response.json();

          setAllPosts(result.data.reverse());
        }
      } catch (error) {
        alert(error)
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  function handleSearchChange(e) {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResults = allPosts.filter((post) => post.name.toLowerCase().includes(searchText.toLowerCase()) || post.prompt.toLowerCase().includes(searchText.toLowerCase()));

        setSearchedResults(searchResults);
      }, 500)
    );
  }

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">The Community Showcase</h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">Browse through a collection of imaginative and visually stunning images generated by DALL-E AI</p>

      </div>

      <div className="mt-16">
        <FormField labelName='Search posts' type='text' name='text' placeholder='Author / Prompt' value={searchText} handleChange={handleSearchChange} />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">Showing results for <span className="text-[#222328]">{searchText}</span></h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards
                  data={searchedResults}
                  title='No results found'
                />
              ) : (
                <RenderCards
                  data={allPosts}
                  title='No posts founds'
                />
              )}
            </div>
          </>
        )}
      </div>
      <div className="flex my-5 justify-center items-center">
        <svg height="28" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="28" data-view-component="true" class="octicon octicon-mark-github v-align-middle">
          <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
        <a className="px-2 hover:text-[#252525]" href="https://github.com/lucastrecente/dalle" target='_blank'>Github Repository</a>
      </div>
    </section>
  )
}