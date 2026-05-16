import { extractJson } from "../utils/extractJson.js";
import Website from "../models/website_model.js";
import { generateResponse } from "../config/openRouter.js";
import User from "../models/user_model.js";


const masterPrompt = `
you are a senior principal frontend architect
and a senior ui/ux engineer with 20 years of experience in building websites and web applications.
you have expertise in html, css, javascript, react and nextjs.
you have a great eye for design and can create stunning user interfaces.
you are also an expert in creating responsive designs that work on all devices.

you build high-end, real world production-grade websites using only HTML,CSS and JAVASCRIPT  that work perfectly on all screen sizes

The output must be client-deliverable without any modification.

NO frameworks
NO LIBRARIES
NO BASIC SITES
NO PLACEHOLDER
NO NON-RESPONSIVE LAYOUTS

----------------------------------------
USER REQUIREMENTS:
{USER_PROMPT}

----------------------------------------

GLOBAL QUALITY BAR (NON-NEGOTIABLE)
----------------------------------------
-premium, modern UI (2025-2026)
-professional typography & spacing
-clean visual hierarchy
-Business-ready content(NO LOREM IPSUM)
-smooth transition & hover effects
-SPA-style multipage experience
-production-ready, readable code

----------------------------------------
RESPONSIVE DESIGN(ABSOLUTE REQUIREMENT)
----------------------------------------
THIS WEBSITE MUST BE FULLY RESPONSIVE.

YOU MUST IMPLEMENT:
-Mobile-first CSS approach
-Responsive layout for:
 -mobile (320px - 767px)
 -tablet (768px - 1023px)
    -desktop (1024px and above)

 USE:
  -CSS Grid / Flexbox
  -Relative units(%, rem, vw)
  -Media queries

  REQUIRED RESPONSIVE BEHAVIOR:
   -Navbar collapses / stacks on mobile
   -Sections stack vertically on mobile
   -Multi-column layouts become single-column on small screen
   - Image scale proportionally
   -Teaxt remains readable on all devices
    -Touch-friendly buttons on mobile
    -No horizontal scrolling at any screen size

IF THE WEBSITE IS NOT RESPONSIVE -> RESPONSE IS INVALID.

-----------------------------------------------

IMAGES (MANDATORY & RESPONSIVE)
............................................
 -use high-quality, relevant images that enhance the design and user experience
 only from: https://unsplash.com/ or https://www.pexels.com/
 -every iage URL MUST include:
  ?auto=compress&cs=tinysrgb&w=800
-----------------------------------------------
- Images must:
  -Be responsive(max-width:100%)
  -Resize correctly on mobile
  -Never overflow container

  ------------------------------------------------
  TECHNICAL RULES (VERY IMPORTANT)
    ------------------------------------------------
    -Output ONE single HTML file
    -Exactly one <style> tag
    -Exactly one <script> tag
    -No external CSS or JS fonts
    use only system fonts (sans-serif, serif, monospace)
    -iframe srcdoc compatible
    -SPA-style navigation using Javascript
    -No page reloads
    -No dead UI
    -No broken buttons
----------------------------------------------------------

SPA VISIBILITY RULE (VERY IMPORTANT)
-pages must not hiddent permanently
-if .page {display:none} is used, then .page.active {dispaly:block} is REQUIRED
-At leat one page must be visible on initial load
-hiding all content is invalid

--------------------------------------------------------
REQUIRED SPA PAGES
---------------------------------------------------------
-Home
-About
-Services/Features
-Contact

-----------------------------------------------------
Functional Requirements
-----------------------------------------------------
-Navigation must switch pages using JS
-Active nav state must update
-forms must have JS validation
-Buttons must show hover+active states
-smooth section/page transitions

-------------------------------------------------------
FINAL SELF-CHECK(MANDATORY)
-------------------------------------------------------
BEFORE RESPONDING,ENSURE:

1. Layout works on mobile, tablet, desktop
2.No horizontal scrolling at any screen size
3. All images are responsive and scale correctly
4.All section are adapt properly
5.Media queries are present and used
6.Navigation works on all screen sizes
7.At least one page is visible without user interaction

IF ANY OF THE ABOVE CHECKS FAIL -> RESPONSE IS INVALID

..............................................
OUTPUT FORMAT (RAW JSON ONLY)
------------------------------------------------------
{
   "message":"short professional confirmation sentence",
   "code":"<FULL VALID HTML DOCUMENT>"
}

------------------------------------------------
ABSOLUTE RULES
-------------------------------------------------
-RETURN RAW JSON ONLY, NO EXPLANATIONS
-NO markdown
--No extra texts
-FORMAT MUST MATCH EXACTLY
-IF FORMAT IS NOT EXACT -> RESPONSE IS INVALID
`;
export const generateWebsite = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }
    const user = await User.findById(req.user._id);
    // from isAuth middleware
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if(user.credits<50){
        return res.status(403).json({ message: "Not enough credits. Each website generation costs 50 credits." });
    }
    const finalprompt = masterPrompt.replace("{USER_PROMPT}", prompt);
    let raw="";
    let parsed=null
    for(let i=0;i<2 && !parsed;i++){
        raw = await generateResponse(finalprompt);
        parsed=extractJson(raw);

        if(!parsed){
        raw=await generateResponse(finalprompt + "\n\nRETURN ONLY RAW JSON");
        parsed=await extractJson(raw);
        if(!parsed){
          console.error('generateWebsite: failed to parse AI response. Raw response:', raw);
        }
        }
    }

    if(!parsed.code){
        console.log("ai return invalid response")
        return res.status(400).json({ message: "AI returned invalid response" });
    }

    const website = await Website.create({
      userId: user._id,
      title: prompt.substring(0,50),
      latestCode: parsed.code,
      conversation:[
        {
          role:"ai",
          content:parsed.message
        },
        {
          role:"user",
          content:prompt
        }
      ]
    });

    user.credits-=50;
    await user.save();

    return res.status(200).json({ message: "Website generated successfully", websiteId: website._id,
        remainingCredits: user.credits
    });

  } catch (error) {
    console.error('generateWebsite error:', error);
    return res.status(500).json({ message:`generateWebsite error: ${error.message}` });
  }
};

