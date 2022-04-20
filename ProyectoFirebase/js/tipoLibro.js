window.onload=function(){
    verAutenticacion();
    //Solo aquellos cuyo bhabilitado es 1
    firebase.firestore().collection("TipoLibro").where("bhabilitado","==","1")
    .onSnapshot(res=>{
        listarTipoLibros(res);
    });
}



function listarTipoLibros(res){


    var contenido="<table class='table mt-2'>";

    contenido+="<thead>";

    contenido+="<tr>";

    contenido+="<th>Id</th>";
    contenido+="<th>Nombre Tipo Libro</th>";
    contenido+="<th>Descripcion</th>";
    contenido+="<th>Operaciones</th>";

    contenido+="</tr>";

    contenido+="</thead>";


    contenido+="<tbody>";

    res.forEach(rpta=>{

        var fila=rpta.data();
        console.log(fila);
        console.log(rpta);

        contenido+="<tr>";

        contenido+="<td>"+rpta.id+"</td>";
        contenido+="<td>"+fila.nombre+"</td>";
        contenido+="<td>"+fila.descripcion+"</td>";
        contenido+="<td>";
        contenido+="<input type='button' class='btn btn-primary' value='Editar' onclick='AbrirModal(\""+rpta.id+"\")' data-toggle='modal' data-target='#exampleModal' />";
        contenido+=" <input type='button' value='Eliminar' class='btn btn-danger' onclick='Eliminar(\""+rpta.id+"\")' />";
        contenido+="</td>";


        contenido+="</tr>";
        
    })


    contenido+="</tbody>";


    contenido+="</table>";
    document.getElementById("divTipoLibro").innerHTML=contenido;

}

function AbrirModal(id){
    Limpiar();
if(id==0){
    document.getElementById("lblTitulo").innerHTML="Agregando Tipo Libro";
}else{
    document.getElementById("lblTitulo").innerHTML="Editando Tipo Libro";
    firebase.firestore().collection("TipoLibro").doc(id).get().then(res=>{
        //Obtuvimos el ID
        document.getElementById("txtIdTipoLibro").value= id;
        //Vamos a base de datos
        var data=  res.data();

        document.getElementById("txtnombre").value= data.nombre;
        document.getElementById("txtdescripcion").value=data.descripcion;

    }).catch(err=>{
        alert(err);
    })
}

}


function Limpiar(){
    //Oculta la alerta
    document.getElementById("alertaErrorRegistro").style.display="none";
    //Limpia los errores anteriores
    document.getElementById("alertaErrorRegistro").innerHTML="";



    //document.getElementById("txtIdTipoLibro").value="";
    //document.getElementById("txtnombre").value="";
    //document.getElementById("txtdescripcion").value="";
    LimpiarDatos();


}

function crearTipoLibro(){

    var IdTipoLibro=document.getElementById("txtIdTipoLibro").value;
    var nombre=document.getElementById("txtnombre").value;
    var descripcion=document.getElementById("txtdescripcion").value;
    var alertErrorCrearTipoLibro= document.getElementById("alertaErrorRegistro");
    //vALIDAR LA INFORMACION
    if(nombre==""){
        alertErrorCrearTipoLibro.style.display="block";
        alertErrorCrearTipoLibro.innerHTML="Debe ingresar el nombre del tipo libro";
        return;
    }
    if(descripcion==""){
        alertErrorCrearTipoLibro.style.display="block";
        alertErrorCrearTipoLibro.innerHTML="Debe ingresar la descripcion del tipo libro";
        return;
    }


    //Es nuevo
    if(IdTipoLibro==""){
        firebase.firestore().collection("TipoLibro").add({
            nombre:nombre,
            descripcion:descripcion,
            bhabilitado:"1"
        }).then(res=>{
            alert("Se agrego correctamente");
            document.getElementById("btnCancelar").click();
        }).catch(err=>{
            document.getElementById("alertaErrorRegistro").style.display="block";
            document.getElementById("alertaErrorRegistro").innerHTML=err;
        })

    }
    //Es editar
    else{
            firebase.firestore().collection("TipoLibro").doc(IdTipoLibro).update({
                descripcion:descripcion,
                nombre:nombre
            }).then(res=>{
                alert("Se actualizo correctamente");
                document.getElementById("btnCancelar").click();
            }).catch(err=>{
                alert(err);
            });
    }


}


function Eliminar(id){

    if(confirm("¿Deseas eliminar realmente?")==1){

        firebase.firestore().collection("TipoLibro").doc(id).update({
            bhabilitado:"0"

        }).then(res=>{
            alert("Se elimino correctamente");

        }).catch(err=>{

            alert(err);
        })



    }


}