import React, { useState } from 'react'
import {useParams} from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'

function LiveSite  () {
  const {id}=useParams()
  const [html, setHtml]=useState("")
  const [error,setError]=useState("")

   useEffect(() => {
  const handleGetWebsite = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/website/get-by-slug/${id}`)

      setHtml(
        result.data.latestCode ||
        result.data.code ||
        result.data.website?.latestCode ||
        ""
      )

    } catch (err) {
      console.error('Error fetching website data:', err)
      setError("site not found")
    }
  }

  if (id) handleGetWebsite()
}, [id])

  if(error){
    return (
        <div className='h-screen flex items-center justify-center
        bg-black text-white'>
            {error}
        </div>
    )
  }

    return (
       <iframe
         title='Live Site'
         srcDoc={html}
         className='w-screen h-screen border-none'
         sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
       />
    )
}

export default LiveSite