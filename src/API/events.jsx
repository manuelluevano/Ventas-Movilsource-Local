// LOGIN & REGISTER
export async function loginApi(email, password) {
  console.log(email, password);
  try {
    var requestOptions = {
      method: "POST",
      redirect: "follow",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    const url = `https://api-movilsource-local-26dce06d51d7.herokuapp.com/user/login`;
    // const url = `http://localhost:3000/apiuser/login`;

    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error login", error);
  }
}
export async function registerApi(name, surname, email, password) {
  try {
    var requestOptions = {
      method: "POST",
      redirect: "follow",
      body: JSON.stringify({
        name,
        surname,
        email,
        password,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    const url = `https://api-movilsource-local-26dce06d51d7.herokuapp.com/user/register`;

    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error login", error);
  }
}

// SERVICES
export async function addService(
  name,
  telefono,
  servicio,
  modelo,
  marca,
  imei,
  sn,
  precio,
  abono,
  created_at,
  folio,
  observaciones,
  token
) {
  console.log("token", token);

  let finalString = token.split('"').join("");

  console.log("token modificado", finalString);

  try {
    var requestOptions = {
      method: "POST",
      redirect: "follow",
      body: JSON.stringify({
        name,
        telefono,
        servicio,
        marca,
        modelo,
        imei,
        sn,
        precio,
        abono,
        created_at,
        folio,
        observaciones,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `${finalString}`,
      },
    };

    const url = `https://api-movilsource-local-26dce06d51d7.herokuapp.com/service/servicio`;
    // const url = `http://localhost:3000/api/service/servicio`;

    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error login", error);
  }
}
export async function listServices(token) {
  let finalString = token.split('"').join("");

  try {
    var requestOptions = {
      method: "get",
      redirect: "follow",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `${finalString}`,
      },
    };

    const url = `https://api-movilsource-local-26dce06d51d7.herokuapp.com/service/servicios`;
    // const url = `http://localhost:3000/api/service/servicios`;
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error login", error);
  }
}

export async function equipoTerminado(id) {
  //GET TOKEN
  const token = localStorage.getItem("token");
  let finalString = token.split('"').join("");
  try {
    var requestOptions = {
      method: "post",
      redirect: "follow",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `${finalString}`,
      },
    };

    const url = `https://api-movilsource-local-26dce06d51d7.herokuapp.com/service/servicio/status/${id}`;
    // const url = `http://localhost:3000/api/service/servicio/complete/${id}`;

    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error login", error);
  }
}

export async function equipoEntregado(id) {
  //GET TOKEN
  const token = localStorage.getItem("token");
  let finalString = token.split('"').join("");
  try {
    var requestOptions = {
      method: "post",
      redirect: "follow",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `${finalString}`,
      },
    };

    const url = `https://api-movilsource-local-26dce06d51d7.herokuapp.com/service/servicio/status/${id}`;
    // const url = `http://localhost:3000/api/service/servicio/status/${id}`;

    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error login", error);
  }
}
export async function searchService(search) {
  //GET TOKEN
  const token = localStorage.getItem("token");
  let finalString = token.split('"').join("");
  try {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `${finalString}`,
      },
    };

    const url = `https://api-movilsource-local-26dce06d51d7.herokuapp.com/service/servicios/${search}`;

    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error login", error);
  }
}
export async function updateService(id, objterminado) {
  //DESTRUCTURING DEL  OBJETO

  const {
    nameNew,
    telefonoNew,
    marcaNew,
    modeloNew,
    servicioNew,
    precioNew,
    folioNew,
    abonoNew,
    observacionesNew,
  } = objterminado;
  console.log("DATOS OBTENIDOS", id, nameNew);

  const token = localStorage.getItem("token");
  let finalString = token.split('"').join("");

  // console.log("token modificado", finalString);

  try {
    var requestOptions = {
      method: "PUT",
      redirect: "follow",
      body: JSON.stringify({
        name: nameNew,
        telefono: telefonoNew,
        servicio: servicioNew,
        marca: marcaNew,
        modelo: modeloNew,
        precio: precioNew,
        abono: abonoNew,
        folio: folioNew,
        observaciones: observacionesNew,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `${finalString}`,
      },
    };

    const url = `https://api-movilsource-local-26dce06d51d7.herokuapp.com/service/servicio/${id}`;
    // const url = `http://localhost:3000/api/service/servicio/${id}`;
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error login", error);
  }
}
export async function editService(id, objterminado) {
  //DESTRUCTURING DEL  OBJETO

  const { refaccionNew, marcaNew, calidadNew, precioNew, stockNew } =
    objterminado;

  // const token = localStorage.getItem("token");
  // let finalString = token.split('"').join("");

  // console.log("token modificado", finalString);

  try {
    var requestOptions = {
      method: "PUT",
      redirect: "follow",
      body: JSON.stringify({
        refaccion: refaccionNew,
        marca: marcaNew,
        calidad: calidadNew,
        precio: precioNew,
        stock: stockNew,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        // Authorization: `${finalString}`,
      },
    };

    const url = `https://api-movilsource-local-26dce06d51d7.herokuapp.com/service/servicio/${id}`;
    // const url = `http://localhost:3000/api/refaccion/refaccion/${id}`;
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error login", error);
  }
}

//LIST ACCESORIOS
export async function addAccesorio(nombre, precio, stock, categoria, imagen) {
  //GET TOKEN
  const token = localStorage.getItem("token");

  console.log("token", token);

  let finalString = token.split('"').join("");

  console.log("token modificado", finalString);

  try {
    var requestOptions = {
      method: "POST",
      redirect: "follow",
      mode: "cors",
      body: JSON.stringify({
        nombre,
        precio,
        stock,
        categoria,
        imagen
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `${finalString}`,
      },
    };

    const url = `https://api-movilsource-local-26dce06d51d7.herokuapp.com/accesorio/accesorio`;
    // const url = "http://localhost:3000/accesorio/accesorio";

    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error login", error);
  }
}

export async function listAccesorios() {
  
  const token = localStorage.getItem("token");
  let finalString = token.split('"').join("");

  try {
    var requestOptions = {
      method: "get",
      redirect: "follow",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `${finalString}`,
      },
    };

    const url = `https://api-movilsource-local-26dce06d51d7.herokuapp.com/accesorio/accesorios`;
    // const url = `http://localhost:3000/accesorio/accesorios`;
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error login", error);
  }
}

export async function searchAccesorio(search) {
  //GET TOKEN
  const token = localStorage.getItem("token");
  let finalString = token.split('"').join("");
  try {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `${finalString}`,
      },
    };

    const url = `https://api-movilsource-local-26dce06d51d7.herokuapp.com/accesorio/accesorios/${search}`;
    // const url = `http://localhost:3000/api/accesorio/accesorios/${search}`;

    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error login", error);
  }
}

