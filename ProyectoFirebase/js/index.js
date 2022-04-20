window.onload=function(){
    verAutenticacion();
}


function iniciarSesion(){
    var email=document.getElementById("txtcorreoIngresar").value;
    var password=document.getElementById("txtcontraIngresar").value;
    firebase.auth().signInWithEmailAndPassword(email,password).then(res=>{
        
        document.location.href="/misPrestamos.html";
        //IMAGEN
        if(res.user.photoURL!=null){
            document.getElementById("imgFotoUsuario").src=res.user.photoURL;
        }else{
            document.getElementById("imgFotoUsuario").src="img/noFoto.jpg";
        }

    }).catch(err=>{
        document.getElementById("alertErrorLogueo").style.display="block";
        document.getElementById("alertErrorLogueo").innerHTML=err;
    });

}

function authGithub(){
    const providerGithub= new firebase.auth.GithubAuthProvider();
    firebase.auth().signInWithPopup(providerGithub).then(res=>{
        var usuario= res.user;
        return firebase.firestore().collection("Usuarios").doc(usuario.uid).get()
        .then(el=>{
              var inf=  el.data();
              //Primera vez y no existe en base de datos
              if(inf==null || inf==undefined){
                    var userName= res.additionalUserInfo.username;
                    return firebase.firestore().collection("Usuarios").doc(usuario.uid)
                    .set({
                        nombre:"",
                        apellido:"",
                        email:usuario.email,
                        displayName:userName,
                        photoURL:usuario.photoURL,
                        provider:res.additionalUserInfo.providerId,
                        phoneNumber:usuario.phoneNumber,
                        descripcion:""

                    }).then(res=>{
                        document.location.href="/misPrestamos.html";
                    }).catch(err=>{
                        alert(err);
                    })
              }else{
                document.location.href="/misPrestamos.html";
              }
        })

      
    }).catch(err=>{
        alert(err);
    });


}


function authTwitter(){
    const providerTwitter= new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithPopup(providerTwitter).then(res=>{
        var usuario= res.user;
        return firebase.firestore().collection("Usuarios").doc(usuario.uid).get()
        .then(el=>{
            var inf=  el.data();

            //No existe
            if(inf==null || inf==undefined){

                var email= res.additionalUserInfo.profile.email;
                return firebase.firestore().collection("Usuarios").doc(usuario.uid)
                    .set({
                        nombre:"",
                        apellido:"",
                        email:email==null ? "": email,
                        displayName:usuario.displayName,
                        photoURL:usuario.photoURL,
                        provider:res.additionalUserInfo.providerId,
                        phoneNumber:usuario.phoneNumber==null?"":usuario.phoneNumber,
                        descripcion:res.additionalUserInfo.profile.description

                    }).then(res=>{
                        document.location.href="/misPrestamos.html";
                    }).catch(err=>{
                        alert(err);
                    })
            }else{
                document.location.href="/misPrestamos.html";
            }

        })


     
    }).catch(err=>{
      alert(err);
    })

  }


function abrirModalRegistro(){
    document.getElementById("alertaErrorRegistro").style.display="none";

    document.getElementById("alertaErrorRegistro").innerHTML="";

}

function createUser(){
    var displayName=document.getElementById("txtDisplayName").value;
    var email=document.getElementById("txtcorreo").value;
    var password=document.getElementById("txtcontra").value;
    if(displayName==""){
        document.getElementById("alertaErrorRegistro").style.display="block";
        document.getElementById("alertaErrorRegistro").innerHTML="Debe ingresar un Nombre";
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email,password)
      .then(res=>{

        var usuario= res.user;
         return res.user.updateProfile({
              displayName:displayName
          }).then(profile=>{
            alert("Se registro correctamente");
            document.getElementById("btnCancelar").click();
            firebase.auth().signOut();
               //Guardo informacion en base de datos
          return firebase.firestore().collection("Usuarios").doc(usuario.uid)
          .set({
              nombre:"",
              apellido:"",
              email:email,
              displayName:usuario.displayName,
              photoURL:usuario.photoURL,
              provider:res.additionalUserInfo.providerId,
              phoneNumber:usuario.phoneNumber==null?"":usuario.phoneNumber,
              descripcion:""

          }).then(res=>{
              document.location.href="/";
          }).catch(err=>{
              alert(err);
          })

          }).catch(err=>{
              alert(err);
          })

       

       
      }).catch(err=>{
            alert(err);
      });
}

function authGoogle(){
    const providerGoogle= new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(providerGoogle).then(res=>{
        //saco todo el objeto
        var user= res.user;

        return firebase.firestore().collection("Usuarios").doc(user.uid)
        .get().then(el=>{

            var inf= el.data();
            //Es su primera vez
            if(inf==null || inf==undefined){
                //Insercion
                return firebase.firestore().collection("Usuarios").doc(user.uid).set({
                    nombre: res.additionalUserInfo.profile.given_name,
                    apellido:  res.additionalUserInfo.profile.family_name,
                    email:user.email,
                    displayName: user.displayName,
                    photoURL:user.photoURL,
                    provider:res.additionalUserInfo.providerId,
                    phoneNumber: user.phoneNumber==null ? "": user.phoneNumber,
                    descripcion:""
                }).then(respuesta=>{
                    document.location.href="/misPrestamos.html";
                }).catch(err=>{
                    alert("Ocurrio un error al registrarlo en base de datos");
                })

                //Ya existe (no registro bd el usuario)
            }else{
                document.location.href="/misPrestamos.html";
            }

        })


        //console.log(res);
   
    }).catch(err=>{
        alert(err);
    });

}

function authFacebook(){
    const providerFacebook= new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(providerFacebook).then(res=>{

        var user= res.user;
        return firebase.firestore().collection("Usuarios").doc(user.uid)
        .get().then(el=>{
            var inf= el.data();
            var userName= res.additionalUserInfo.username;
            if(inf==null || inf==undefined){
                //registrar
                return firebase.firestore().collection("Usuarios").doc(user.uid).set({
                    nombre: "",
                    apellido:  "",
                    email:user.email,
                    displayName: userName==undefined ?"" : userName,
                    photoURL:user.photoURL,
                    provider:res.additionalUserInfo.providerId,
                    phoneNumber: user.phoneNumber==null ? "": user.phoneNumber,
                    descripcion:""
                }).then(respuesta=>{
                    document.location.href="/misPrestamos.html";
                }).catch(err=>{
                    alert("Ocurrio un error al registrarlo en base de datos");
                })
            }else{
                //que ingrese
                document.location.href="/misPrestamos.html";

            }
        })


    }).catch(err=>{
        alert(err);
    })


}

