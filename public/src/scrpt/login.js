async function login(){
    let un = document.getElementById('un').value;
    let pw = document.getElementById('pw').value;
    let req = {username: un, password: pw};
    const res = await fetch("users/login", {method: 'POST',
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