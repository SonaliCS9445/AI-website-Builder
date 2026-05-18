import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { Code2, Monitor,Rocket, Send, X } from 'lucide-react'
import useGetCurrentUser from '../hooks/useGetCurrentUser'
import { AnimatePresence,motion } from 'motion/react'
import Editor from '@monaco-editor/react'
import { MessageSquare } from 'lucide-react'


// Basic HTML formatter to make single-line/minified HTML readable in the editor.
function formatHTML(html) {
  if (!html || typeof html !== 'string') return html || ''
  // First, format contents of <style> and <script> blocks to preserve inner structure
  const formatCSS = (css) => {
    if (!css) return ''
    let out = css.trim()
    out = out.replace(/\r\n|\r/g, '\n')
    out = out.replace(/\s*{\s*/g, ' {\n')
    out = out.replace(/\s*}\s*/g, '\n}\n')
    out = out.replace(/;\s*/g, ';\n')
    const lines = out.split('\n')
    let indent = 0
    return lines
      .map((ln) => {
        const t = ln.trim()
        if (t.endsWith('}')) indent = Math.max(indent - 1, 0)
        const ind = '  '.repeat(indent) + t
        if (t.endsWith('{')) indent += 1
        return ind
      })
      .filter((l) => l !== '')
      .join('\n')
  }

  const formatJS = (js) => {
    if (!js) return ''
    let out = js.trim()
    out = out.replace(/\r\n|\r/g, '\n')
    out = out.replace(/;\s*/g, ';\n')
    out = out.replace(/\s*{\s*/g, ' {\n')
    out = out.replace(/\s*}\s*/g, '\n}\n')
    const lines = out.split('\n')
    let indent = 0
    return lines
      .map((ln) => {
        const t = ln.trim()
        if (t.endsWith('}')) indent = Math.max(indent - 1, 0)
        const ind = '  '.repeat(indent) + t
        if (t.endsWith('{')) indent += 1
        return ind
      })
      .filter((l) => l !== '')
      .join('\n')
  }

  // replace style blocks
  html = html.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (m, inner) => {
    return `<style>\n${formatCSS(inner)}\n</style>`
  })
  // replace script blocks
  html = html.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, (m, inner) => {
    return `<script>\n${formatJS(inner)}\n</script>`
  })

  // Collapse multiple spaces between tags, then add newlines between tags
  let s = html.replace(/>\s+</g, '><')
  s = s.replace(/></g, '>\n<')
  const lines = s.split('\n')
  let indent = 0
  const out = lines.map((line) => {
    const trimmed = line.trim()
    if (trimmed.match(/^<\//)) {
      indent = Math.max(indent - 1, 0)
    }
    const indented = '  '.repeat(indent) + trimmed
    if (
      trimmed.match(/^<[^\/!][^>]*>$/) && // opening tag (not self-closing or comment)
      !trimmed.match(/<.*<.*/)
    ) {
      if (!trimmed.endsWith('/>') && !trimmed.startsWith('<!')) {
        indent += 1
      }
    }
    return indented
  })
  return out.join('\n')
}


function WebsiteEditor() {
  const { id } = useParams()
  const [website, setWebsite] = useState(null)
  const [error, setError] = useState(null)
  const iframeRef = useRef(null)
  const [code,setCode] = useState("");
  const [prompt,setPrompt] = useState("");
  const [messages,setMessages] = useState([]);
  const [updateLoading,setUpdateLoading] = useState(false);
  const [thinkingIndex,setThinkingIndex] = useState(0);
  const [showCode,setShowCode] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false)
  const [showMessages, setShowMessages] = useState(false)

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
          setCode(formatHTML(res.data.code));
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
        setCode(formatHTML(result.data.website.latestCode));
        setMessages(result.data.website.conversation || []);
      } catch (err) {
        console.error('Error fetching website data:', err)
        setError(err.response?.data?.message || err.message || 'Error fetching website')
      }
    }

    if (id) handleGetWebsite()
  }, [id])

  // Auto-format code when opening the code panel
  useEffect(() => {
    if (showCode) {
      setCode((c) => formatHTML(c))
    }
  }, [showCode])

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
        <Header title={website.title || website.name} 
         onclose={()=>setShowMessages(false)}/>
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

            <button className='p-2 lg:hidden' onClick={() => setShowMessages(!showMessages)}>
              <MessageSquare size={18} />
            </button>
            <button className='p-2' onClick={() => setShowCode(!showCode)}>
              <Code2 size={18} />
            </button>
            <button className='p-2' onClick={()=>setShowFullPreview(true)}><Monitor size={18} /></button>
         </div>
       </div>
        <iframe ref={iframeRef} title="Preview" srcDoc={website.latestCode} className="w-full h-full bg-white z-0" />
      </div>

      <AnimatePresence>
        {          showMessages && (
            <motion.div
              initial={{y: "100%"}}

              animate={{y: 0}}
              exit={{y: "100%"}}
              className='fixed inset-0 z-[9999]
               bg-black/80 flex flex-col' >
                <Header title={website.title || website.name} onclose={() => setShowMessages(false)} />

             
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

               </motion.div>)}
      </AnimatePresence>

       <AnimatePresence>
      {showCode && (
        <motion.div
        initial={{x:"100%"}}
        animate={{x:0}}
        exit={{x:"100%"}}
          className="fixed inset-y-0 right-0 top-0 bottom-0 w-full lg:w-[45%] z-[9999] bg-[#1e1e1e]
        flex flex-col">
          <div className='h-12 px-4 flex justify-between items-center border-b
          border-white/10 bg-[#1e1e1e]'>
            <span className='text-sm font-medium'>index.html</span>
            <div className='flex items-center gap-2'>
              <button className='px-2 py-1 text-sm rounded border border-white/10' onClick={() => setCode(formatHTML(code))}>Format</button>
              <button onClick={() => setShowCode(false)}><X/></button>
            </div>
          </div>

          <Editor
              height="calc(100vh - 48px)"
            defaultLanguage="html"
            theme='vs-dark'
            value={code}
            onChange={(v)=>setCode(v)}
          />

        </motion.div>
      )}
       </AnimatePresence>

       <AnimatePresence>
        {
          showFullPreview && (
            <motion.div
              className='fixed inset-0 z-[9999] bg-black'
            >
              <iframe className='w-full h-full bg-white' srcDoc={website.latestCode}/>
              <button onClick={() => setShowFullPreview(false)} className='absolute top-4 right-4
              p-2 bg-black/70 rounded-lg' ><X/></button>
            </motion.div>
          )
        }
       </AnimatePresence>
    </div>
  )
}

function Header({ title, onclose }) {
  return (
    <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
      <span className="font-semibold truncate">{title}</span>
      {onclose && (
        <button onClick={onclose} className="p-2 text-white/70 hover:bg-white/20">
          <X size={18} />
        </button>
      )}
    </div>
  )
}


export default WebsiteEditor
