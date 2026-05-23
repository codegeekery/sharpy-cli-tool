# 🖼️ Sharpy
**Conversor de Imágenes CLI en Node.js**
Convierte imágenes entre formatos modernos de manera sencilla, rápida y eficiente.
[![My Skills](https://skillicons.dev/icons?i=nodejs,ts)](https://skillicons.dev)
---
## ✨ Características
- 🚀 **Conversión masiva** de imágenes por carpeta y subcarpetas
- 🎨 **Múltiples formatos**: JPEG, PNG, WebP, AVIF, TIFF
- ⚙️ **Control de calidad** ajustable para formatos con compresión
- 🔄 **Sobrescritura opcional** de archivos existentes
- 🗑️ **Limpieza automática** de archivos originales
- 🏷️ **Renombrado automático** con estrategias de nombre únicas
- 💻 **Interfaz CLI** simple y amigable
---
## 📦 Instalación
### Opción 1: Desde npm (Recomendado)
```bash
# Instalación global desde npm
npm install -g sharpy-cli-tool
# Usar directamente
sharpy webp
```
### Opción 2: Desde el código fuente
```bash
# Clonar el repositorio
git clone https://github.com/codegeekery/sharpy-tool.git
cd sharpy-tool
# Instalar dependencias
npm install
# (Opcional) Instalación global desde local
npm link
```
---
## 🎯 Uso Básico
```bash
sharpy <formato> [opciones]
```
### Formatos Disponibles
`jpeg` · `jpg` · `png` · `webp` · `avif` · `tiff`
---
## 💡 Ejemplos Prácticos
```bash
# Conversión simple a WebP
sharpy webp
# AVIF con calidad específica, recursivo y eliminando originales
sharpy avif -q 70 -r --rm
# JPEG de alta calidad en carpeta específica, forzando sobrescritura
sharpy jpeg --dir ./fotos -f -q 85
# PNG recursivo sin eliminar originales
sharpy png -r --dir ./imagenes
# WebP con nombres únicos tipo Snowflake
sharpy webp --rename snowflake
# AVIF recursivo con UUID como nombre de archivo
sharpy avif --rename uuid -r
```
---
## ⚙️ Opciones
| Opción | Alias | Descripción |
|--------|-------|-------------|
| `--dir <ruta>` | | Especifica la carpeta a procesar (por defecto: carpeta actual) |
| `--recursive` | `-r` | Procesa imágenes en subcarpetas |
| `--quality <n>` | `-q` | Ajusta la calidad (0-100) para formatos con compresión |
| `--force` | `-f` | Sobrescribe archivos de destino existentes |
| `--remove-original` | `--rm` | Elimina el archivo original tras conversión exitosa |
| `--rename <strategy>` | | Estrategia de nombre para el archivo de salida (ver abajo) |
| `--help` | `-h` | Muestra la ayuda del comando |

### 🏷️ Estrategias de Renombrado (`--rename`)
| Estrategia | Descripción | Ejemplo |
|------------|-------------|---------|
| `original` | Mantiene el nombre del archivo original *(default)* | `foto.webp` |
| `snowflake` | ID único basado en timestamp (ordenable cronológicamente) | `1734123456789001.webp` |
| `uuid` | UUID v4 aleatorio | `a3f2c1d4-9b8e-4f2a-b1c3-d4e5f6a7b8c9.webp` |

---
## 📚 Casos de Uso
### 🎨 Optimización para Web
```bash
sharpy webp --dir ./assets/images -r -q 85
```
### 📸 Conversión de Fotografías
```bash
sharpy jpeg -q 95 --dir ./fotografias -r
```
### 🧹 Limpieza y Conversión
```bash
sharpy avif -r --rm -q 80
```
### 🔄 Migración de Formato
```bash
sharpy webp --dir ./proyecto -r -f
```
### 🏷️ Renombrado Masivo con IDs Únicos
```bash
# Útil para assets de producción sin colisiones de nombres
sharpy webp --rename snowflake --dir ./assets -r
# UUID para archivos que se subirán a un CDN o almacenamiento en la nube
sharpy avif --rename uuid -r --rm
```
---
## ⚠️ Solución de Problemas
### Archivo ocupado o bloqueado
```
⚠️ No se pudo borrar original: path/to/file.webp 
(EBUSY: resource busy or locked, unlink ...)
```
**Soluciones:**
- ✅ Cierra visores de imágenes activos
- ✅ Cierra el Explorador de Archivos en esa carpeta
- ✅ Verifica que ningún proceso esté usando las imágenes
---
## 🛠️ Tecnologías
| Tecnología | Uso |
|------------|-----|
| **Node.js** | Runtime de JavaScript |
| **Sharp** | Procesamiento de imágenes de alto rendimiento |
| **Commander.js** | Gestión de CLI |
- ⚡ Procesamiento asíncrono para máximo rendimiento
- 🧩 Código modular y fácil de mantener
- 🔒 Manejo robusto de errores
---
## 📖 Ayuda
```bash
sharpy --help
```
**⭐ Si te gusta Sharpy, dale una estrella en GitHub ⭐**

Hecho con ❤️ usando Node.js y Sharp

---

Los cambios fueron:

- `🏷️ Renombrado automático` agregado en Características
- Dos ejemplos nuevos en Ejemplos Prácticos
- Columna `--rename <strategy>` en la tabla de Opciones
- Tabla explicando las tres estrategias con ejemplos de nombre de archivo
- Nuevo caso de uso `🏷️ Renombrado Masivo con IDs Únicos`