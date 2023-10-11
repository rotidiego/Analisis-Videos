

document.addEventListener('DOMContentLoaded', function () {
    const videoInput = document.getElementById('videoInput');
    const resumen = document.getElementById('resumen');
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const resumenTabla = document.getElementById('pixelTable');
    const ctx = canvas.getContext('2d');
    let pixelesTotal = 0;
    let pixelCounts = [];
    let asa2 = 0;
    let a = false;
    videoInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        canvas.style.display = 'none';
        resumenTabla.innerHTML = '';
        resumen.innerHTML = '';
        pixelesTotal = 0;
        pixelCounts = [];
        if (file) {
            canvas.height = video.height;
            a = true;
            const objectURL = URL.createObjectURL(file);
            video.src = objectURL;
        } else {
            a = false
        }
        if (a) {
            video.style.display = "block";
        } else {
            video.style.display = "none";
        }

    });

    video.addEventListener('play', function () {
        canvas.style.display = 'block';
        canvas.height = video.clientHeight;
        AnalizarPixeles();
    });

    function AnalizarPixeles() {

        const interval = setInterval(function () {
            if (video.paused || video.ended) {
                clearInterval(interval);
                MostrarResumen(pixelCounts,true);
                return;
            }

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;

            for (let i = 0; i < pixels.length; i += 4) {
                pixelesTotal++;
                let rgb = pixels.slice(i, i + 4).join(',');
                let pixelExistente = pixelCounts.find((element) => element.color == rgb);
                if (pixelExistente != undefined) {
                    pixelExistente.veces++;
                } else {
                    pixelCounts.push({ color: rgb, veces: 1 });
                }
            }
            MostrarResumen(pixelCounts,false);

        }, 1000);
    }

    function compararPorNombre(a, b) {
        const nombreA = a.color.toUpperCase();
        const nombreB = b.color.toUpperCase();

        let comparacion = 0;
        if (nombreA < nombreB) {
            comparacion = 1;
        } else if (nombreA > nombreB) {
            comparacion = -1;
        }
        return comparacion;
    }

    function MostrarResumen(pixelCounts, paso) {
        // Limpiar la tabla
        let contador = 0;
        resumenTabla.innerHTML = '';
        HtmlTabla = "<tr><th>Color</th><th>Cantidad</th><th>Probabilidad</th><th>Frecuencia I(Sn)</th></tr>";
        //pixelCounts.sort(compararPorNombre);
        let Frecuencia = 0;
        let ProbabilidadN = 0;
        let Entropia = 0;
        let ProbaSuma = 0;
        for (const color in pixelCounts) {
            contador++;
            const count = pixelCounts[color].veces;
            let colorP = pixelCounts[color].color;
            if(!paso){    
                ProbabilidadN = "--";
                Frecuencia = "--";
                ProbaSuma = 1;        
            }else{                
                ProbabilidadN = Number(count / pixelesTotal);
                Frecuencia = Math.abs(Number(Math.log(ProbabilidadN) / Math.log(2)));
                ProbaSuma = ProbaSuma + Number(count / pixelesTotal);
                Entropia += Math.abs(ProbabilidadN * Frecuencia);
            }
            HtmlTabla += `<tr style=" background-color: rgba(${colorP});"><td style="color: rgba(${colorP}); filter: invert(100%);">rgba(${colorP})</td>
            <td style="color: rgba(${colorP}); filter: invert(100%);">${count}</td>
            <td style="color: rgba(${colorP}); filter: invert(100%);">${ProbabilidadN}</td>
            <td style="color: rgba(${colorP}); filter: invert(100%);">${Frecuencia}</td></tr>`;
        }
        resumenTabla.innerHTML = HtmlTabla;
        resumen.innerHTML = "En total existen " + pixelCounts.length + " Simbolos.<br>En total existen " + pixelesTotal + " bloques.<br>Suma de probabilidades: " + ProbaSuma + ".<br>Entropia: " + Entropia;
    }
});
