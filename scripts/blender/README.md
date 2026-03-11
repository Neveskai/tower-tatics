# Renderizar sprites de torres no Blender

Gera PNGs das torres (e armas) do **Kenney Tower Defense Kit** na mesma perspectiva dos sprites do goblin (D / S / U), com fundo transparente.

## Pré-requisitos

- [Blender](https://www.blender.org/) instalado (3.x ou 4.x).
- O kit **kenney_tower-defense-kit** na raiz do projeto (ao lado de `src/`, `public/`, etc.).

## Uso

### Opção 1: Script auxiliar (Windows, quando `blender` não está no PATH)

Na raiz do projeto:

```powershell
.\scripts\blender\run_render_towers.ps1
```

O script procura o Blender em `C:\Program Files\Blender Foundation\Blender X.X\blender.exe`. Se estiver noutro sítio, defina antes:

```powershell
$env:BLENDER_EXE = "C:\caminho\para\blender.exe"
.\scripts\blender\run_render_towers.ps1
```

### Opção 2: Linha de comando (com Blender no PATH)

```bash
blender --background --python scripts/blender/render_tower_sprites.py
```

### Opção 3: Dentro do Blender

**Scripting** → abrir `scripts/blender/render_tower_sprites.py` → **Run Script**.

## Saída

- **Torres:** `public/assets/frames/towers/` – `Tower.png`, `Machine_Gun.png`, `Cannon.png`, etc. (ou `Nome_D.png`, … se usar as 3 direções).
- **Tiles do mapa:** `public/assets/frames/tiles/` – `tile.png`, `tile-straight.png`, `tile-corner-inner.png`, etc., na **mesma perspectiva** das torres (câmera D, elevação 38°, ortográfica).
- **Formato:** PNG com canal alpha (fundo transparente).

Para usar no jogo como hoje (WebP), converta depois, por exemplo:

- [Squoosh](https://squoosh.app/) (WebP, qualidade/alpha)
- Ou no terminal: `npx sharp-cli --input "public/assets/frames/towers/*.png" --output "./public/assets/frames/towers/" --format webp`

## Ajustes no script

Edite `scripts/blender/render_tower_sprites.py`:

- **`RESOLUTION`** – tamanho da sprite (ex.: 256 ou 512).
- **`ORTHO_SCALE`** – zoom da câmera ortográfica (menor = torre maior no frame).
- **`DIRECTIONS`** – ângulos da câmera para D / S / U (azimuth, elevation em graus).
- **`RENDER_DIRECTIONS`** – `["D"]` para uma única vista (como no jogo atual); `["D", "S", "U"]` para as 3 vistas como o goblin.
- **`CROP_TO_CONTENT`** – se `True`, cada PNG é recortado ao retângulo mínimo que contém pixels visíveis (remove margens vazias). `CROP_PADDING` adiciona pixels em volta; `CROP_ALPHA_THRESHOLD` define o alpha mínimo para considerar um pixel visível.
- **`TOWER_RENDERS`** – quais modelos GLB compõem cada sprite (base + armas).
- **`TILE_RENDERS`** – quais tiles do mapa renderizar (um GLB por sprite; mesma perspectiva das torres).

Os GLB ficam em `kenney_tower-defense-kit/Models/GLB format/` (ex.: `tower-square-bottom-a.glb`, `weapon-turret.glb`, `tile.glb`, `tile-straight.glb`).