export async function getAccesorioID(id) {
  try {
    var requestOptions = {
      method: "get",
      redirect: "follow",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    const url = `https://api-movilsource-local-26dce06d51d7.herokuapp.com/accesorio/accesorio/${id}`;
    // const url = `http://localhost:3000/api/accesorio/accesorio/${id}`;

    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error al traer Accesorio", error);
  }
}

export async function updateAccesorio(
  id,
  nombre,
  precio,
  stock,
  categoria,
  imagen
) {
  const token = localStorage.getItem("token");
  let finalString = token.split('"').join("");

  // console.log("token modificado", finalString);

  try {
    var requestOptions = {
      method: "PATCH",
      redirect: "follow",
      body: JSON.stringify({
        nombre,
        precio,
        stock,
        imagen,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `${finalString}`,
      },
    };

    const url = `https://api-movilsource-local-26dce06d51d7.herokuapp.com/accesorio/accesorio/${id}`;
    // const url = `http://localhost:3000/api/accesorio/accesorio/${id}`;
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error login", error);
  }
}
export async function accesorioVenta(id) {
  //GET TOKEN
  const token = localStorage.getItem("token");
  let finalString = token.split('"').join("");
  try {
    var requestOptions = {
      method: "post",
      redirect: "follow",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `${finalString}`,
      },
    };

    const url = `https://api-movilsource-local-26dce06d51d7.herokuapp.com/accesorio/accesorio/${id}`;
    // const url = `http://localhost:3000/api/accesorio/accesorio/${id}`;

    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error login", error);
  }
}

//PEDIDOS DE ACCESORIOS
export async function createReportsAccesorio(user, accesorio, total) {
  console.log(user, accesorio, total);
  const token = localStorage.getItem("token");

  let finalString = token.split('"').join("");

  // console.log(user, pedido, total);

  // // console.log("token modificado", finalString);

  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      user,
      accesorio,
      total,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    // const url = `  http://localhost:3000/api/pedido/accesorios`;
    // fetch("http://localhost:3000/api/pedido/accesorios", requestOptions)
    //   .then((response) => response)
    //   .then((result) => result)
    //   .catch((error) => console.error(error));

    // const url = `http://localhost:3000/api/pedido/accesorios`;
    const url = `https://api-movilsource-local-26dce06d51d7.herokuapp.com/pedido/accesorios`;

    const response = await fetch(url, requestOptions);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log("error login", error);
  }
}

export async function listAccesoriosReport() {
  const token = localStorage.getItem("token");
  let finalString = token.split('"').join("");

  try {
    var requestOptions = {
      method: "get",
      redirect: "follow",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `${finalString}`,
      },
    };

    const url = `https://api-movilsource-local-26dce06d51d7.herokuapp.com/pedido/accesorios`;
    // const url = `http://localhost:3000/api/pedido/accesorios`;
    const response = await fetch(url, requestOptions);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log("error login", error);
  }
}
// REFACCIONES
// export async function listRefacciones() {
//   //GET TOKEN
//   const token = localStorage.getItem("token");
//   let finalString = token.split('"').join("");

