### WORDLE


## Inicialización del proyecto
 
1. Intruccion para ejecutar:

```
    npm run start
```

2. Archivo de configuración WebPack:

```
    const path =  require('path');

    module.exports = {
        entry: './src/index.js', 
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'public')
        },
        mode: 'development'
    }
```

3. En la propiedad scripts del package.json: 

```
    "scripst": {
        ...,
        ...,
        "strart": "webpack serve"
    }
```

