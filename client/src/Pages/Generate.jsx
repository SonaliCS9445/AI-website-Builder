import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

function Generate() {
  const navigate = useNavigate();
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
              name=""
              id=""
              placeholder="Describe your website idea..."
              className="w-full h-56 p-6 rounded-3xl bg-black/60 border border-white/10 placeholder:text-zinc-500 text-white outline-none resize-none text-sm leading-relaxed focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-center">
            <motion.button
                whileHover={{scale:1.05}}
                whileTap={{scale:0.95}}
                className='px-14 py-4 rounded-xl font-semibold text-lg bg-white text-black '
                onClick={() => alert('Website generation feature coming soon!')}
            >
                Generate Website
            </motion.button>
            
        </div>
      </div>
    </div>
  );
}

export default Generate;
