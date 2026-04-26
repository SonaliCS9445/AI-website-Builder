import React from 'react'
import {AnimatePresence, easeOut, motion} from "motion/react"
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from '../firebase';
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';


const LoginModal = ({open, setOpen}) => {
    const dispatch = useDispatch();
    const handleGoogleAuth =async () => {
        // Implement Google login logic here
        try{
            const result = await signInWithPopup(auth, provider);
            const {data} = await axios.post(`${serverUrl}/api/auth/google`,{
                name: result.user.displayName,
                email: result.user.email,
                avtar: result.user.photoURL
            },{withCredentials:true});
           
                dispatch(setUserData(data.user));
             setOpen(false);
        }catch(error){
            console.error("Google authentication failed", error);
        }
    }
  return (
    <AnimatePresence>
        {open && (
            <motion.div
            className='fixed inset-0 z-50 flex items-center justify-center  bg-black/80 
            backdrop-blur-xl px-4'
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            onClick={()=>setOpen(false)}
            >
                <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{scale:0.8,opacity:0, y:60}} 
                animate={{scale:1,opacity:1,y:0}}
                exit={{scale:0.9,opacity:0,y:40}}
                transition={{duration:0.4, ease:easeOut}}
                className='relative w-full max-w-md p-[1px] rounded-3xl
                bg-gradient-to-br from-purple-500/40 via-blue-500/30 to-transparent' >

                
               
                <div className='relative rounded-3xl bg-[#0b0b0b] border-white/10
                shadow-[0_30px_120px_rgba(0,0,0,0.8)] overflow-hidden'>
                    <motion.div
                    animate={{opacity:[0.25,0.4,0.25]}}
                    transition={{duration:6, repeat:Infinity}}
                    className='absolute -top-32 -left-32 w-80 h-80 bg-purple-500/30 blur-[140px]'
                    />

                     <motion.div
                    animate={{opacity:[0.2,0.35,0.2]}}
                    transition={{duration:2, repeat:Infinity,delay:2}}
                    className='absolute -bottom-32 -right-32 w-80 h-80 bg-purple-500/25 blur-[140px]'
                    />
                    
                    <button
                    className='absolute top-5 right-5 z-20 text-zinc-400 hover:text-white
                    transition text-lg'
                        onClick={()=>setOpen(false)}>
                         X
                    </button>

                    <div className='relative px-8 pt-14 pb-10 text-center'>
                        <h1 className='inline-block mb-6 px-4 py-1.5 rounded-full bg-white/5
                        border border-white/10 text-xs text-zinc-300'>AI powered website builder
                        </h1>
                        <h2 className='text-3xl font-semibold leading-tight mb-3 space-x-2'>
                            <span>Welcome to</span>
                            <span className='bg-linear-to-r from-purple-400 to-blue-400
                            bg-clip-text text-transparent'>GenWeb.ai</span>
                        </h2>

                        <motion.button
                        whileHover={{scale:1.05}}
                        whileTap={{scale:0.96}}
                        onClick={handleGoogleAuth}
                        className='group relative w-full h-13 rounded-xl bg-white
                        text-black font-semibold shadow-xl overflow-hidden'>
                            <img src="https://www.svgrepo.com/show/223041/google.svg" alt="Google" className='w-5 h-5 inline mr-2'/>
                            <span className='text-sm'>Continue with Google</span>
                        </motion.button>

                        <div className='flex items-center gap-4 my-10'>
                            <div className='h-px flex-1 bg-white/10'/>
                            <span className='text-xs text-zinc-500 tracking-wide'>Secure Login</span>
                            <div className='h-px flex-1 bg-white/10 '/>
                        </div>

                        <p className='text-xs text-zinc-500 leading-relaxed'>
                            By continuing, you agree to our{" "}
                             <span className='underline cursor-pointer hover:text-zinc-300'>Terms of Service</span>{" "}
                             and <span className='underline cursor-pointer hover:text-zinc-300'>Privacy Policy</span>.
                        </p>

                    </div>

                </div>
               
            </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
  )
}

export default LoginModal