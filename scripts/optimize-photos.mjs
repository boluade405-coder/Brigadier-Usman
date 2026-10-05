import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { photoCatalog } from '../src/lib/photo-catalog.mjs'

const projectRoot = process.cwd()
const sourceDirectory = path.join(projectRoot, 'public', 'archive')
const outputDirectory = path.join(sourceDirectory, 'optimized')
const variants = [
  { name: 'tiny', width: 32, quality: 28, blur: 1.1 },
  { name: 'thumbnail', width: 480, quality: 70 },
  { name: 'medium', width: 960, quality: 76 },
  { name: 'large', width: 1600, quality: 82 },
]

await mkdir(outputDirectory, { recursive: true })

let originalBytes = 0
let generatedBytes = 0

for (const photo of photoCatalog) {
  const sourcePath = path.join(sourceDirectory, photo.original)
  const originalStat = await stat(sourcePath)
  originalBytes += originalStat.size
  const photoDirectory = path.join(outputDirectory, photo.id)
  await mkdir(photoDirectory, { recursive: true })

  for (const variant of variants) {
    const outputPath = path.join(photoDirectory, `${variant.name}.webp`)
    let pipeline = sharp(sourcePath).rotate().resize({ width: variant.width, withoutEnlargement: true })
    if (variant.blur) pipeline = pipeline.blur(variant.blur)
    await pipeline.webp({ quality: variant.quality, effort: 5 }).toFile(outputPath)
    generatedBytes += (await stat(outputPath)).size
  }
}

const formatMegabytes = bytes => `${(bytes / 1024 / 1024).toFixed(2)} MB`
console.log(`Optimized ${photoCatalog.length} images into ${photoCatalog.length * variants.length} WebP variants.`)
console.log(`Originals: ${formatMegabytes(originalBytes)}; generated variants: ${formatMegabytes(generatedBytes)}.`)
