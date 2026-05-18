import React, { useEffect, useState } from 'react'
import { ArrowLeft,Rocket } from 'lucide-react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { serverUrl } from '../App';
function Dashboard() {
  const {userData} = useSelector((state) => state.user);
  const navigate = useNavigate();
    const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(()=>{
    const handleGetAllWebsites = async () => {
        setLoading(true);
      try {
                const response = await fetch(`${serverUrl}/api/website/get-all`, { credentials: 'include' });
                if (!response.ok) {
                    if (response.status === 401) {
                        setError('Unauthorized. Please sign in.');
                        setLoading(false);
                        return;
                    }
                    const text = await response.text().catch(() => null);
                    setError(text || `Request failed with status ${response.status}`);
                    setLoading(false);
                    return;
                }
                const data = await response.json();
                setWebsites((data && data.websites) || []);
                setLoading(false);
                console.log("Response from server:", data);
      }
      catch(error){
                console.error("Error fetching websites:", error);
                setLoading(false);
                setError(error?.message || "An error occurred while fetching websites.");
      }
    }
    handleGetAllWebsites();
},[]);
  return (

    <div className='min-h-screen bg-[#050505] text-white'>
        <div className='sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10'>
        <div className='max-w-7xl mx-auto px-6 py-4
        flex justify-between'>

            <div className='flex items-center gap-4'>
                <button className='p-2 rounded-lg hover:bg-white/10 transition' onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} />
                </button>
                <h1 className='text-lg font-semibold'>Dashboard</h1>

            </div>
            <button className='px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:scale-105 transition' onClick={() => navigate('/generate')}>
                + New Website
            </button>
        </div>
        <div className='max-w-7xl mx-auto px-6 py-10'>
            <motion.div
               initial={{opacity:0, y:20}}  
                animate={{opacity:1, y:0}}
                className="mb-10"
            >
                <p className='text-sm text-zinc-400 mb-1'>Welcome Back</p>
                <h1 className='text-3xl font-bold'>{userData.name}</h1>
            </motion.div>
           
           {loading && (
              <div className='mt-24 text-center text-zinc-400'>Loading...</div>
           )}
           {error && 
              !loading && (<div className='mt-24 text-center text-red-400'>{error}</div>
           )}

           {websites?.length ===0 &&
            <div className='mt-24 text-center text-zinc-400'>No websites found.</div>
            }

            {!loading && !error && (
                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {websites.map((website, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{delay: i*0.05}}
                        whileHover={{y: -6}}
                        className='rounded-2xl bg-white/5 border border-white/10
                        overflow-hidden hover:bg-white/10 transition flex flex-col cursor-pointer'
                    >
                        <div className='relative h-40 bg-black cursor-pointer'>
                            <iframe srcDoc={website.latestCode} className='absolute inset-0 w-[140%] h-[140%] scale-[0.72]
                            origin-top-left pointer-events-none bg-white'/>
                            <div className='absolute inset-0 bg-black/30'/>

                        </div>
                       <div className='p-5 flex flex-col gap-4 flex-1'>
                        <h3 className='text-base font-semibold line-clamp-2'>{website.title}</h3>
                        <p className='text-xs text-zinc-400'>Last updated: {new Date(website.updatedAt).toLocaleDateString()}</p>

                        {!website.deployed ?(
                            <button className='mt-auto flex items-center justify-center gap-2
                            px-4 py-2 rounded-xl texxt-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500
                            hover:scale-105 transition'>
                                <Rocket size={18}/>Deploy</button>
                        ):(<button className='mt-auto flex items-center justify-center gap-2
                            px-4 py-2 rounded-xl texxt-sm font-semibold bg-gradient-to-r from-green-500 to-teal-500
                            hover:scale-105 transition'>
                                <Share size={18}/>Share</button>)}

                         
                       </div>
                    </motion.div>
                ))}
                </div>
            )}

        </div>
    </div>
    </div>
  )
}

export default Dashboard