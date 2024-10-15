import moment from "moment";

export function toTitleCase(str) {
  const titleCase = str
    .toLowerCase()
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

  return titleCase;
}

export async function handleDate() {
  const today = new Date();
  console.log(typeof( today));

  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();
  const hora = today.getHours();
  const minuto = today.getMinutes();
  const formattedMinutes = minuto < 10 ? "0" + minuto : minuto;
  

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const formattedToday =
    dd + "/" + mm + "/" + yyyy + " " + hora + ":" + formattedMinutes;

  console.log("Fecha actual", formattedToday);

  return today;
}


export async function handleMesActual(){
  const fecha = new Date();

    const hoy = fecha.getDate();
    const mesActual = fecha.getMonth() + 1;

    return mesActual
}


export const marcas = [
  {
    label: "IPHONE",
    value: "IPHONE",
  },
  {
    label: "MACKBOOK",
    value: "MACKBOOK",
  },
  {
    label: "IPAD",
    value: "IPAD",
  },
  {
    label: "APPLE WATCH",
    value: "APPLE WATCH",
  },
  {
    label: "SAMSUNG",
    value: "SAMSUNG",
  },
  {
    label: "XIAOMI",
    value: "XIAOMI",
  },
  {
    label: "MOTOROLA",
    value: "MOTOROLA",
  },
  {
    label: "OPPO",
    value: "OPPO",
  },
  {
    label: "HUAWEI",
    value: "HUAWEI",
  },
  {
    label: "LANIX",
    value: "LANIX",
  },
  {
    label: "REALME",
    value: "REALME",
  },
  {
    label: "ZTE",
    value: "ZTE",
  },
  {
    label: "LG",
    value: "LG",
  },
  {
    label: "HONOR",
    value: "HONOR",
  },
  {
    label: "VIVO",
    value: "VIVO",
  },
  {
    label: "SONIC",
    value: "SONIC",
  },
  {
    label: "DELL",
    value: "DELL",
  },
  {
    label: "HP",
    value: "HP",
  },
  {
    label: "OTRO",
    value: "OTRO",
  }
];

