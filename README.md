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
| `--help` | `-h` | Muestra la ayuda del comando |

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