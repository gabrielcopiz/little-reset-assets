// Helper de la sesion: sube la miniatura nueva al editor de Etsy y da las coordenadas del arrastre.
window.LR = {
  g: () => document.querySelector('.le-media-grid > *'),
  k: () => 1568 / innerWidth,   // el frame de captura viene escalado respecto del viewport CSS
  ids() {
    return [...this.g().children]
      .map(x => { const d = x.querySelector('[aria-roledescription=sortable]'); return d ? d.id : null; })
      .filter(Boolean);
  },
  c(id) {
    const r = document.getElementById(id).getBoundingClientRect(), k = this.k();
    return [Math.round((r.left + r.width / 2) * k), Math.round((r.top + r.height / 2) * k)];
  },
  estado(nueva) {
    const ids = this.ids();
    const b = [...document.querySelectorAll('button')].find(x => x.innerText.trim() === 'Publicar cambios');
    const r = b.getBoundingClientRect(), k = this.k();
    return {
      pos: ids.indexOf(nueva), n: ids.length,
      desde: this.c(nueva), hasta: this.c(ids[0]),
      pub: [Math.round((r.left + r.width / 2) * k), Math.round((r.top + r.height / 2) * k)]
    };
  },
  async subir(n) {
    const antes = this.ids();
    const res = await fetch('https://raw.githubusercontent.com/gabrielcopiz/little-reset-assets/master/heroes/' + n + '.png');
    if (!res.ok) return { error: 'fetch ' + res.status };
    const f = new File([await res.blob()], 'LittleReset-' + n + '.png', { type: 'image/png' });
    const dt = new DataTransfer(); dt.items.add(f);
    const i = [...document.querySelectorAll('input[type=file][name="listing-media-upload"]')].pop();
    i.files = dt.files; i.dispatchEvent(new Event('change', { bubbles: true }));
    for (let t = 0; t < 25; t++) {
      await new Promise(r => setTimeout(r, 1000));
      const a = this.ids();
      if (a.length === antes.length + 1) {
        const nueva = a.find(x => !antes.includes(x));
        this.g().scrollIntoView({ block: 'center' });
        await new Promise(r => setTimeout(r, 600));
        return Object.assign({ nueva }, this.estado(nueva));
      }
    }
    return { error: 'timeout subida' };
  }
};
'LR listo';
