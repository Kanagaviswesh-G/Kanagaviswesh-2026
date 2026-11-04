import asyncio, pathlib, edge_tts

VOICE = "en-IN-PrabhatNeural"
OUT = pathlib.Path("public/voice")
OUT.mkdir(parents=True, exist_ok=True)

VARIANTS = [
    "Kana gaa Vis wesh",    # test 6 (reference)
    "Kana gaa Vish wesh",
    "Kana gaa Vis vesh",
    "Kana gaa Vish vesh",
    "Kana gaa Vis waesh",
    "Kana ga Vis wesh",
    "Kanaa gaa Vis wesh",
    "Kana gaa Viss wesh",
]

async def main():
    for i, name in enumerate(VARIANTS, 1):
        text = f"Hi! I am {name}, an A I M L and full stack developer."
        await edge_tts.Communicate(text, VOICE, rate="-4%").save(str(OUT / f"r2_{i}.mp3"))
        print(i, name)

asyncio.run(main())