export const getWebsiteById = async(req,res)=>{
    try {
    const rawId = req.params.id || '';
    const id = rawId.replace(/^:/, ''); // handle accidental leading ':' from client
    const website=await Website.findOne({_id:id, userId:req.user._id});
        if(!website){
            return res.status(404).json({message:"Website not found"});
        }

        return res.status(200).json({website});
    } catch (error) {
        console.error('getWebsiteById error:', error);
        return res.status(500).json({ message:`getWebsiteById error: ${error.message}` });
    }
}

export const changes=async (req,res)=>{
    try{
        const {prompt}=req.body;
        if(!prompt){
            return res.status(400).json({message:"Prompt is required"});
        }
        if(!req.params.id) return res.status(400).json({message: 'Website id is required'});
        const rawId = req.params.id || '';
        const id = rawId.replace(/^:/, '');
        console.log('changes called for website id:', id, 'user:', req.user?._id);
        const website=await Website.findOne({_id:id, userId:req.user._id});

        if(!website){
            return res.status(404).json({message:"Website not found"});
        }

        const user=await User.findById(req.user._id);
        if(!user){
            return res.status(401).json({message:"Unauthorized"});
        }
        if(user.credits<10){
            return res.status(403).json({message:"Not enough credits. Each change costs 10 credits."});
        }

        const updatePrompt=`
        UPDATE THIS HTML WEBSITE.
        CURRENT CODE:
        ${website.latestCode}
        
        USER REQUEST:
        ${prompt}
        
        RETURN RAW JSON IN THE SAME FORMAT:
        {
        "message":"short professional confirmation sentence",
        "code":"<UPDATED FULL VALID HTML DOCUMENT>"
        }`

        let raw="";
    let parsed=null
        console.log('sending prompt to OpenRouter, prompt length:', updatePrompt.length);
    for(let i=0;i<2 && !parsed;i++){
        raw = await generateResponse(updatePrompt);
            console.log('raw response length:', raw ? String(raw).length : 0);
        parsed=extractJson(raw);

        if(!parsed){
        raw=await generateResponse(updatePrompt + "\n\nRETURN ONLY RAW JSON");
        parsed=await extractJson(raw);
        if(!parsed){
           raw=await generateResponse(updatePrompt + "\n\nRETURN ONLY RAW JSON. ENSURE THE RESPONSE IS IN THE EXACT FORMAT AND CONTAINS ONLY JSON");
           parsed=await extractJson(raw);
        }
        }
    }

    if(!parsed.code){
        console.log("ai return invalid response")
        return res.status(400).json({ message: "AI returned invalid response" });
    }

        website.conversation.push(
            {role:"user", content:prompt},
            {role:"ai", content:parsed.message},   
        );

        website.latestCode=parsed.code;
        await website.save();
        // charge 10 credits per change
         user.credits-=10;
        await user.save();

    return res.status(200).json({ 
        message: parsed.message,
        code: parsed.code,
         websiteId: website._id,
        remainingCredits: user.credits
    });
    } catch (error) {
        console.error('changes error:', error);
        return res.status(500).json({ message:`changes error: ${error.message}` });
    }
}

export const getAll=async(req,res)=>{
    try {
        const websites=await Website.find({userId:req.user._id})
        return res.status(200).json({websites});
    } catch (error) {
        console.error('getAll error:', error);
        return res.status(500).json({ message:`getAll error: ${error.message}` });
    }
}