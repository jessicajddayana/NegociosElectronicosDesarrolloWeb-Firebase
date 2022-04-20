window.onload=function(){
    verAutenticacion();
    //desc (descendente-> de mayor a menor)
    //asc (ascendente-> de menor a mayor)
    firebase.firestore().collection("Libro").where("bhabilitado","==",1).orderBy("nombre","desc")
    .onSnapshot(res=>{
        listarLibro(res);
    });
    listarTipoLibroCombo();
}


function listarTipoLibroCombo(){
var contenido="";
    firebase.firestore().collection("TipoLibro").where("bhabilitado","==","1").orderBy("nombre","asc")
    .onSnapshot(res=>{
        //Recorre
        contenido+="<option value=''>--Seleccione--</option>";

        res.forEach(rpta=>{
            //La infomacion como objeto
            var fila=rpta.data();

            contenido+="<option value='"+rpta.id+"'>"+fila.nombre+"</option>";
            console.log(fila);

        });

        document.getElementById("cboTipoLibro").innerHTML=contenido;
    });


}

function listarLibro(res){

    var contenido="<table class='table mt-2'>";

    contenido+="<thead>";

    contenido+="<tr>";

    contenido+="<th>Id</th>";
    contenido+="<th>Imagen Libro</th>";
    contenido+="<th>Nombre Libro</th>";
    contenido+="<th>Fecha Publicaciòn</th>";
    contenido+="<th>Nº Pag</th>";

    contenido+="<th>Operaciones</th>";

    contenido+="</tr>";

    contenido+="</thead>";


    contenido+="<tbody>";

    res.forEach(rpta=>{

        var fila=rpta.data();
        //console.log(fila);
 

        contenido+="<tr>";

        contenido+="<td>"+rpta.id+"</td>";
        contenido+="<td><img width='100' height='100' src="+fila.photoURL+" /></td>";
        contenido+="<td>"+fila.nombre+"</td>";
        contenido+="<td>"+fila.fechaPublicacion+"</td>";
        contenido+="<td>"+fila.numeroPaginas+"</td>";
        contenido+="<td>";
        contenido+="<input type='button' class='btn btn-primary' value='Editar' onclick='AbrirModal(\""+rpta.id+"\")' data-toggle='modal' data-target='#exampleModal' />";
        contenido+=" <input type='button' value='Eliminar' class='btn btn-danger' onclick='Eliminar(\""+rpta.id+"\")' />";
        contenido+="</td>";


        contenido+="</tr>";
        
    })


    contenido+="</tbody>";


    contenido+="</table>";
    document.getElementById("divLibro").innerHTML=contenido;



}

function Eliminar(id){

    if(confirm("Desea eliminar realmente el libro?")==1){
        firebase.firestore().collection("Libro").doc(id).update({
            bhabilitado:0
        }).then(res=>{
            alert("Se elimino correctamente");
        }).catch(err=>{
            alert("Ocurrio un error");
        })
    }


}

function DescargarLibro(){
    var a=document.createElement("a");
    a.href=urlArchivo;
    a.target="_blank";
    a.click();
}


var urlArchivo;
function AbrirModal(id){
    LimpiarDatos();
    document.getElementById("imgFotolLibro").src="";
    document.getElementById("iframePreview").src="";


    if(id==0){
        document.getElementById("lblTitulo").innerHTML="Agregando Libro";
    }else{
        document.getElementById("lblTitulo").innerHTML="Editando Libro";

        firebase.firestore().collection("Libro").doc(id).get().then(res=>{
            //Nos saca el objeto
            var data=res.data();
            document.getElementById("txtIdLibro").value=res.id;
            document.getElementById("txtnombre").value=data.nombre;
            document.getElementById("cboTipoLibro").value=data.iidTipoLibro;
            document.getElementById("txtFechaPublicacion").value=data.fechaPublicacion;
            document.getElementById("txtNumeroPagina").value=data.numeroPaginas;
            document.getElementById("txtcantidadTotal").value=data.cantidadTotal;
            document.getElementById("imgFotolLibro").src=data.photoURL;
            document.getElementById("iframePreview").src=data.fileURL;
            urlArchivo=data.fileURL;

            if(data.fileURL!=null && data.fileURL!=undefined){
                document.getElementById("btnDescargar").style.display="inline-block";
            }else{
                document.getElementById("btnDescargar").style.display="none";

            }


        }).catch(err=>{
            alert(err);
        });


    }
}


function subirImage(e){
    var file= e.files[0];
    var reader=new FileReader();


    reader.onloadend=function(){
        document.getElementById("imgFotolLibro").src= reader.result;
    }
    reader.readAsDataURL(file);


}


function subirArchivo(e){
    var file= e.files[0];
    var reader=new FileReader();


    reader.onloadend=function(){
        document.getElementById("iframePreview").src= reader.result;
    }
    reader.readAsDataURL(file);


}

