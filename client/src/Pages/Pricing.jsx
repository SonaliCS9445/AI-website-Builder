import axios from 'axios';
import { ArrowLeft, Check, Coins } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';


const pricingPlans = [
  {
    name: "Free",
    key: "free",
    description: "Perfect for trying out the platform with basic features.",
    price: 0,
    credits: 100,
    features: [
      "5 AI website generations",
      "Basic templates",
      "Limited customization",
      "Community support",
      "Subdomain hosting"
    ],
   
    button:  "Get Started",
    popular: false
  },
  {
    name: "Basic",
    key: "basic",
    description: "Great for individuals building personal or small projects.",
    price: "Rs49",
    credits: 500,
    features: [
      "50 AI website generations",
      "All basic templates",
      "Advanced customization",
      "Email support",
      "Custom domain support"
    ],

    button: "Upgrade to Basic",
    popular: true
  },
  {
    name: "Pro",
    key: "pro",
    description: "Best for professionals and businesses needing full power.",
    price: "Rs200",
    credits: 2000,
    features: [
      "200 AI website generations",
      "Premium templates",
      "Full customization access",
      "Priority support",
      "Custom domain + hosting",
      "Faster AI generation",
      "Export code"
    ],
    button: "Go Pro",
    popular: false
  }
];

function Pricing() {
    const navigate=useNavigate()
    const {userData} = useSelector(state=>state.user)
    const [loading,setLoading]=useState(null)
    const handleBuy=async (planKey) =>{
      if(!userData){
        navigate("/")
        return
      }
      if(planKey=="free"){
        navigate("/dashboard")
        return
      }
      setLoading(planKey)
      try{
        const result=await axios.post(`${serverUrl}/api/billing`,
            {planType:planKey},{withCredentials:true})
            window.location.href=(result.data.sessionUrl)    
      }catch(error){
        console.log(error)
        setLoading(null)
      }
    }
  return (
    <div className='relative min-h-screen overflow-hidden bg-[#050505] text-white
    px-6 pt-16 pb-24'>

        <div className='absolute inset-0 pointer-events-none'>
            <div className='absolute -top-40 -left-40 w-[500px] h-[500px]
            bg-indigo-600/20 rounded-full blur-[120px]'/>
            <div className='absolute bottom-0 right-0 w-[500px] h-[500px]
            bg-purple-600/20 rounded-full blur-[120px]'/>
        </div>

        <button className='relative z-10 mb-8 flex items-center gap-2 text-sm  text-zinc-400
        hover:text-white transition' onClick={()=>navigate("/")}>
            <ArrowLeft size={16}/>
            Back
        </button>
      <motion.div
      initial={{opacity:0, y:24}}
       animate={{opacity: 1, y:0}}
       className='relative z-10 max-w-4xl mx-auto text-center mb-14'
       >
        <h1 className='text-4xl md:text-5xl font-bold mb-4'>
            Simple, Transparent Pricing
        </h1>
        <p className='text-zinc-400 text-lg'>
            Buy credits once, Build anytime.
        </p>
      </motion.div>

      <div className='relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3
      gap-8'>
      {
        pricingPlans.map((p,i) =>(
            <motion.div
             key={i}
             initial={{opacity:0, y:40}}
             whileInView={{opacity:1, y:0}}
             transition={{delay: i*0.12}}
             whileHover={{y:-14,scale:1.03}}
             className={`relative rounded-3xl p-8 border backdrop-blur-xl transition-all
                ${
                    p.popular 
                    ? "border-indigo-500 bg-gradient-to-b from-indigo-500/20 to-transparent shadow-2xl shadow-indigo-500/30"
                    :"border-white/10 bg-white/5 hover:border-indigo-400 hover:bg-white/10"
                }`}
            >

                {p.popular && (
                    <span className='absolute top-5 right-5 px-3 py-1 text-xs rounded-full
                    bg-indigo-500'>Most Popular</span>
                )}

                <h1 className='text-xl font-semibold mb-2'>{p.name}</h1>
                <p className='text-zinc-400  text-sm mb-6'>{p.description}</p>

                <div>
                    <span className='text-4xl font-bold'>{p.price}</span>
                    <span className='text-sm text-zinc-400 mb-1'>/one-time</span>
                </div>

                <div>
                    <Coins size={18} className='text-yellow-400'/>
                    <span className='font-semibold'>{p.credits}</span>
                </div>

                <ul>
                    {p.features.map((f)=>(
                        <li
                        key={f}
                        className='flex items-center gap-2 text-sm text-zinc-400'
                        >
                            <Check size={16} className='text-green-400'/>
                            {f}
                        </li>

                    ))}
                </ul>
                
                <motion.button
                   whileTap={{scale: 0.96}}
                   disabled={loading}
                   onClick={()=>handleBuy(p.key)}
                   className={`w-full py-3 mt-10 rounded-xl font-semibold transition
                    ${p.popular
                        ?"bg-indigo-500 hover:bg-indigo-600"
                        :"bg-white/10 hover:bg-white/20"
                    } disabled:opacity-60`}
                >
                    {loading===p.key?"Redirecting...":p.button}

                </motion.button>


            </motion.div>
        ))
      }


      </div>
    </div>
  )
}

export default Pricing