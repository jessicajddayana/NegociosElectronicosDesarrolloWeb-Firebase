//Ya tengo en el array los libros
var libros=[];
window.onload=function(){
    verAutenticacion();
    //Traernos los libros
   firebase.firestore().collection("Libro").get().then(el=>{

      el.forEach((res)=>{
        libros.push({idLibro: res.id  , nombre: res.data().nombre});
      });
   }).catch(err=>{
       alert("No se trajo los libros");
   });


   firebase.auth().onAuthStateChanged(el=>{
     var idUser= firebase.auth().currentUser.uid;
     firebase.firestore().collection("Prestamos").where("idUser","==",idUser).
     where("devuelto","==",0).onSnapshot(res=>{
        listarMisPrestamos(res);
     });
   });



}

function listarMisPrestamos(res){

    var contenido="<table class='table'>";

    contenido+="<thead>";
    contenido+="<tr>";
    contenido+="<td>Id Prestamo</td>";
    contenido+="<td>Fecha reserva</td>";
    contenido+="<td>Nombre Libro</td>";
    contenido+="<td>Operaciones</td>";

    contenido+="</tr>";

    contenido+="</thead>";

    //Ponemos el contenido
    contenido+="<tbody>";

    res.forEach(el=>{
        var fila= el.data();
        contenido+="<tr>";
        contenido+="<td>"+el.id+"</td>";
        contenido+="<td>"+fila.fechaReserva+"</td>";
        contenido+="<td>";
        //Obtendre el nombre del libro
        contenido+= libros.filter(p=>p.idLibro==fila.idLibro).map(p=>p.nombre);
        contenido+="</td>";

        contenido+="<td>";
        contenido+="<button class='btn btn-primary' onclick='Devolver(\""+el.id+"\",\""+fila.idLibro+"\")'>Devolver</button>";
        contenido+="</td>";

        contenido+="</tr>";

    });

    contenido+="</tbody>";
    contenido+="</table>";

    document.getElementById("divMisPrestamos").innerHTML=contenido;
}

//
function Devolver(id,idLibro){
    
    if(confirm("Desea realizar la devolucion?")==1){
        mostrarLoading();
        firebase.firestore().collection("Prestamos").doc(id).update({
            devuelto:1
        }).then(res=>{
            //Sacamos el numero de libros disponibles
            firebase.firestore().collection("Libro").doc(idLibro).get().then(res=>{
                var disponibles=res.data().disponibles +1;
                //Actualizar el libro 
                firebase.firestore().collection("Libro").doc(idLibro).update({
                    disponibles:disponibles
                }).then(res=>{
                    ocultarLoading();
                    alert("Se realizo correctamente la devolucion");
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


}