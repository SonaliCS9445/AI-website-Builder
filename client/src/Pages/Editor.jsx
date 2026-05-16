import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { Code2, Monitor,Rocket, Send } from 'lucide-react'
import useGetCurrentUser from '../hooks/useGetCurrentUser'


function Editor() {
  const { id } = useParams()
  const [website, setWebsite] = useState(null)
  const [error, setError] = useState(null)
  const iframeRef = useRef(null)
  const [code,setCode] = useState("");
  const [prompt,setPrompt] = useState("");
  const [messages,setMessages] = useState([]);
  const [updateLoading,setUpdateLoading] = useState(false);
  const [thinkingIndex,setThinkingIndex] = useState(0);
  const thinkingSteps = [
    "Analyzing your request...",
    "Designing the layout...",
    "Choosing color schemes...",
    "Finalizing updates..."
  ]

  const handleUpdate=async () =>{
    if(!prompt || !prompt.trim()) return;
    setUpdateLoading(true);
    const text = prompt
    setPrompt("");
    console.log('handleUpdate called, id:', id, 'prompt length:', String(prompt).length);
    setMessages((m)=>[...m,{role:"user",content:prompt}]);
    try {
      const res = await axios.post(`${serverUrl}/api/website/update/${id}`,{
       prompt:text
      },{withCredentials:true})
      console.log(res);
      setUpdateLoading(false);
      setMessages((m)=>[...m,{role:"ai",content:res.data.message}]);
      setCode(res.data.code);
    }catch (err) {
      console.error("Failed to update website", err);
      setUpdateLoading(false);
    }
  }

  useEffect(() => {
    const i = setInterval(() => {
      setThinkingIndex((i)=>(i+1)%thinkingSteps.length)
  }, 1200)
},[updateLoading])

  useEffect(() => {
    const handleGetWebsite = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/website/get-by-id/${id}`, { withCredentials: true })
        setWebsite(result.data.website)
        setCode(result.data.website.latestCode);
        setMessages(result.data.website.conversation || []);
      } catch (err) {
        console.error('Error fetching website data:', err)
        setError(err.response?.data?.message || err.message || 'Error fetching website')
      }
    }

    if (id) handleGetWebsite()
  }, [id])

  // iframe content is provided via `srcDoc` below; no extra effect needed


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050505] via-[#0b0b0b] to-[#1a1a1a] text-white">
        <h1 className="text-2xl font-semibold">{error}</h1>
      </div>
    )
  }

  if (!website) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">Loading....</div>
    )
  }

  return (
    <div className="h-screen w-screen flex bg-black text-white overflow-hidden">
      <aside className="hidden lg:flex w-[380px] flex-col border-r border-white/10 bg-black/80">
        <Header title={website.title || website.name} />
         <>
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {messages.map((m, i) => (
        <div key={i} className={`max-w-[85%] ${m.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
          <div
            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user' ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-zinc-200'
            }`}
          >
            {m.content}
          </div>
        </div>
      ))}

      {updateLoading && (
        <div className='max-w-[85%] mr-auto'>
            <div className='px-4 py-2.5 rounded-2xl text-xs bg-white/5 border
            border-white/10 text-zinc-400 italic'>{thinkingSteps[thinkingIndex]}</div>

        </div>
      )}

    </div>
     <div className='p-3 border-t border-white/10'>
        <div className='flex gap-2'>
            <input  placeholder="Type your message..." className='flex-1 resize-none
            rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-sm outline-none'
            onChange={(e)=>setPrompt(e.target.value)} value={prompt} />
            <button type="button" className='px-4 py-3 rounded-2xl bg-white text-black' disabled={updateLoading} onClick={handleUpdate}><Send size={14}/></button>
        </div>

     </div>
    </>
      </aside>
      <div className="flex-1 flex flex-col">

         <div className='h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80'>
         <span className='text-xs text-zinc-400'> Live Preview</span>

         <div className='flex gap-2'>
            <button className='flex items-center gap-2 px-4 py-1.5 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-sm text-white hover:scale-105 transition'><Rocket size={14} />Deploy</button>
            <button className='p-2'><Code2 size={18} /></button>
            <button className='p-2'><Monitor size={18} /></button>
         </div>
       </div>
        <iframe ref={iframeRef} title="Preview" srcDoc={website.latestCode} className="w-full h-full bg-white" />
      </div>
    </div>
  )
}

function Header({ title }) {
  return (
    <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
      <span className="font-semibold truncate">{title}</span>
    </div>
  )
}


export default Editor
