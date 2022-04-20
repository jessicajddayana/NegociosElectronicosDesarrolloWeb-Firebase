var firebaseConfig = {
  apiKey: "AIzaSyBHy1ju5REBD0hi7lGMx8Kqmne2HmG66mQ",
  authDomain: "proyectoaprender-323b9.firebaseapp.com",
  projectId: "proyectoaprender-323b9",
  storageBucket: "proyectoaprender-323b9.appspot.com",
  messagingSenderId: "979049853883",
  appId: "1:979049853883:web:bb4a8b9988e9c0f8e4ca9e",
  measurementId: "G-KWS4JCEVG0" 
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


  function verAutenticacion(){

    firebase.auth().onAuthStateChanged(res=>{
      if (res == null) {
        document.getElementById("itemSalir").style.display = "none";
        document.getElementById("itemTipoLibro").style.display = "none";
        document.getElementById("itemLibro").style.display = "none";
        document.getElementById("itemMisPrestamos").style.display = "none";
        document.getElementById("itemMiPerfil").style.display = "none";
        document.getElementById("itemPrestamos").style.display = "none";

        //itemPrestamos
        document.getElementById("itemRegistro").style.display = "inline-block";

        if (document.getElementById("divRedes"))
          document.getElementById("divRedes").style.visibility = "visible";
        document.getElementById("divDatosUsu").style.visibility = "hidden";

      } else {
        document.getElementById("itemSalir").style.display = "inline-block";
        document.getElementById("itemTipoLibro").style.display = "inline-block";
        document.getElementById("itemLibro").style.display = "inline-block";
        document.getElementById("itemMisPrestamos").style.display = "inline-block";
        document.getElementById("itemMiPerfil").style.display = "inline-block";
        document.getElementById("itemPrestamos").style.display = "inline-block";
        //document.getElementById("itemPrestamos").style.display = "none";

        document.getElementById("itemRegistro").style.display = "none";

         if( document.getElementById("divRedes"))
         document.getElementById("divRedes").style.visibility="hidden";
         document.getElementById("divDatosUsu").style.visibility="visible";

         /*
          if(res.displayName!=null)
            document.getElementById("lblNombreUsuario").innerHTML="Bienvenido "+res.displayName;
          else
            if(res.email!=null)
          document.getElementById("lblNombreUsuario").innerHTML="Bienvenido "+res.email;
        */
          firebase.firestore().collection("Usuarios").doc(res.uid).get().then(resultado=>{

            var res= resultado.data();
            if(res.displayName!=null){
              document.getElementById("lblNombreUsuario").innerHTML="Bienvenido "+res.displayName;

            }else{
              document.getElementById("lblNombreUsuario").innerHTML="Bienvenido "+res.email;
            }

            if(res.photoURL!=null){
              document.getElementById("imgFotoUsuario").src=res.photoURL;

            }else{
              document.getElementById("imgFotoUsuario").src="img/noFoto.jpg";

            }


          });


        }

    });



  }


  function LimpiarDatos(){
    //class Limpiar

    var controles= document.getElementsByClassName("limpiar");
    var ncontroles= controles.length;
    for(var i=0;i<ncontroles;i++){

      controles[i].value="";
    }

  }

  


  function Salir(){

    firebase.auth().signOut().then(res=>{
      document.location.href="/";
    }).catch(err=>{
      alert(err);
    })

  }
  
  function mostrarLoading(){
    document.getElementById("divLoading").style.display="block";

  }

  function ocultarLoading(){
    document.getElementById("divLoading").style.display="none";

  }