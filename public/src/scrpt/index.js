let loaded;

async function getPage(req){
    let body = document.getElementById('body');
    let log = document.getElementById('logbut');
    let pre = document.getElementById("json");
    loaded = false;
    if(req) {
        link = "/courses/" + req;
    } else {
        link = "/courses";
    }

    if (sessionStorage.getItem("id") != null) {
        log.innerText = "Logout";
        log.setAttribute('onclick', 'logout()');
    } else {
        log.innerText = "Login";
        log.setAttribute('onclick', 'login()');
    }
    
    const res = await fetch(link);
    const data = await res.json();
    
    if(!loaded){
        let opts = new Set();
        data.forEach(e => {
            opts.add(e.code);
        });
        select = document.getElementById('code');
        opts.forEach(e => {
            let opt = document.createElement('option');
            opt.value = e;
            opt.text = e;
            select.appendChild(opt);
        });
        loaded = true;
    }
    pre.innerText = JSON.stringify(data,null, 4);
    body.appendChild(pre);
    console.log(sessionStorage);
}

async function filter(){
    let num = document.getElementById('num').value;
    let code = document.getElementById('code').value;
    let req = `?num=${num}&code=${code}`;
    getPage(req);
}

function logout(){
    sessionStorage.removeItem('id');
    window.location.replace("/")
}

function login(){
    window.location.href = "login.html"
}