import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { easeIn, motion } from "motion/react";
import {useState} from 'react';
import axios from "axios";
import { serverUrl } from "../App";

import { useEffect } from "react";
const PHASES = [
  "Analyzing your ideas....",
  "Creating the structure of your website....",
  "Designing the layout and user interface....",
  "Adding content and features....",
  "Finalizing and optimizing your website....",
]

function Generate() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [loading,setLoading] = useState(false)
  const [progress,setProgress] = useState(0);
  const [phaseIndex,setPhaseIndex] = useState(0);
  const [error,setError] = useState("");
  const handleGenerateWebsite=async()=>{
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/website/generate`,{prompt},
      {withCredentials:true});
      console.log('generate result:', result?.data);
      const websiteId = result?.data?.websiteId || result?.data?.website?._id;
      if (!websiteId) {
        setLoading(false);
        setError(result?.data?.message || 'Unexpected server response');
        return;
      }
      setProgress(100);
      setLoading(false);
      navigate(`/editor/${websiteId}`);
    }catch (error) {
      console.error("Failed to generate website", error);
      setLoading(false);
      // Prefer server-provided message when available
      const serverMessage = error?.response?.data?.message;
      if (error?.response?.status === 401) {
        setError(serverMessage || 'Unauthorized. Please sign in.');
        // optionally redirect to login
        // navigate('/login');
        return;
      }
      if (error?.response?.status === 403) {
        setError(serverMessage || 'Forbidden. You may not have enough credits.');
        return;
      }
      setError(serverMessage || error.message || "Failed to generate website. Please try again.");
    }
  }

  useEffect(()=>{
    if(!loading){
      setProgress(0);
      setPhaseIndex(0);
      setError("");
      return;
    }

    let value = 0;
    let phase = 0;
    const interval = setInterval(()=>{
      const increment = value <20
                 ? Math.random() *1.5 
                 : value <60
                 ? Math.random() *0.5
                 : Math.random() *0.2;
      value = Math.min(value + increment, 100);
      setProgress(value);

      phase = Math.min(Math.floor(value / (100/PHASES.length)), PHASES.length -1);
      setPhaseIndex(phase);
  
    },1200);
    return () => clearInterval(interval);
  }
   ,[loading] )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0b0b0b] to-[#1a1a1a] text-white">
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div
          className="max-w-7xl mx-auto px-6 py-4
        flex justify-between"
        >
          <div className="flex items-center gap-4">
            <button
              className="p-2 rounded-lg hover:bg-white/10 transition"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-lg font-semibold">
              Builder<span className="text-zinc-400">.ai</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Build Your Stunning Website with{" "}
            <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Builder.ai
            </span>
          </h1>
          <p className=" text-zinc-400  max-w-2xl mx-auto">
            Create a beautiful website in minutes with our easy-to-use builder.
          </p>
        </motion.div>

        <div className="mb-14">
          <h1 className="text-xl font-semibold mb-2">Describe your idea</h1>
          <div className="relative">
            <textarea
      
              onChange={(e) => setPrompt(e.target.value)}
               value={prompt}
              name=""
              id=""
              placeholder="Describe your website idea..."
              className="w-full h-56 p-6 rounded-3xl bg-black/60 border border-white/10 placeholder:text-zinc-500 text-white outline-none resize-none text-sm leading-relaxed focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        {error && (
          <div className="mt-6 text-red-400 text-center text-sm">{error}</div>
         )}

        <div className="flex justify-center">
            <motion.button
                whileHover={{scale:1.05}}
                whileTap={{scale:0.95}}
       
              onClick={handleGenerateWebsite}
              disabled={!prompt.trim() || loading}
              className={`px-14 py-4 rounded-2xl font-semibold text-lg ${prompt.trim() && !loading ? 'bg-white text-black' : 'bg-white/20 text-zinc-400 cursor-not-allowed'}`}

            >
                Generate Website
            </motion.button>
            
        </div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-xl mx-auto mt-12"
          >
            <div className="flex justify-between mb-2 text-xs text-zinc-400">
              <span>{PHASES[phaseIndex]}</span>
              <span>{progress}%</span>
            </div>

            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-blue-500 to-purple-500"
                animate={{ width: `${progress}%` }}
                transition={{ease: "easeOut", duration: 0.8}}
              ></div>
            </div>

            <div className="text-center text-xs text-zinc-400 mt-4">
              Estimated time remaining:{" "}
              {Math.max(((100 - progress) / 100) * 60, 5).toFixed(0)} seconds
            </div>
          </motion.div>

          )}
      </div>
    </div>
  );
}

export default Generate;