export const servicios = [
  {
    label: "FLASH SOFTWARE",
    value: "FLASH SOFTWARE",
  },
  {
    label: "FRP",
    value: "FRP",
  },
  {
    label: "MDM - PAYJOY",
    value: "MDM - PAYJOY",
  },
  {
    label: "LIBERACION - CODIGO",
    value: "LIBERACION - CODIGO",
  },
  {
    label: "LIBERACION - RSIM",
    value: "LIBERACION - RSIM",
  },
  {
    label: "LIBERACION - SERVER",
    value: "LIBERACION - SERVER",
  },
  {
    label: "KG LOCKED - BYPASS",
    value: "KG LOCKED - BYPASS",
  },
  {
    label: "MI ACCOUNT - BYPASS",
    value: "MI ACCOUNT - BYPASS",
  },
  {
    label: "MI ACCOUNT - RAIZ",
    value: "MI ACCOUNT - RAIZ",
  },
  {
    label: "ICLOUD - RAIZ - SERVER",
    value: "ICLOUD - RAIZ - SERVER",
  },
  {
    label: "ICLOUD - BYPASS FULL SENAL",
    value: "ICLOUD - BYPASS FULL SENAL",
  },
  {
    label: "ICLOUD - BYPASS SIN SENAL",
    value: "ICLOUD - BYPASS SIN SENAL",
  },
  {
    label: "APPLE - TAPA POR LASER",
    value: "APPLE - TAPA POR LASER",
  },
  {
    label: "LIMPIEZA",
    value: "LIMPIEZA",
  },
  {
    label: "TAPA",
    value: "TAPA",
  },
  {
    label: "CONTRA-TAPA",
    value: "CONTRA-TAPA",
  },
  {
    label: "CRISTAL CAMARA",
    value: "CRISTAL CAMARA",
  },
  {
    label: "FLEX - INTERCONEXION",
    value: "FLEX - INTERCONEXION",
  },
  {
    label: "FLEX - CARGA",
    value: "FLEX - CARGA",
  },
  {
    label: "PIN DE CARGA - V8",
    value: "PIN DE CARGA - V8",
  },
  {
    label: "PIN DE CARGA - TIPO C",
    value: "PIN DE CARGA - TIPO C",
  },
  {
    label: "BATERIA - CALIDAD ORIGINAL",
    value: "BATERIA - CALIDAD ORIGINAL",
  },
  {
    label: "BATERIA - ORIGINAL 100%",
    value: "BATERIA - ORIGINAL 100%",
  },
  {
    label: "DISPLAY - CALIDAD IPS",
    value: "DISPLAY - CALIDAD IPS",
  },
  {
    label: "DISPLAY - ORIGINAL 100%",
    value: "DISPLAY - ORIGINAL 100%",
  },
  {
    label: "REMANUFACTURA DE PANTALLA",
    value: "REMANUFACTURA DE PANTALLA",
  },
  {
    label: "CAMBIO LED'S TV",
    value: "CAMBIO LED'S TV",
  },
  {
    label: "GARANTIA",
    value: "GARANTIA",
  },
  {
    label: "DIAGNOSTICO",
    value: "DIAGNOSTICO",
  },
  {
    label: "OTRO",
    value: "OTRO",
  },
];
export const refacciones = [
  {
    label: "DISPLAY",
    value: "DISPLAY",
  },
  {
    label: "DISPLAY CON MARCO",
    value: "DISPLAY CON MARCO",
  },
  {
    label: "BATERIA",
    value: "BATERIA",
  },
  {
    label: "FLEX CARGA",
    value: "FLEX CARGA",
  },
  {
    label: "TAPA ORIGINAL",
    value: "TAPA ORIGINAL",
  },
  {
    label: "CHASIS ORIGINAL",
    value: "CHASIS ORIGINAL",
  },
  {
    label: "TAPA GENEFICA",
    value: "TAPA GENERICA",
  },
  {
    label: "FLEX ENCENDIDO",
    value: "FLEX ENCENDIDO",
  },
  {
    label: "FLEX CAMARA FRONTAL",
    value: "FLEX CAMARA FRONTAL ",
  },
  {
    label: "FLEX AUDICULAR",
    value: "FLEX AUDICULAR",
  },
  {
    label: "FLEX HOME",
    value: "FLEX HOME",
  },
  {
    label: "HUELLA",
    value: "HUELLA",
  },
  {
    label: "CRISTAL CAMARAS",
    value: "CRISTAL CAMARAS",
  },
  {
    label: "PIN DE CARGA V8",
    value: "PIN DE CARGA TIPO C",
  },
  {
    label: "GLASS", 
    value: "GLASS",
  },
  {
    label: "RSIM",
    value: "RSIM",
  },
  {
    label: "QPE",
    value: "QPE",
  },
  {
    label: "BANDEJA DE SIM",
    value: "BANDEJA DE SIM",
  },
  {
    label: "MICROFONO",
    value: "MICROFONO",
  },
  {
    label: "CAMARA TRASERA",
    value: "CAMARA TRASERA",
  },
  {
    label: "BOCINA / ALTAVOZ",
    value: "BOCINA / ALTAVOZ",
  },
  {
    label: "REPUESTO TORNILLOS",
    value: "REPUESTO TORNILLOS",
  },
  {
    label: "VIBRADOR",
    value: "VIBRADOR",
  },
];
export const calidades = [
  {
    label: "ORIGINAL",
    value: "ORIGINAL",
  },
  {
    label: "CALIDAD IPS",
    value: "CALIDAD IPS",
  },
  {
    label: "GENERICO",
    value: "GENERICO",
  },
  {
    label: "INCELL",
    value: "INCELL",
  },
  {
    label: "OLED",
    value: "OLED",
  },
  {
    label: "IPS",
    value: "IPS",
  }
];
export const categorias = [
  {
    label: "CARGADORES",
    value: "CARGADORES",
  },
  {
    label: "CABLES",
    value: "CABLES",
  },
  {
    label: "RSIM",
    value: "RSIM",
  },
  {
    label: "CUBOS DE CARGA",
    value: "CUBOS DE CARGA",
  },
  {
    label: "ADAPTADORES",
    value: "ADAPTADORES",
  },
  {
    label: "MICA HIDROGUEL",
    value: "MICA HIDROGUEL",
  },
  {
    label: "AUDIFONOS",
    value: "AUDIFONOS",
  }
];
export function handleMessage() {
  return new Promise((resolve) => setTimeout(resolve, 3000));

   // eslint-disable-next-line no-unreachable
   {/* 
   <button
        onClick={() => {
          toast.promise(
            () => new Promise((resolve) => setTimeout(resolve, 2000)),
            {
              loading: "Loading",
              success: "Success",
              error: "Error",
            }
          );
        }}
      >
        Aceptar
      </button>
      <button
        onClick={() => {
          toast.promise(uploadSomething, {
            style: {
              color: "white",
            },
            loading: "Loading...",
            success: (data) => {
              return `${data.name} has been added!`;
            },
            error: "Error",
          });
        }}
      >
        Aceptar
      </button>
      <button
        onClick={() => {
          toast("Terminos y condiciones", {
            description: "Gracias por aceptar",
            icon: (
              <BiCheck
                style={{
                  color: "white",
                  fontSize: "1rem",
                  marginRight: "1rem",
                }}
              />
            ),
          });
        }}
      >
        Aceptar
      </button>
     
    */}
}


 // FORMATEAR FECHAS
 export const  formatearFecha = fecha =>  {
  const nuevaFecha = new Date(fecha)

  const opciones ={
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  return nuevaFecha.toLocaleDateString('es-ES', opciones)
}


