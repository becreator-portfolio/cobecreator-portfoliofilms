# Loops do topo (mudos): o mesmo corte do reel, mas o plano de abertura (o olho) respira —
# 4,75 s em vez de 2,1 s, com aproximação mais lenta. O reel com música (full.mp4) não muda.
import subprocess

L = '/home/user/src/lp/'
O = '/home/user/work/reel5/'
FPS = 24
NF = 114           # 4,75 s: da fonte inteira (0,0 s → 4,75 s), piscada perto de 2 s
ZOOM = 0.06        # 6 % ao longo do plano (no reel: 4,5 % em 2,1 s)
ENC = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '12', '-pix_fmt', 'yuv420p', '-r', str(FPS), '-an']


def push(w, h):
    W, H = 4 * w, 4 * h
    return (f"scale=w='trunc({W}*(1+{ZOOM}*n/{NF})/2)*2':h=-2:eval=frame:flags=bicubic,"
            f"crop={W}:{H},scale={w}:{h}:flags=lanczos")


src = L + 'eye.mp4'
w, h = 1108, 828
fill16 = 'scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos,crop=1920:1080'
sw = round(h * 9 / 16) // 2 * 2
x = max(0, min(w - sw, round(w * 0.42 - sw / 2)))
vert = f'crop={sw}:{h}:{x}:0,scale=608:1080:flags=lanczos'
for k, base, (W, H) in (('h', fill16, (1920, 1080)), ('v', vert, (608, 1080))):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-frames:v', str(NF), '-vf',
                    f'setpts=N/({FPS}*TB),{base},{push(W, H)},setsar=1,format=yuv420p', *ENC, f'{O}{k}/00_hero.mp4'], check=True)
    files = [f'{O}{k}/00_hero.mp4'] + [l.split("'")[1] for l in open(f'{O}{k}.txt') if not l.strip().endswith("/00.mp4'")]
    open(f'{O}{k}_hero.txt', 'w').write(''.join(f"file '{f}'\n" for f in files))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{O}{k}_hero.txt', '-c', 'copy', f'{O}cut_{k}_hero.mp4'], check=True)
    print(k, len(files), 'planos')
