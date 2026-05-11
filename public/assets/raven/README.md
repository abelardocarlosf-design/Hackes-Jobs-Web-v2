# Assets — Test de Matrices Progresivas de Raven

El componente `RavenTest` espera 60 imágenes locales en este directorio:

```
q01.png ... q60.png
```

Cada imagen debe contener:
- La matriz 3x3 (o 2x2 en series A/B) con la pieza faltante marcada en color sólido.
- Las 8 opciones de respuesta numeradas (1–8) debajo o al lado de la matriz.

Recomendación técnica:
- Formato PNG con fondo transparente o blanco puro.
- Resolución mínima: 1200×800 px para que se vea nítido en pantallas 4K.
- Tamaño máximo: 400 KB por imagen (optimizar con `pngquant` o `squoosh`).

Las series clásicas del Raven Standard:
- Serie A (q01–q12): patrones simples, completar el patrón continuo.
- Serie B (q13–q24): analogías 2×2.
- Serie C (q25–q36): progresiones continuas 3×3.
- Serie D (q37–q48): permutaciones de figuras.
- Serie E (q49–q60): cambios cualitativos / razonamiento abstracto.

Una vez subidos los archivos, el componente los renderizará automáticamente; no es necesario tocar código.
