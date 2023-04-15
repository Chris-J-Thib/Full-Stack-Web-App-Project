async function signup(){
    let un = document.getElementById('un').value;
    let pw1 = document.getElementById('pw1').value;
    let pw2 = document.getElementById('pw2').value;



    if(pw1!=pw2){
        document.getElementById('resp').innerText = "Passwords do not match.";
    } else if(!pw1){
        document.getElementById('resp').innerText = "Please enter a vaild password.";
    } else {
        let req = {username: un, password: pw1};
        const res = await fetch("users/signup", {method: 'POST',
                                                headers: {'Content-Type': 'application/json'},
                                                body: JSON.stringify(req)});
        const data = await res.json();
        if(data.error){
            document.getElementById('resp').innerText = data.error;
        } else {
            sessionStorage.setItem('id', data.userId);
            window.location.replace("/");
        }
    }    
}