

import pathlib
import asyncio

try:
    import edge_tts  # type: ignore[import-not-found]
except ModuleNotFoundError:
    edge_tts = None

VOICE = "en-IN-PrabhatNeural"
RATE = "-4%"
OUT = pathlib.Path("public/voice")
OUT.mkdir(parents=True, exist_ok=True)

SPOKEN = {
    "home": "Hi! I am Kanaga Viswesh, an A I M L and full stack developer. Welcome to my portfolio! Scroll down and I will walk you through everything, or hit, Take the tour.",
    "about": "I am a B Tech graduate in A I and Data Science who loves building A I powered, full stack and data driven solutions. I have even presented a research paper at an I triple E conference.",
    "skills": "Here is my toolkit: lots of technologies across Python, React, Fast A P I, Jango, Tensor Flow and more. Use the tabs to filter by category.",
    "projects": "I have built several projects, from an Auto M L platform to a rag knowledge assistant. Hover to pause the showcase, and copy any clone command!",
    "experience": "I am working as a Frontend and Chatbot Developer at Aigonic Innovations. That live timer counts every second I have spent there!",
    "education": "I earned my B Tech in A I and Data Science from Karpagam College of Engineering. The rings show my G P A at each stage of the journey.",
    "certifications": "I am a certified Click Sense Business Analyst, and I presented my I triple E research paper at N I T Puducherry.",
    "contact": "Let us build something together! Fill in the form and hit Send Message, or reach me by email, Linked In or Git Hub. I would love to hear from you.",
}

async def main():
    for key, text in SPOKEN.items():
        await edge_tts.Communicate(text, VOICE, rate=RATE).save(str(OUT / f"{key}.mp3"))
        print("done", key)

asyncio.run(main())