// Crear un SoundAudioContext para desbloquear el audio
const SoundAudioContext = new (window.AudioContext || window.webkitAudioContext)();

// Variable global para el audio actual
let currentAudio = null;

// Variable para habilitar o deshabilitar el sonido
let habilitarSonido = confirm("¿Deseas habilitar el sonido?");

// Lista de archivos de sonido
const archivosWav = [
    "btnBuenodale.wav",
    "btnJugar.wav",
    "btnNohacefalta.wav",
    "cha.wav",
    "estaserinto.wav",
    "indicacionFlecha.wav",
    "instruccion - bienvenida.wav",
    "instruccion - simbolos.wav",
    "intro - Audiosasistido.wav",
    "intro - bienvenida.wav",
    "mano.wav",
    "palo.wav",
    "selectBASE.wav",
    "selectCLAVE.wav",
    "selectRESONGO.wav",
    "slide2.wav",
    "slide3.wav",
    "slide4.wav"
];

// Crear un objeto para almacenar los elementos de audio pre-cargados
const audios = {};

// Pre-cargar todos los audios
archivosWav.forEach(fileName => {
    const audio = new Audio(`sonidos/${fileName}`);
    audio.preload = "auto";
    audios[fileName] = audio;
});

// Función para reproducir el sonido inicial
function PlayInitialSound() {
    SoundAudioContext.resume().then(() => {
        console.log("Contexto de sonido desbloqueado");

        currentAudio = audios[archivosWav[7]]; // Seleccionar el sonido inicial
        if (!currentAudio) {
            console.error("El archivo de sonido inicial no existe.");
            return;
        }

        const track = SoundAudioContext.createMediaElementSource(currentAudio);
        track.connect(SoundAudioContext.destination);

        currentAudio.currentTime = 0; // Reiniciar al inicio
        currentAudio.play()
            .then(() => {
                console.log(`Reproduciendo: ${archivosWav[7]}`);
            })
            .catch(error => {
                console.error(`Error al reproducir sonido inicial: ${error}`);
            });
    }).catch(error => {
        console.error("Error al desbloquear el contexto de sonido:", error);
    });
}

// Reproducir el sonido inicial si el usuario habilita el sonido
if (habilitarSonido) {
    PlayInitialSound();
}

// Función para reproducir cualquier sonido
async function PlaySound(fileName) {
    if (!habilitarSonido) return; // Si el sonido está deshabilitado, no hacer nada

    // Si el contexto de audio está suspendido, reanudarlo
    if (SoundAudioContext.state === "suspended") {
        await SoundAudioContext.resume();
    }

    // Si hay un audio reproduciéndose, detenerlo
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0; // Reiniciar el tiempo al inicio
    }

    // Obtener el audio pre-cargado
    currentAudio = audios[fileName];
    if (!currentAudio) {
        console.error(`El archivo ${fileName} no existe.`);
        return;
    }

    // Conectar el audio al contexto
    const track = SoundAudioContext.createMediaElementSource(currentAudio);
    track.connect(SoundAudioContext.destination);

    // Reproducir el nuevo audio
    currentAudio.currentTime = 0; // Reiniciar al inicio
    currentAudio.play()
        .then(() => {
            console.log(`Reproduciendo: ${fileName}`);
        })
        .catch(error => {
            console.error(`Error al reproducir el sonido: ${error}`);
        });
}

// Ejemplo: Reproducir un sonido por su nombre
// PlaySound("btnJugar.wav");
