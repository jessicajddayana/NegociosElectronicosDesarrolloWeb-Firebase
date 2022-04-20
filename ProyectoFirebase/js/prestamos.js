window.onload=function(){
    verAutenticacion();

    firebase.firestore().collection("Libro").where("disponibles",">",0)
     .where("bhabilitado","==",1).onSnapshot(res=>{

        listarLibrosPrestamos(res);
    });


}

function listarLibrosPrestamos(res){

    var contenido="";
    res.forEach(rpta=>{
        var fila= rpta.data();

        contenido+=`<div class="card m-5 " style="width: 18rem;min-height:398px">
        <div style="min-height:205px">
        <img src=${fila.photoURL} class="card-img-top" style="width:18rem" >
        </div>
        <div class="card-body">
          <h5 class="card-title">${fila.nombre}</h5>
          <p class="card-text">Fecha publicaciòn : ${fila.fechaPublicacion}</p>
          <p class="card-text">Fecha publicaciòn : ${fila.disponibles}/${fila.cantidadTotal}</p>

          <button class='btn btn-primary' onclick='Descargar(\" ${fila.fileURL} \")'>Descargar</button>
          <button class='btn btn-primary' onclick='Reservar(\"${rpta.id}\")' >Reservar</button>

        </div>
      </div>`;

    });


    document.getElementById("divPrestamos").innerHTML=contenido;


 
}

function Descargar(file){
    var a=document.createElement("a");
    a.href=file;
    a.target="_blank";
    a.click();
}

function Reservar(id){

    if(confirm("Desea realmente reservar?")==1){
        var exito=false;
        mostrarLoading();
        var userId= firebase.auth().currentUser.uid;
        // idLibro  idUser  devuelto (0 1)
        firebase.firestore().collection("Prestamos").where("devuelto","==",0)
        .where("idUser","==",userId).where("idLibro","==",id).get().then(resp=>{
            var cantidad=0;

            resp.forEach(nveces=>{
                cantidad++;
            });

            if(cantidad==0)      realizarReserva(id)
            else {alert("Ya reservo ese libro"); ocultarLoading()}

        }).catch(err=>{
            ocultarLoading();
            alert(err);
        })





    }


    
}

function realizarReserva(id){

    firebase.firestore().collection("Libro").doc(id).get().then(res=>{

        var obj=res.data();
        var disponibles= res.data().disponibles;
        disponibles--;
        //Actualizar el valor en la coleccion libros
        return firebase.firestore().collection("Libro").doc(id).update({
            disponibles:disponibles
        }).then(res=>{
            //Registrar el prestamo
            var userId= firebase.auth().currentUser.uid;
            firebase.firestore().collection("Prestamos").add({
                idUser:userId,
                idLibro:id,
                fechaReserva: new Date().toLocaleDateString(),
                devuelto:0
            }).then(res=>{
                ocultarLoading();
                alert("Se reservo correctamente el libro");
               
            }).catch(err=>{
                ocultarLoading();
                alert(err);
                
            })

        }).catch(err=>{
            ocultarLoading();
            alert(err);
        })


    }).catch(err=>{
        ocultarLoading();
        alert(err);
    })



}