//   try {
//     var requestOptions = {
//       method: "get",
//       redirect: "follow",
//       headers: {
//         "Content-type": "application/json; charset=UTF-8",
//         Authorization: `${finalString}`,
//       },
//     };

//     const url = `https://gray-different-panda.cyclic.app/api/refaccion/refacciones`;
//     // const url = `http://localhost:3000/api/refaccion/refacciones`;

//     const response = await fetch(url, requestOptions);
//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.log("error al traer lista refacciones", error);
//   }
// }
// export async function getRefaccionID(id) {
//   try {
//     var requestOptions = {
//       method: "get",
//       redirect: "follow",
//       headers: {
//         "Content-type": "application/json; charset=UTF-8",
//       },
//     };

//     // const url = `https://gray-different-panda.cyclic.app/api/refaccion/refacciones`;
//     const url = `http://localhost:3000/api/refaccion/refaccionDetail/${id}`;

//     const response = await fetch(url, requestOptions);
//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.log("error al traer lista refacciones", error);
//   }
// }

// export async function addNewRefaccion(
//   refaccion,
//   modelo,
//   marca,
//   calidad,
//   precio,
//   stock,
//   imagen
// ) {
//   //GET TOKEN
//   // const token = localStorage.getItem("token");
//   // let finalString = token.split('"').join("");

//   try {
//     var requestOptions = {
//       method: "POST",
//       redirect: "follow",
//       body: JSON.stringify({
//         refaccion,
//         modelo,
//         marca,
//         calidad,
//         precio,
//         stock,
//         imagen,
//       }),
//       headers: {
//         "Content-type": "application/json; charset=UTF-8",
//         // Authorization: `${finalString}`,
//       },
//     };

//     const url = `https://gray-different-panda.cyclic.app/api/refaccion/refaccion`;
//     // const url = `http://localhost:3000/api/refaccion/refaccion`;

//     const response = await fetch(url, requestOptions);
//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.log("error al crear refaccion", error);
//   }
// }

// export async function searchRefaccion(search) {
//   //GET TOKEN
//   // const token = localStorage.getItem("token");
//   // let finalString = token.split('"').join("");
//   try {
//     var requestOptions = {
//       method: "GET",
//       redirect: "follow",
//       headers: {
//         "Content-type": "application/json; charset=UTF-8",
//         // Authorization: `${finalString}`,
//       },
//     };

//     // const url = `http://localhost:3000/api/refaccion/refacciones/${search}`;
//     const url = `https://gray-different-panda.cyclic.app/api/refaccion/refacciones/${search}`;

//     const response = await fetch(url, requestOptions);
//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.log("error search", error);
//   }
// }

// REPORTS
// export async function listReports() {
//   //GET TOKEN
//   // const token = localStorage.getItem("token");
//   // let finalString = token.split('"').join("");
//   try {
//     var requestOptions = {
//       method: "GET",
//       redirect: "follow",
//       headers: {
//         "Content-type": "application/json; charset=UTF-8",
//         Authorization: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY1MGQzMTU1ZmEyMjg5ZDQzNjFmODIwYSIsIm5hbWUiOiJtYW51ZWwiLCJzdXJuYW1lIjoibHVldmFubyIsImVtYWlsIjoibWFudWVsQGdtYWlsLmNvbSIsInJvbGUiOiJyb2xlX3VzZXIiLCJpbWFnZW4iOiJkZWZhdWx0LnBuZyIsImlhdCI6MTY5NTcwNzk0OCwiZXhwIjoxNjk4Mjk5OTQ4fQ.DwY9J55Yw0Y_BW05bPExstYmV2pY72fXbVC6w0VkDgQ`,
//       },
//     };

//     // const url = `http://localhost:3000/api/reporte/refacciones`;
//     const url = `https://gray-different-panda.cyclic.app/api/reporte/refacciones`;

//     const response = await fetch(url, requestOptions);
//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.log("error search", error);
//   }
// }
// export async function createReports(refaccion, fecha) {
//   const token = localStorage.getItem("token");

//   let finalString = token.split('"').join("");

//   console.log("token modificado", finalString);

//   try {
//     var requestOptions = {
//       method: "POST",
//       redirect: "follow",
//       body: JSON.stringify({
//         refaccion,
//         fecha,
//       }),
//       headers: {
//         "Content-type": "application/json; charset=UTF-8",
//         Authorization: `${finalString}`,
//       },
//     };

//     // const url = `http://localhost:3000/api/reporte/refaccion`;
//     const url = `https://gray-different-panda.cyclic.app/api/reporte/refaccion`;

//     const response = await fetch(url, requestOptions);
//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.log("error login", error);
//   }
// }
// //PRECIO DOLAR
// export async function precioDolar() {
//   try {
//     var requestOptions = {
//       method: "GET",
//       redirect: "follow",
//     };

//     const url = "https://api.exchangerate.host/latest?base=USD&symbols=MXN";

//     const response = await fetch(url, requestOptions);
//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.log("error login", error);
//   }
// }
