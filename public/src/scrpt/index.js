let loaded,add;

async function getCourseList(req){
    let body = document.getElementById('body');
    let log = document.getElementById('logbut');
    let courses = document.createElement('div');
    let acc = document.getElementById('acc');

    console.log(sessionStorage);
    loaded = false;
    courses.id = 'courseList';

    if(req) link = "/courses/" + req;
    else link = "/courses";

    if (sessionStorage.getItem("id") != null) {
        add = true;
        acc.style.display = 'inline';
        log.innerText = "Logout";
        log.setAttribute('onclick', 'logout()');
    } else {
        add = false;
        acc.style.display = 'none';
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
    } else body.removeChild(document.getElementById('courseList'));

    data.forEach(element => {
        let course = document.createElement('div');        
        let but = document.createElement('button');
        let lab = document.createElement('label');
        lab.setAttribute('for', element['code']+element['num']);
        but.innerText = "Add";
        but.id = element['code']+element['num'];
        but.setAttribute('onclick', `addCourse("${element['code']+element['num']}")`);
        for (const key in element) {
            if(key == 'credits') continue;
            value = element[key];
            let div = document.createElement('div');
            div.className = key;
            div.innerText = value;
            course.appendChild(div);
        }
        if(sessionStorage.getItem("id") != null) {
            course.appendChild(but);
            course.appendChild(lab);
        }
        courses.appendChild(course);
    });
    body.appendChild(courses);
}

async function filter(){
    let num = document.getElementById('num').value;
    let code = document.getElementById('code').value;
    let req = `?num=${num}&code=${code}`;
    getPage(req);
}