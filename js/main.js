
let blockVid1 = document.getElementById("vid1");
let blockVid2 = document.getElementById("vid2");
let btnVid1 = document.getElementById("btnVid1");
let btnVid2 = document.getElementById("btnVid2");

let pix1 = 0;
let simb1 = 0;
let Prob1 = 0;
let Entro1 = 0;

let pix2 = 0;
let simb2 = 0;
let Prob2 = 0;
let Entro2 = 0;

let pixelesTotal = 0;
let pixelCounts = [];
let pixelesTotal2 = 0;
let pixelCounts2 = [];

document.addEventListener('DOMContentLoaded', function () {
    const videoInput = document.getElementById('videoInput');
    const videoInput2 = document.getElementById('videoInput1');
    const resumen = document.getElementById('resumen');
    const resumen2 = document.getElementById('resumen1');
    const video = document.getElementById('video');
    const video2 = document.getElementById('video1');
    const canvas = document.getElementById('canvas');
    const canvas2 = document.getElementById('canvas1');
    const resumenTabla = document.getElementById('pixelTable');
    const resumenTabla2 = document.getElementById('pixelTable1');
    const ctx = canvas.getContext('2d');
    const ctx2 = canvas2.getContext('2d');
    let a = false;
    let a2 = false;
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

    videoInput2.addEventListener('change', function (e) {
        const file = e.target.files[0];
        canvas2.style.display = 'none';
        resumenTabla2.innerHTML = '';
        resumen2.innerHTML = '';
        pixelesTotal2 = 0;
        pixelCounts2 = [];
        if (file) {
            canvas2.height = video2.height;
            a2 = true;
            const objectURL = URL.createObjectURL(file);
            video2.src = objectURL;
        } else {
            a2 = false
        }
        if (a) {
            video2.style.display = "block";
        } else {
            video2.style.display = "none";
        }

    });

    video.addEventListener('play', function () {
        canvas.style.display = 'block';
        canvas.height = video.clientHeight;
        AnalizarPixeles(video, canvas, pixelCounts, ctx, "1", 0);
    });

    video2.addEventListener('play', function () {
        canvas2.style.display = 'block';
        canvas2.height = video2.clientHeight;
        AnalizarPixeles(video2, canvas2, pixelCounts2, ctx2, "2", 0);
    });

    function AnalizarPixeles(vid, canv, pixCount, ctxP, selectvid, pixtotales) {

        const interval = setInterval(function () {
            if (vid.paused || vid.ended) {
                clearInterval(interval);
                MostrarResumen(pixCount, true, selectvid, pixtotales);
                return;
            }

            ctxP.drawImage(vid, 0, 0, canv.width, canv.height);
            const imageData = ctxP.getImageData(0, 0, canv.width, canv.height);
            const pixels = imageData.data;

            for (let i = 0; i < pixels.length; i += 4) {
                pixtotales++;
                let rgb = pixels.slice(i, i + 4).join(',');
                let pixelExistente = pixCount.find((element) => element.color == rgb);
                if (pixelExistente != undefined) {
                    pixelExistente.veces++;
                } else {
                    pixCount.push({ color: rgb, veces: 1 });
                }
            }
            //MostrarResumen(pixCount,false, selectvid);

        }, 1000);
    }




    function MostrarResumen(pixlCounts, paso, selectvid,pixTotal) {
        // Limpiar la tabla
        let contador = 0;
        resumenTabla.innerHTML = '';
        HtmlTabla = "<tr><th>Color</th><th>Cantidad</th><th>Probabilidad</th><th>Frecuencia I(Sn)</th></tr>";
        //pixelCounts.sort(compararPorNombre);
        let Frecuencia = 0;
        let ProbabilidadN = 0;
        let Entropia = 0;
        let ProbaSuma = 0;
        for (const color in pixlCounts) {
            contador++;
            const count = pixlCounts[color].veces;
            let colorP = pixlCounts[color].color;
            if (!paso) {
                ProbabilidadN = "--";
                Frecuencia = "--";
                ProbaSuma = 1;
            } else {
                ProbabilidadN = Number(count / pixTotal);
                Frecuencia = Math.abs(Number(Math.log(ProbabilidadN) / Math.log(2)));
                ProbaSuma = ProbaSuma + Number(count / pixTotal);
                Entropia += Math.abs(ProbabilidadN * Frecuencia);
            }
            /*HtmlTabla += `<tr style=" background-color: rgba(${colorP});"><td style="color: rgba(${colorP}); filter: invert(100%);">rgba(${colorP})</td>
            <td style="color: rgba(${colorP}); filter: invert(100%);">${count}</td>
            <td style="color: rgba(${colorP}); filter: invert(100%);">${ProbabilidadN}</td>
            <td style="color: rgba(${colorP}); filter: invert(100%);">${Frecuencia}</td></tr>`;*/
        }
        let textHTML = "En total existen " + pixlCounts.length + " Simbolos.<br>En total existen " + pixTotal + " bloques.<br>Suma de probabilidades: " + ProbaSuma + ".<br>Entropia: " + Entropia;
        if (selectvid == "1") {
            btnVid1.style.display = "block";
            btnVid2.style.display = "none";
            Prob1 = ProbaSuma;
            Entro1 = Entropia;
            simb1 = pixlCounts.length;
            pix1 = pixTotal;
            pixelCounts = pixlCounts;
            //  resumenTabla.innerHTML = HtmlTabla;
            resumen.innerHTML = textHTML
        } else {
            btnVid1.style.display = "none";
            btnVid2.style.display = "block";
            Prob2 = ProbaSuma;
            Entro2 = Entropia;
            simb2 = pixlCounts.length;
            pix2 = pixTotal;
            pixelCounts2 = pixlCounts;
            //  resumenTabla.innerHTML = HtmlTabla;
            resumen2.innerHTML = textHTML;
        }

    }
});
function AnalisisVideo1() {
    blockVid1.style.display = "block";
    blockVid2.style.display = "none";
}
function AnalisisVideo2() {
    btnVid1.style.display = "none";
    btnVid2.style.display = "none";
    blockVid1.style.display = "none";
    blockVid2.style.display = "block";
}
function AnalisisGeneral() {
    blockVid1.style.display = "block";
    blockVid2.style.display = "block";
    let tablaGeneral = document.getElementById("resumenGeneral");
    let htmlResume = "<tr><td>Video</td><td>Entropia</td><td>Suma Probabilidades</td><td>Cantidad Pixeles</td> <td>Cantidad Simbolos</td><td>Ver resumen individual</td></tr>";
    htmlResume += "<tr><td>1</td><td>" + Entro1 + "</td><td>" + Prob1 + "</td><td>" + simb1 + "</td><td>" + pix1 + "</td><td><button class='btn btn-primary' onclick='verResumen(1)'>Ver Analisis</button></td></tr>";
    htmlResume += "<tr><td>2</td><td>" + Entro2 + "</td><td>" + Prob2 + "</td><td>" + simb2 + "</td><td>" + pix2 + "</td><td><button class='btn btn-primary' onclick='verResumen(2)'>Ver Analisis</button></td></td></tr>";
    tablaGeneral.innerHTML = htmlResume;
}
function verResumen(selectvid){
    let data;

    if (selectvid == 1){
        exportWSPlus(pixelCounts, "Analisis Video1.xlsx");
    }else{
        exportWSPlus(pixelCounts2, "Analisis Video2.xlsx");
    }		
}
function exportWorksheet(jsonObject, myFile) {
    var myWorkSheet = XLSX.utils.json_to_sheet(jsonObject);
    var myWorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(myWorkBook, myWorkSheet, "myWorkSheet");
    XLSX.writeFile(myWorkBook, myFile);
  }
  