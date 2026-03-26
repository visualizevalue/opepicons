Opepicons
========

A tiny library for generating opepen identicons as SVGs.

![Opepicons](examples/sample.png)

Install
-----

    pnpm i @visualizevalue/opepicons


Usage
-----

```typescript
import { renderSVG } from '@visualizevalue/opepicons';

const svg = renderSVG({  // All options are optional
    seed: 'randstring',  // seed used to generate icon data, default: random
    size: 160,           // width/height of the SVG in pixels, default: responsive
    color: '#dfe',       // foreground color, default: generated from seed
    bgcolor: '#aaa',     // background color, default: generated from seed
    spotcolor: '#f00',   // spot color, default: generated from seed
});

// svg is a string: '<svg xmlns="http://www.w3.org/2000/svg" ...>...</svg>'
```

### Browser

```typescript
const div = document.createElement('div');
div.innerHTML = renderSVG({ seed: '0x...', size: 160 });
document.body.appendChild(div);
```

### Server

```typescript
import { renderSVG } from '@visualizevalue/opepicons';

// Express / Hono / any HTTP server
app.get('/icon/:seed.svg', (req, res) => {
    const svg = renderSVG({ seed: req.params.seed, size: 160 });
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
});
```

Build
-----

    pnpm run build

License
-------

[WTFPL](http://www.wtfpl.net/)

Credits
-------

Based on [opepen-standard](https://github.com/Zapper-fi/opepen-standard), which itself was based on [blockies](https://github.com/download13/blockies).
