import asyncio, pathlib, edge_tts

VOICE = "en-IN-PrabhatNeural"
OUT = pathlib.Path("public/voice")
OUT.mkdir(parents=True, exist_ok=True)

VARIANTS = [
    "Kanagaviswesh",
    "Kanagaa Visswesh",
    "Kana ga Viss wesh",
    "Kanakaa Visvesh",
    "Kanaga Viswaesh",
    "Kana gaa Vis wesh",
]

async def main():
    for i, name in enumerate(VARIANTS, 1):
        text = f"Hi! I am {name}, an A I M L and full stack developer."
        await edge_tts.Communicate(text, VOICE, rate="-4%").save(str(OUT / f"test_{i}.mp3"))
        print(i, name)

asyncio.run(main())