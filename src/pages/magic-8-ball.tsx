import React, { useEffect, useState } from 'react'

const Magic8Ball = () => {
  const [html, setHtml] = useState("");
  const [value, setValue] = useState("");
  useEffect(() => {
    getResponse("GET");
  }, []);

  const getResponse = async (method: string) => {
    setHtml("");
    const res = await fetch(`/api/magic-8-ball`, {
      method: method
    })

    const text = await res.text();
    setValue("");
    setHtml(text);
  }
  return (
    <div className="bg-white">
      <div className="h-screen w-screen flex flex-col justify-center align-center items-center">
        <div>
          {
            html ?
              <div dangerouslySetInnerHTML={{ __html: html }} /> :
              <h4 className="text-black text-2xl">Loading...</h4>
          }
          <div className="text-center w-3/4 m-auto mt-4">
            <div>
              <input className="text-black rounded-sm p-2 border border-dark-900" type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Ask your question" />
            </div>
            <div className="mt-2">
              <button className="border border-dark-900 text-white rounded-md px-4 py-2 text-black" onClick={() => getResponse("POST")}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Magic8Ball