function cerrarPopup(){

    document.getElementById("btnCancelar").click();
}

function guardarLibro(){
    var idLibro=document.getElementById("txtIdLibro").value;
    var nombre=document.getElementById("txtnombre").value;
    var idTipoLibro=document.getElementById("cboTipoLibro").value;
    var fechaPublicacion=document.getElementById("txtFechaPublicacion").value;
    var numeroPaginas=document.getElementById("txtNumeroPagina").value;
    var cantidadTotal=document.getElementById("txtcantidadTotal").value;
    var img=document.getElementById("fileImage").files[0];
    var file=document.getElementById("file").files[0];

    if(idLibro==""){

        firebase.firestore().collection("Libro").add({
            nombre:nombre,
            fechaPublicacion:fechaPublicacion,
            numeroPaginas:numeroPaginas * 1,
            cantidadTotal:cantidadTotal * 1,
            disponibles:cantidadTotal * 1,
            iidTipoLibro:idTipoLibro,
            bhabilitado:1
        }).then(res=>{
            var id= res.id;
            //Este if ve si es que se subio una imagen o un archivo
            if (img != undefined && img != null && file != undefined && file != null) {
                //Si es que una imagen se registro
                if (img != undefined && img != null) {

                    var refImg = firebase.storage().ref("libroImg/" + id + "/" + img.name);
                    var subImg = refImg.put(img);

                    subImg.on("state_changed", () => { }, (err) => { alert(err) }, () => {

                        subImg.snapshot.ref.getDownloadURL().then(url => {

                            firebase.firestore().collection("Libro").doc(id).update({
                                photoURL: url
                            }).then(respuesta => {

                                alert("Se subio la imagen correctamente")
                                cerrarPopup();
                            }).catch(err => {
                                alert(err);
                            });

                        }).catch(err => {
                            alert(err);

                        });


                    });



                }
                //Archivo en PDF
                if ((img != undefined && img != null) || (file != undefined && file != null)) {

                    var refImg = firebase.storage().ref("libroFile/" + id + "/" + file.name);
                    var subFile = refImg.put(file);

                    subFile.on("state_changed", () => { }, (err) => { alert(err) }, () => {

                        subFile.snapshot.ref.getDownloadURL().then(url => {

                            firebase.firestore().collection("Libro").doc(id).update({
                                fileURL: url
                            }).then(respuesta => {

                                alert("Se subio el archivo PDF correctamente");
                                cerrarPopup();

                            }).catch(err => {
                                alert(err);
                            });

                        }).catch(err => {
                            alert(err);
                            console.log(err);
                        });


                    });



                }








            } else {
                alert("Se registro correctamente")

            }

        }).catch(err=>{
            alert(err);
        })

    }else{
        //Editando Informacion
        firebase.firestore().collection("Libro").doc(idLibro).update({
            nombre:nombre,
            fechaPublicacion:fechaPublicacion,
            numeroPaginas:numeroPaginas * 1,
            cantidadTotal:cantidadTotal * 1,
            disponibles:cantidadTotal * 1,
            iidTipoLibro:idTipoLibro,
            bhabilitado:1
        }).then(res=>{
            //var id= res.id;
            //Este if ve si es que se subio una imagen o un archivo
            if ((img != undefined && img != null) || (file != undefined && file != null)) {
                //Si es que una imagen se registro
                if (img != undefined && img != null) {

                    var refImg = firebase.storage().ref("libroImg/" + idLibro + "/" + img.name);
                    var subImg = refImg.put(img);

                    subImg.on("state_changed", () => { }, (err) => { alert(err) }, () => {

                        subImg.snapshot.ref.getDownloadURL().then(url => {

                            firebase.firestore().collection("Libro").doc(idLibro).update({
                                photoURL: url
                            }).then(respuesta => {

                                alert("Se subio la imagen correctamente")
                                cerrarPopup();
                            }).catch(err => {
                                alert(err);
                            });

                        }).catch(err => {
                            alert(err);

                        });


                    });



                }
                //Archivo en PDF
                if (file != undefined && file != null) {

                    var refImg = firebase.storage().ref("libroFile/" + idLibro + "/" + file.name);
                    var subFile = refImg.put(file);

                    subFile.on("state_changed", () => { }, (err) => { alert(err) }, () => {

                        subFile.snapshot.ref.getDownloadURL().then(url => {

                            firebase.firestore().collection("Libro").doc(idLibro).update({
                                fileURL: url
                            }).then(respuesta => {

                                alert("Se subio el archivo PDF correctamente");
                                cerrarPopup();

                            }).catch(err => {
                                alert(err);
                            });

                        }).catch(err => {
                            alert(err);

                        });


                    });



                }








            } else {
                alert("Se edito correctamente")

            }

        }).catch(err=>{
            alert(err);
        })

    }



}
