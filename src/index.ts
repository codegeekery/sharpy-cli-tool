#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

type OutputFormat = "jpeg" | "jpg" | "png" | "webp" | "avif" | "tiff";

const SUPPORTED_INPUTS = new Set([
  "jpg", "jpeg", "png", "webp", "avif", "tif", "tiff"
]);

const SUPPORTED_OUTPUTS: OutputFormat[] = ["jpeg", "jpg", "png", "webp", "avif", "tiff"];

interface Options {
  dir: string;
  recursive: boolean;
  quality?: number;
  force: boolean;
  removeOriginal?: boolean;
}

function parseArgs(): { format: OutputFormat; options: Options } {
  const [, , ...argv] = process.argv;

  if (argv.length === 0) showHelpAndExit("Debes indicar un formato de salida...");
  // Manejar --help primero. Si el primer argumento es --help o -h, mostrar la ayuda y salir.
  if (argv[0] === "--help" || argv[0] === "-h") showHelpAndExit();

  // Ahora sí, validar formato
  const formatArg = (argv[0] || "").toLowerCase() as OutputFormat;
  if (!SUPPORTED_OUTPUTS.includes(formatArg)) {
    showHelpAndExit(`Formato no soportado: ${formatArg}. Soportados: ...`);
  }


  const options: Options = {
    dir: process.cwd(),
    recursive: false,
    force: false,
    removeOriginal: false
  };

  for (let i = 1; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--recursive" || arg === "-r") {
      options.recursive = true;
    } else if (arg === "--force" || arg === "-f") {
      options.force = true;
    } else if (arg === "--remove-original" || arg === "--rm") {
      options.removeOriginal = true;
    } else if (arg === "--dir") {
      const next = argv[i + 1];
      if (!next) showHelpAndExit("Falta valor para --dir");
      options.dir = path.resolve(next);
      i++;
    } else if (arg === "--quality" || arg === "-q") {
      const next = argv[i + 1];
      if (!next || isNaN(Number(next))) showHelpAndExit("Calidad inválida para --quality");
      options.quality = Number(next);
      i++;
    } else if (arg === "--help" || arg === "-h") {
      showHelpAndExit();
    } else {
      showHelpAndExit(`Argumento desconocido: ${arg}`);
    }
  }

  return { format: normalizeFormat(formatArg), options };
}

function normalizeFormat(fmt: OutputFormat): OutputFormat {
  if (fmt === "jpg") return "jpeg";
  return fmt;
}

function showHelpAndExit(msg?: string): never {
  if (msg) console.error(`\nError: ${msg}\n`);
  console.log(`Uso:
  imgc <formato> [opciones]

<formato>:
  ${SUPPORTED_OUTPUTS.join(", ")}

Opciones:
  --dir <ruta>        Carpeta a procesar (por defecto, carpeta actual)
  -r, --recursive     Buscar imágenes en subcarpetas
  -q, --quality <n>   Calidad (0-100) para formatos con pérdida (jpeg/webp/avif/tiff)
  -f, --force         Sobrescribir si el destino ya existe
  --rm, --remove-original   Borrar el archivo original si la conversión fue exitosa
  -h, --help          Mostrar ayuda

Ejemplos:
  sharpy webp
  sharpy avif -q 70 -r --rm
  sharpy jpeg --dir ./fotos -f -q 85
`);
  process.exit(msg ? 1 : 0);
}

async function listImages(dir: string, recursive: boolean, excludeExt?: OutputFormat): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (recursive) files.push(...(await listImages(full, true, excludeExt)));
    } else if (ent.isFile()) {
      const ext = path.extname(ent.name).slice(1).toLowerCase();
      if (SUPPORTED_INPUTS.has(ext) && ext !== excludeExt) files.push(full);
    }
  }
  return files;
}

function destPathFor(srcPath: string, outFmt: OutputFormat): string {
  const dir = path.dirname(srcPath);
  const base = path.basename(srcPath, path.extname(srcPath));
  const ext = outFmt === "jpeg" ? ".jpg" : `.${outFmt}`;
  return path.join(dir, `${base}${ext}`);
}

async function convertOne(
  src: string,
  outFmt: OutputFormat,
  opts: Options
): Promise<{ src: string; dest: string; ok: boolean; reason?: string }> {
  const dest = destPathFor(src, outFmt);

  if (!opts.force) {
    try {
      await fs.access(dest);
      return { src, dest, ok: false, reason: "destino ya existe (usa --force para sobrescribir)" };
    } catch {
      // no existe -> seguir
    }
  }

  try {
    const img = sharp(src);
    if (outFmt === "jpeg") {
      await img.jpeg({ quality: opts.quality ?? 80 }).toFile(dest);
    } else if (outFmt === "webp") {
      await img.webp({ quality: opts.quality ?? 80 }).toFile(dest);
    } else if (outFmt === "avif") {
      await img.avif({ quality: opts.quality ?? 50 }).toFile(dest);
    } else if (outFmt === "png") {
      await img.png().toFile(dest);
    } else if (outFmt === "tiff") {
      await img.tiff({ quality: opts.quality ?? 80 }).toFile(dest);
    } else {
      throw new Error(`Formato de salida no manejado: ${outFmt}`);
    }
    return { src, dest, ok: true };
  } catch (err: any) {
    return { src, dest, ok: false, reason: err?.message ?? String(err) };
  }
}

async function main() {
  const { format, options } = parseArgs();

  // Validar carpeta
  try {
    const stat = await fs.stat(options.dir);
    if (!stat.isDirectory()) {
      console.error(`La ruta no es carpeta: ${options.dir}`);
      process.exit(1);
    }
  } catch {
    console.error(`Carpeta no encontrada: ${options.dir}`);
    process.exit(1);
  }

  const excludeExt = format === "jpeg" ? "jpg" : format;
  const files = await listImages(options.dir, options.recursive, excludeExt);
  if (files.length === 0) {
    console.log("No se encontraron imágenes soportadas que no estén ya en el formato de destino.");
    return;
  }

  console.log(`Encontradas ${files.length} imagen(es). Convirtiendo a ${format.toUpperCase()}...`);

  // Concurrencia simple
  const concurrency = 4;
  let idx = 0;
  const results: Awaited<ReturnType<typeof convertOne>>[] = [];

  async function worker() {
    while (idx < files.length) {
      const current = files[idx++];
      const res = await convertOne(current, format, options);
      results.push(res);

      // Mejora: reintentos al borrar archivo original
      if (res.ok && options.removeOriginal) {
        for (let tries = 0; tries < 3; tries++) {
          try {
            // Cambia el delay 
            await new Promise(r => setTimeout(r, 1000));
            await fs.unlink(res.src);
            console.log(`🧹 Borrado original: ${path.relative(options.dir, res.src)}`);
            break;
          } catch (err: any) {
            if (tries === 2) {
              console.warn(`⚠️ No se pudo borrar original: ${res.src} (${err.message})`);
            }
          }
        }
      }

      const status = res.ok ? "OK" : "FALLO";
      console.log(
        `[${status}] ${path.relative(options.dir, current)} -> ${path.relative(options.dir, res.dest)}${res.reason ? " | " + res.reason : ""}`
      );
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, files.length) }, () => worker()));

  const ok = results.filter(r => r.ok).length;
  const fail = results.length - ok;
  console.log(`\nCompletado: ${ok} convertido(s), ${fail} con error.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
